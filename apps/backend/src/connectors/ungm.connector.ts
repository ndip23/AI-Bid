import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class UngmConnector implements IPublisherConnector {
  readonly connectorType = 'REST_API';
  private readonly logger = new Logger(UngmConnector.name);
  private readonly publicNoticeUrl = 'https://www.ungm.org/Public/Notice';
  private readonly officialApiEndpoint = 'https://api.ungm.org/v1/notices';

  async authenticate(publisher: Publisher): Promise<void> {
    const clientId = process.env.UNGM_CLIENT_ID;
    const clientSecret = process.env.UNGM_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      this.logger.warn(`[UNGM] API credentials missing (UNGM_CLIENT_ID / UNGM_CLIENT_SECRET). Fallback to UNGM public portal crawler.`);
    } else {
      this.logger.log(`[UNGM] Using authenticated API credentials for UNGM Notice API.`);
    }
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return [publisher.apiEndpoint || this.publicNoticeUrl];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    if (process.env.UNGM_API_ENABLED === 'false') {
      this.logger.log(`[UNGM] UNGM Connector is disabled in environment.`);
      return [];
    }

    const clientId = process.env.UNGM_CLIENT_ID;
    const clientSecret = process.env.UNGM_CLIENT_SECRET;

    // 1. Authenticated API query if credentials provided
    if (clientId && clientSecret) {
      return this.fetchFromOfficialApi(publisher, clientId, clientSecret);
    }

    // 2. Public UNGM Portal Web Crawler Fallback
    return this.fetchFromPublicNoticePortal(publisher);
  }

  private async fetchFromOfficialApi(publisher: Publisher, clientId: string, clientSecret: string): Promise<StandardTenderModel[]> {
    const endpoint = publisher.apiEndpoint || this.officialApiEndpoint;
    const results: StandardTenderModel[] = [];

    try {
      this.logger.log(`[UNGM API] Querying authenticated UNGM Notice API at ${endpoint}...`);
      const response = await axios.get(endpoint, {
        headers: {
          'X-Client-Id': clientId,
          'X-Client-Secret': clientSecret,
          Accept: 'application/json',
        },
        params: { pageSize: 100, pageIndex: 1 },
        timeout: 20000,
      });

      const items = Array.isArray(response.data) ? response.data : response.data?.items || response.data?.results || [];
      for (const item of items) {
        const normalized = this.normalize(item, publisher);
        if (this.validate(normalized)) results.push(normalized);
      }

      this.logger.log(`[UNGM API] Ingested ${results.length} notices via authenticated UNGM API.`);
      return results;
    } catch (err: any) {
      this.logger.error(`[UNGM API] Authenticated query failed (${err.message}). Trying public portal fallback...`);
      return this.fetchFromPublicNoticePortal(publisher);
    }
  }

  private async fetchFromPublicNoticePortal(publisher: Publisher): Promise<StandardTenderModel[]> {
    const results: StandardTenderModel[] = [];

    try {
      this.logger.log(`[UNGM Public] Querying UNGM Public Notice Portal (${this.publicNoticeUrl})...`);
      const response = await axios.get(this.publicNoticeUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 20000,
      });

      const $ = cheerio.load(response.data);
      const rows = $('.tbl-notices tr, .resultRow, .table tbody tr, article');

      rows.each((index, el) => {
        const titleEl = $(el).find('a').first();
        const titleText = titleEl.text().trim() || $(el).text().split('\n')[0].trim();
        const href = titleEl.attr('href');

        if (titleText && titleText.length > 5 && href) {
          const fullUrl = href.startsWith('http') ? href : `https://www.ungm.org${href}`;
          const id = fullUrl.split('/').pop() || `UNGM-PUB-${index}-${Date.now()}`;

          results.push({
            externalId: id,
            country: publisher.country || 'Global / Pan-African',
            publisher: publisher.name,
            organization: 'United Nations Global Marketplace (UNGM)',
            title: titleText,
            referenceNumber: `UNGM-REF-${id.substring(0, 20)}`,
            publicationDate: new Date(),
            closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            description: titleText,
            sector: 'United Nations Procurement',
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

      this.logger.log(`[UNGM Public Portal] Ingested ${results.length} official notices.`);
      return results;
    } catch (err: any) {
      this.logger.error(`[UNGM Public Portal] Query error: ${err.message}`);
      return [];
    }
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const latest = await this.fetchLatest(publisher);
    return latest.find((n) => n.externalId === externalId) || null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const filename = url.split('/').pop() || `ungm_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[UNGM] Document download error for ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const id = String(rawItem.Id || rawItem.id || rawItem.NoticeId || `UNGM-${Date.now()}`);
    const refNum = rawItem.Reference || rawItem.reference || rawItem.NoticeReference || `UNGM-REF-${id}`;
    const agency = rawItem.AgencyName || rawItem.agency || rawItem.Organization || 'United Nations Global Marketplace (UNGM)';
    const title = rawItem.Title || rawItem.title || rawItem.NoticeTitle || 'UN Global Procurement Opportunity';
    const country = rawItem.CountryName || rawItem.country || publisher.country || 'Global / Pan-African';

    let pubDate = new Date();
    if (rawItem.PublishedDate || rawItem.publishedAt || rawItem.CreationDate) {
      const parsed = new Date(rawItem.PublishedDate || rawItem.publishedAt || rawItem.CreationDate);
      if (!isNaN(parsed.getTime())) pubDate = parsed;
    }

    let closingDate = new Date(pubDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (rawItem.Deadline || rawItem.deadline || rawItem.DeadlineDate) {
      const parsedClose = new Date(rawItem.Deadline || rawItem.deadline || rawItem.DeadlineDate);
      if (!isNaN(parsedClose.getTime())) closingDate = parsedClose;
    }

    const noticeUrl = rawItem.Link || rawItem.url || `https://www.ungm.org/Public/Notice/${id}`;

    return {
      externalId: id,
      country,
      publisher: publisher.name,
      organization: agency,
      title,
      referenceNumber: String(refNum),
      publicationDate: pubDate,
      closingDate,
      description: rawItem.Description || rawItem.summary || title,
      sector: rawItem.Category || rawItem.UNSPSC || 'UN Procurement',
      subcategory: rawItem.Type || rawItem.NoticeType || 'Goods & Services',
      procurementMethod: rawItem.ProcurementMethod || 'Request for Proposal (RFP)',
      estimatedBudget: Number(rawItem.EstimatedBudget || rawItem.amount || 0),
      currency: rawItem.Currency || 'USD',
      documents: rawItem.Documents ? (Array.isArray(rawItem.Documents) ? rawItem.Documents : [rawItem.Documents]) : [],
      sourceURL: noticeUrl,
      attachments: [],
      language: 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.sourceURL && tender.title.length > 3);
  }
}
