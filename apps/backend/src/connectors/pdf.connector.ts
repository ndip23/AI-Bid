import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import axios from 'axios';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class PdfConnector implements IPublisherConnector {
  readonly connectorType = 'PDF';
  private readonly logger = new Logger(PdfConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[PDF] Authenticating for PDF bulletin access: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return publisher.procurementPage ? [publisher.procurementPage] : [];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    const pdfTarget = publisher.procurementPage || publisher.officialWebsite;
    if (!pdfTarget) return [];

    try {
      this.logger.log(`[PDF] Fetching PDF bulletin from ${pdfTarget}`);
      const response = await axios.get(pdfTarget, { responseType: 'arraybuffer', timeout: 30000 });
      
      const buffer = Buffer.from(response.data);
      const title = `Gazette Bulletin - ${publisher.name} (${new Date().toISOString().split('T')[0]})`;
      const refNum = `PDF-BULLETIN-${Date.now()}`;

      const tender = this.normalize(
        {
          id: refNum,
          title,
          url: pdfTarget,
          rawBufferLength: buffer.length,
        },
        publisher,
      );

      return [tender];
    } catch (error) {
      this.logger.error(`[PDF] Error fetching PDF bulletin from ${pdfTarget}: ${error.message}`);
      return [];
    }
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    const items = await this.fetchLatest(publisher);
    return items[0] || null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    const downloaded: DownloadedDocument[] = [];
    for (const url of documentUrls) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        downloaded.push({
          filename: url.split('/').pop() || `bulletin_${Date.now()}.pdf`,
          contentType: 'application/pdf',
          url,
          contentBuffer: Buffer.from(response.data),
        });
      } catch (err) {
        this.logger.error(`[PDF] Download failed: ${err.message}`);
      }
    }
    return downloaded;
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const now = new Date();
    return {
      externalId: rawItem.id,
      country: publisher.country,
      publisher: publisher.name,
      organization: publisher.name,
      title: rawItem.title,
      referenceNumber: rawItem.id,
      publicationDate: now,
      closingDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      description: `Official PDF Procurement Bulletin published by ${publisher.name}`,
      sector: 'Public Sector Procurement',
      estimatedBudget: 0,
      currency: 'USD',
      documents: [rawItem.url],
      sourceURL: rawItem.url,
      attachments: [rawItem.url],
      language: 'en',
      rawContent: `PDF Bulletin Size: ${rawItem.rawBufferLength} bytes`,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.publisher && tender.country);
  }
}
