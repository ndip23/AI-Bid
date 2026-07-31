import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seeding with African & Global Procurement Tenders...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.matchScore.deleteMany();
  await prisma.savedTender.deleteMany();
  await prisma.aiSummary.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // 1. Create Default Company
  const company1 = await prisma.company.create({
    data: {
      name: 'Apex Technology Solutions',
      industry: 'Cloud & Managed IT Services',
      countries: ['Cameroon', 'Nigeria', 'Kenya', 'South Africa', 'United States'],
      certifications: ['ISO 27001', 'SOC 2 Type II', 'ISO 9001', 'ARMP Registered', 'NITDA IT Clearance'],
      services: [
        'Cloud Migration & DevOps',
        'Enterprise Cybersecurity',
        'Custom Software Engineering',
        'SLA 24/7 Managed Services',
        'IoT Telemetry & Smart City Platforms',
      ],
      teamSize: 85,
      annualRevenue: '$15M - $25M',
      website: 'https://apextechsolutions.demo',
      description:
        'Apex Technology Solutions is a premier technology provider specializing in secure cloud infrastructure, enterprise software development, and AI integration for African government and enterprise clients.',
    },
  });

  // 2. Create Super Admin User
  await prisma.user.create({
    data: {
      email: 'admin@aibidcopilot.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Director',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // 3. Create Company User
  const companyUser = await prisma.user.create({
    data: {
      email: 'user@apextech.com',
      passwordHash,
      firstName: 'David',
      lastName: 'Miller',
      role: UserRole.COMPANY_USER,
      companyId: company1.id,
    },
  });

  // 4. Create African Procurement Tenders
  const tenderCameroon = await prisma.tender.create({
    data: {
      title: 'Ministère des Travaux Publics (MINTP Cameroon) — Douala Regional Highway Link & Smart Telemetry',
      refNumber: 'CMR-ARMP-2026-N089',
      buyerName: 'Ministère des Travaux Publics (MINTP Cameroon)',
      buyerCountry: 'Cameroon',
      industry: 'Civil Infrastructure & Construction',
      estimatedValue: 12500000,
      currency: 'USD',
      publishDate: new Date('2026-07-25'),
      deadline: new Date('2026-09-15'),
      status: 'OPEN',
      description:
        'Appel d’Offres National Ouvert pour les travaux d’aménagement de l’axe routier Douala-Yaoundé et installation de capteurs intelligents de télémétrie routière.',
      rawContent: `SECTION 1: Objet de l’Appel d’Offres. Exigence de garantie bancaire 2%, enregistrement ARMP obligatoire, effectif 50+ ingénieurs.
DELIVERABLES:
- Conception et bitumage de la liaison autoroutière Douala.
- Déploiement de 40 stations de contrôle de pesage automatique et caméras ANPR.`,
      attachments: ['mintp-douala-highway-spec.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-ARMP-2026-N089',
    },
  });

  const tenderNigeria = await prisma.tender.create({
    data: {
      title: 'Federal Ministry of Communications Nigeria — National Government Cloud & Data Center Modernization',
      refNumber: 'FMCDE-NG-2026-CLOUD-04',
      buyerName: 'Federal Ministry of Communications, Innovation & Digital Economy',
      buyerCountry: 'Nigeria',
      industry: 'Cloud & IT Infrastructure',
      estimatedValue: 8500000,
      currency: 'USD',
      publishDate: new Date('2026-07-28'),
      deadline: new Date('2026-08-30'),
      status: 'OPEN',
      description:
        'Procurement of Tier-III Data Center Infrastructure, Hybrid Cloud Migration, and Cyber Incident Response for Nigerian Federal Government Ministries.',
      rawContent: `MANDATORY REQUIREMENTS:
1. Active BPP IRR Clearance Certificate & Industrial Training Fund (ITF) Compliance.
2. NITDA IT clearance & 3 years Audited Financial Tax Clearance Certificate.
3. ISO 27001 & SOC 2 Type II certified vendor.`,
      attachments: ['fmcde-nigeria-cloud.pdf'],
      sourceUrl: 'https://bpp.gov.ng/tenders/fmcde-ng-2026-04',
    },
  });

  const tenderKenya = await prisma.tender.create({
    data: {
      title: 'Nairobi City County Kenya — Smart Water Metering Telemetry & IoT Platform',
      refNumber: 'NCC-KE-2026-IOT-771',
      buyerName: 'Nairobi City County Government',
      buyerCountry: 'Kenya',
      industry: 'Smart City Infrastructure',
      estimatedValue: 4200000,
      currency: 'USD',
      publishDate: new Date('2026-07-20'),
      deadline: new Date('2026-09-05'),
      status: 'OPEN',
      description:
        'Supply, installation, and commissioning of 25,000 smart water IoT telemetry devices with real-time billing integration for Nairobi Metropolitan Area.',
      rawContent: `KENYA PPIP SPECIFICATION:
1. REQUIREMENTS: Valid KRA Tax Compliance Certificate, NCA Registration, 5 years past IoT deployment experience in East Africa.`,
      attachments: ['nairobi-smart-water-iot.pdf'],
      sourceUrl: 'https://tenders.go.ke/notice/ncc-ke-2026-iot-771',
    },
  });

  const tenderSouthAfrica = await prisma.tender.create({
    data: {
      title: 'South Africa Department of Health — National Electronic Health Records & Telemedicine System',
      refNumber: 'ZA-DOH-2026-EHR-109',
      buyerName: 'South Africa Department of Health',
      buyerCountry: 'South Africa',
      industry: 'Healthcare & Healthtech Systems',
      estimatedValue: 6800000,
      currency: 'USD',
      publishDate: new Date('2026-07-18'),
      deadline: new Date('2026-09-20'),
      status: 'OPEN',
      description:
        'Procurement of a unified cloud-native Electronic Health Record (EHR) and remote clinical telemedicine platform across South African provincial clinics.',
      rawContent: `SOUTH AFRICA NATIONAL TREASURY ETENDER SPECIFICATION:
1. B-BBEE Level 1-4 compliance certification mandatory.
2. Protection of Personal Information Act (POPIA) compliance.`,
      attachments: ['za-doh-ehr-spec.pdf'],
      sourceUrl: 'https://etenders.gov.za/tender/ZA-DOH-2026-EHR-109',
    },
  });

  const tenderAfDB = await prisma.tender.create({
    data: {
      title: 'African Development Bank (AfDB) — Pan-African Rural Solar Microgrid & Power Grid Extension',
      refNumber: 'AFDB-P-Z1-FA0-019',
      buyerName: 'African Development Bank Group',
      buyerCountry: 'Pan-African',
      industry: 'Renewable Energy & Solar Power',
      estimatedValue: 18500000,
      currency: 'USD',
      publishDate: new Date('2026-07-10'),
      deadline: new Date('2026-09-30'),
      status: 'OPEN',
      description:
        'Design, procurement, and installation of 120 solar-powered mini-grids across rural West & East Africa under AfDB financing framework.',
      rawContent: `BIDDING RULES: Open International Bidding under AfDB Procurement Framework. Mandatory audited financial turnover exceeding $10M.`,
      attachments: ['afdb-solar-microgrid.pdf'],
      sourceUrl: 'https://afdb.org/procurement/AFDB-P-Z1-FA0-019',
    },
  });

  const tenderUS = await prisma.tender.create({
    data: {
      title: 'US Department of Veterans Affairs — Cloud Migration & Hybrid Security Architecture',
      refNumber: 'VA-2026-CLOUD-9941',
      buyerName: 'US Department of Veterans Affairs',
      buyerCountry: 'United States',
      industry: 'Cloud & IT Infrastructure',
      estimatedValue: 4500000,
      currency: 'USD',
      publishDate: new Date('2026-07-15'),
      deadline: new Date('2026-08-25'),
      status: 'OPEN',
      description:
        'Multi-region hybrid cloud migration from legacy mainframe workloads to AWS/Azure environments, complete with zero-trust network security posture.',
      rawContent: `SECTION C: STATEMENT OF WORK (SOW)\n1. SCOPE: Provide cloud migration for 12 VA medical centers.\n2. MANDATORY COMPLIANCE: ISO 27001 & SOC 2 Type II certification.`,
      attachments: ['va-2026-sow.pdf'],
      sourceUrl: 'https://sam.gov/opp/va-2026-cloud-9941',
    },
  });

  // Seed AI Summaries for African Tenders
  await prisma.aiSummary.createMany({
    data: [
      {
        tenderId: tenderCameroon.id,
        executiveSummary: 'Major $12.5M USD Highway construction and IoT telemetry procurement by MINTP Cameroon under ARMP framework.',
        requirements: JSON.parse(JSON.stringify([{ id: 'r1', category: 'Compliance', description: 'ARMP Registration & 2% Bank Guarantee', isMandatory: true }])),
        deliverables: JSON.parse(JSON.stringify(['Douala Highway Paving', '40 Smart Telemetry Stations'])),
        deadlineSummary: 'Full proposals due September 15, 2026.',
        risks: JSON.parse(JSON.stringify([{ id: 'rk1', risk: 'Monsoon weather delay risk', severity: 'MEDIUM', mitigation: 'Phase earthworks during dry season.' }])),
      },
      {
        tenderId: tenderNigeria.id,
        executiveSummary: 'High-value $8.5M USD Federal Government Cloud Migration and Data Center Modernization contract in Abuja, Nigeria.',
        requirements: JSON.parse(JSON.stringify([{ id: 'r2', category: 'Compliance', description: 'BPP IRR Certificate & NITDA IT Clearance', isMandatory: true }])),
        deliverables: JSON.parse(JSON.stringify(['Tier-III Data Center Spec', 'Federal Cloud Migration'])),
        deadlineSummary: 'Proposals due August 30, 2026.',
        risks: JSON.parse(JSON.stringify([{ id: 'rk2', risk: 'Strict local data residency compliance', severity: 'HIGH', mitigation: 'Deploy in Abuja Tier-III data center.' }])),
      },
      {
        tenderId: tenderKenya.id,
        executiveSummary: '$4.2M USD Smart Water Metering and IoT telemetry infrastructure contract for Nairobi City County, Kenya.',
        requirements: JSON.parse(JSON.stringify([{ id: 'r3', category: 'Compliance', description: 'KRA Tax Clearance & NCA Registration', isMandatory: true }])),
        deliverables: JSON.parse(JSON.stringify(['25,000 IoT Meter Deployments', 'Telemetry Billing Platform'])),
        deadlineSummary: 'Proposals due September 5, 2026.',
        risks: JSON.parse(JSON.stringify([{ id: 'rk3', risk: 'LoRaWAN coverage gaps', severity: 'LOW', mitigation: 'Deploy cellular NB-IoT fallback fallback modems.' }])),
      },
    ],
  });

  // Seed default Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: companyUser.id,
        title: 'New High-Match Tender: Cameroon Highway & Telemetry',
        message: 'MINTP Cameroon published CMR-ARMP-2026-N089 matching your operational geographies.',
        type: 'NEW_MATCH',
      },
      {
        userId: companyUser.id,
        title: 'New High-Match Tender: Nigeria Federal Cloud',
        message: 'Federal Ministry of Communications Nigeria published FMCDE-NG-2026-CLOUD-04 ($8.5M USD).',
        type: 'NEW_MATCH',
      },
    ],
  });

  console.log('✅ Prisma African Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
