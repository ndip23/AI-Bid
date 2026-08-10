import { Module } from '@nestjs/common';
import { SourceService } from './source.service';
import { SourceController } from './source.controller';
import { SchedulerService } from './scheduler.service';
import { MinistryDiscoveryService } from './ministry-discovery.service';
import { DeduplicationService } from './deduplication.service';
import { CategoryClassifierService } from './category-classifier.service';
import { ConnectorFactory } from '../../connectors/connector.factory';
import { RestApiConnector } from '../../connectors/rest-api.connector';
import { RssConnector } from '../../connectors/rss.connector';
import { HtmlConnector } from '../../connectors/html.connector';
import { PdfConnector } from '../../connectors/pdf.connector';
import { XmlCsvConnector } from '../../connectors/xml-csv.connector';
import { ManualUploadConnector } from '../../connectors/manual-upload.connector';
import { WorldBankConnector } from '../../connectors/worldbank.connector';
import { UngmConnector } from '../../connectors/ungm.connector';
import { AfdbConnector } from '../../connectors/afdb.connector';
import { ArmpConnector } from '../../connectors/armp.connector';
import { ColepsConnector } from '../../connectors/coleps.connector';
import { GenericProcurementCrawler } from '../../connectors/generic-procurement-crawler';
import { DocumentProcessorService } from '../tender/document-processor.service';
import { MatchModule } from '../match/match.module';
import { QueueModule } from '../queue/queue.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [MatchModule, QueueModule, AiModule],
  controllers: [SourceController],
  providers: [
    SourceService,
    SchedulerService,
    MinistryDiscoveryService,
    DeduplicationService,
    CategoryClassifierService,
    ConnectorFactory,
    RestApiConnector,
    RssConnector,
    HtmlConnector,
    PdfConnector,
    XmlCsvConnector,
    ManualUploadConnector,
    WorldBankConnector,
    UngmConnector,
    AfdbConnector,
    ArmpConnector,
    ColepsConnector,
    GenericProcurementCrawler,
    DocumentProcessorService,
  ],
  exports: [SourceService, SchedulerService, MinistryDiscoveryService, DeduplicationService, CategoryClassifierService],
})
export class SourceModule {}
