import { Publisher } from '@prisma/client';

export interface StandardTenderModel {
  externalId: string;
  country: string;
  publisher: string;
  organization?: string;
  title: string;
  referenceNumber: string;
  publicationDate: Date;
  closingDate: Date;
  openingDate?: Date;
  description: string;
  sector?: string;
  subcategory?: string;
  procurementMethod?: string;
  estimatedBudget: number;
  currency: string;
  contactInformation?: Record<string, any>;
  documents: string[];
  sourceURL: string;
  attachments: string[];
  language: string;
  rawContent?: string;
}

export interface DownloadedDocument {
  filename: string;
  contentType: string;
  url: string;
  contentBuffer?: Buffer;
  extractedText?: string;
}

export interface IPublisherConnector {
  readonly connectorType: string;

  authenticate(publisher: Publisher): Promise<void>;
  discover(publisher: Publisher): Promise<string[]>;
  fetchLatest(publisher: Publisher): Promise<StandardTenderModel[]>;
  fetchById(publisher: Publisher, externalId: string): Promise<StandardTenderModel | null>;
  downloadDocuments(publisher: Publisher, documentUrls: string[]): Promise<DownloadedDocument[]>;
  normalize(rawItem: any, publisher: Publisher): StandardTenderModel;
  validate(tender: StandardTenderModel): boolean;
}
