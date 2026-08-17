import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ArmpConnector } from './connectors/armp.connector';
import { ColepsConnector } from './connectors/coleps.connector';
import { BstpConnector } from './connectors/bstp.connector';
import { CorporateProcurementCrawler } from './connectors/corporate-procurement-crawler';
import { WorldBankConnector } from './connectors/worldbank.connector';
import { AfdbConnector } from './connectors/afdb.connector';
import { PrismaService } from './prisma/prisma.service';
import { CategoryClassifierService } from './modules/source/category-classifier.service';
import { DeduplicationService } from './modules/source/deduplication.service';

import { SourceService } from './modules/source/source.service';

async function testCameroonIngestion() {
  console.log('========================================================');
  console.log('CAMEROON BUSINESS OPPORTUNITY & PROCUREMENT INGESTION ENGINE');
  console.log('========================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });

  try {
    const prisma = app.get(PrismaService);
    const sourceService = app.get(SourceService);
    const armpConnector = app.get(ArmpConnector);
    const colepsConnector = app.get(ColepsConnector);
    const bstpConnector = app.get(BstpConnector);
    const corporateCrawler = app.get(CorporateProcurementCrawler);
    const worldBankConnector = app.get(WorldBankConnector);
    const afdbConnector = app.get(AfdbConnector);
    const categoryClassifier = app.get(CategoryClassifierService);
    const deduplicationService = app.get(DeduplicationService);

    // Seed publisher registry first
    await sourceService.seedAfricanPublishers();

    console.log('[1/6] Ingesting Government Tenders (ARMP & COLEPS)...');
    const armpPub = { id: 'pub-armp', name: 'ARMP Cameroon', country: 'Cameroon', connectorType: 'HTML' } as any;
    const colepsPub = { id: 'pub-coleps', name: 'COLEPS Cameroon', country: 'Cameroon', connectorType: 'HTML' } as any;

    const armpNotices = await armpConnector.fetchLatest(armpPub);
    const colepsNotices = await colepsConnector.fetchLatest(colepsPub);
    console.log(`  -> ARMP returned: ${armpNotices.length} notices`);
    console.log(`  -> COLEPS returned: ${colepsNotices.length} notices`);

    console.log('\n[2/6] Ingesting Subcontracting & Matchmaking Opportunities (BSTP-CMR)...');
    const bstpPub = { id: 'pub-bstp', name: 'BSTP-CMR', country: 'Cameroon', connectorType: 'HTML' } as any;
    const bstpNotices = await bstpConnector.fetchLatest(bstpPub);
    console.log(`  -> BSTP-CMR returned: ${bstpNotices.length} business opportunities`);

    console.log('\n[3/6] Ingesting State-Owned Enterprises & Public Ports (PAK & PAD)...');
    const pakPub = {
      id: 'pub-pak',
      name: 'PAK - Port Autonome de Kribi',
      country: 'Cameroon',
      organizationType: 'STATE_OWNED_ENTERPRISE',
      officialWebsite: 'https://www.pak.cm',
      procurementPage: 'https://www.pak.cm/fr/affaires/appels-doffres/',
      connectorType: 'HTML',
    } as any;
    const padPub = {
      id: 'pub-pad',
      name: 'PAD - Port Autonome de Douala',
      country: 'Cameroon',
      organizationType: 'STATE_OWNED_ENTERPRISE',
      officialWebsite: 'https://www.pad.cm',
      procurementPage: 'https://www.pad.cm/appels-doffre/',
      connectorType: 'HTML',
    } as any;

    const pakNotices = await corporateCrawler.fetchLatest(pakPub);
    const padNotices = await corporateCrawler.fetchLatest(padPub);
    console.log(`  -> PAK (Port Autonome de Kribi) returned: ${pakNotices.length} notices`);
    console.log(`  -> PAD (Port Autonome de Douala) returned: ${padNotices.length} notices`);

    console.log('\n[4/6] Ingesting Cameroon Donor-Funded Opportunities (World Bank & AfDB)...');
    const wbPub = { id: 'pub-wb', name: 'World Bank Group', country: 'Global / Africa', connectorType: 'REST_API' } as any;
    const afdbPub = { id: 'pub-afdb', name: 'AfDB', country: 'Pan-African', connectorType: 'RSS' } as any;

    const wbNotices = (await worldBankConnector.fetchLatest(wbPub)).filter(
      (n) => n.country?.toLowerCase().includes('cameroon') || n.description?.toLowerCase().includes('cameroon')
    );
    const afdbNotices = (await afdbConnector.fetchLatest(afdbPub)).filter(
      (n) => n.country?.toLowerCase().includes('cameroon') || n.title?.toLowerCase().includes('cameroun') || n.title?.toLowerCase().includes('cameroon')
    );
    console.log(`  -> World Bank (Cameroon Filtered) returned: ${wbNotices.length} notices`);
    console.log(`  -> AfDB (Cameroon Filtered) returned: ${afdbNotices.length} notices`);

    // Combine all opportunity batches
    const allBatches = [
      ...armpNotices,
      ...colepsNotices,
      ...bstpNotices,
      ...pakNotices,
      ...padNotices,
      ...wbNotices,
      ...afdbNotices,
    ];

    console.log(`\n[5/6] Deduplicating & Persisting ${allBatches.length} Total Discovered Opportunities...`);

    let newInserted = 0;
    let duplicatesFound = 0;
    let failedCount = 0;
    const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> => {
      let lastErr: any;
      for (let i = 0; i < retries; i++) {
        try {
          return await fn();
        } catch (err: any) {
          lastErr = err;
          if (i < retries - 1) {
            await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
          }
        }
      }
      throw lastErr;
    };

    for (const opportunity of allBatches) {
      try {
        const dupResult = await withRetry(() => deduplicationService.checkDuplicate(opportunity));

        if (dupResult.isDuplicate) {
          duplicatesFound++;
          if (dupResult.existingId) {
            await withRetry(() =>
              prisma.tender.update({
                where: { id: dupResult.existingId },
                data: { status: 'OPEN', deadline: opportunity.closingDate },
              })
            );
          }
        } else {
          const industryClassification = categoryClassifier.classify(opportunity.title, opportunity.description, opportunity.sector);
          const opportunityType = opportunity.opportunityType || categoryClassifier.classifyOpportunityType(opportunity.title, opportunity.description);
          const sourceCategory = opportunity.sourceCategory || categoryClassifier.classifySourceCategory(opportunity.publisher, undefined, opportunity.title);
          const buyerType = opportunity.buyerType || categoryClassifier.classifyBuyerType(opportunity.publisher, undefined, opportunity.organization);
          const buyerIntent = opportunity.buyerIntent || categoryClassifier.classifyBuyerIntent(opportunity.title, opportunity.description);

          await withRetry(() =>
            prisma.tender.create({
              data: {
                title: opportunity.title,
                refNumber: opportunity.referenceNumber,
                buyerName: opportunity.organization || opportunity.publisher || 'Cameroon Entity',
                buyerCountry: 'Cameroon',
                industry: industryClassification.primaryCategory,
                estimatedValue: opportunity.estimatedBudget || 0,
                currency: opportunity.currency || 'XAF',
                publishDate: opportunity.publicationDate || new Date(),
                deadline: opportunity.closingDate || new Date(Date.now() + 30 * 24 * 3600 * 1000),
                description: opportunity.description,
                rawContent: opportunity.rawContent || opportunity.description,
                sourceUrl: opportunity.sourceURL,
                attachments: opportunity.attachments || [],
                organization: opportunity.organization || opportunity.publisher,
                sector: industryClassification.primaryCategory,
                subcategory: opportunity.subcategory || 'Public/Private Opportunity',
                procurementMethod: opportunity.procurementMethod || 'Direct Sourcing',
                status: 'OPEN',
                language: opportunity.language || 'fr',
                opportunityType: opportunityType as any,
                sourceCategory: sourceCategory as any,
                buyerType: buyerType as any,
                buyerIntent: buyerIntent as any,
                sourceQualityScore: opportunity.sourceQualityScore || 85,
                originalSource: opportunity.originalSource || opportunity.publisher,
                originalUrl: opportunity.originalUrl || opportunity.sourceURL,
                originalExternalId: opportunity.externalId,
              },
            })
          );
          newInserted++;
        }
      } catch (err: any) {
        failedCount++;
        console.error(`  [X] Failed processing ${opportunity.referenceNumber}: ${err.message}`);
      }
    }

    console.log('\n[6/6] Fetching Final KPI Metric Dashboard Breakdown...');
    const summary = await withRetry(() => sourceService.getDailyIngestionSummary());

    console.log('\n========================================================');
    console.log('FINAL CAMEROON INGESTION REPORT');
    console.log('========================================================');
    console.log(`TOTAL DISCOVERED: ${allBatches.length}`);
    console.log(`TOTAL VALID:      ${allBatches.length - failedCount}`);
    console.log(`TOTAL NEW UNIQUE: ${newInserted}`);
    console.log(`TOTAL DUPLICATES: ${duplicatesFound}`);
    console.log(`TOTAL FAILED:     ${failedCount}`);
    console.log('--------------------------------------------------------');
    console.log('NEW ACTIVE UNIQUE CAMEROON OPPORTUNITIES TODAY:', summary.kpiMetrics.newActiveUniqueCameroonOpportunitiesToday);
    console.log('DAILY TARGET (>= 50):                         ', summary.kpiMetrics.kpiTarget);
    console.log('KPI HEALTH STATUS:                             ', summary.kpiMetrics.status);
    console.log('--------------------------------------------------------');
    console.log('CATEGORY BREAKDOWN:');
    for (const [cat, count] of Object.entries(summary.categoryBreakdown)) {
      console.log(`  - ${(cat + ':').padEnd(26)} ${count}`);
    }
    console.log('========================================================\n');

  } catch (err) {
    console.error('Execution error in testCameroonIngestion:', err);
  } finally {
    await app.close();
  }
}

testCameroonIngestion();
