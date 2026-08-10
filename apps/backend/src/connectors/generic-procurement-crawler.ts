import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

export interface CrawlerConfiguration {
  procurementPaths?: string[];
  selectors?: {
    container?: string;
    title?: string;
    date?: string;
    deadline?: string;
    link?: string;
    reference?: string;
  };
}

@Injectable()
export class GenericProcurementCrawler implements IPublisherConnector {
  readonly connectorType = 'HTML';
  private readonly logger = new Logger(GenericProcurementCrawler.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[GenericCrawler] Prepared crawler configuration for ${publisher.name} (${publisher.country})`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    const baseUrl = publisher.officialWebsite || publisher.procurementPage || publisher.tendersPage;
    if (!baseUrl) return [];

    const config = (publisher.parserConfiguration as CrawlerConfiguration) || {};
    const paths = config.procurementPaths || ['/marches-publics', '/appels-doffres', '/tenders', '/procurement'];
    const urls: string[] = [];

    for (const path of paths) {
      if (path.startsWith('http')) {
        urls.push(path);
      } else {
        try {
          urls.push(new URL(path, baseUrl).toString());
        } catch {
          urls.push(`${baseUrl.replace(/\/$/, '')}${path}`);
        }
      }
    }

    if (urls.length === 0) urls.push(baseUrl);
    return urls;
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    if (process.env.GENERIC_CRAWLER_ENABLED === 'false') {
      this.logger.log(`[GenericCrawler] Generic crawler disabled via environment.`);
      return [];
    }

    const targetUrls = await this.discover(publisher);
    const results: StandardTenderModel[] = [];
    const config = (publisher.parserConfiguration as CrawlerConfiguration) || {};

    for (const targetUrl of targetUrls) {
      try {
        this.logger.log(`[GenericCrawler] Crawling procurement endpoint: ${targetUrl}`);
        const response = await axios.get(targetUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 20000,
        });

        const $ = cheerio.load(response.data);
        const containerSelector =
          config.selectors?.container || 'tr, .tender-card, .notice-item, article, .list-group-item, li';

        $(containerSelector).each((index, el) => {
          const text = $(el).text().trim();
          const linkEl = config.selectors?.link ? $(el).find(config.selectors.link).first() : $(el).find('a').first();
          const href = linkEl.attr('href');

          if (
            text &&
            text.length > 10 &&
            (text.toLowerCase().includes('tender') ||
              text.toLowerCase().includes('marché') ||
              text.toLowerCase().includes('appel') ||
              text.toLowerCase().includes('projet') ||
              text.toLowerCase().includes('notice') ||
              text.toLowerCase().includes('offres'))
          ) {
            const fullUrl = href
              ? href.startsWith('http')
                ? href
                : new URL(href, targetUrl).toString()
              : targetUrl;

            const parsed = this.normalize(
              {
                text,
                url: fullUrl,
                index,
                rawHtml: $(el).html(),
              },
              publisher,
            );

            if (this.validate(parsed)) {
              results.push(parsed);
            }
          }
        });
      } catch (err: any) {
        this.logger.warn(`[GenericCrawler] Failed crawling ${targetUrl}: ${err.message}`);
      }
    }

    return results;
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
        const filename = url.split('/').pop() || `crawler_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[GenericCrawler] Failed downloading document ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const text = rawItem.text || '';
    const title = text.split('\n')[0].trim().substring(0, 180) || 'Public Procurement Opportunity';

    // Extract reference pattern if available
    const refMatch = text.match(/(N[°o]?\s*[0-9\/A-Z\.-]{5,35})/i) || text.match(/([0-9]{3,5}\/[A-Z0-9\/-]{5,30})/);
    const refNum = refMatch ? refMatch[1] : `CRAWL-${publisher.country.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}-${rawItem.index || 0}`;

    const now = new Date();
    const closingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return {
      externalId: String(refNum),
      country: publisher.country,
      publisher: publisher.name,
      organization: publisher.name,
      title,
      referenceNumber: String(refNum),
      publicationDate: now,
      closingDate,
      description: text.substring(0, 500) || title,
      sector: 'Public Procurement',
      subcategory: 'Public Notice',
      procurementMethod: 'National / International Bidding',
      estimatedBudget: 0,
      currency: publisher.country === 'Cameroon' || publisher.country === 'Senegal' || publisher.country === 'Ivory Coast' ? 'XAF' : 'USD',
      documents: rawItem.url ? [rawItem.url] : [],
      sourceURL: rawItem.url || publisher.officialWebsite || '',
      attachments: [],
      language: publisher.country === 'Cameroon' || publisher.country === 'Senegal' || publisher.country === 'Ivory Coast' ? 'fr' : 'en',
      rawContent: text,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.sourceURL && tender.title.length > 5);
  }
}
