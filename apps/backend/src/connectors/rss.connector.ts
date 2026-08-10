import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class RssConnector implements IPublisherConnector {
  readonly connectorType = 'RSS';
  private readonly logger = new Logger(RssConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[RSS] No authentication required for RSS feed: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return publisher.rssFeed ? [publisher.rssFeed] : [];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const feedUrl = publisher.rssFeed || publisher.officialWebsite;
    if (!feedUrl) return [];

    try {
      this.logger.log(`[RSS] Fetching RSS feed from ${feedUrl}`);
      const response = await axios.get(feedUrl, { timeout: 15000 });
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(response.data);

      const items = result?.rss?.channel?.item || result?.feed?.entry || [];
      const itemList = Array.isArray(items) ? items : [items];

      return itemList
        .filter((item) => !!item)
        .map((item) => this.normalize(item, publisher))
        .filter((t) => this.validate(t));
    } catch (error) {
      this.logger.error(`[RSS] Error parsing RSS feed from ${feedUrl}: ${error.message}`);
      return [];
    }
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const latest = await this.fetchLatest(publisher);
    return latest.find((t) => t.externalId === externalId) || null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        downloaded.push({
          filename: url.split('/').pop() || `rss_doc_${Date.now()}`,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err) {
        this.logger.error(`[RSS] Failed downloading document ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const title = rawItem.title || 'RSS Notice';
    const link = rawItem.link?._ || rawItem.link || publisher.officialWebsite || '';
    const guid = rawItem.guid?._ || rawItem.guid || rawItem.id || link || `RSS-${Date.now()}`;
    const pubDate = rawItem.pubDate || rawItem.published || rawItem.updated ? new Date(rawItem.pubDate || rawItem.published || rawItem.updated) : new Date();

    return {
      externalId: String(guid),
      country: publisher.country,
      publisher: publisher.name,
      organization: publisher.name,
      title: typeof title === 'string' ? title : String(title._ || 'Procurement Notice'),
      referenceNumber: `RSS-${guid.substring(0, 20)}`,
      publicationDate: pubDate,
      closingDate: new Date(pubDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      description: typeof rawItem.description === 'string' ? rawItem.description : rawItem.summary || title,
      sector: 'General Procurement',
      estimatedBudget: 0,
      currency: 'USD',
      documents: link ? [link] : [],
      sourceURL: link,
      attachments: [],
      language: 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.country && tender.publisher);
  }
}
