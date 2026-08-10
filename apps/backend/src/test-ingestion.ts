import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SchedulerService } from './modules/source/scheduler.service';
import { SourceService } from './modules/source/source.service';

async function testIngestionPipeline() {
  console.log('=== STARTING TEST INGESTION ENGINE RUN ===');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });

  try {
    const sourceService = app.get(SourceService);
    const schedulerService = app.get(SchedulerService);

    // 1. Ensure publishers are seeded
    console.log('\n[1/3] Verifying / Seeding Procurement Publishers Registry...');
    await sourceService.seedAfricanPublishers();

    // 2. Trigger multi-source sync run
    console.log('\n[2/3] Executing Multi-Source Ingestion Pipeline across active sources...');
    const syncMetrics = await schedulerService.runHourlyProcurementSync();
    console.log('\nSync Metrics Result:', JSON.stringify(syncMetrics, null, 2));

    // 3. Fetch daily summary & performance breakdown
    console.log('\n[3/3] Fetching Daily Ingestion KPI Metrics...');
    const summary = await sourceService.getDailyIngestionSummary();
    console.log('\nDaily Summary:', JSON.stringify(summary, null, 2));

    console.log('\n=== INGESTION ENGINE TEST COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    console.error('Ingestion test failed:', err);
  } finally {
    await app.close();
  }
}

testIngestionPipeline();
