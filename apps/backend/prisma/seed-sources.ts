import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding African & Multilateral Procurement Sources into Registry...');

  const sources = [
    {
      country: 'Cameroon',
      sourceName: 'ARMP (Agence de Régulation des Marchés Publics)',
      method: 'HTML / Scraper',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 142,
    },
    {
      country: 'Cameroon',
      sourceName: 'COLEPS (Cameroon Online E-Procurement System)',
      method: 'API / HTML',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 89,
    },
    {
      country: 'Nigeria',
      sourceName: 'BPP (Bureau of Public Procurement Nigeria)',
      method: 'HTML',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 215,
    },
    {
      country: 'Kenya',
      sourceName: 'PPIP (Public Procurement Information Portal Kenya)',
      method: 'API / HTML',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 178,
    },
    {
      country: 'Ghana',
      sourceName: 'PPA (Public Procurement Authority Ghana)',
      method: 'HTML',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 94,
    },
    {
      country: 'Rwanda',
      sourceName: 'RPPA (Rwanda Public Procurement Authority / Umucyo)',
      method: 'API',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 112,
    },
    {
      country: 'South Africa',
      sourceName: 'eTender (National Treasury South Africa)',
      method: 'HTML / RSS',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 304,
    },
    {
      country: 'Uganda',
      sourceName: 'PPDA (Public Procurement and Disposal of Assets Authority)',
      method: 'HTML',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 76,
    },
    {
      country: 'Pan-African',
      sourceName: 'AfDB (African Development Bank Group Portal)',
      method: 'API / RSS',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 165,
    },
    {
      country: 'Global / Africa',
      sourceName: 'World Bank Procurement & Projects API',
      method: 'API',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 420,
    },
    {
      country: 'Global / Africa',
      sourceName: 'UNGM (United Nations Global Marketplace)',
      method: 'API / RSS',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 195,
    },
    {
      country: 'Global / Africa',
      sourceName: 'JSearch RapidAPI Procurement Aggregator',
      method: 'API',
      frequency: 'Hourly',
      status: 'ACTIVE',
      totalIngested: 230,
    },
  ];

  for (const s of sources) {
    const existing = await prisma.procurementSource.findFirst({
      where: { sourceName: s.sourceName },
    });

    if (!existing) {
      await prisma.procurementSource.create({
        data: s,
      });
    }
  }

  console.log('✅ Procurement Source Registry Seeded with 12 Active African & Multilateral Feeds (World Bank, AfDB, UNGM, JSearch, ARMP, BPP)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
