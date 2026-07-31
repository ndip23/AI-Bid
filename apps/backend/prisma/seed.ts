import { PrismaClient, UserRole, TenderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding rich full corpus of African procurement tenders (Cameroon, Nigeria, Kenya, SA, Pan-African)...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.matchScore.deleteMany();
  await prisma.savedTender.deleteMany();
  await prisma.aiSummary.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const passwordHash = await bcrypt.hash('DemoPassword123!', 10);

  // Create Company
  const company1 = await prisma.company.create({
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

  // Admin User
  await prisma.user.create({
    data: {
      email: 'admin@aibidcopilot.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Director',
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Company User
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

  // ──── CAMEROON (ARMP / COLEPS) TENDERS ────
  const tendersData = [
    {
      title: 'Ministère des Travaux Publics (MINTP Cameroon) — Douala Highway Link & Smart Telemetry',
      refNumber: 'CMR-ARMP-2026-N089',
      buyerName: 'Ministère des Travaux Publics (MINTP Cameroon)',
      buyerCountry: 'Cameroon',
      industry: 'Civil Infrastructure & Construction',
      estimatedValue: 12500000,
      currency: 'USD',
      publishDate: new Date('2026-07-25'),
      deadline: new Date('2026-09-15'),
      status: TenderStatus.OPEN,
      description: 'Appel d’Offres National Ouvert pour les travaux d’aménagement de l’axe routier Douala-Yaoundé et installation de capteurs intelligents de télémétrie routière.',
      rawContent: 'SECTION 1: Objet de l’Appel d’Offres. Exigence de garantie bancaire 2%, enregistrement ARMP obligatoire, effectif 50+ ingénieurs.\nDELIVERABLES: Bitumage et installation de 40 stations de pesage automatique.',
      attachments: ['mintp-douala-highway.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-ARMP-2026-N089',
    },
    {
      title: 'Centre Hospitalier Universitaire de Yaoundé — Modern Imaging & Medical Equipment Supply',
      refNumber: 'CMR-CHU-2026-MED-042',
      buyerName: 'Ministère de la Santé Publique (MINSANTE Cameroon)',
      buyerCountry: 'Cameroon',
      industry: 'Healthcare & Healthtech Systems',
      estimatedValue: 3800000,
      currency: 'USD',
      publishDate: new Date('2026-07-22'),
      deadline: new Date('2026-09-10'),
      status: TenderStatus.OPEN,
      description: 'Fourniture, installation et mise en service d’équipements d’imagerie médicale (IRM 3T, Scanner 128 coupes) au CHU de Yaoundé.',
      rawContent: 'SPECIFICATIONS: Agrément MINSANTE exigé, garantie constructeur 3 ans, formation du personnel médical sur site.',
      attachments: ['minsante-chu-imaging.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-CHU-2026-MED-042',
    },
    {
      title: 'Port Autonome de Limbe — Deepwater Crane & Security Container Inspection Systems',
      refNumber: 'CMR-PAL-2026-PORT-110',
      buyerName: 'Port Autonome de Limbe Authority',
      buyerCountry: 'Cameroon',
      industry: 'Transport & Port Logistics',
      estimatedValue: 15000000,
      currency: 'USD',
      publishDate: new Date('2026-07-18'),
      deadline: new Date('2026-09-30'),
      status: TenderStatus.OPEN,
      description: 'Fourniture et montage de portiques de manutention de conteneurs et déploiement du système de scanner d’inspection douanière.',
      rawContent: 'EXIGENCES: Certification ISO 9001, expérience minimale de 10 ans dans l’équipement portuaire maritime.',
      attachments: ['pal-port-security.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-PAL-2026-PORT-110',
    },
    {
      title: 'Ministère de l’Eau et de l’Énergie — Garoua Solar Photovoltaic Plant & Microgrids',
      refNumber: 'CMR-MINEE-2026-SOLAR-07',
      buyerName: 'Ministère de l’Eau et de l’Énergie (MINEE Cameroon)',
      buyerCountry: 'Cameroon',
      industry: 'Renewable Energy & Solar Power',
      estimatedValue: 8200000,
      currency: 'USD',
      publishDate: new Date('2026-07-15'),
      deadline: new Date('2026-09-25'),
      status: TenderStatus.OPEN,
      description: 'Construction d’une centrale solaire photovoltaïque de 15 MW à Garoua et mini-réseaux associés pour l’électrification rurale du Nord.',
      rawContent: 'CONDIITONS: Licence MINEE, fourniture de panneaux solaires certifiés Tier-1, batteries LFP haute capacité.',
      attachments: ['minee-garoua-solar.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-MINEE-2026-SOLAR-07',
    },
    {
      title: 'Ministère de l’Éducation de Base — Primary School Infrastructure & Digital Laboratories',
      refNumber: 'CMR-MINEDUB-2026-EDU-55',
      buyerName: 'Ministère de l’Éducation de Base (MINEDUB Cameroon)',
      buyerCountry: 'Cameroon',
      industry: 'Education & Digital Infrastructure',
      estimatedValue: 4500000,
      currency: 'USD',
      publishDate: new Date('2026-07-10'),
      deadline: new Date('2026-08-30'),
      status: TenderStatus.OPEN,
      description: 'Construction de 80 salles de classe modernes et équipement en laboratoires informatiques solaires dans la région de l’Adamaoua.',
      rawContent: 'SPECIFICATIONS: Construction en matériaux locaux stabilisés, ordinateurs portables durcis avec logiciels éducatifs préinstallés.',
      attachments: ['minedub-school-spec.pdf'],
      sourceUrl: 'https://armp.cm/tenders/CMR-MINEDUB-2026-EDU-55',
    },

    // ──── NIGERIA (BPP / NOPO) TENDERS ────
    {
      title: 'Federal Ministry of Communications Nigeria — National Government Cloud & Data Center',
      refNumber: 'FMCDE-NG-2026-CLOUD-04',
      buyerName: 'Federal Ministry of Communications, Innovation & Digital Economy',
      buyerCountry: 'Nigeria',
      industry: 'Cloud & IT Infrastructure',
      estimatedValue: 8500000,
      currency: 'USD',
      publishDate: new Date('2026-07-28'),
      deadline: new Date('2026-08-30'),
      status: TenderStatus.OPEN,
      description: 'Procurement of Tier-III Data Center Infrastructure, Hybrid Cloud Migration, and Cyber Incident Response for Federal Government Ministries.',
      rawContent: 'MANDATORY REQUIREMENTS: BPP IRR Certificate, NITDA IT Clearance, Tax Clearance Certificate (3 years), ISO 27001 certification.',
      attachments: ['fmcde-nigeria-cloud.pdf'],
      sourceUrl: 'https://bpp.gov.ng/tenders/fmcde-ng-2026-04',
    },
    {
      title: 'Nigerian Railway Corporation — Lagos-Ibadan Railway Signal & Telecommunications Modernization',
      refNumber: 'NRC-NG-2026-RAIL-99',
      buyerName: 'Nigerian Railway Corporation (NRC)',
      buyerCountry: 'Nigeria',
      industry: 'Civil Infrastructure & Construction',
      estimatedValue: 22000000,
      currency: 'USD',
      publishDate: new Date('2026-07-20'),
      deadline: new Date('2026-10-15'),
      status: TenderStatus.OPEN,
      description: 'Installation of Automated Train Protection (ATP) signaling, fiber optic communications along the Lagos-Ibadan rail corridor.',
      rawContent: 'REQUIREMENTS: BPP Registration, Federal Ministry of Transportation clearance, 15+ years heavy railway engineering experience.',
      attachments: ['nrc-railway-signal.pdf'],
      sourceUrl: 'https://bpp.gov.ng/tenders/nrc-ng-2026-rail-99',
    },
    {
      title: 'Federal Ministry of Health Nigeria — National Referral Hospital Medical Equipment & EHR',
      refNumber: 'FMH-NG-2026-EHR-12',
      buyerName: 'Federal Ministry of Health',
      buyerCountry: 'Nigeria',
      industry: 'Healthcare & Healthtech Systems',
      estimatedValue: 9100000,
      currency: 'USD',
      publishDate: new Date('2026-07-16'),
      deadline: new Date('2026-09-18'),
      status: TenderStatus.OPEN,
      description: 'Procurement of diagnostic imaging equipment and unified Electronic Health Record software across 6 Federal Medical Centers.',
      rawContent: 'SPECIFICATIONS: Medical Registration Council certification, HL7/FHIR compliance, 24/7 technical support in Abuja & Lagos.',
      attachments: ['fmh-medical-spec.pdf'],
      sourceUrl: 'https://bpp.gov.ng/tenders/fmh-ng-2026-ehr-12',
    },

    // ──── KENYA (PPIP / COUNTIES) TENDERS ────
    {
      title: 'Nairobi City County Kenya — Smart Water Metering Telemetry & IoT Platform',
      refNumber: 'NCC-KE-2026-IOT-771',
      buyerName: 'Nairobi City County Government',
      buyerCountry: 'Kenya',
      industry: 'Smart City Infrastructure',
      estimatedValue: 4200000,
      currency: 'USD',
      publishDate: new Date('2026-07-20'),
      deadline: new Date('2026-09-05'),
      status: TenderStatus.OPEN,
      description: 'Supply, installation, and commissioning of 25,000 smart water IoT telemetry devices with real-time billing integration.',
      rawContent: 'KENYA PPIP SPECIFICATION: Valid KRA Tax Compliance Certificate, NCA Registration, 5 years past IoT deployment experience in East Africa.',
      attachments: ['nairobi-smart-water-iot.pdf'],
      sourceUrl: 'https://tenders.go.ke/notice/ncc-ke-2026-iot-771',
    },
    {
      title: 'Kenya Ports Authority — Cargo Inspection X-Ray Scanners & Automated Gate Automation',
      refNumber: 'KPA-KE-2026-PORT-303',
      buyerName: 'Kenya Ports Authority (KPA)',
      buyerCountry: 'Kenya',
      industry: 'Transport & Port Logistics',
      estimatedValue: 7600000,
      currency: 'USD',
      publishDate: new Date('2026-07-14'),
      deadline: new Date('2026-09-12'),
      status: TenderStatus.OPEN,
      description: 'Procurement of high-throughput mobile X-ray container inspection scanners and optical character recognition (OCR) gate automation.',
      rawContent: 'REQUIREMENTS: KPA Vendor Clearance, Radiation Protection Board certification, 3 years local support SLA in Mombasa.',
      attachments: ['kpa-gate-automation.pdf'],
      sourceUrl: 'https://tenders.go.ke/notice/kpa-ke-2026-port-303',
    },

    // ──── SOUTH AFRICA (NATIONAL TREASURY ETENDER) TENDERS ────
    {
      title: 'South Africa Department of Health — National Electronic Health Records System',
      refNumber: 'ZA-DOH-2026-EHR-109',
      buyerName: 'South Africa Department of Health',
      buyerCountry: 'South Africa',
      industry: 'Healthcare & Healthtech Systems',
      estimatedValue: 6800000,
      currency: 'USD',
      publishDate: new Date('2026-07-18'),
      deadline: new Date('2026-09-20'),
      status: TenderStatus.OPEN,
      description: 'Procurement of a unified cloud-native Electronic Health Record (EHR) and remote clinical telemedicine platform across South African clinics.',
      rawContent: 'SOUTH AFRICA NATIONAL TREASURY ETENDER SPECIFICATION: B-BBEE Level 1-4 compliance certification mandatory. POPIA privacy compliance.',
      attachments: ['za-doh-ehr-spec.pdf'],
      sourceUrl: 'https://etenders.gov.za/tender/ZA-DOH-2026-EHR-109',
    },
    {
      title: 'City of Cape Town — Grid Energy Storage & Battery Substation Expansion',
      refNumber: 'CCT-ZA-2026-GRID-88',
      buyerName: 'City of Cape Town Energy Directorate',
      buyerCountry: 'South Africa',
      industry: 'Renewable Energy & Solar Power',
      estimatedValue: 19500000,
      currency: 'USD',
      publishDate: new Date('2026-07-12'),
      deadline: new Date('2026-10-01'),
      status: TenderStatus.OPEN,
      description: 'Engineering, procurement, and construction of 50 MWh Utility-Scale Battery Energy Storage Systems (BESS) for grid stabilization.',
      rawContent: 'MANDATORY: CIDB Grade 8EP/9EP registration, South African Grid Code compliance, local content participation commitment.',
      attachments: ['cct-bess-spec.pdf'],
      sourceUrl: 'https://etenders.gov.za/tender/CCT-ZA-2026-GRID-88',
    },

    // ──── PAN-AFRICAN & DEVELOPMENT BANKS ────
    {
      title: 'African Development Bank (AfDB) — Pan-African Rural Solar Microgrid Rollout',
      refNumber: 'AFDB-P-Z1-FA0-019',
      buyerName: 'African Development Bank Group',
      buyerCountry: 'Pan-African',
      industry: 'Renewable Energy & Solar Power',
      estimatedValue: 18500000,
      currency: 'USD',
      publishDate: new Date('2026-07-10'),
      deadline: new Date('2026-09-30'),
      status: TenderStatus.OPEN,
      description: 'Design, procurement, and installation of 120 solar-powered mini-grids across rural West & East Africa under AfDB financing framework.',
      rawContent: 'BIDDING RULES: Open International Bidding under AfDB Procurement Framework. Mandatory audited financial turnover exceeding $10M.',
      attachments: ['afdb-solar-microgrid.pdf'],
      sourceUrl: 'https://afdb.org/procurement/AFDB-P-Z1-FA0-019',
    },
  ];

  for (const tData of tendersData) {
    const createdTender = await prisma.tender.create({ data: tData });

    // Generate AI Summary
    await prisma.aiSummary.create({
      data: {
        tenderId: createdTender.id,
        executiveSummary: `Official public procurement notice by ${createdTender.buyerName} (${createdTender.buyerCountry}) valued at $${(createdTender.estimatedValue / 1000000).toFixed(1)}M USD.`,
        requirements: JSON.parse(JSON.stringify([
          { id: 'r1', category: 'Compliance', description: `Official registration with ${createdTender.buyerCountry} procurement authority`, isMandatory: true },
          { id: 'r2', category: 'Financial', description: 'Audited financial statements for past 3 fiscal years', isMandatory: true },
          { id: 'r3', category: 'Technical', description: `Proven track record in ${createdTender.industry}`, isMandatory: true },
        ])),
        deliverables: JSON.parse(JSON.stringify(['Project Execution Blueprint', 'Technical Delivery & Commissioning', '24/7 SLA Technical Support'])),
        deadlineSummary: `Full technical and financial proposals due ${new Date(createdTender.deadline).toLocaleDateString()}.`,
        risks: JSON.parse(JSON.stringify([
          { id: 'rk1', risk: 'Strict milestone delivery schedule', severity: 'MEDIUM', mitigation: 'Establish local operational office and project manager.' },
        ])),
      },
    });
  }

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

  console.log('✅ Prisma Full African Procurement Database Seeded (Cameroon, Nigeria, Kenya, SA, Pan-African)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
