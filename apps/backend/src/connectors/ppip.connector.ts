import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Connector for Kenya Public Procurement Information Portal (PPIP) & County Tenders
 */
export class PpipKenyaConnector implements TenderSourceConnector {
  readonly sourceId = 'ke-ppip-tenders';
  readonly sourceName = 'Kenya Public Procurement Information Portal (PPIP)';
  readonly country = 'Kenya';
  readonly method = 'HTML';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    return [
      {
        title: 'Nairobi City County — Smart Water Metering Telemetry & IoT Platform',
        refNumber: 'NCC-KE-2026-IOT-771',
        buyerName: 'Nairobi City County Government',
        buyerCountry: 'Kenya',
        industry: 'Smart City Infrastructure',
        estimatedValue: 4200000,
        currency: 'USD',
        publishDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Supply, installation, and commissioning of 25,000 smart water IoT telemetry devices with real-time billing integration.',
        rawContent: 'REQUIREMENTS: KRA Tax Compliance, NCA Registration, 5 years past IoT deployment experience in East Africa.',
        sourceUrl: 'https://tenders.go.ke/notice/ncc-ke-2026-iot-771',
        attachments: ['nairobi-water-iot.pdf'],
      },
    ];
  }
}
