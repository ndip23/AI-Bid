import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ArmpConnector } from './connectors/armp.connector';
import { ColepsConnector } from './connectors/coleps.connector';
import { GenericProcurementCrawler } from './connectors/generic-procurement-crawler';
import { PrismaService } from './prisma/prisma.service';
import { CategoryClassifierService } from './modules/source/category-classifier.service';

async function testCameroonIngestion() {
  console.log('=== RUNNING DEDICATED CAMEROON (ARMP / COLEPS / MINISTRIES) INGESTION ===');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });

  try {
    const prisma = app.get(PrismaService);
    const armpConnector = app.get(ArmpConnector);
    const colepsConnector = app.get(ColepsConnector);
    const genericCrawler = app.get(GenericProcurementCrawler);
    const categoryClassifier = app.get(CategoryClassifierService);

    // Dummy publisher object for Cameroon
    const cameroonPublisher: any = {
      id: 'cm-publisher-001',
      name: 'ARMP - Agence de Régulation des Marchés Publics Cameroon',
      country: 'Cameroon',
      connectorType: 'HTML',
      officialWebsite: 'https://www.armp.cm',
      procurementPage: 'https://www.armp.cm/appels-doffres',
      tendersPage: 'https://www.armp.cm/marches-publics',
    };

    console.log('\n[1/3] Executing ArmpConnector live crawl...');
    const armpTenders = await armpConnector.fetchLatest(cameroonPublisher);
    console.log(`ArmpConnector returned ${armpTenders.length} tenders.`);

    console.log('\n[2/3] Executing ColepsConnector live crawl...');
    const colepsPublisher: any = {
      id: 'cm-coleps-001',
      name: 'COLEPS - Cameroon Online E-Procurement System',
      country: 'Cameroon',
      connectorType: 'HTML',
      officialWebsite: 'https://www.marchespublics.cm',
      tendersPage: 'https://www.marchespublics.cm/tenders',
    };
    const colepsTenders = await colepsConnector.fetchLatest(colepsPublisher);
    console.log(`ColepsConnector returned ${colepsTenders.length} tenders.`);

    // Combine and insert into DB
    const allCameroonNotices = [...armpTenders, ...colepsTenders];
    let inserted = 0;
    let dups = 0;

    for (const tenderModel of allCameroonNotices) {
      try {
        const existing = await prisma.tender.findFirst({
          where: {
            OR: [
              { refNumber: tenderModel.referenceNumber },
              { sourceUrl: tenderModel.sourceURL },
            ],
          },
        });

        if (existing) {
          dups++;
          // Ensure status is OPEN and deadline is future
          await prisma.tender.update({
            where: { id: existing.id },
            data: {
              status: 'OPEN',
              deadline: tenderModel.closingDate,
              buyerCountry: 'Cameroon',
            },
          });
        } else {
          const classification = categoryClassifier.classify(
            tenderModel.title,
            tenderModel.description,
            tenderModel.sector
          );

          await prisma.tender.create({
            data: {
              title: tenderModel.title,
              refNumber: tenderModel.referenceNumber,
              buyerName: tenderModel.organization || 'Ministère des Marchés Publics (Cameroon)',
              buyerCountry: 'Cameroon',
              industry: classification.primaryCategory,
              estimatedValue: tenderModel.estimatedBudget || 0,
              currency: 'USD',
              publishDate: tenderModel.publicationDate,
              deadline: tenderModel.closingDate,
              description: tenderModel.description,
              rawContent: tenderModel.rawContent || tenderModel.description,
              sourceUrl: tenderModel.sourceURL,
              attachments: tenderModel.attachments || [],
              organization: tenderModel.organization || 'Government of Cameroon',
              sector: classification.primaryCategory,
              subcategory: 'Appel d’Offres National',
              procurementMethod: 'Appel d’Offres Ouvert',
              status: 'OPEN',
              language: 'fr',
            },
          });
          inserted++;
        }
      } catch (err: any) {
        console.error(`Error inserting tender ${tenderModel.referenceNumber}: ${err.message}`);
      }
    }

    console.log(`\n=== CAMEROON INGESTION COMPLETE: ${inserted} new inserted, ${dups} updated/deduplicated ===`);
    const totalCameroon = await prisma.tender.count({
      where: { buyerCountry: { contains: 'Cameroon', mode: 'insensitive' } },
    });
    console.log(`Total Cameroon Tenders in Database now: ${totalCameroon}`);

  } catch (err) {
    console.error('Cameroon Ingestion error:', err);
  } finally {
    await app.close();
  }
}

testCameroonIngestion();
