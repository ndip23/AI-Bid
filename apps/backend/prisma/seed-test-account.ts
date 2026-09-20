import { PrismaClient, UserRole, SavedStatus, Priority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding fully verified test account with all documents, company profile, and pipeline updates...');

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // 1. Create or Update Company with full documents & credentials
  const companyData = {
    name: 'Apex Technology Solutions Ltd',
    taxId: 'RC/DLA/2019/B/1420 • NIF: M051912789012A',
    industry: 'Cloud & IT Infrastructure',
    countries: ['Cameroon', 'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Rwanda', 'Senegal', 'Ivory Coast'],
    certifications: [
      'ISO 27001 (Information Security)',
      'ISO 9001 (Quality Management)',
      'SOC 2 Type II',
      'ARMP Registered Contractor (Grade A)',
      'NITDA IT Clearance Certification',
      'BPP Federal Contractor IRR Database',
      'CNPS Social Security Clearance Certificate',
      'Tax Non-Redevance (DGI Valid)',
    ],
    services: [
      'Cloud Infrastructure & Data Centers',
      'Civil Infrastructure & Telemetry',
      'Enterprise Software & Healthtech',
      'IoT Smart Sensors & Telecommunications',
      'Renewable Solar Power & Microgrids',
      'Cybersecurity & Public Safety',
    ],
    annualRevenue: '$15M - $25M',
    teamSize: 85,
    website: 'https://apextechsolutions.demo',
    description:
      'Apex Technology Solutions Ltd is an accredited African digital engineering and cloud infrastructure contractor. We deploy secure government digital infrastructure, civil telemetry systems, smart grid IoT, and mission-critical enterprise software across CEMAC and ECOWAS jurisdictions.',
  };

  // Find existing Apex company or first company
  let company = await prisma.company.findFirst({
    where: {
      OR: [
        { name: { contains: 'Apex', mode: 'insensitive' } },
        { name: 'Apex Technology Solutions Ltd' },
      ],
    },
  });

  if (company) {
    company = await prisma.company.update({
      where: { id: company.id },
      data: companyData,
    });
    console.log(`✅ Updated existing company: ${company.name} (${company.id})`);
  } else {
    company = await prisma.company.create({
      data: companyData,
    });
    console.log(`✅ Created new company: ${company.name} (${company.id})`);
  }

  // 2. Ensure primary test accounts exist and point to this company
  const testAccounts = [
    { email: 'user@apextech.com', username: 'david_miller', role: UserRole.COMPANY_USER },
    { email: 'demo@bidora.io', username: 'demo_bidder', role: UserRole.COMPANY_USER },
    { email: 'test@bidora.io', username: 'test_contractor', role: UserRole.COMPANY_USER },
  ];

  for (const acc of testAccounts) {
    const existing = await prisma.user.findUnique({
      where: { email: acc.email },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          username: acc.username,
          companyId: company.id,
          role: acc.role,
        },
      });
      console.log(`✅ Updated test user credentials: ${acc.email} (password: DemoPassword123!)`);
    } else {
      await prisma.user.create({
        data: {
          email: acc.email,
          username: acc.username,
          passwordHash,
          role: acc.role,
          companyId: company.id,
        },
      });
      console.log(`✅ Created test user credentials: ${acc.email} (password: DemoPassword123!)`);
    }
  }

  // 3. Populate Match Scores for open tenders so the user sees high match scores immediately
  const tenders = await prisma.tender.findMany({
    where: { status: 'OPEN' },
    take: 40,
    include: { aiSummary: true },
  });

  console.log(`📊 Generating AI Match Scores for ${tenders.length} tenders...`);
  for (const tender of tenders) {
    const isCameroonOrRegion =
      company.countries.some((c) => c.toLowerCase() === tender.buyerCountry.toLowerCase()) ||
      tender.title.toLowerCase().includes('cameroon') ||
      tender.title.toLowerCase().includes('energy') ||
      tender.title.toLowerCase().includes('digital') ||
      tender.title.toLowerCase().includes('infrastructure');

    const overallScore = isCameroonOrRegion ? Math.floor(Math.random() * 11) + 88 : Math.floor(Math.random() * 15) + 65;
    const industryScore = 95;
    const countryScore = isCameroonOrRegion ? 100 : 40;
    const experienceScore = 90;
    const certScore = 98;

    const reasons = [
      `High Compatibility (${overallScore}%): Strong synergy between Apex Technology Solutions and ${tender.buyerName}`,
      `Certified Entity: Meets ISO 27001, ISO 9001, ARMP Grade A, and Tax Compliance standards`,
      `Regional Footprint: Operational headquarters active in ${tender.buyerCountry || 'target market'}`,
      `Service Alignment: Directly maps to Enterprise Infrastructure & Technical Services`,
    ];

    const metRequirements = [
      'Trade Registry & Valid Tax Clearance (< 3 months)',
      'CNPS Social Security Regularity Certificate',
      'ISO 27001 & ISO 9001 certified protocols',
      'Provisional bid bond liquidity & audited balance sheets (3 years)',
      'Local execution capacity & certified key personnel',
    ];

    const missingRequirements: string[] = [];

    const existingMatch = await prisma.matchScore.findFirst({
      where: { companyId: company.id, tenderId: tender.id },
    });

    if (existingMatch) {
      await prisma.matchScore.update({
        where: { id: existingMatch.id },
        data: {
          overallScore,
          industryMatchScore: industryScore,
          countryMatchScore: countryScore,
          experienceScore,
          certMatchScore: certScore,
          reasons: reasons as any,
          metRequirements: metRequirements as any,
          missingRequirements: missingRequirements as any,
        },
      });
    } else {
      await prisma.matchScore.create({
        data: {
          companyId: company.id,
          tenderId: tender.id,
          overallScore,
          industryMatchScore: industryScore,
          countryMatchScore: countryScore,
          experienceScore,
          certMatchScore: certScore,
          reasons: reasons as any,
          metRequirements: metRequirements as any,
          missingRequirements: missingRequirements as any,
        },
      });
    }
  }

  // 4. Populate Pipeline Stages in saved_tenders
  if (tenders.length >= 3) {
    const [t1, t2, t3] = tenders;

    // Stage: BIDDING (actively preparing bid / ready for submission)
    await prisma.savedTender.upsert({
      where: { companyId_tenderId: { companyId: company.id, tenderId: t1.id } },
      update: {
        status: SavedStatus.BIDDING,
        priority: Priority.HIGH,
        notes: 'Dossier packaging complete with 3 Envelopes (Administrative, Technical, Financial). Ready for final submission.',
      },
      create: {
        companyId: company.id,
        tenderId: t1.id,
        status: SavedStatus.BIDDING,
        priority: Priority.HIGH,
        notes: 'Dossier packaging complete with 3 Envelopes (Administrative, Technical, Financial). Ready for final submission.',
      },
    });

    // Stage: UNDER_REVIEW (legal & engineering review)
    await prisma.savedTender.upsert({
      where: { companyId_tenderId: { companyId: company.id, tenderId: t2.id } },
      update: {
        status: SavedStatus.UNDER_REVIEW,
        priority: Priority.HIGH,
        notes: 'Technical team reviewing CCTP specifications and preparing GANTT methodology.',
      },
      create: {
        companyId: company.id,
        tenderId: t2.id,
        status: SavedStatus.UNDER_REVIEW,
        priority: Priority.HIGH,
        notes: 'Technical team reviewing CCTP specifications and preparing GANTT methodology.',
      },
    });

    // Stage: BOOKMARKED (pipeline discovery)
    await prisma.savedTender.upsert({
      where: { companyId_tenderId: { companyId: company.id, tenderId: t3.id } },
      update: {
        status: SavedStatus.BOOKMARKED,
        priority: Priority.MEDIUM,
        notes: 'Identified as promising regional opportunity. Awaiting bid bond preliminary quote.',
      },
      create: {
        companyId: company.id,
        tenderId: t3.id,
        status: SavedStatus.BOOKMARKED,
        priority: Priority.MEDIUM,
        notes: 'Identified as promising regional opportunity. Awaiting bid bond preliminary quote.',
      },
    });

    console.log(`📌 Pipeline seeded: 1 BIDDING, 1 UNDER_REVIEW, 1 BOOKMARKED.`);
  }

  // 5. Seed Real-time Notifications for the test users
  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@bidora.io' } });
  const apexUser = await prisma.user.findUnique({ where: { email: 'user@apextech.com' } });

  for (const u of [demoUser, apexUser]) {
    if (!u) continue;

    // Clear and re-populate recent notifications
    await prisma.notification.deleteMany({ where: { userId: u.id } });

    await prisma.notification.createMany({
      data: [
        {
          userId: u.id,
          title: '🔥 New High-Priority Match (95%)',
          message: `Your company profile matched tender "${tenders[0]?.title.slice(0, 50)}..." with 95% compatibility score.`,
          type: 'NEW_MATCH',
          isRead: false,
        },
        {
          userId: u.id,
          title: '⏳ Bid Submission Deadline Approaching',
          message: `The submission deadline for ref "${tenders[0]?.refNumber}" expires soon. Make sure to download and submit your 3-envelope package.`,
          type: 'DEADLINE_WARNING',
          isRead: false,
        },
        {
          userId: u.id,
          title: '📁 Knowledge Vault Synchronized',
          message: 'RCCM, Tax Clearance, CNPS and ISO 27001 credentials have been verified and linked to your corporate vault.',
          type: 'STATUS_CHANGE',
          isRead: true,
        },
      ],
    });
    console.log(`🔔 Notifications seeded for user ${u.email}`);
  }

  console.log('\n🎉 ALL DONE! Verified account details:');
  console.log('----------------------------------------------------');
  console.log('Email:     demo@bidora.io  (or user@apextech.com)');
  console.log('Password:  DemoPassword123!');
  console.log('Company:   Apex Technology Solutions Ltd');
  console.log('Tax ID:    RC/DLA/2019/B/1420 • NIF: M051912789012A');
  console.log('Status:    100% Complete with all documents in Vault');
  console.log('----------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
