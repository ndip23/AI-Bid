import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class ColepsConnector implements IPublisherConnector {
  readonly connectorType = 'HTML';
  private readonly logger = new Logger(ColepsConnector.name);
  private readonly defaultBaseUrl = 'https://www.marchespublics.cm';
  private readonly defaultTendersPage = 'https://www.marchespublics.cm/tenders';

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[COLEPS Cameroon] Prepared web connection for Cameroon E-Procurement portal (${publisher.name}).`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return [
      publisher.tendersPage || this.defaultTendersPage,
      publisher.procurementPage || `${this.defaultBaseUrl}/appels-doffres`,
    ];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    if (process.env.COLEPS_SCRAPER_ENABLED === 'false') {
      this.logger.log(`[COLEPS Cameroon] Scraper disabled via environment variable.`);
      return [];
    }

    const results: StandardTenderModel[] = [];
    const targetPages = await this.discover(publisher);
    const maxPages = 3;

    for (const baseUrl of targetPages) {
      for (let page = 1; page <= maxPages; page++) {
        try {
          const pageUrl = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
          this.logger.log(`[COLEPS Cameroon] Fetching E-Procurement notices from: ${pageUrl}`);

          const response = await axios.get(pageUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            timeout: 20000,
          });

          const $ = cheerio.load(response.data);
          const selectors = ['.tender-row', 'table tbody tr', '.card-notice', '.notice-card', '.list-item', 'article'];

          let pageItems = 0;
          for (const selector of selectors) {
            const elements = $(selector);
            if (elements.length > 0) {
              elements.each((index, el) => {
                const text = $(el).text().trim();
                const linkEl = $(el).find('a').first();
                const href = linkEl.attr('href');

                if (text && text.length > 15) {
                  const fullUrl = href
                    ? href.startsWith('http')
                      ? href
                      : new URL(href, this.defaultBaseUrl).toString()
                    : pageUrl;

                  const parsed = this.normalize(
                    {
                      text,
                      url: fullUrl,
                      index,
                    },
                    publisher,
                  );

                  if (this.validate(parsed)) {
                    results.push(parsed);
                    pageItems++;
                  }
                }
              });
              if (pageItems > 0) break;
            }
          }

          this.logger.log(`[COLEPS Cameroon] Extracted ${pageItems} tender notices from page ${page}.`);
          if (pageItems === 0) break;
        } catch (err: any) {
          this.logger.error(`[COLEPS Cameroon] Error fetching ${baseUrl} page ${page}: ${err.message}`);
          break;
        }
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
        const filename = url.split('/').pop() || `coleps_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[COLEPS Cameroon] Failed downloading document ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const text = rawItem.text || '';
    const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    const title = lines[0] || 'Cameroon COLEPS E-Procurement Notice';

    // Extract Ref Number
    const refMatch = text.match(/(COLEPS-[A-Z0-9\/-]{4,30})/i) || text.match(/(N[°o]?\s*[0-9\/A-Z\.-]{5,35})/i);
    const refNum = refMatch ? refMatch[1] : `CMR-COLEPS-${Date.now().toString().slice(-6)}-${rawItem.index || 0}`;

    // Extract Authority
    const authorityMatch = text.match(/(Ministère[^\n,]+|Maître d’Ouvrage:[^\n]+|Autorité Contractante:[^\n]+)/i);
    const organization = authorityMatch ? authorityMatch[1].trim() : 'République du Cameroun — Services du Premier Ministre';

    // Extract Budget in FCFA/XAF or convert to USD equivalent
    let estimatedBudget = 0;
    const budgetMatch = text.match(/([0-9\s\.]{4,15})\s*(FCFA|CFA|F\s*CFA|XAF)/i) || text.match(/(budget|montant)[^\n\d]*([0-9\s\.]{4,15})/i);
    if (budgetMatch) {
      const cleanNum = Number(budgetMatch[1].replace(/[^0-9]/g, ''));
      if (!isNaN(cleanNum) && cleanNum > 0) {
        estimatedBudget = Math.round(cleanNum / 600); // Convert XAF to USD (approx 1 USD = 600 XAF)
      }
    }

    const now = new Date();
    const closingDate = new Date(now.getTime() + (35 + (rawItem.index || 0)) * 24 * 60 * 60 * 1000);

    return {
      externalId: String(refNum),
      country: 'Cameroon',
      publisher: publisher.name,
      organization,
      title,
      referenceNumber: String(refNum),
      publicationDate: now,
      closingDate,
      description: text.substring(0, 500) || title,
      sector: 'Marchés Publics E-Procurement',
      subcategory: 'Appel d’Offres En Ligne',
      procurementMethod: 'Procédure COLEPS',
      estimatedBudget,
      currency: 'USD',
      documents: rawItem.url ? [rawItem.url] : [],
      sourceURL: rawItem.url || publisher.officialWebsite || this.defaultBaseUrl,
      attachments: [],
      language: 'fr',
      rawContent: text,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.sourceURL && tender.title.length > 5);
  }
}
