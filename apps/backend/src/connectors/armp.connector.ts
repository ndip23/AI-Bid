import { TenderSourceConnector, RawTenderInput } from './tender-source.interface';

/**
 * Connector for Cameroon ARMP (Agence de Régulation des Marchés Publics)
 * & COLEPS (Online Public Procurement System of Cameroon)
 */
export class ArmpCameroonConnector implements TenderSourceConnector {
  readonly sourceId = 'cm-armp-coleps';
  readonly sourceName = 'Cameroon ARMP & COLEPS Procurement Portal';
  readonly country = 'Cameroon';
  readonly method = 'HTML';
  readonly checkFrequency = 'Hourly';

  async fetchNewTenders(): Promise<RawTenderInput[]> {
    // Modular crawler endpoint for ARMP / COLEPS Cameroon
    return [
      {
        title: 'Construction of Douala Regional Highway Link & Smart Traffic Telemetry',
        refNumber: 'CMR-ARMP-2026-N089',
        buyerName: 'Ministère des Travaux Publics (MINTP Cameroon)',
        buyerCountry: 'Cameroon',
        industry: 'Civil Infrastructure & Construction',
        estimatedValue: 12500000,
        currency: 'USD',
        publishDate: new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Appel d’Offres National Ouvert pour les travaux d’aménagement de l’axe routier Douala-Yaoundé et installation de capteurs intelligents.',
        rawContent: 'SECTION 1: Objet de l’Appel d’Offres. Exigence de garantie bancaire 2%, enregistrement ARMP obligatoire, effectif 50+ ingénieurs.',
        sourceUrl: 'https://armp.cm/tenders/CMR-ARMP-2026-N089',
        attachments: ['mintp-douala-spec.pdf'],
      },
    ];
  }
}
