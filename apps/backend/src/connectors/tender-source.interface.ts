export interface RawTenderInput {
  title: string;
  refNumber: string;
  buyerName: string;
  buyerCountry: string;
  industry: string;
  estimatedValue: number;
  currency: string;
  publishDate: string;
  deadline: string;
  description: string;
  rawContent: string;
  sourceUrl?: string;
  attachments?: string[];
}

export interface TenderSourceConnector {
  readonly sourceId: string;
  readonly sourceName: string;
  readonly country: string;
  readonly method: 'API' | 'RSS' | 'HTML' | 'PDF';
  readonly checkFrequency: string; // e.g. "Hourly" | "Daily"

  fetchNewTenders(): Promise<RawTenderInput[]>;
}
