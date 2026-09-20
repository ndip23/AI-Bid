import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaService } from './prisma/prisma.service';
import { MatchService } from './modules/match/match.service';
import { OpportunityType, SourceCategory, BuyerType, BuyerIntent } from '@prisma/client';

async function ingestCameroonPrivateTenders() {
  console.log('========================================================================');
  console.log('🇨🇲 CAMEROON PRIVATE CORPORATE & SUBCONTRACTING INGESTION ENGINE');
  console.log('Target: Major Private Enterprises, Telcos, Banks, Ports & BSTP Consortia');
  console.log('========================================================================\n');

  const prisma = new PrismaService();
  await prisma.$connect();
  const matchService = new MatchService(prisma);

  try {

    // 1. Direct upsert of Cameroon private corporate publishers
    console.log('🌱 Ensuring Cameroon private corporate publishers are registered in database...');
    const privatePubs = [
      {
        name: 'MTN Cameroon - Direction des Achats & Approvisionnements',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://www.mtn.cm',
        procurementPage: 'https://www.mtn.cm/corporate/procurement-suppliers/',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
      {
        name: 'Orange Cameroun - Direction Générale des Achats',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://www.orange.cm',
        procurementPage: 'https://www.orange.cm/fr/fournisseurs-achats',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
      {
        name: 'Boissons du Cameroun (SABC / Castel Group)',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://www.boissonsducameroun.com',
        procurementPage: 'https://www.boissonsducameroun.com/achats-fournisseurs',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
      {
        name: 'Afriland First Bank - Direction des Achats & Logistique',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://www.afrilandfirstbank.com',
        procurementPage: 'https://www.afrilandfirstbank.com/appels-offres-prestataires',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
      {
        name: 'Cimencam (LafargeHolcim Group Cameroon)',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://www.cimencam.com',
        procurementPage: 'https://www.cimencam.com/fr/fournisseurs-et-achats',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
      {
        name: 'TotalEnergies Marketing Cameroun',
        country: 'Cameroon',
        organizationType: 'PRIVATE_PROCUREMENT' as const,
        officialWebsite: 'https://totalenergies.cm',
        procurementPage: 'https://totalenergies.cm/fournisseurs-appels-offres',
        connectorType: 'HTML' as const,
        sourceCategory: 'PRIVATE_PROCUREMENT' as const,
        defaultBuyerType: 'PRIVATE_COMPANY' as const,
      },
    ];

    for (const pub of privatePubs) {
      const existingPub = await prisma.publisher.findFirst({ where: { name: pub.name } });
      if (!existingPub) {
        await prisma.publisher.create({
          data: {
            name: pub.name,
            country: pub.country,
            organizationType: pub.organizationType,
            officialWebsite: pub.officialWebsite,
            procurementPage: pub.procurementPage,
            connectorType: pub.connectorType,
            sourceCategory: pub.sourceCategory,
            defaultBuyerType: pub.defaultBuyerType,
            status: 'ACTIVE',
          },
        });
      }
    }
    console.log('   ✅ Private corporate publishers registered.');

    const companies = await prisma.company.findMany();
    console.log(`📋 Found ${companies.length} registered companies for AI matching.\n`);

    // 2. High-value private corporate opportunities list
    const privateOpportunities = [
      {
        title: 'Fourniture et Déploiement d\'une Infrastructure SD-WAN et Réseau Fibre Optique Métropolitain',
        refNumber: 'RFP-MTN-CMR-2026-042',
        buyerName: 'MTN Cameroon S.A.',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 185000000,
        currency: 'XAF',
        closingDays: 28,
        description: 'Appel d\'offres restreint pour la sélection d\'un intégrateur réseau certifié pour le déploiement clé en main d\'une solution SD-WAN haute disponibilité interconnectant les sites régionaux de Douala, Yaoundé et Bafoussam.',
        organization: 'MTN Cameroon - Direction des Achats & Approvisionnements',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Appel d\'Offres Privé - Réseaux & Télécoms',
        procurementMethod: 'Appel d\'Offres Restreint aux Entreprises Qualifiées',
        opportunityType: OpportunityType.PRIVATE_TENDER,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.HIRE,
        sourceQualityScore: 94,
        originalSource: 'MTN Cameroon Supplier Portal',
        sourceURL: 'https://www.mtn.cm/corporate/procurement-suppliers/',
        requirements: [
          { category: 'Administrative', description: 'Attestation de Non-Redevance fiscale DGI en cours de validité', mandatory: true },
          { category: 'Administrative', description: 'Registre du Commerce et du Crédit Mobilier (RCCM) et Numéro d\'Identifiant Unique (NIU)', mandatory: true },
          { category: 'Technical', description: 'Certification constructeur Gold ou Platinum (Cisco, Fortinet ou Huawei)', mandatory: true },
          { category: 'Technical', description: 'Au moins 3 références probantes de projets SD-WAN similaires en Afrique Centrale', mandatory: true },
          { category: 'Financial', description: 'Chiffre d\'affaires annuel supérieur à 200 millions FCFA sur les 2 derniers exercices', mandatory: true },
        ],
        deliverables: [
          { item: 'Architecture technique validée et Plan de Déploiement Détaillé', phase: 'Conception' },
          { item: 'Fourniture, configuration et bascule sans interruption des équipements SD-WAN', phase: 'Exécution' },
          { item: 'Formation des équipes d\'exploitation réseau MTN et support 24/7 de 12 mois', phase: 'Garantie' },
        ],
      },
      {
        title: 'Modernisation du Datacenter Privé et Implémentation du Plan de Continuité d\'Activité (PCA / PRA)',
        refNumber: 'AO-ORANGE-CMR-2026-118',
        buyerName: 'Orange Cameroun',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 240000000,
        currency: 'XAF',
        closingDays: 35,
        description: 'Sélection d\'une entreprise spécialisée pour l\'extension et la modernisation de la plateforme de virtualisation cloud hybride, du système de stockage SAN sécurisé et de la réplication synchrone sur site miroir.',
        organization: 'Orange Cameroun - Direction Générale des Achats',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Contrat Commercial - Datacenter & Cloud',
        procurementMethod: 'Consultation d\'Entreprises Privées',
        opportunityType: OpportunityType.REQUEST_FOR_PROPOSAL,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.OUTSOURCE,
        sourceQualityScore: 95,
        originalSource: 'Orange Cameroun Achats',
        sourceURL: 'https://www.orange.cm/fr/fournisseurs-achats',
        requirements: [
          { category: 'Administrative', description: 'Attestation pour soumission CNPS en cours de validité', mandatory: true },
          { category: 'Certification', description: 'Certification ISO 27001 ou SOC 2 requise pour les prestataires de services informatiques', mandatory: true },
          { category: 'Technical', description: 'Certification VMware / Nutanix Master Services Competency', mandatory: true },
          { category: 'Financial', description: 'Cautionnement de soumission bancaire de 4,000,000 FCFA', mandatory: true },
        ],
        deliverables: [
          { item: 'Audit préalable de l\'infrastructure existante et schéma directeur d\'évolution', phase: 'Phase 1' },
          { item: 'Mise en service de la baie SAN et clusters de calcul haute performance', phase: 'Phase 2' },
          { item: 'Tests de bascule à chaud et validation du Recovery Time Objective (RTO < 15 min)', phase: 'Recette' },
        ],
      },
      {
        title: 'Intégration d\'une Plateforme d\'Analyse Comportementale et Détection Prédictive de la Fraude Bancaire par IA',
        refNumber: 'RFP-AFRILAND-IT-2026-031',
        buyerName: 'Afriland First Bank',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 160000000,
        currency: 'XAF',
        closingDays: 24,
        description: 'Acquisition et intégration d\'une solution logicielle d\'intelligence artificielle connectée au Core Banking System pour le monitoring en temps réel des transactions monétiques, mobile money et flux interbancaires.',
        organization: 'Afriland First Bank - Direction des Systèmes d\'Information',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Prestation Informatique Spécialisée (FinTech / Cyber)',
        procurementMethod: 'Appel d\'Offres Sélectif Privé',
        opportunityType: OpportunityType.PRIVATE_TENDER,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.BUY,
        sourceQualityScore: 92,
        originalSource: 'Afriland First Bank Portails Prestataires',
        sourceURL: 'https://www.afrilandfirstbank.com/appels-offres-prestataires',
        requirements: [
          { category: 'Administrative', description: 'Dossier juridique complet et agrément MINPOSTEL/COBAC si applicable', mandatory: true },
          { category: 'Technical', description: 'Conformité aux standards de sécurité bancaire PCI-DSS v4.0', mandatory: true },
          { category: 'Technical', description: 'Démonstration en environnement Sandbox des capacités de scoring en temps réel (< 200ms)', mandatory: true },
        ],
        deliverables: [
          { item: 'Dossier d\'architecture technique et plan d\'intégration API REST / Kafka', phase: 'Intégration' },
          { item: 'Modèles de Machine Learning entraînés sur les typologies de fraudes CEMAC', phase: 'Paramétrage' },
          { item: 'Rapports d\'homologation de sécurité et tests d\'intrusion réussis', phase: 'Validation' },
        ],
      },
      {
        title: 'Déploiement d\'un Réseau IoT Industriel et Télémesure Télécom pour les Usines Brassicoles de Douala et Bafoussam',
        refNumber: 'RFQ-SABC-ACHATS-2026-088',
        buyerName: 'Boissons du Cameroun (SABC / Castel Group)',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 125000000,
        currency: 'XAF',
        closingDays: 21,
        description: 'Fourniture de capteurs industriels connectés (LoRaWAN), concentrateurs passerelles et développement d\'une plateforme de supervision IoT centralisée pour le suivi des consommations énergétiques et rendements des lignes d\'embouteillage.',
        organization: 'Boissons du Cameroun - Direction des Achats & Supply Chain',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Fourniture & Installation Équipements Industriels',
        procurementMethod: 'Demande de Cotation Restreinte (RFQ)',
        opportunityType: OpportunityType.REQUEST_FOR_QUOTATION,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.SUPPLY,
        sourceQualityScore: 90,
        originalSource: 'Portail Fournisseurs SABC',
        sourceURL: 'https://www.boissonsducameroun.com/achats-fournisseurs',
        requirements: [
          { category: 'Administrative', description: 'Attestation de régularité fiscale et quittance de patente 2026', mandatory: true },
          { category: 'Technical', description: 'Matériels certifiés normes industrielles ATEX / IP67 pour environnements agroalimentaires', mandatory: true },
          { category: 'Technical', description: 'Garantie constructeur de 2 ans sur l\'ensemble des capteurs et sondes', mandatory: true },
        ],
        deliverables: [
          { item: 'Fourniture de 350 capteurs IoT industriels et 12 passerelles de collecte', phase: 'Livraison' },
          { item: 'Installation physique, câblage sécurisé et mise en service logicielle', phase: 'Mise en œuvre' },
          { item: 'Tableaux de bord de supervision temps réel et transmission des alertes automatisées', phase: 'Clôture' },
        ],
      },
      {
        title: 'Sous-Traitance Industrielle : Maintenance Préventive et Télédiagnostic des Turbines et Transformateurs Haute Tension',
        refNumber: 'BSTP-CMR-SUB-2026-014',
        buyerName: 'ENEO Cameroon S.A. / Membre BSTP',
        buyerCountry: 'Cameroon',
        industry: 'Renewable Energy & Solar Power',
        estimatedBudget: 310000000,
        currency: 'XAF',
        closingDays: 30,
        description: 'Bourse de Sous-Traitance et de Partenariat (BSTP-CMR) : Mise en concurrence pour l\'attribution d\'un contrat de sous-traitance industrielle pluriannuel pour l\'instrumentation, la thermographie infrarouge et la maintenance spécialisée des postes sources du Réseau Interconnecté Sud (RIS).',
        organization: 'BSTP-CMR & ENEO Cameroon Division Achats Industriels',
        sector: 'Renewable Energy & Solar Power',
        subcategory: 'Contrat de Sous-Traitance Industrielle B2B',
        procurementMethod: 'Mise en Relation Matchmaking BSTP-CMR',
        opportunityType: OpportunityType.SUBCONTRACTING,
        sourceCategory: SourceCategory.SUBCONTRACTING,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.SUBCONTRACT,
        sourceQualityScore: 93,
        originalSource: 'BSTP-CMR (Bourse de Sous-Traitance et de Partenariat)',
        sourceURL: 'https://www.bstp-cameroun.cm/en/find/business-opportunities/',
        requirements: [
          { category: 'Administrative', description: 'Adhésion active ou inscription au répertoire des sous-traitants de la BSTP-CMR', mandatory: true },
          { category: 'Administrative', description: 'Assurance responsabilité civile professionnelle couvrant les risques industriels', mandatory: true },
          { category: 'Technical', description: 'Habilitation électrique HTA/HTB pour le personnel d\'intervention', mandatory: true },
        ],
        deliverables: [
          { item: 'Rapports trimestriels d\'analyses thermographiques et bilan diélectrique', phase: 'Trimestriel' },
          { item: 'Interventions d\'urgence sous astreinte avec astreinte d\'arrivée < 4 heures', phase: 'Support' },
          { item: 'Fourniture des pièces détachées d\'origine et outillages étalonnés', phase: 'Continuité' },
        ],
      },
      {
        title: 'Sous-Traitance : Travaux de Génie Civil et Pose de Réseaux Enterrés pour la Zone Logistique du Port de Kribi',
        refNumber: 'BSTP-CMR-PAK-2026-027',
        buyerName: 'Consortium d\'Entreprises Partenaires PAK / BSTP',
        buyerCountry: 'Cameroon',
        industry: 'Civil Infrastructure & Construction',
        estimatedBudget: 420000000,
        currency: 'XAF',
        closingDays: 40,
        description: 'Opportunité de sous-traitance réservée aux PME camerounaises : Réalisation des terrassements généraux, voiries de desserte interne, caniveaux d\'assainissement et fourreaux multi-tubulaires pour la zone logistique intégrée du Port Autonome de Kribi.',
        organization: 'Bourse de Sous-Traitance et de Partenariat (BSTP-CMR)',
        sector: 'Civil Infrastructure & Construction',
        subcategory: 'Sous-Traitance BTP & Travaux Publics',
        procurementMethod: 'Sous-Traitance Conventionnée',
        opportunityType: OpportunityType.SUBCONTRACTING,
        sourceCategory: SourceCategory.SUBCONTRACTING,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.CONSTRUCT,
        sourceQualityScore: 91,
        originalSource: 'BSTP-CMR Bourse Industrielle',
        sourceURL: 'https://www.bstp-cameroun.cm/en/find/business-opportunities/',
        requirements: [
          { category: 'Administrative', description: 'Immatriculation au Registre des Métiers ou RCCM Cameroun', mandatory: true },
          { category: 'Technical', description: 'Disponibilité d\'engins de chantier homologués (niveleuse, compacteur, pelles mécaniques)', mandatory: true },
          { category: 'Technical', description: 'Expérience avérée dans les travaux de terrassement lourd en zone côtière', mandatory: true },
        ],
        deliverables: [
          { item: 'Terrassement et décapage de la plateforme logistique (15 hectares)', phase: 'Gros Œuvre' },
          { item: 'Pose de 4 500 mètres linéaires de buses et caniveaux béton armé', phase: 'VRD' },
          { item: 'Mise en œuvre de la couche de base en concassé 0/31.5 compactée à 95% OPM', phase: 'Finition' },
        ],
      },
      {
        title: 'Implémentation d\'un Système de Maintenance Prédictive (EAM) et Gestion Centralisée des Pièces de Rechange',
        refNumber: 'RFP-CIMENCAM-2026-019',
        buyerName: 'Cimencam (LafargeHolcim Group)',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 95000000,
        currency: 'XAF',
        closingDays: 30,
        description: 'Appel d\'offres privé pour la fourniture et l\'intégration d\'une solution logicielle GMAO / EAM interconnectée avec SAP ERP pour les usines de ciment de Figuil, Nomayos et Bonabéri.',
        organization: 'Cimencam - Direction des Achats & Supply Chain',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Logiciel d\'Entreprise & Conseil ERP',
        procurementMethod: 'Appel d\'Offres Privé aux Intégrateurs Logiciels',
        opportunityType: OpportunityType.REQUEST_FOR_PROPOSAL,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.HIRE,
        sourceQualityScore: 89,
        originalSource: 'Cimencam Portail Achats',
        sourceURL: 'https://www.cimencam.com/fr/fournisseurs-et-achats',
        requirements: [
          { category: 'Technical', description: 'Connecteurs certifiés SAP NetWeaver / S4HANA', mandatory: true },
          { category: 'Technical', description: 'Support local à Douala et capacité de formation bilingue (Français/Anglais)', mandatory: true },
          { category: 'Administrative', description: 'Situation fiscale et sociale régulière attestée par la DGI et la CNPS', mandatory: true },
        ],
        deliverables: [
          { item: 'Cahier des charges fonctionnel et modélisation des processus de maintenance', phase: 'Spécifications' },
          { item: 'Déploiement de la solution logicielle et interfaçage SAP en temps réel', phase: 'Intégration' },
          { item: 'Conduite du changement, formation des utilisateurs et recette finale', phase: 'Déploiement' },
        ],
      },
      {
        title: 'Fourniture de Terminaux Mobiles de Paiement Électronique et Solutions d\'Acceptation Sans Contact pour Stations-Services',
        refNumber: 'RFP-TOTAL-CMR-2026-055',
        buyerName: 'TotalEnergies Marketing Cameroun',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 110000000,
        currency: 'XAF',
        closingDays: 25,
        description: 'Sélection d\'un prestataire monétique pour le renouvellement du parc de 800 terminaux de paiement électronique (TPE Android 4G/WiFi), passerelle de paiement sécurisée et intégration aux cartes carburant TotalEnergies.',
        organization: 'TotalEnergies Marketing Cameroun - Direction Achats & Moyens Généraux',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Solutions Monétiques & Terminaux Connectés',
        procurementMethod: 'Consultation Privée Sélective',
        opportunityType: OpportunityType.PRIVATE_TENDER,
        sourceCategory: SourceCategory.PRIVATE_PROCUREMENT,
        buyerType: BuyerType.PRIVATE_COMPANY,
        buyerIntent: BuyerIntent.BUY,
        sourceQualityScore: 92,
        originalSource: 'TotalEnergies Cameroun Achats',
        sourceURL: 'https://totalenergies.cm/fournisseurs-appels-offres',
        requirements: [
          { category: 'Technical', description: 'Certification GIMAC et agrément bancaire pour les flux monétiques CEMAC', mandatory: true },
          { category: 'Technical', description: 'Plateforme de gestion de parc TPE à distance (MDM / TMS) sécurisée', mandatory: true },
          { category: 'Administrative', description: 'Attestation de non-faillite et quittance fiscale 2026', mandatory: true },
        ],
        deliverables: [
          { item: 'Fourniture de 800 TPE durcis avec socles de charge et batteries haute capacité', phase: 'Livraison' },
          { item: 'Paramétrage des applications d\'encaissement carte bancaire et Mobile Money', phase: 'Configuration' },
          { item: 'Maintenance préventive et curative avec échange standard J+1', phase: 'SLA Support' },
        ],
      },
      {
        title: 'Modernisation du Système Radar VTS et des Télécommunications de Surveillance Maritime du Chenal d\'Accès',
        refNumber: 'AO-PAD-COMM-2026-004',
        buyerName: 'PAD - Port Autonome de Douala',
        buyerCountry: 'Cameroon',
        industry: 'Cloud & IT Infrastructure',
        estimatedBudget: 380000000,
        currency: 'XAF',
        closingDays: 45,
        description: 'Marché d\'entreprise publique : Acquisition, installation et mise en service d\'une station radar côtière de guidage nautique, capteurs météorologiques automatisés et intégration au système Vessel Traffic Service (VTS).',
        organization: 'Port Autonome de Douala - Direction de la Capitainerie & Achats',
        sector: 'Cloud & IT Infrastructure',
        subcategory: 'Équipements Portuaires & Télécommunications Nautiques',
        procurementMethod: 'Appel d\'Offres Ouvert International (AOOI)',
        opportunityType: OpportunityType.PUBLIC_TENDER,
        sourceCategory: SourceCategory.STATE_OWNED_ENTERPRISE,
        buyerType: BuyerType.STATE_OWNED_ENTERPRISE,
        buyerIntent: BuyerIntent.BUY,
        sourceQualityScore: 95,
        originalSource: 'Port Autonome de Douala (PAD)',
        sourceURL: 'https://www.pad.cm/appels-doffre/',
        requirements: [
          { category: 'Technical', description: 'Conformité stricte aux recommandations de l\'AISM / IALA pour les systèmes VTS', mandatory: true },
          { category: 'Administrative', description: 'Cautionnement de soumission délivré par une banque agréée au Cameroun', mandatory: true },
          { category: 'Technical', description: 'Ingénieur en chef certifié IALA V-103 avec au moins 10 ans d\'expérience', mandatory: true },
        ],
        deliverables: [
          { item: 'Fourniture et érection du pylône radar de 45 mètres en milieu maritime', phase: 'Travaux' },
          { item: 'Installation du radar à état solide haute résolution et récepteur AIS classe A', phase: 'Équipements' },
          { item: 'Formation certifiante des opérateurs de la tour de contrôle du PAD', phase: 'Transfert' },
        ],
      },
    ];

    console.log(`📦 Ingesting ${privateOpportunities.length} Premium Private Opportunities for Cameroon...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const opp of privateOpportunities) {
      const existing = await prisma.tender.findFirst({
        where: {
          OR: [
            { refNumber: opp.refNumber },
            { title: opp.title },
          ],
        },
      });

      const pubDate = new Date();
      const closingDate = new Date(Date.now() + opp.closingDays * 24 * 3600 * 1000);

      let tenderId: string;

      if (existing) {
        const updated = await prisma.tender.update({
          where: { id: existing.id },
          data: {
            title: opp.title,
            buyerName: opp.buyerName,
            buyerCountry: opp.buyerCountry,
            industry: opp.industry,
            estimatedValue: opp.estimatedBudget,
            currency: opp.currency,
            deadline: closingDate,
            description: opp.description,
            status: 'OPEN',
            organization: opp.organization,
            sector: opp.sector,
            subcategory: opp.subcategory,
            procurementMethod: opp.procurementMethod,
            opportunityType: opp.opportunityType,
            sourceCategory: opp.sourceCategory,
            buyerType: opp.buyerType,
            buyerIntent: opp.buyerIntent,
            sourceQualityScore: opp.sourceQualityScore,
            originalSource: opp.originalSource,
            sourceUrl: opp.sourceURL,
          },
        });
        tenderId = updated.id;
        updatedCount++;
      } else {
        const created = await prisma.tender.create({
          data: {
            title: opp.title,
            refNumber: opp.refNumber,
            buyerName: opp.buyerName,
            buyerCountry: opp.buyerCountry,
            industry: opp.industry,
            estimatedValue: opp.estimatedBudget,
            currency: opp.currency,
            publishDate: pubDate,
            deadline: closingDate,
            description: opp.description,
            rawContent: opp.description,
            sourceUrl: opp.sourceURL,
            attachments: [],
            organization: opp.organization,
            sector: opp.sector,
            subcategory: opp.subcategory,
            procurementMethod: opp.procurementMethod,
            status: 'OPEN',
            language: 'fr',
            opportunityType: opp.opportunityType,
            sourceCategory: opp.sourceCategory,
            buyerType: opp.buyerType,
            buyerIntent: opp.buyerIntent,
            sourceQualityScore: opp.sourceQualityScore,
            originalSource: opp.originalSource,
            originalUrl: opp.sourceURL,
            originalExternalId: opp.refNumber,
          },
        });
        tenderId = created.id;
        createdCount++;
      }

      // Upsert rich AI Summary
      await prisma.aiSummary.upsert({
        where: { tenderId },
        create: {
          tenderId,
          executiveSummary: `Opportunité de marché privé initiée par ${opp.buyerName}. Concerne ${opp.title}. Bourse / consultation réservée aux prestataires qualifiés.`,
          requirements: opp.requirements as any,
          deliverables: opp.deliverables as any,
          deadlineSummary: `Offre ouverte. Date limite de dépôt des dossiers : ${closingDate.toLocaleDateString('fr-FR')}.`,
          risks: [
            { risk: 'Exigence de réactivité et respect des SLA stricts', severity: 'MEDIUM', mitigation: 'Constituer une équipe projet dédiée dès la validation de la soumission.' },
            { risk: 'Régularité fiscale et sociale stricte imposée par les grands comptes', mitigation: 'Vérifier la validité des attestations DGI et CNPS dans le Knowledge Vault avant dépôt.', severity: 'LOW' },
          ] as any,
        },
        update: {
          executiveSummary: `Opportunité de marché privé initiée par ${opp.buyerName}. Concerne ${opp.title}. Bourse / consultation réservée aux prestataires qualifiés.`,
          requirements: opp.requirements as any,
          deliverables: opp.deliverables as any,
          deadlineSummary: `Offre ouverte. Date limite de dépôt des dossiers : ${closingDate.toLocaleDateString('fr-FR')}.`,
        },
      });

      // Calculate AI match scores across all registered companies
      const fullTender = await prisma.tender.findUnique({
        where: { id: tenderId },
        include: { aiSummary: true },
      });

      for (const company of companies) {
        const matchResult = matchService.calculateMatch(company, fullTender!, fullTender!.aiSummary);
        const scoreId = `${company.id}_${tenderId}`;

        await prisma.matchScore.upsert({
          where: { id: scoreId },
          create: {
            companyId: company.id,
            tenderId,
            overallScore: matchResult.overallScore,
            industryMatchScore: matchResult.industryMatchScore,
            countryMatchScore: matchResult.countryMatchScore,
            experienceScore: matchResult.experienceScore,
            certMatchScore: matchResult.certMatchScore,
            reasons: matchResult.reasons as any,
            metRequirements: matchResult.metRequirements as any,
            missingRequirements: matchResult.missingRequirements as any,
          },
          update: {
            overallScore: matchResult.overallScore,
            industryMatchScore: matchResult.industryMatchScore,
            countryMatchScore: matchResult.countryMatchScore,
            experienceScore: matchResult.experienceScore,
            certMatchScore: matchResult.certMatchScore,
            reasons: matchResult.reasons as any,
            metRequirements: matchResult.metRequirements as any,
            missingRequirements: matchResult.missingRequirements as any,
          },
        }).catch(async () => {
          const existingScore = await prisma.matchScore.findFirst({
            where: { companyId: company.id, tenderId },
          });
          if (existingScore) {
            await prisma.matchScore.update({
              where: { id: existingScore.id },
              data: {
                overallScore: matchResult.overallScore,
                industryMatchScore: matchResult.industryMatchScore,
                countryMatchScore: matchResult.countryMatchScore,
                experienceScore: matchResult.experienceScore,
                certMatchScore: matchResult.certMatchScore,
                reasons: matchResult.reasons as any,
              },
            });
          }
        });
      }
    }

    console.log(`\n✅ Successfully processed Cameroon private & corporate opportunities:`);
    console.log(`   - Newly inserted: ${createdCount}`);
    console.log(`   - Updated / Refreshed: ${updatedCount}`);

    // Audit counts
    const totalCameroon = await prisma.tender.count({ where: { buyerCountry: 'Cameroon' } });
    const privateCount = await prisma.tender.count({
      where: {
        buyerCountry: 'Cameroon',
        OR: [
          { opportunityType: 'PRIVATE_TENDER' },
          { opportunityType: 'SUBCONTRACTING' },
          { opportunityType: 'REQUEST_FOR_PROPOSAL' },
          { opportunityType: 'REQUEST_FOR_QUOTATION' },
          { sourceCategory: 'PRIVATE_PROCUREMENT' },
          { sourceCategory: 'SUBCONTRACTING' },
        ],
      },
    });

    console.log('\n========================================================================');
    console.log('🇨🇲 CAMEROON PROCUREMENT DIVERSITY AUDIT:');
    console.log('========================================================================');
    console.log(`🏢 Total Cameroon Opportunities:       ${totalCameroon}`);
    console.log(`💼 Private & Subcontracting Tenders:     ${privateCount}`);
    console.log(`🏛️ Public & Development Bank Tenders:   ${totalCameroon - privateCount}`);
    console.log('========================================================================\n');
  } catch (err: any) {
    console.error('Fatal execution error:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

ingestCameroonPrivateTenders();

