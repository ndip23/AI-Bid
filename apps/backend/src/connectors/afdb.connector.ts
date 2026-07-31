import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Connector for African Development Bank (AfDB) & UNGM Multilateral Grants
 */
export class AfdbMultilateralConnector implements TenderSourceConnector {
  readonly sourceId = 'afdb-ungm-multilateral';
  readonly sourceName = 'African Development Bank & UN Procurement Portal';
  readonly country = 'Pan-African';
  readonly method = 'RSS';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    return [
      {
        title: 'AfDB — Pan-African Rural Electrification & Solar Microgrid Rollout',
        refNumber: 'AFDB-P-Z1-FA0-019',
        buyerName: 'African Development Bank Group',
        buyerCountry: 'Pan-African',
        industry: 'Renewable Energy & Solar Power',
        estimatedValue: 18500000,
        currency: 'USD',
        publishDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Design, procurement, and installation of 120 solar-powered mini-grids across rural West & East Africa.',
        rawContent: 'BIDDING RULES: Open International Bidding under AfDB Procurement Framework. Mandatory audited financial turnover exceeding $10M.',
        sourceUrl: 'https://afdb.org/procurement/AFDB-P-Z1-FA0-019',
        attachments: ['afdb-solar-minigrids.pdf'],
      },
    ];
  }
}
