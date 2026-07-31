import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating company operating countries to African target markets...');

  const updated = await prisma.company.updateMany({
    data: {
      countries: ['Cameroon', 'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Rwanda'],
    },
  });

  console.log(`✅ Updated ${updated.count} company records in Neon PostgreSQL DB!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
