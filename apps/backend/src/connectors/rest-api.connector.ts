import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class RestApiConnector implements IPublisherConnector {
  readonly connectorType = 'REST_API';
  private readonly logger = new Logger(RestApiConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[REST_API] Authenticating publisher: ${publisher.name} (${publisher.authenticationType})`);
    // Implement token acquisition or header injection based on authenticationType & parserConfiguration
  }

  async discover(publisher: Publisher): Promise<string[]> {
    this.logger.log(`[REST_API] Discovering endpoints for ${publisher.name}`);
    const endpoints: string[] = [];
    if (publisher.apiEndpoint) endpoints.push(publisher.apiEndpoint);
    return endpoints;
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const endpoint = publisher.apiEndpoint || publisher.officialWebsite;
    if (!endpoint) {
      this.logger.warn(`No API endpoint configured for publisher ${publisher.name}`);
      return [];
    }

    try {
      this.logger.log(`[REST_API] Fetching latest notices from ${endpoint}`);
      const headers: Record<string, string> = { 'User-Agent': 'Bidora-ProcurementEngine/1.0' };
      const config = (publisher.parserConfiguration as Record<string, any>) || {};

      if (publisher.authenticationType === 'API_KEY' && config.apiKey) {
        headers['X-API-KEY'] = config.apiKey;
      } else if (publisher.authenticationType === 'BEARER_TOKEN' && config.bearerToken) {
        headers['Authorization'] = `Bearer ${config.bearerToken}`;
      }

      const response = await axios.get(endpoint, { headers, timeout: 15000 });
      const items = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.tenders || response.data?.results || [];

      return items.map((item: any) => this.normalize(item, publisher)).filter((t) => this.validate(t));
    } catch (error) {
      this.logger.error(`[REST_API] Error fetching from ${endpoint}: ${error.message}`);
      return [];
    }
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const endpoint = `${publisher.apiEndpoint}/${externalId}`;
    try {
      const response = await axios.get(endpoint, { timeout: 15000 });
      const normalized = this.normalize(response.data, publisher);
      return this.validate(normalized) ? normalized : null;
    } catch (error) {
      this.logger.error(`[REST_API] Error fetching ID ${externalId}: ${error.message}`);
      return null;
    }
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const contentType = String(response.headers['content-type'] || 'application/octet-stream');
        const filename = url.split('/').pop() || `doc_${Date.now()}`;
        downloaded.push({
          filename,
          contentType,
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err) {
        this.logger.error(`Failed downloading document ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const refNum = rawItem.referenceNumber || rawItem.id || rawItem.refNo || rawItem.code || `REF-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const title = rawItem.title || rawItem.name || rawItem.subject || 'Procurement Opportunity';
    const pubDate = rawItem.publicationDate || rawItem.publishedAt || rawItem.createdAt ? new Date(rawItem.publicationDate || rawItem.publishedAt || rawItem.createdAt) : new Date();
    const closeDate = rawItem.closingDate || rawItem.deadline || rawItem.expiresAt ? new Date(rawItem.closingDate || rawItem.deadline || rawItem.expiresAt) : new Date(Date.now() + 30*24*60*60*1000);
    
    return {
      externalId: String(rawItem.id || refNum),
      country: publisher.country,
      publisher: publisher.name,
      organization: rawItem.organization || rawItem.buyerName || publisher.name,
      title: title,
      referenceNumber: refNum,
      publicationDate: pubDate,
      closingDate: closeDate,
      openingDate: rawItem.openingDate ? new Date(rawItem.openingDate) : undefined,
      description: rawItem.description || rawItem.summary || title,
      sector: rawItem.sector || rawItem.category || 'General',
      subcategory: rawItem.subcategory || rawItem.type,
      procurementMethod: rawItem.procurementMethod || rawItem.method || 'Open International Tender',
      estimatedBudget: Number(rawItem.estimatedBudget || rawItem.value || rawItem.amount || 0),
      currency: rawItem.currency || 'USD',
      contactInformation: rawItem.contactInformation || rawItem.contact || {},
      documents: Array.isArray(rawItem.documents) ? rawItem.documents : [],
      sourceURL: rawItem.url || rawItem.sourceUrl || publisher.officialWebsite || publisher.apiEndpoint || '',
      attachments: Array.isArray(rawItem.attachments) ? rawItem.attachments : [],
      language: rawItem.language || 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.country && tender.publisher);
  }
}
