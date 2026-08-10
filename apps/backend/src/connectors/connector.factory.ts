import { Injectable, Logger } from '@nestjs/common';
import { ConnectorType } from '@prisma/client';
import { IPublisherConnector } from './publisher-connector.interface';
import { RestApiConnector } from './rest-api.connector';
import { RssConnector } from './rss.connector';
import { HtmlConnector } from './html.connector';
import { PdfConnector } from './pdf.connector';
import { XmlCsvConnector } from './xml-csv.connector';
import { ManualUploadConnector } from './manual-upload.connector';
import { WorldBankConnector } from './worldbank.connector';
import { UngmConnector } from './ungm.connector';
import { AfdbConnector } from './afdb.connector';
import { ArmpConnector } from './armp.connector';
import { ColepsConnector } from './coleps.connector';
import { GenericProcurementCrawler } from './generic-procurement-crawler';

@Injectable()
export class ConnectorFactory {
  private readonly logger = new Logger(ConnectorFactory.name);

  constructor(
    private readonly restApiConnector: RestApiConnector,
    private readonly rssConnector: RssConnector,
    private readonly htmlConnector: HtmlConnector,
    private readonly pdfConnector: PdfConnector,
    private readonly xmlCsvConnector: XmlCsvConnector,
    private readonly manualUploadConnector: ManualUploadConnector,
    private readonly worldBankConnector: WorldBankConnector,
    private readonly ungmConnector: UngmConnector,
    private readonly afdbConnector: AfdbConnector,
    private readonly armpConnector: ArmpConnector,
    private readonly colepsConnector: ColepsConnector,
    private readonly genericProcurementCrawler: GenericProcurementCrawler,
  ) {}

  getConnector(type: ConnectorType | string, publisherName?: string): IPublisherConnector {
    const nameLower = (publisherName || '').toLowerCase();

    // Specific Source Connector Overrides
    if (nameLower.includes('world bank') || nameLower.includes('banque mondiale')) {
      return this.worldBankConnector;
    }
    if (nameLower.includes('ungm') || nameLower.includes('united nations global marketplace')) {
      return this.ungmConnector;
    }
    if (nameLower.includes('afdb') || nameLower.includes('african development bank')) {
      return this.afdbConnector;
    }
    if (nameLower.includes('armp') || nameLower.includes('agence de régulation des marchés publics')) {
      return this.armpConnector;
    }
    if (nameLower.includes('coleps') || nameLower.includes('marchespublics.cm')) {
      return this.colepsConnector;
    }
    if (nameLower.includes('ministry') || nameLower.includes('ministère') || nameLower.includes('crawler')) {
      return this.genericProcurementCrawler;
    }

    // Connector Type Defaults
    switch (type) {
      case ConnectorType.REST_API:
      case 'REST_API':
      case 'API':
        return this.restApiConnector;

      case ConnectorType.RSS:
      case 'RSS':
        return this.rssConnector;

      case ConnectorType.HTML:
      case 'HTML':
      case 'SCRAPER':
        return this.htmlConnector;

      case ConnectorType.PDF:
      case 'PDF':
        return this.pdfConnector;

      case ConnectorType.XML:
      case 'XML':
      case ConnectorType.CSV:
      case 'CSV':
      case 'XML_CSV':
        return this.xmlCsvConnector;

      case ConnectorType.MANUAL_UPLOAD:
      case 'MANUAL_UPLOAD':
      case 'MANUAL':
        return this.manualUploadConnector;

      default:
        this.logger.warn(`Unknown connector type "${type}", utilizing Generic Procurement Crawler`);
        return this.genericProcurementCrawler;
    }
  }
}
