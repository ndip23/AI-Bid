import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as xml2js from 'xml2js';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class AfdbConnector implements IPublisherConnector {
  readonly connectorType = 'RSS';
  private readonly logger = new Logger(AfdbConnector.name);
  private readonly defaultRssFeed = 'https://www.afdb.org/en/rss/procurement';
  private readonly procurementPage = 'https://www.afdb.org/en/projects-and-operations/procurement';

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[AfDB] Verified public access for AfDB RSS & procurement portal: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return [publisher.rssFeed || this.defaultRssFeed, publisher.procurementPage || this.procurementPage];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    if (process.env.AFDB_API_ENABLED === 'false') {
      this.logger.log(`[AfDB] Connector disabled via environment setting.`);
      return [];
    }

    const results: StandardTenderModel[] = [];

    // 1. Try AfDB Official Procurement RSS Feed
    try {
      const feedUrl = publisher.rssFeed || this.defaultRssFeed;
      this.logger.log(`[AfDB] Querying RSS feed: ${feedUrl}`);

      const response = await axios.get(feedUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'AI-Bid-Copilot/1.0 (AfDB Procurement Connector)' },
      });

      const parser = new xml2js.Parser({ explicitArray: false });
      const parsedXml = await parser.parseStringPromise(response.data);
      const items = parsedXml?.rss?.channel?.item || parsedXml?.feed?.entry || [];
      const itemList = Array.isArray(items) ? items : [items];

      for (const rawItem of itemList) {
        if (!rawItem) continue;
        const normalized = this.normalizeRss(rawItem, publisher);
        if (this.validate(normalized)) results.push(normalized);
      }

      if (results.length > 0) {
        this.logger.log(`[AfDB] Successfully fetched ${results.length} procurement notices from official RSS.`);
        return results;
      }
    } catch (rssErr: any) {
      this.logger.warn(`[AfDB] RSS feed query failed: ${rssErr.message}. Falling back to procurement page crawler...`);
    }

    // 2. HTML Scraping Fallback for AfDB Procurement Portal
    try {
      this.logger.log(`[AfDB] Scraping official procurement page: ${this.procurementPage}`);
      const pageResponse = await axios.get(this.procurementPage, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 20000,
      });

      const $ = cheerio.load(pageResponse.data);
      $('.views-row, tr, .procurement-notice-item').each((index, el) => {
        const titleEl = $(el).find('a').first();
        const titleText = titleEl.text().trim() || $(el).text().split('\n')[0].trim();
        const href = titleEl.attr('href');

        if (titleText && titleText.length > 10 && href) {
          const fullUrl = href.startsWith('http') ? href : `https://www.afdb.org${href}`;
          const id = fullUrl.split('/').pop() || `AFDB-${index}-${Date.now()}`;

          results.push({
            externalId: id,
            country: publisher.country || 'Pan-African',
            publisher: publisher.name,
            organization: 'African Development Bank Group (AfDB)',
            title: titleText,
            referenceNumber: `AFDB-${id.substring(0, 20)}`,
            publicationDate: new Date(),
            closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            description: titleText,
            sector: 'Development & Infrastructure',
            estimatedBudget: 0,
            currency: 'USD',
            documents: [fullUrl],
            sourceURL: fullUrl,
            attachments: [],
            language: 'en',
            rawContent: $(el).text().trim(),
          });
        }
      });

      this.logger.log(`[AfDB HTML Fallback] Extracted ${results.length} procurement notices.`);
    } catch (htmlErr: any) {
      this.logger.error(`[AfDB HTML Fallback] Scraping error: ${htmlErr.message}`);
    }

    return results.filter((t) => this.validate(t));
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const list = await this.fetchLatest(publisher);
    return list.find((item) => item.externalId === externalId) || null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const filename = url.split('/').pop() || `afdb_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[AfDB] Document download error for ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  private normalizeRss(rawItem: any, publisher: Publisher): StandardTenderModel {
    const title = typeof rawItem.title === 'string' ? rawItem.title : rawItem.title?._ || 'AfDB Procurement Notice';
    const link = rawItem.link?._ || rawItem.link || rawItem.guid?._ || rawItem.guid || publisher.officialWebsite || '';
    const guid = rawItem.guid?._ || rawItem.guid || link || `AFDB-${Date.now()}`;
    const pubDate = rawItem.pubDate || rawItem.published || rawItem.updated ? new Date(rawItem.pubDate || rawItem.published || rawItem.updated) : new Date();

    return {
      externalId: String(guid),
      country: publisher.country || 'Pan-African',
      publisher: publisher.name,
      organization: 'African Development Bank Group (AfDB)',
      title,
      referenceNumber: `AFDB-${String(guid).replace(/[^a-zA-Z0-9-]/g, '').substring(0, 25)}`,
      publicationDate: pubDate,
      closingDate: new Date(pubDate.getTime() + 45 * 24 * 60 * 60 * 1000),
      description: typeof rawItem.description === 'string' ? rawItem.description : title,
      sector: 'Multilateral & Regional Infrastructure',
      estimatedBudget: 0,
      currency: 'USD',
      documents: link ? [link] : [],
      sourceURL: link,
      attachments: [],
      language: 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    return this.normalizeRss(rawItem, publisher);
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.sourceURL && tender.title.length > 5);
  }
}
