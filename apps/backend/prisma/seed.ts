import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding core test accounts (100% Live Ingested Procurement Tenders Only)...');

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // 1. Ensure Demo Company exists
  let company1 = await prisma.company.findFirst({
    where: { name: 'Apex Technology Solutions' },
  });

  if (!company1) {
    company1 = await prisma.company.create({
      data: {
        name: 'Apex Technology Solutions',
        industry: 'Cloud & IT Infrastructure',
        countries: ['Cameroon', 'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Rwanda'],
        certifications: ['ISO 27001', 'SOC 2 Type II', 'ISO 9001', 'ARMP Registered', 'NITDA IT Clearance', 'BPP IRR Certificate'],
        services: [
          'Cloud Infrastructure & Data Centers',
          'Civil Infrastructure & Telemetry',
          'Enterprise Software & Healthtech',
          'IoT Smart Sensors & Telecommunications',
          'Renewable Solar Power & Microgrids',
        ],
        teamSize: 85,
        annualRevenue: '$15M - $25M',
        website: 'https://apextechsolutions.demo',
        description:
          'Apex Technology Solutions is a premier technology provider specializing in secure cloud infrastructure, civil telemetry, enterprise software, and AI integration for African government and enterprise clients.',
      },
    });
  }

  // 2. Ensure Admin User exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@aibidcopilot.com' },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: 'admin@bidora.io',
        username: 'admin',
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      },
    });
  }

  // 3. Ensure Company User exists
  const existingCompanyUser = await prisma.user.findUnique({
    where: { email: 'user@apextech.com' },
  });

  if (!existingCompanyUser) {
    await prisma.user.create({
      data: {
        email: 'user@apextech.com',
        username: 'david_miller',
        passwordHash,
        role: UserRole.COMPANY_USER,
        companyId: company1.id,
      },
    });
  }

  console.log('✅ Base user accounts and company profile verified. Zero static seed tenders added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
