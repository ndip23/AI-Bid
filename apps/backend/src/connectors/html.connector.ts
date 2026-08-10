import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class HtmlConnector implements IPublisherConnector {
  readonly connectorType = 'HTML';
  private readonly logger = new Logger(HtmlConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[HTML] Authentication prepared for publisher: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    const urls: string[] = [];
    if (publisher.procurementPage) urls.push(publisher.procurementPage);
    if (publisher.tendersPage) urls.push(publisher.tendersPage);
    if (publisher.officialWebsite) urls.push(publisher.officialWebsite);
    return urls;
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const targetUrl = publisher.tendersPage || publisher.procurementPage || publisher.officialWebsite;
    if (!targetUrl) {
      this.logger.warn(`[HTML] No target URL found for publisher ${publisher.name}`);
      return [];
    }

    try {
      this.logger.log(`[HTML] Scraping HTML notices from ${targetUrl}`);
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 20000,
      });

      const $ = cheerio.load(response.data);
      const results: StandardTenderModel[] = [];

      // Extract table rows, cards, or list items
      const selectors = ['tr', '.tender-card', '.notice-item', 'article', '.list-group-item', 'li'];
      
      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length > 2) {
          elements.each((index, el) => {
            const text = $(el).text().trim();
            if (
              text.toLowerCase().includes('tender') ||
              text.toLowerCase().includes('marché') ||
              text.toLowerCase().includes('notice') ||
              text.toLowerCase().includes('projet') ||
              text.toLowerCase().includes('appel')
            ) {
              const href = $(el).find('a').attr('href') || targetUrl;
              const fullUrl = href.startsWith('http') ? href : new URL(href, targetUrl).toString();

              results.push(
                this.normalize(
                  {
                    title: text.split('\n')[0].trim().substring(0, 150),
                    fullText: text,
                    url: fullUrl,
                    id: `HTML-${publisher.id.substring(0, 5)}-${index}-${Date.now()}`,
                  },
                  publisher,
                ),
              );
            }
          });
          break;
        }
      }

      return results.filter((t) => this.validate(t));
    } catch (error) {
      this.logger.error(`[HTML] Failed scraping ${targetUrl}: ${error.message}`);
      return [];
    }
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
        downloaded.push({
          filename: url.split('/').pop() || `document_${Date.now()}.pdf`,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err) {
        this.logger.error(`[HTML] Document download failed for ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const title = rawItem.title || 'Official Procurement Notice';
    const refNum = `REF-${publisher.country.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*100)}`;
    const now = new Date();

    return {
      externalId: rawItem.id || refNum,
      country: publisher.country,
      publisher: publisher.name,
      organization: publisher.name,
      title: title,
      referenceNumber: refNum,
      publicationDate: now,
      closingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      description: rawItem.fullText || title,
      sector: 'Public Procurement',
      estimatedBudget: 0,
      currency: 'USD',
      documents: rawItem.url ? [rawItem.url] : [],
      sourceURL: rawItem.url || publisher.officialWebsite || '',
      attachments: [],
      language: publisher.country === 'Cameroon' || publisher.country === 'Senegal' || publisher.country === 'Ivory Coast' ? 'fr' : 'en',
      rawContent: rawItem.fullText || title,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.country && tender.publisher && tender.title.length > 5);
  }
}
