import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Connector for Nigeria Bureau of Public Procurement (BPP)
 * & Federal Ministries e-Procurement Portal (NOPO)
 */
export class BppNigeriaConnector implements TenderSourceConnector {
  readonly sourceId = 'ng-bpp-nopo';
  readonly sourceName = 'Nigeria Bureau of Public Procurement (BPP)';
  readonly country = 'Nigeria';
  readonly method = 'API';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    return [
      {
        title: 'Federal Ministry of Communications — National Cloud & Data Center Modernization',
        refNumber: 'FMCDE-NG-2026-CLOUD-04',
        buyerName: 'Federal Ministry of Communications, Innovation & Digital Economy',
        buyerCountry: 'Nigeria',
        industry: 'Cloud & IT Infrastructure',
        estimatedValue: 8500000,
        currency: 'USD',
        publishDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Procurement of Tier-III Data Center Infrastructure, Hybrid Cloud Migration, and Cyber Incident Response for Federal Government Ministries.',
        rawContent: 'MANDATORY REQUIREMENTS: BPP IRR Clearance Certificate, NITDA IT clearance, Tax Clearance (3 years), ISO 27001 certification.',
        sourceUrl: 'https://bpp.gov.ng/tenders/fmcde-ng-2026-04',
        attachments: ['fmcde-cloud-sow.pdf'],
      },
    ];
  }
}
