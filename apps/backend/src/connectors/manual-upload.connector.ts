import { Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@prisma/client';
import { DownloadedDocument, IPublisherConnector, StandardTenderModel } from './publisher-connector.interface';

@Injectable()
export class ManualUploadConnector implements IPublisherConnector {
  readonly connectorType = 'MANUAL_UPLOAD';
  private readonly logger = new Logger(ManualUploadConnector.name);

  async authenticate(publisher: Publisher): Promise<void> {
    this.logger.log(`[MANUAL_UPLOAD] Ready for manual submission for publisher: ${publisher.name}`);
  }

  async discover(publisher: Publisher): Promise<string[]> {
    return [];
  }

  async fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]> {
    this.logger.log(`[MANUAL_UPLOAD] Manual uploads are ingested via API upload controller`);
    return [];
  }

  async fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null> {
    return null;
  }

  async downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]> {
    return [];
  }

  normalize(rawItem: any, publisher: Publisher): StandardTenderModel {
    const now = new Date();
    return {
      externalId: rawItem.id || `MANUAL-${Date.now()}`,
      country: rawItem.country || publisher.country,
      publisher: publisher.name,
      organization: rawItem.organization || publisher.name,
      title: rawItem.title || 'Manually Uploaded Notice',
      referenceNumber: rawItem.referenceNumber || `REF-MANUAL-${Date.now()}`,
      publicationDate: rawItem.publicationDate ? new Date(rawItem.publicationDate) : now,
      closingDate: rawItem.closingDate ? new Date(rawItem.closingDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      description: rawItem.description || rawItem.title,
      sector: rawItem.sector || 'General',
      estimatedBudget: Number(rawItem.estimatedBudget || 0),
      currency: rawItem.currency || 'USD',
      documents: rawItem.documents || [],
      sourceURL: rawItem.sourceURL || publisher.officialWebsite || '',
      attachments: rawItem.attachments || [],
      language: rawItem.language || 'en',
      rawContent: rawItem.rawContent || rawItem.description,
    };
  }

  validate(tender: StandardTenderModel): boolean {
    return !!(tender.title && tender.referenceNumber && tender.publisher);
  }
}
