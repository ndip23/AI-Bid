import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StandardTenderModel } from '../../connectors/publisher-connector.interface';

@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(DeduplicationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Checks if a tender model is a duplicate of an existing tender in the database.
   * Returns existing tender ID if duplicate found, or null if unique.
   */
  async checkDuplicate(tender: StandardTenderModel): Promise<{ isDuplicate: boolean; existingId?: string; reason?: string }> {
    const cleanRef = this.cleanString(tender.referenceNumber);
    const cleanUrl = this.normalizeUrl(tender.sourceURL);

    // Tier 1: Exact Reference Number
    if (cleanRef) {
      const exactRefMatch = await this.prisma.tender.findFirst({
        where: { refNumber: tender.referenceNumber },
      });
      if (exactRefMatch) {
        return { isDuplicate: true, existingId: exactRefMatch.id, reason: 'Exact Reference Number Match' };
      }
    }

    // Tier 2: Exact Normalized Source URL
    if (cleanUrl) {
      const exactUrlMatch = await this.prisma.tender.findFirst({
        where: { sourceUrl: tender.sourceURL },
      });
      if (exactUrlMatch) {
        return { isDuplicate: true, existingId: exactUrlMatch.id, reason: 'Exact Source URL Match' };
      }
    }

    // Tier 3: Cleaned Reference Code Match
    if (cleanRef.length > 5) {
      const allRefMatches = await this.prisma.tender.findMany({
        where: { buyerCountry: tender.country },
        select: { id: true, refNumber: true },
      });
      const match = allRefMatches.find((t) => this.cleanString(t.refNumber) === cleanRef);
      if (match) {
        return { isDuplicate: true, existingId: match.id, reason: 'Normalized Reference Code Match' };
      }
    }

    // Tier 4: Composite Title + Organization + Deadline Similarity
    const candidates = await this.prisma.tender.findMany({
      where: {
        buyerCountry: tender.country,
        status: 'OPEN',
      },
      select: { id: true, title: true, buyerName: true, deadline: true },
      take: 100,
    });

    const targetTitleTokens = this.tokenize(tender.title);
    for (const candidate of candidates) {
      const candidateTokens = this.tokenize(candidate.title);
      const similarity = this.jaccardSimilarity(targetTitleTokens, candidateTokens);

      if (similarity >= 0.85) {
        // Confirm deadline proximity (within 3 days) or buyer similarity
        const deadlineDiffDays = candidate.deadline
          ? Math.abs(candidate.deadline.getTime() - tender.closingDate.getTime()) / (1000 * 3600 * 24)
          : 0;

        if (deadlineDiffDays <= 3) {
          return {
            isDuplicate: true,
            existingId: candidate.id,
            reason: `Composite Title Similarity (${(similarity * 100).toFixed(1)}%) & Deadline Proximity`,
          };
        }
      }
    }

    return { isDuplicate: false };
  }

  private cleanString(str: string): string {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private normalizeUrl(url: string): string {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname}`.replace(/\/$/, '').toLowerCase();
    } catch {
      return url.toLowerCase().replace(/\/$/, '');
    }
  }

  private tokenize(str: string): Set<string> {
    if (!str) return new Set();
    const clean = str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
    return new Set(clean);
  }

  private jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const elem of setA) {
      if (setB.has(elem)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }
}
