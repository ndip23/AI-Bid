import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class XmlCsvConnector implements IPublisherConnector {
  readonly connectorType = 'XML_CSV';
  private readonly logger = new Logger(XmlCsvConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[XML/CSV] Initializing connection for publisher: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return publisher.apiEndpoint ? [publisher.apiEndpoint] : [];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const endpoint = publisher.apiEndpoint || publisher.procurementPage;
    if (!endpoint) return [];

    try {
      this.logger.log(`[XML/CSV] Downloading Open Data batch file from ${endpoint}`);
      const response = await axios.get(endpoint, { timeout: 30000 });
      const rawText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

      const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
      const tenders: StandardTenderModel[] = [];

      for (let i = 1; i < Math.min(lines.length, 50); i++) {
        const line = lines[i];
        const cols = line.split(/,|;|\t/);
        if (cols.length >= 2) {
          const title = cols[0].replace(/"/g, '').trim();
          const ref = cols[1] ? cols[1].replace(/"/g, '').trim() : `ROW-${i}`;
          tenders.push(
            this.normalize(
              {
                id: `CSV-${Date.now()}-${i}`,
                title: title.length > 5 ? title : `Procurement Notice Row ${i}`,
                refNumber: ref,
                rawLine: line,
              },
              publisher,
            ),
          );
        }
      }

      return tenders.filter((t) => this.validate(t));
    } catch (error) {
      this.logger.error(`[XML/CSV] Error reading batch dataset: ${error.message}`);
      return [];
    }
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const list = await this.fetchLatest(publisher);
    return list.find((t) => t.externalId === externalId) || null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    return [];
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const now = new Date();
    return {
      externalId: rawItem.id,
      country: publisher.country,
      publisher: publisher.name,
      organization: publisher.name,
      title: rawItem.title,
      referenceNumber: rawItem.refNumber || `REF-${Date.now()}`,
      publicationDate: now,
      closingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      description: rawItem.rawLine || rawItem.title,
      sector: 'Public Sector',
      estimatedBudget: 0,
      currency: 'USD',
      documents: [],
      sourceURL: publisher.apiEndpoint || publisher.officialWebsite || '',
      attachments: [],
      language: 'en',
      rawContent: rawItem.rawLine,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.publisher && tender.country);
  }
}
