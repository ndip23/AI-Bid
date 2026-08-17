import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

export interface CorporateSourceConfig {
  procurementPaths?: string[];
  containerSelector?: string;
  titleSelector?: string;
  refSelector?: string;
  dateSelector?: string;
  deadlineSelector?: string;
  linkSelector?: string;
}

@Injectable()
export class CorporateProcurementCrawler implements IPublisherConnector {
  readonly connectorType = 'HTML';
  private readonly logger = new Logger(CorporateProcurementCrawler.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[CorporateCrawler] Prepared corporate crawler for ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    const baseUrl = publisher.officialWebsite || publisher.procurementPage || publisher.tendersPage;
    if (!baseUrl) return [];

    const config = (publisher.parserConfiguration as CorporateSourceConfig) || {};
    const paths = config.procurementPaths || [
      '/appels-doffres',
      '/appels-doffre',
      '/marches-publics',
      '/tenders',
      '/procurement',
      '/business-opportunities',
      '/fournisseurs',
      '/achats'
    ];

    const urls: string[] = [];
    if (publisher.procurementPage) urls.push(publisher.procurementPage);
    if (publisher.tendersPage) urls.push(publisher.tendersPage);

    for (const path of paths) {
      if (path.startsWith('http')) {
        if (!urls.includes(path)) urls.push(path);
      } else if (baseUrl) {
        try {
          const full = new URL(path, baseUrl).toString();
          if (!urls.includes(full)) urls.push(full);
        } catch {
          const alt = `${baseUrl.replace(/\/$/, '')}${path}`;
          if (!urls.includes(alt)) urls.push(alt);
        }
      }
    }

    if (urls.length === 0 && baseUrl) urls.push(baseUrl);
    return urls;
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const targetUrls = await this.discover(publisher);
    const results: StandardTenderModel[] = [];
    const config = (publisher.parserConfiguration as CorporateSourceConfig) || {};

    const isSoe = publisher.organizationType === 'STATE_OWNED_ENTERPRISE' ||
                  publisher.name.toLowerCase().includes('port') ||
                  publisher.name.toLowerCase().includes('pak') ||
                  publisher.name.toLowerCase().includes('pad') ||
                  publisher.name.toLowerCase().includes('camwater') ||
                  publisher.name.toLowerCase().includes('sonatrel');

    for (const targetUrl of targetUrls) {
      try {
        this.logger.log(`[CorporateCrawler] Scanning corporate/SOE portal: ${targetUrl}`);
        const response = await axios.get(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 20000,
        });

        const $ = cheerio.load(response.data);
        const containerSelector = config.containerSelector || 'tr, .tender-item, .appel-offres-item, .notice-card, article, .post-item, li';

        $(containerSelector).each((index, el) => {
          const text = $(el).text().trim();
          const title = config.titleSelector
            ? $(el).find(config.titleSelector).first().text().trim()
            : $(el).find('h1, h2, h3, h4, .title, strong, a').first().text().trim() || text.substring(0, 150);

          const linkEl = config.linkSelector ? $(el).find(config.linkSelector).first() : $(el).find('a').first();
          const href = linkEl.attr('href');

          if (
            title &&
            title.length > 8 &&
            (text.toLowerCase().includes('appel') ||
              text.toLowerCase().includes('tender') ||
              text.toLowerCase().includes('marché') ||
              text.toLowerCase().includes('cotation') ||
              text.toLowerCase().includes('projet') ||
              text.toLowerCase().includes('fournisseur') ||
              text.toLowerCase().includes('recrutement'))
          ) {
            const fullUrl = href
              ? (href.startsWith('http') ? href : new URL(href, targetUrl).toString())
              : targetUrl;

            const refMatch = text.match(/(N[°o]?\s*[0-9\/A-Z\.-]{5,35})/i) || text.match(/([0-9]{3,5}\/[A-Z0-9\/-]{4,30})/);
            const refNum = refMatch
              ? refMatch[1]
              : `${publisher.name.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}-${index + 1}`;

            const now = new Date();
            const closingDate = new Date(now.getTime() + 25 * 24 * 3600 * 1000);

            results.push({
              externalId: `${publisher.id}-${index + 1}`,
              country: publisher.country || 'Cameroon',
              publisher: publisher.name,
              organization: publisher.name,
              title,
              referenceNumber: refNum,
              publicationDate: now,
              closingDate,
              description: text.substring(0, 600) || title,
              sector: 'Corporate & Infrastructure Procurement',
              subcategory: isSoe ? 'State-Owned Enterprise Tender' : 'Private Corporate Procurement',
              procurementMethod: isSoe ? 'Appel d’Offres Ouvert (SOE)' : 'Demande de Cotation Privée',
              estimatedBudget: 0,
              currency: 'XAF',
              documents: fullUrl.endsWith('.pdf') ? [fullUrl] : [],
              sourceURL: fullUrl,
              attachments: fullUrl.endsWith('.pdf') ? [fullUrl] : [],
              language: 'fr',
              rawContent: text,
              opportunityType: isSoe ? 'PUBLIC_TENDER' : 'PRIVATE_TENDER',
              sourceCategory: isSoe ? 'STATE_OWNED_ENTERPRISE' : 'PRIVATE_PROCUREMENT',
              buyerType: isSoe ? 'STATE_OWNED_ENTERPRISE' : 'PRIVATE_COMPANY',
              buyerIntent: text.toLowerCase().includes('travaux') ? 'CONSTRUCT' : text.toLowerCase().includes('maintenance') ? 'MAINTAIN' : 'BUY',
              sourceQualityScore: isSoe ? 90 : 78,
              originalSource: publisher.name,
              originalUrl: fullUrl,
            });
          }
        });
      } catch (err: any) {
        this.logger.warn(`[CorporateCrawler] Failed crawling ${targetUrl}: ${err.message}`);
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
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 25000 });
        const filename = url.split('/').pop() || `corporate_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[CorporateCrawler] Document download failed for ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    return rawItem as StandardTenderModel;
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.sourceURL && tender.title.length > 5);
  }
}
