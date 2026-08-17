import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SchedulerService } from './scheduler.service';
import { MinistryDiscoveryService } from './ministry-discovery.service';
import { OrganizationType, ConnectorType, PublisherStatus } from '@prisma/client';

@Injectable()
export class SourceService {
  private readonly logger = new Logger(SourceService.name);

  constructor(
    private prisma: PrismaService,
    private schedulerService: SchedulerService,
    private ministryDiscoveryService: MinistryDiscoveryService,
  ) {}

  /**
   * Retrieves all registered publishers in the system. Seeds initial publishers if empty.
   */
  async findAllPublishers(country?: string) {
    const count = await this.prisma.publisher.count();
    if (count === 0) {
      await this.seedAfricanPublishers();
    }

    return this.prisma.publisher.findMany({
      where: country ? { country } : undefined,
      include: {
        _count: { select: { tenders: true, syncLogs: true } },
      },
      orderBy: [{ country: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Returns details for a single publisher.
   */
  async findPublisherById(id: string) {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id },
      include: {
        tenders: { take: 10, orderBy: { createdAt: 'desc' } },
        syncLogs: { take: 10, orderBy: { startTime: 'desc' } },
      },
    });

    if (!publisher) {
      throw new NotFoundException(`Publisher with ID ${id} not found`);
    }

    return publisher;
  }

  /**
   * Creates or registers a new official procurement publisher dynamically without code changes.
   */
  async createPublisher(data: any) {
    return this.prisma.publisher.create({
      data: {
        country: data.country,
        name: data.name,
        organizationType: data.organizationType || OrganizationType.GOVERNMENT_AGENCY,
        officialWebsite: data.officialWebsite,
        procurementPage: data.procurementPage,
        tendersPage: data.tendersPage,
        newsPage: data.newsPage,
        projectsPage: data.projectsPage,
        rssFeed: data.rssFeed,
        apiEndpoint: data.apiEndpoint,
        connectorType: data.connectorType || ConnectorType.HTML,
        authenticationType: data.authenticationType || 'NONE',
        crawlInterval: data.crawlInterval || 60,
        status: data.status || PublisherStatus.ACTIVE,
        parserConfiguration: data.parserConfiguration || {},
      },
    });
  }

  /**
   * Triggers manual synchronization for a publisher.
   */
  async syncPublisher(id: string) {
    const publisher = await this.prisma.publisher.findUnique({ where: { id } });
    if (!publisher) {
      throw new NotFoundException(`Publisher with ID ${id} not found`);
    }

    const syncResult = await this.schedulerService.syncSinglePublisher(id);
    return {
      message: `Successfully synchronized ${publisher.name} (${publisher.country})`,
      metrics: syncResult,
    };
  }

  /**
   * Runs the Ministry Discovery Engine for a specified publisher/ministry.
   */
  async discoverPublisher(id: string) {
    return this.ministryDiscoveryService.discoverMinistryEndpoints(id);
  }

  /**
   * Toggles publisher active status.
   */
  async togglePublisherStatus(id: string, status: PublisherStatus) {
    return this.prisma.publisher.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Fetches latest Sync Logs across all publishers.
   */
  async getSyncLogs(limit = 50) {
    return this.prisma.syncLog.findMany({
      take: limit,
      orderBy: { startTime: 'desc' },
      include: {
        publisher: { select: { name: true, country: true, organizationType: true } },
      },
    });
  }

  /**
   * Computes real-time Daily Ingestion KPI Metrics targeting NEW ACTIVE UNIQUE CAMEROON OPPORTUNITIES (Target: >= 50 / day).
   */
  async getDailyIngestionSummary() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayCameroonOpportunitiesCount, syncLogsToday, activePublishersCount] = await Promise.all([
      this.prisma.tender.count({
        where: {
          buyerCountry: { contains: 'Cameroon', mode: 'insensitive' },
          status: 'OPEN',
          createdAt: { gte: startOfDay },
        },
      }),
      this.prisma.syncLog.findMany({
        where: { startTime: { gte: startOfDay } },
        include: { publisher: { select: { name: true, country: true, sourceCategory: true } } },
      }),
      this.prisma.publisher.count({
        where: { status: PublisherStatus.ACTIVE },
      }),
    ]);

    // Fetch breakdown by SourceCategory for today's active Cameroon opportunities
    const categoryCountsRaw = await this.prisma.tender.groupBy({
      by: ['sourceCategory'],
      where: {
        buyerCountry: { contains: 'Cameroon', mode: 'insensitive' },
        status: 'OPEN',
        createdAt: { gte: startOfDay },
      },
      _count: { id: true },
    });

    const categoryBreakdown: Record<string, number> = {
      GOVERNMENT: 0,
      STATE_OWNED_ENTERPRISE: 0,
      SUBCONTRACTING: 0,
      PRIVATE_PROCUREMENT: 0,
      DONOR_PROCUREMENT: 0,
      NGO_PROCUREMENT: 0,
      UNIVERSITY: 0,
      HEALTHCARE: 0,
      MUNICIPAL: 0,
      OTHER: 0,
    };

    for (const item of categoryCountsRaw) {
      const catKey = item.sourceCategory ? String(item.sourceCategory) : 'GOVERNMENT';
      categoryBreakdown[catKey] = item._count.id;
    }

    let totalRetrieved = 0;
    let totalNewRecords = 0;
    let totalDuplicates = 0;
    let totalFailed = 0;

    const sourceBreakdown: Record<string, { found: number; newRecords: number; duplicates: number; failed: number }> = {};

    for (const log of syncLogsToday) {
      const name = log.publisher.name;
      totalRetrieved += log.recordsRetrieved;
      totalNewRecords += log.newRecords;
      totalDuplicates += log.duplicates;
      totalFailed += log.failedRecords;

      if (!sourceBreakdown[name]) {
        sourceBreakdown[name] = { found: 0, newRecords: 0, duplicates: 0, failed: 0 };
      }
      sourceBreakdown[name].found += log.recordsRetrieved;
      sourceBreakdown[name].newRecords += log.newRecords;
      sourceBreakdown[name].duplicates += log.duplicates;
      sourceBreakdown[name].failed += log.failedRecords;
    }

    const kpiTarget = 50;
    const isHealthy = todayCameroonOpportunitiesCount >= kpiTarget;

    return {
      date: new Date().toISOString().split('T')[0],
      kpiMetrics: {
        newActiveUniqueCameroonOpportunitiesToday: todayCameroonOpportunitiesCount,
        kpiTarget,
        status: isHealthy ? 'HEALTHY' : 'BUILDING_CAPACITY',
        achievementPercentage: Math.min(100, Math.round((todayCameroonOpportunitiesCount / kpiTarget) * 100)),
      },
      categoryBreakdown,
      ingestionTotals: {
        totalScraped: totalRetrieved,
        totalInserted: totalNewRecords,
        totalDuplicates,
        totalFailed,
        activeSources: activePublishersCount,
      },
      sourceBreakdown,
    };
  }

  /**
   * Seeds official procurement publishers across Cameroon ministries, state enterprises, ports & international bodies.
   */
  async seedAfricanPublishers() {
    this.logger.log(`[Publisher Registry] Seeding official Cameroon primary sources & procurement publishers...`);

    const defaultPublishers: Array<{
      country: string;
      name: string;
      organizationType: OrganizationType;
      officialWebsite?: string;
      procurementPage?: string;
      tendersPage?: string;
      rssFeed?: string;
      apiEndpoint?: string;
      connectorType: ConnectorType;
      sourceCategory?: any;
      defaultBuyerType?: any;
      status?: PublisherStatus;
      requiresAuth?: boolean;
      parserConfiguration?: any;
    }> = [
      // Primary Cameroon Government Authorities
      {
        country: 'Cameroon',
        name: 'ARMP - Agence de Régulation des Marchés Publics Cameroon',
        organizationType: OrganizationType.NATIONAL_PROCUREMENT_AUTHORITY,
        officialWebsite: 'https://www.armp.cm',
        procurementPage: 'https://www.armp.cm/appels-doffres',
        tendersPage: 'https://www.armp.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'GOVERNMENT',
        defaultBuyerType: 'GOVERNMENT',
      },
      {
        country: 'Cameroon',
        name: 'COLEPS - Cameroon Online E-Procurement System',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.marchespublics.cm',
        tendersPage: 'https://www.marchespublics.cm/tenders',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'GOVERNMENT',
        defaultBuyerType: 'GOVERNMENT',
      },

      // Subcontracting Matchmaking Platform (BSTP-CMR)
      {
        country: 'Cameroon',
        name: 'BSTP-CMR - Bourse de Sous-Traitance et de Partenariat',
        organizationType: OrganizationType.PRIVATE_PROCUREMENT,
        officialWebsite: 'https://www.bstp-cameroun.cm',
        procurementPage: 'https://www.bstp-cameroun.cm/en/find/business-opportunities/',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'SUBCONTRACTING',
        defaultBuyerType: 'PRIVATE_COMPANY',
      },

      // State-Owned Enterprises (SOEs) & Public Ports
      {
        country: 'Cameroon',
        name: 'PAK - Port Autonome de Kribi',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.pak.cm',
        procurementPage: 'https://www.pak.cm/fr/affaires/appels-doffres/',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'STATE_OWNED_ENTERPRISE',
        defaultBuyerType: 'STATE_OWNED_ENTERPRISE',
      },
      {
        country: 'Cameroon',
        name: 'PAD - Port Autonome de Douala',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.pad.cm',
        procurementPage: 'https://www.pad.cm/appels-doffre/',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'STATE_OWNED_ENTERPRISE',
        defaultBuyerType: 'STATE_OWNED_ENTERPRISE',
      },
      {
        country: 'Cameroon',
        name: 'SONATREL - Société Nationale de Transport d’Électricité',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.sonatrel.cm',
        procurementPage: 'https://www.sonatrel.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'STATE_OWNED_ENTERPRISE',
        defaultBuyerType: 'STATE_OWNED_ENTERPRISE',
      },
      {
        country: 'Cameroon',
        name: 'CAMWATER - Cameroon Water Utilities Corporation',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.camwater.cm',
        procurementPage: 'https://www.camwater.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'STATE_OWNED_ENTERPRISE',
        defaultBuyerType: 'STATE_OWNED_ENTERPRISE',
      },
      {
        country: 'Cameroon',
        name: 'ENEO Cameroon S.A.',
        organizationType: OrganizationType.PRIVATE_PROCUREMENT,
        officialWebsite: 'https://www.eneocameroon.cm',
        procurementPage: 'https://www.eneocameroon.cm/index.php/fr/fournisseurs-et-prestataires',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'PRIVATE_PROCUREMENT',
        defaultBuyerType: 'PRIVATE_COMPANY',
      },

      // Key Official Ministries
      {
        country: 'Cameroon',
        name: 'MINHDU - Ministère de l’Habitat et du Développement Urbain',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minhdu.gov.cm',
        procurementPage: 'https://www.minhdu.gov.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'GOVERNMENT',
        defaultBuyerType: 'GOVERNMENT',
      },
      {
        country: 'Cameroon',
        name: 'MINTP - Ministère des Travaux Publics',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.mintp.cm',
        procurementPage: 'https://www.mintp.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        sourceCategory: 'GOVERNMENT',
        defaultBuyerType: 'GOVERNMENT',
      },

      // International Donors
      {
        country: 'Global / Africa',
        name: 'World Bank Group Procurement Notices',
        organizationType: OrganizationType.INTERNATIONAL_ORGANIZATION,
        officialWebsite: 'https://www.worldbank.org',
        apiEndpoint: 'https://search.worldbank.org/api/v2/procurement',
        connectorType: ConnectorType.REST_API,
        sourceCategory: 'DONOR_PROCUREMENT',
        defaultBuyerType: 'GOVERNMENT',
      },
      {
        country: 'Pan-African',
        name: 'AfDB - African Development Bank Group',
        organizationType: OrganizationType.DEVELOPMENT_BANK,
        officialWebsite: 'https://www.afdb.org',
        procurementPage: 'https://www.afdb.org/en/projects-and-operations/procurement',
        rssFeed: 'https://www.afdb.org/en/rss/procurement',
        connectorType: ConnectorType.RSS,
        sourceCategory: 'DONOR_PROCUREMENT',
        defaultBuyerType: 'GOVERNMENT',
      },
      {
        country: 'Global / Africa',
        name: 'UNGM - United Nations Global Marketplace',
        organizationType: OrganizationType.INTERNATIONAL_ORGANIZATION,
        officialWebsite: 'https://www.ungm.org',
        apiEndpoint: 'https://api.ungm.org/v1/notices',
        connectorType: ConnectorType.REST_API,
        sourceCategory: 'DONOR_PROCUREMENT',
        defaultBuyerType: 'NGO',
        status: PublisherStatus.AUTH_REQUIRED,
        requiresAuth: true,
      },
    ];

    for (const pub of defaultPublishers) {
      const existing = await this.prisma.publisher.findFirst({
        where: { name: pub.name },
      });

      if (!existing) {
        await this.prisma.publisher.create({
          data: {
            country: pub.country,
            name: pub.name,
            organizationType: pub.organizationType,
            officialWebsite: pub.officialWebsite,
            procurementPage: pub.procurementPage,
            tendersPage: pub.tendersPage,
            rssFeed: pub.rssFeed,
            apiEndpoint: pub.apiEndpoint,
            connectorType: pub.connectorType,
            sourceCategory: pub.sourceCategory || 'GOVERNMENT',
            defaultBuyerType: pub.defaultBuyerType || 'GOVERNMENT',
            status: pub.status || PublisherStatus.ACTIVE,
            requiresAuth: pub.requiresAuth || false,
            parserConfiguration: pub.parserConfiguration || {},
          },
        });
      }
    }

    this.logger.log(`[Publisher Registry] Successfully registered primary Cameroon & international procurement sources.`);
  }
}
