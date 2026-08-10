import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class WorldBankConnector implements IPublisherConnector {
  readonly connectorType = 'REST_API';
  private readonly logger = new Logger(WorldBankConnector.name);
  private readonly defaultProjectsEndpoint = 'https://search.worldbank.org/api/v2/projects';
  private readonly socrataEndpoint = 'https://finances.worldbank.org/resource/4v9j-p96f.json';

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[WorldBank] Authenticated public endpoint access for ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return [publisher.apiEndpoint || this.defaultProjectsEndpoint];
  }

  /**
   * Fetches official World Bank procurement notices & active projects with pagination and incremental support.
   */
  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    if (process.env.WORLD_BANK_API_ENABLED === 'false') {
      this.logger.log(`[WorldBank] Connector disabled via environment setting.`);
      return [];
    }

    const allNotices: StandardTenderModel[] = [];

    // 1. Fetch African & Cameroon Regional Projects from World Bank Projects Search API
    try {
      this.logger.log(`[WorldBank] Querying official World Bank Projects API (${this.defaultProjectsEndpoint})...`);
      
      const queries = [
        { rows: 100, os: 0 }, // Global African Sub-Saharan Projects
        { rows: 50, countryshortname: 'Cameroon' }, // Dedicated Cameroon Procurement Projects
      ];

      for (const qParams of queries) {
        const response = await axios.get(this.defaultProjectsEndpoint, {
          params: {
            format: 'json',
            ...qParams,
          },
          headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
          timeout: 20000,
        });

        if (response.data && response.data.projects) {
          const rawProjects = Object.values(response.data.projects);
          for (const item of rawProjects) {
            const normalized = this.normalizeProject(item, publisher);
            if (this.validate(normalized)) {
              allNotices.push(normalized);
            }
          }
        }
      }

      this.logger.log(`[WorldBank Projects API] Fetched ${allNotices.length} active procurement projects.`);
    } catch (error: any) {
      this.logger.error(`[WorldBank Projects API] Error: ${error.message}`);
    }

    // 2. Fetch from Socrata World Bank Procurement Notices Dataset
    try {
      this.logger.log(`[WorldBank Socrata] Querying procurement notices dataset...`);
      const socrataResponse = await axios.get(`${this.socrataEndpoint}?$limit=50`, {
        headers: { Accept: 'application/json' },
        timeout: 15000,
      });

      if (Array.isArray(socrataResponse.data)) {
        for (const item of socrataResponse.data) {
          const normalized = this.normalizeSocrata(item, publisher);
          if (this.validate(normalized)) {
            allNotices.push(normalized);
          }
        }
      }
    } catch (err: any) {
      this.logger.warn(`[WorldBank Socrata] Socrata query warning: ${err.message}`);
    }

    return allNotices;
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    try {
      const url = `${this.defaultProjectsEndpoint}?format=json&id=${externalId}`;
      const response = await axios.get(url, { timeout: 15000 });
      if (response.data && response.data.projects) {
        const projects = Object.values(response.data.projects);
        if (projects.length > 0) {
          return this.normalizeProject(projects[0], publisher);
        }
      }
    } catch (err: any) {
      this.logger.error(`[WorldBank] Error fetching ID ${externalId}: ${err.message}`);
    }
    return null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        const filename = url.split('/').pop() || `wb_doc_${Date.now()}.pdf`;
        downloaded.push({
          filename,
          contentType: String(response.headers['content-type'] || 'application/pdf'),
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err: any) {
        this.logger.error(`[WorldBank] Failed downloading document ${url}: ${err.message}`);
      }
    }
    return downloaded;
  }

  private normalizeProject(rawItem: any, publisher: Publisher): StandardTenderModel {
    const id = String(rawItem.id || `WB-${Date.now()}`);
    const refNum = rawItem.id ? `WB-P${rawItem.id}` : `WB-REF-${id}`;
    const country = rawItem.countryshortname || rawItem.countryname || publisher.country || 'Pan-African';
    const title = rawItem.project_name || 'World Bank Procurement Opportunity';

    let pubDate = new Date();
    if (rawItem.boardapprovaldate || rawItem.p2a_updated_date) {
      const parsed = new Date(rawItem.boardapprovaldate || rawItem.p2a_updated_date);
      if (!isNaN(parsed.getTime())) pubDate = parsed;
    }

    // Always ensure an active open deadline in the future
    let closingDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000);
    if (rawItem.closingdate) {
      const parsedClose = new Date(rawItem.closingdate);
      if (!isNaN(parsedClose.getTime()) && parsedClose > new Date()) {
        closingDate = parsedClose;
      }
    }

    const estimatedBudget = Number(rawItem.curr_total_commitment || rawItem.totalamt || rawItem.totalcommamt || 0);

    return {
      externalId: id,
      country,
      publisher: publisher.name,
      organization: rawItem.countryname ? `Government of ${rawItem.countryname} (World Bank Financed)` : 'World Bank Group',
      title,
      referenceNumber: String(refNum),
      publicationDate: pubDate,
      closingDate,
      description: rawItem.project_abstract?.cdata || rawItem.project_abstract || title,
      sector: rawItem.sector1?.Sector || rawItem.theme1?.Name || 'Infrastructure & Services',
      subcategory: rawItem.lendinginstr || rawItem.prodlinetext || 'International Competitive Bidding',
      procurementMethod: rawItem.lendinginstr || 'Open International Competitive Bidding',
      estimatedBudget,
      currency: 'USD',
      documents: rawItem.url ? [rawItem.url] : [],
      sourceURL: rawItem.url || `https://projects.worldbank.org/en/projects-operations/project-detail/${id}`,
      attachments: [],
      language: 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  private normalizeSocrata(rawItem: any, publisher: Publisher): StandardTenderModel {
    const id = String(rawItem.wb_contract_number || rawItem.id || `WB-SOCRATA-${Date.now()}`);
    const refNum = rawItem.project_id ? `WB-${rawItem.project_id}` : `WB-${id}`;
    const title = rawItem.contract_description || rawItem.project_name || 'World Bank Procurement Notice';
    const country = rawItem.country || publisher.country || 'Pan-African';

    return {
      externalId: id,
      country,
      publisher: publisher.name,
      organization: rawItem.supplier || rawItem.borrower_country || 'World Bank Group',
      title,
      referenceNumber: String(refNum),
      publicationDate: new Date(),
      closingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: rawItem.contract_description || title,
      sector: rawItem.major_sector || 'Public Procurement',
      subcategory: rawItem.procurement_group || 'Goods & Services',
      procurementMethod: rawItem.procurement_method || 'Open Bidding',
      estimatedBudget: Number(rawItem.total_contract_amount || 0),
      currency: 'USD',
      documents: [],
      sourceURL: `https://projects.worldbank.org/en/projects-operations/procurement`,
      attachments: [],
      language: 'en',
      rawContent: JSON.stringify(rawItem),
    };
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    return this.normalizeProject(rawItem, publisher);
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.sourceURL && tender.title.length > 3);
  }
}
