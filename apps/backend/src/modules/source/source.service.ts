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
   * Computes real-time Daily Ingestion KPI Metrics (Target: >= 50 unique tenders / day).
   */
  async getDailyIngestionSummary() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayTendersCount, syncLogsToday, activePublishersCount] = await Promise.all([
      this.prisma.tender.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      this.prisma.syncLog.findMany({
        where: { startTime: { gte: startOfDay } },
        include: { publisher: { select: { name: true, country: true } } },
      }),
      this.prisma.publisher.count({
        where: { status: PublisherStatus.ACTIVE },
      }),
    ]);

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
    const isHealthy = todayTendersCount >= kpiTarget;

    return {
      date: new Date().toISOString().split('T')[0],
      kpiMetrics: {
        newUniqueTendersToday: todayTendersCount,
        kpiTarget,
        status: isHealthy ? 'HEALTHY' : 'BUILDING_CAPACITY',
        achievementPercentage: Math.min(100, Math.round((todayTendersCount / kpiTarget) * 100)),
      },
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
   * Seeds official procurement publishers across Cameroon ministries, African hubs & international bodies.
   */
  async seedAfricanPublishers() {
    this.logger.log(`[Publisher Registry] Seeding official Cameroon ministries & African procurement publishers...`);

    const defaultPublishers = [
      // Primary Cameroon Authorities & Portals
      {
        country: 'Cameroon',
        name: 'ARMP - Agence de Régulation des Marchés Publics Cameroon',
        organizationType: OrganizationType.NATIONAL_PROCUREMENT_AUTHORITY,
        officialWebsite: 'https://www.armp.cm',
        procurementPage: 'https://www.armp.cm/appels-doffres',
        tendersPage: 'https://www.armp.cm/marches-publics',
        connectorType: ConnectorType.HTML,
      },
      {
        country: 'Cameroon',
        name: 'COLEPS - Cameroon Online E-Procurement System',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.marchespublics.cm',
        tendersPage: 'https://www.marchespublics.cm/tenders',
        connectorType: ConnectorType.HTML,
      },

      // Official Cameroon Ministries
      {
        country: 'Cameroon',
        name: 'MINTP - Ministère des Travaux Publics',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.mintp.cm',
        procurementPage: 'https://www.mintp.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres', '/marches-publics'] },
      },
      {
        country: 'Cameroon',
        name: 'MINSANTE - Ministère de la Santé Publique',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minsante.cm',
        procurementPage: 'https://www.minsante.cm/site_minsante/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres', '/tenders'] },
      },
      {
        country: 'Cameroon',
        name: 'MINEE - Ministère de l’Eau et de l’Énergie',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minee.cm',
        procurementPage: 'https://www.minee.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/marches-publics', '/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINEDUB - Ministère de l’Éducation de Base',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minedub.cm',
        procurementPage: 'https://www.minedub.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINESEC - Ministère de l’Enseignement Secondaire',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minesec.gov.cm',
        procurementPage: 'https://www.minesec.gov.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/marches-publics', '/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINADER - Ministère de l’Agriculture et du Développement Rural',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minader.cm',
        procurementPage: 'https://www.minader.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINPOSTEL - Ministère des Postes et Télécommunications',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minpostel.gov.cm',
        procurementPage: 'https://www.minpostel.gov.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/marches-publics', '/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINHDU - Ministère de l’Habitat et du Développement Urbain',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minhdu.gov.cm',
        procurementPage: 'https://www.minhdu.gov.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINEPAT - Ministère de l’Économie et de la Planification',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minepat.gov.cm',
        procurementPage: 'https://www.minepat.gov.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'MINEPDED - Ministère de l’Environnement et du Développement Durable',
        organizationType: OrganizationType.MINISTRY,
        officialWebsite: 'https://www.minepded.gov.cm',
        procurementPage: 'https://www.minepded.gov.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },

      // Key Cameroon State Enterprises & Infrastructure Agencies
      {
        country: 'Cameroon',
        name: 'SONATREL - Société Nationale de Transport d’Électricité',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.sonatrel.cm',
        procurementPage: 'https://www.sonatrel.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'CAMWATER - Cameroon Water Utilities Corporation',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.camwater.cm',
        procurementPage: 'https://www.camwater.cm/marches-publics',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/marches-publics'] },
      },
      {
        country: 'Cameroon',
        name: 'PAD - Port Autonome de Douala',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.pad.cm',
        procurementPage: 'https://www.pad.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },
      {
        country: 'Cameroon',
        name: 'PAK - Port Autonome de Kribi',
        organizationType: OrganizationType.STATE_OWNED_ENTERPRISE,
        officialWebsite: 'https://www.pak.cm',
        procurementPage: 'https://www.pak.cm/appels-doffres',
        connectorType: ConnectorType.HTML,
        parserConfiguration: { procurementPaths: ['/appels-doffres'] },
      },

      // International & Pan-African Organizations
      {
        country: 'Global / Africa',
        name: 'World Bank Group Procurement Notices',
        organizationType: OrganizationType.INTERNATIONAL_ORGANIZATION,
        officialWebsite: 'https://www.worldbank.org',
        apiEndpoint: 'https://search.worldbank.org/api/v2/procurement',
        connectorType: ConnectorType.REST_API,
      },
      {
        country: 'Global / Africa',
        name: 'UNGM - United Nations Global Marketplace',
        organizationType: OrganizationType.INTERNATIONAL_ORGANIZATION,
        officialWebsite: 'https://www.ungm.org',
        apiEndpoint: 'https://api.ungm.org/v1/notices',
        connectorType: ConnectorType.REST_API,
      },
      {
        country: 'Pan-African',
        name: 'AfDB - African Development Bank Group',
        organizationType: OrganizationType.DEVELOPMENT_BANK,
        officialWebsite: 'https://www.afdb.org',
        procurementPage: 'https://www.afdb.org/en/projects-and-operations/procurement',
        rssFeed: 'https://www.afdb.org/en/rss/procurement',
        connectorType: ConnectorType.RSS,
      },
      {
        country: 'Nigeria',
        name: 'BPP - Bureau of Public Procurement Nigeria',
        organizationType: OrganizationType.NATIONAL_PROCUREMENT_AUTHORITY,
        officialWebsite: 'https://www.bpp.gov.ng',
        tendersPage: 'https://www.bpp.gov.ng/tenders',
        connectorType: ConnectorType.HTML,
      },
      {
        country: 'Kenya',
        name: 'PPIP - Public Procurement Information Portal Kenya',
        organizationType: OrganizationType.NATIONAL_PROCUREMENT_AUTHORITY,
        officialWebsite: 'https://tenders.go.ke',
        apiEndpoint: 'https://tenders.go.ke/api/tenders',
        connectorType: ConnectorType.REST_API,
      },
      {
        country: 'Ghana',
        name: 'PPA - Public Procurement Authority Ghana',
        organizationType: OrganizationType.NATIONAL_PROCUREMENT_AUTHORITY,
        officialWebsite: 'https://ppa.gov.gh',
        tendersPage: 'https://ppa.gov.gh/tenders',
        connectorType: ConnectorType.HTML,
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
            status: PublisherStatus.ACTIVE,
            parserConfiguration: pub.parserConfiguration || {},
          },
        });
      }
    }

    this.logger.log(`[Publisher Registry] Successfully seeded ${defaultPublishers.length} Cameroon ministries and African procurement publishers.`);
  }
}
