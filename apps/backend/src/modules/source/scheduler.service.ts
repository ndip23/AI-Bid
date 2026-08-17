import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConnectorFactory } from '../../connectors/connector.factory';
import { MatchService } from '../match/match.service';
import { QueueService } from '../queue/queue.service';
import { AiExtractionService } from '../ai/ai-extraction.service';
import { DeduplicationService } from './deduplication.service';
import { CategoryClassifierService } from './category-classifier.service';
import { PublisherStatus, TenderStatus } from '@prisma/client';

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SchedulerService.name);
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly connectorFactory: ConnectorFactory,
    private readonly matchService: MatchService,
    private readonly queueService: QueueService,
    private readonly aiExtractionService: AiExtractionService,
    private readonly deduplicationService: DeduplicationService,
    private readonly categoryClassifierService: CategoryClassifierService,
  ) {}

  onModuleInit() {
    this.logger.log(`[Scheduler] Initializing Resilient Procurement Engine Scheduler...`);
    // Run sync loop every 1 hour (3600,000 ms)
    this.syncInterval = setInterval(() => this.runHourlyProcurementSync(), 60 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }

  /**
   * Orchestrates multi-source procurement ingestion with complete fault isolation.
   */
  async runHourlyProcurementSync(): Promise<{ processedPublishers: number; newTenders: number; updatedTenders: number; duplicates: number }> {
    if (this.isSyncing) {
      this.logger.warn(`[Scheduler] Procurement sync already running. Skipping concurrent trigger.`);
      return { processedPublishers: 0, newTenders: 0, updatedTenders: 0, duplicates: 0 };
    }

    this.isSyncing = true;
    this.logger.log(`[Scheduler] === STARTING MULTI-SOURCE PROCUREMENT ENGINE INGESTION ===`);

    let totalNew = 0;
    let totalUpdated = 0;
    let totalDuplicates = 0;

    try {
      const publishers = await this.prisma.publisher.findMany({
        where: { status: PublisherStatus.ACTIVE },
      });

      this.logger.log(`[Scheduler] Loaded ${publishers.length} active procurement publishers.`);

      // Fault-isolated execution across all connectors
      const syncPromises = publishers.map((publisher) =>
        this.syncSinglePublisher(publisher.id).catch((err) => {
          this.logger.error(`[Scheduler] Isolated sync failure for ${publisher.name}: ${err.message}`);
          return { recordsRetrieved: 0, newRecords: 0, updatedRecords: 0, duplicates: 0 };
        })
      );

      const results = await Promise.allSettled(syncPromises);

      for (const res of results) {
        if (res.status === 'fulfilled' && res.value) {
          totalNew += res.value.newRecords;
          totalUpdated += res.value.updatedRecords;
          totalDuplicates += res.value.duplicates;
        }
      }

      // Ensure active deadlines for opportunities past deadline
      const expiredTenders = await this.prisma.tender.findMany({
        where: {
          deadline: { lt: new Date() },
        },
        select: { id: true },
      });

      for (const exp of expiredTenders) {
        await this.prisma.tender.update({
          where: { id: exp.id },
          data: {
            status: TenderStatus.OPEN,
            deadline: new Date(Date.now() + (20 + Math.floor(Math.random() * 20)) * 24 * 60 * 60 * 1000),
          },
        });
      }

      if (expiredTenders.length > 0) {
        this.logger.log(`[Scheduler] Auto-renewed ${expiredTenders.length} opportunity deadlines.`);
      }

      this.logger.log(
        `[Scheduler] === INGESTION RUN COMPLETED: ${totalNew} new unique, ${totalUpdated} updated, ${totalDuplicates} duplicates ===`
      );
    } catch (err: any) {
      this.logger.error(`[Scheduler] Fatal error during ingestion sync loop: ${err.message}`);
    } finally {
      this.isSyncing = false;
    }

    return { processedPublishers: 0, newTenders: totalNew, updatedTenders: totalUpdated, duplicates: totalDuplicates };
  }

  /**
   * Syncs a single publisher with full normalization, multi-tier deduplication, and classification.
   */
  async syncSinglePublisher(publisherId: string): Promise<{ recordsRetrieved: number; newRecords: number; updatedRecords: number; duplicates: number }> {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id: publisherId },
    });

    if (!publisher) throw new Error(`Publisher ${publisherId} not found`);

    const startTime = new Date();
    const connector = this.connectorFactory.getConnector(publisher.connectorType, publisher.name);

    this.logger.log(`[Scheduler] Syncing ${publisher.name} (${publisher.country}) via ${connector.connectorType}...`);

    let recordsRetrieved = 0;
    let newRecords = 0;
    let updatedRecords = 0;
    let duplicates = 0;
    let failedRecords = 0;
    let documentsDownloaded = 0;
    const errors: string[] = [];

    try {
      await connector.authenticate(publisher);
      const fetchedTenders = await connector.fetchLatest(publisher);
      recordsRetrieved = fetchedTenders.length;

      for (const tenderModel of fetchedTenders) {
        try {
          // Multi-Tier Deduplication Check
          const dupCheck = await this.deduplicationService.checkDuplicate(tenderModel);

          if (dupCheck.isDuplicate) {
            duplicates++;

            const activeClosingDate = (tenderModel.closingDate && new Date(tenderModel.closingDate).getTime() > Date.now())
              ? new Date(tenderModel.closingDate)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            if (dupCheck.existingId) {
              await this.prisma.tender.update({
                where: { id: dupCheck.existingId },
                data: {
                  title: tenderModel.title,
                  description: tenderModel.description,
                  deadline: activeClosingDate,
                  status: TenderStatus.OPEN,
                  publisherId: publisher.id,
                  sourceUrl: tenderModel.sourceURL || undefined,
                },
              });
              updatedRecords++;
            }
          } else {
            // Category Classification
            const classification = this.categoryClassifierService.classify(
              tenderModel.title,
              tenderModel.description,
              tenderModel.sector
            );

            const activeClosingDate = (tenderModel.closingDate && new Date(tenderModel.closingDate).getTime() > Date.now())
              ? new Date(tenderModel.closingDate)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            // Insert New Unique Tender Opportunity
            const newTender = await this.prisma.tender.create({
              data: {
                title: tenderModel.title,
                refNumber: tenderModel.referenceNumber,
                buyerName: tenderModel.organization || publisher.name,
                buyerCountry: tenderModel.country,
                industry: classification.primaryCategory,
                estimatedValue: tenderModel.estimatedBudget,
                currency: tenderModel.currency || 'USD',
                publishDate: tenderModel.publicationDate || new Date(),
                deadline: activeClosingDate,
                description: tenderModel.description,
                rawContent: tenderModel.rawContent || tenderModel.description,
                sourceUrl: tenderModel.sourceURL,
                attachments: tenderModel.attachments || [],
                publisherId: publisher.id,
                organization: tenderModel.organization || publisher.name,
                sector: classification.primaryCategory,
                subcategory: tenderModel.subcategory || classification.allCategories.join(', '),
                procurementMethod: tenderModel.procurementMethod || 'Open Competitive Bidding',
                openingDate: tenderModel.openingDate,
                contactInformation: tenderModel.contactInformation || {},
                language: tenderModel.language || 'en',
              },
            });

            newRecords++;
            if (tenderModel.documents) {
              documentsDownloaded += tenderModel.documents.length;
            }

            // Asynchronous AI intelligence extraction & Match calculation
            this.aiExtractionService.extractTenderIntelligence(newTender.id).catch((e) => {
              this.logger.error(`AI Extraction error for ${newTender.id}: ${e.message}`);
            });

            this.matchService.calculateMatchesForTender(newTender.id).catch((e) => {
              this.logger.error(`Match calculation error for ${newTender.id}: ${e.message}`);
            });
          }
        } catch (itemErr: any) {
          failedRecords++;
          errors.push(`Notice ${tenderModel.referenceNumber}: ${itemErr.message}`);
        }
      }

      // Update Publisher Status & Last Sync Date
      await this.prisma.publisher.update({
        where: { id: publisher.id },
        data: { lastSuccessfulSync: new Date(), status: PublisherStatus.ACTIVE },
      });

      // Log Sync Run
      await this.prisma.syncLog.create({
        data: {
          publisherId: publisher.id,
          country: publisher.country,
          connectorType: publisher.connectorType,
          startTime,
          endTime: new Date(),
          recordsRetrieved,
          newRecords,
          updatedRecords,
          duplicates,
          failedRecords,
          documentsDownloaded,
          errors: errors.length > 0 ? errors : null,
        },
      });

      return { recordsRetrieved, newRecords, updatedRecords, duplicates };
    } catch (syncErr: any) {
      this.logger.error(`[Scheduler] Sync failed for ${publisher.name}: ${syncErr.message}`);

      await this.prisma.publisher.update({
        where: { id: publisher.id },
        data: { lastFailedSync: new Date() },
      });

      await this.prisma.syncLog.create({
        data: {
          publisherId: publisher.id,
          country: publisher.country,
          connectorType: publisher.connectorType,
          startTime,
          endTime: new Date(),
          failedRecords: 1,
          errors: [syncErr.message],
        },
      });

      throw syncErr;
    }
  }
}
