import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PublisherStatus } from '@prisma/client';

export const ENGLISH_KEYWORDS = [
  'Procurement',
  'Tender',
  'Tenders',
  'Notice',
  'Opportunity',
  'Procurement Notices',
  'Expressions of Interest',
  'Request for Proposal',
  'Request for Quotation',
  'Consultancy',
  'Projects',
];

export const FRENCH_KEYWORDS = [
  "Marchés Publics",
  "Appels d'Offres",
  "Avis d'Appel d'Offres",
  'Consultation',
  "Manifestation d'Intérêt",
  'Demande de Cotation',
  'Appel à Manifestation',
  'Projet',
  'Avis',
];

@Injectable()
export class MinistryDiscoveryService {
  private readonly logger = new Logger(MinistryDiscoveryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Discovers and registers procurement pages for a ministry official website
   */
  async discoverMinistryEndpoints(publisherId: string): Promise<{ discoveredUrls: string[]; updatedPublisher: any }> {
    const publisher = await this.prisma.publisher.findUnique({
      where: { id: publisherId },
    });

    if (!publisher || !publisher.officialWebsite) {
      throw new Error(`Publisher with ID ${publisherId} not found or missing officialWebsite.`);
    }

    this.logger.log(`[Ministry Discovery] Starting discovery scan for: ${publisher.name} (${publisher.officialWebsite})`);

    const allKeywords = [...ENGLISH_KEYWORDS, ...FRENCH_KEYWORDS].map((k) => k.toLowerCase());
    const discoveredUrls = new Set<string>();

    try {
      const response = await axios.get(publisher.officialWebsite, {
        headers: {
          'User-Agent': 'AI-Bid-MinistryDiscoveryEngine/1.0',
        },
        timeout: 15000,
      });

      const $ = cheerio.load(response.data);

      $('a[href]').each((_, el) => {
        const linkText = $(el).text().trim().toLowerCase();
        const href = $(el).attr('href');

        if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

        const isMatch = allKeywords.some((keyword) => linkText.includes(keyword) || href.toLowerCase().includes(keyword));

        if (isMatch) {
          try {
            const absoluteUrl = href.startsWith('http') ? href : new URL(href, publisher.officialWebsite).toString();
            discoveredUrls.add(absoluteUrl);
          } catch {
            // ignore invalid URL parsing
          }
        }
      });

      const urlList = Array.from(discoveredUrls);
      this.logger.log(`[Ministry Discovery] Discovered ${urlList.length} candidate procurement endpoints for ${publisher.name}`);

      // Categorize discovered endpoints
      let procurementPage = publisher.procurementPage;
      let tendersPage = publisher.tendersPage;
      let projectsPage = publisher.projectsPage;
      let newsPage = publisher.newsPage;

      for (const url of urlList) {
        const lower = url.toLowerCase();
        if (lower.includes('tender') || lower.includes('appel')) tendersPage = url;
        else if (lower.includes('procurement') || lower.includes('marche')) procurementPage = url;
        else if (lower.includes('projet') || lower.includes('project')) projectsPage = url;
        else if (lower.includes('notice') || lower.includes('avis') || lower.includes('news')) newsPage = url;
      }

      const updated = await this.prisma.publisher.update({
        where: { id: publisherId },
        data: {
          procurementPage: procurementPage || (urlList[0] ?? null),
          tendersPage: tendersPage || (urlList[1] ?? null),
          projectsPage: projectsPage || (urlList[2] ?? null),
          newsPage: newsPage || (urlList[3] ?? null),
          status: PublisherStatus.ACTIVE,
        },
      });

      return { discoveredUrls: urlList, updatedPublisher: updated };
    } catch (error) {
      this.logger.error(`[Ministry Discovery] Scan failed for ${publisher.officialWebsite}: ${error.message}`);
      return { discoveredUrls: [], updatedPublisher: publisher };
    }
  }

  /**
   * Scans all publishers with DISCOVERING or ACTIVE status to find new procurement pages
   */
  async scanAllMinistries(): Promise<{ scanned: number; discoveredTotal: number }> {
    const ministries = await this.prisma.publisher.findMany({
      where: {
        organizationType: 'MINISTRY',
        officialWebsite: { not: null },
      },
    });

    let totalDiscovered = 0;
    for (const ministry of ministries) {
      try {
        const res = await this.discoverMinistryEndpoints(ministry.id);
        totalDiscovered += res.discoveredUrls.length;
      } catch (err) {
        this.logger.error(`Failed discovering ministry ${ministry.name}: ${err.message}`);
      }
    }

    return { scanned: ministries.length, discoveredTotal: totalDiscovered };
  }
}
