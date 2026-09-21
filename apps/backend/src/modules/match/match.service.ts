import { Injectable, Logger } from '@nestjs/common';
import { Company, Tender, AiSummary } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface MatchCalculationResult {
  overallScore: number;
  industryMatchScore: number;
  countryMatchScore: number;
  certMatchScore: number;
  experienceScore: number;
  reasons: string[];
  metRequirements: string[];
  missingRequirements: string[];
}

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates and saves match scores for all registered companies against a newly ingested tender.
   */
  async calculateMatchesForTender(tenderId: string): Promise<void> {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
      include: { aiSummary: true },
    });

    if (!tender) return;

    const companies = await this.prisma.company.findMany();
    for (const company of companies) {
      const result = this.calculateMatch(company, tender, tender.aiSummary);

      await this.prisma.matchScore.upsert({
        where: {
          id: `${company.id}_${tender.id}`,
        },
        create: {
          companyId: company.id,
          tenderId: tender.id,
          overallScore: result.overallScore,
          industryMatchScore: result.industryMatchScore,
          countryMatchScore: result.countryMatchScore,
          experienceScore: result.experienceScore,
          certMatchScore: result.certMatchScore,
          reasons: result.reasons as any,
          metRequirements: result.metRequirements as any,
          missingRequirements: result.missingRequirements as any,
        },
        update: {
          overallScore: result.overallScore,
          industryMatchScore: result.industryMatchScore,
          countryMatchScore: result.countryMatchScore,
          experienceScore: result.experienceScore,
          certMatchScore: result.certMatchScore,
          reasons: result.reasons as any,
          metRequirements: result.metRequirements as any,
          missingRequirements: result.missingRequirements as any,
        },
      }).catch(async () => {
        // Fallback for compound unique constraint if not using custom id format
        const existing = await this.prisma.matchScore.findFirst({
          where: { companyId: company.id, tenderId: tender.id },
        });

        if (existing) {
          await this.prisma.matchScore.update({
            where: { id: existing.id },
            data: {
              overallScore: result.overallScore,
              industryMatchScore: result.industryMatchScore,
              countryMatchScore: result.countryMatchScore,
              experienceScore: result.experienceScore,
              certMatchScore: result.certMatchScore,
              reasons: result.reasons as any,
              metRequirements: result.metRequirements as any,
              missingRequirements: result.missingRequirements as any,
            },
          });
        } else {
          await this.prisma.matchScore.create({
            data: {
              companyId: company.id,
              tenderId: tender.id,
              overallScore: result.overallScore,
              industryMatchScore: result.industryMatchScore,
              countryMatchScore: result.countryMatchScore,
              experienceScore: result.experienceScore,
              certMatchScore: result.certMatchScore,
              reasons: result.reasons as any,
              metRequirements: result.metRequirements as any,
              missingRequirements: result.missingRequirements as any,
            },
          });
        }
      });
    }

    this.logger.log(`[Match Engine] Calculated matches for tender ${tender.refNumber} across ${companies.length} companies.`);
  }

  calculateMatch(company: Company, tender: Tender, aiSummary?: AiSummary | null): MatchCalculationResult {
    const reasons: string[] = [];
    const metRequirements: string[] = [];
    const missingRequirements: string[] = [];

    // Safe fallbacks for company attributes
    const companyIndustry = company?.industry || '';
    const companyCountries = Array.isArray(company?.countries) ? company.countries : [];
    const companyCerts = Array.isArray(company?.certifications) ? company.certifications : [];
    const companyServices = Array.isArray(company?.services) ? company.services : [];

    // Safe fallbacks for tender attributes
    const tenderIndustry = tender?.industry || '';
    const tenderCountry = tender?.buyerCountry || '';
    const tenderTitle = tender?.title || '';
    const tenderDesc = tender?.description || '';
    const tenderRaw = (tender as any)?.rawContent || '';

    // 1. Industry Match
    let industryScore = 40;
    const compIndustryLower = companyIndustry.toLowerCase();
    const tendIndustryLower = tenderIndustry.toLowerCase();

    if (compIndustryLower && tendIndustryLower && (compIndustryLower === tendIndustryLower || tendIndustryLower.includes(compIndustryLower) || compIndustryLower.includes(tendIndustryLower))) {
      industryScore = 100;
      reasons.push(`Industry Match (100%): Perfect alignment in ${tenderIndustry || 'relevant sector'}`);
    } else if (
      (compIndustryLower.includes('technology') || compIndustryLower.includes('it')) &&
      (tendIndustryLower.includes('cloud') || tendIndustryLower.includes('software') || tendIndustryLower.includes('cyber') || tendIndustryLower.includes('telecom'))
    ) {
      industryScore = 85;
      reasons.push(`Industry Alignment (85%): ${companyIndustry} aligns closely with ${tenderIndustry}`);
    } else {
      reasons.push(`Industry Alignment (${industryScore}%): Evaluated against ${tenderIndustry || 'procurement category'}`);
    }

    // 2. Country / Geography Match
    let countryScore = 0;
    const normalizeCountry = (c: string) => {
      if (!c) return '';
      const lower = c.trim().toLowerCase();
      if (/cote d'?ivoire|côte d'?ivoire|ivory coast/i.test(lower)) return "cote d'ivoire";
      if (/cameroon|cameroun/i.test(lower)) return 'cameroon';
      if (/nigeria/i.test(lower)) return 'nigeria';
      return lower;
    };
    const tenderCountryNorm = normalizeCountry(tenderCountry);
    const isCountryMatch = companyCountries.some((c) => {
      const cNorm = normalizeCountry(c);
      return cNorm === tenderCountryNorm || cNorm === 'global' || tenderCountryNorm === 'global';
    });

    if (isCountryMatch) {
      countryScore = 100;
      reasons.push(`Country Coverage (100%): Buyer country (${tenderCountry}) is within company operating regions`);
      metRequirements.push(`Operational presence in ${tenderCountry}`);
    } else {
      countryScore = 0;
      reasons.push(`Geographic Target (0%): Buyer is in ${tenderCountry || 'unspecified region'}`);
      missingRequirements.push(`Active business registration / operations in ${tenderCountry || 'region'}`);
    }

    // 3. Certifications Match
    let certScore = 100;
    let reqs: any[] = [];
    const rawRequirements = aiSummary?.requirements;
    if (Array.isArray(rawRequirements)) {
      reqs = rawRequirements;
    } else if (typeof rawRequirements === 'string') {
      try {
        const parsed = JSON.parse(rawRequirements);
        if (Array.isArray(parsed)) reqs = parsed;
      } catch {}
    } else if (rawRequirements && typeof rawRequirements === 'object') {
      reqs = Object.values(rawRequirements).flatMap((v) => (Array.isArray(v) ? v : [v]));
    }

    const certReqs = reqs.filter((r) => r && (r.category === 'Certification' || (r.description && (r.description.toLowerCase().includes('iso') || r.description.toLowerCase().includes('soc')))));

    if (certReqs.length > 0) {
      let matchedCertsCount = 0;
      for (const req of certReqs) {
        const desc = req.description || req.requirement || '';
        const hasCert = companyCerts.some((cert) =>
          desc.toLowerCase().includes(cert.toLowerCase()),
        );
        if (hasCert) {
          matchedCertsCount++;
          metRequirements.push(desc);
        } else {
          missingRequirements.push(desc);
        }
      }

      certScore = Math.round((matchedCertsCount / certReqs.length) * 100);
      if (certScore === 100) {
        reasons.push(`Certification Coverage (100%): Holds all required certifications (${companyCerts.join(', ')})`);
      } else {
        reasons.push(`Certification Deficit (${certScore}%): Missing required certifications mandated by tender specification`);
      }
    } else {
      reasons.push(`Certification Standard (100%): Company holds recognized industry certifications (${companyCerts.join(', ')})`);
      metRequirements.push('Standard compliance & certification baseline');
    }

    // 4. Experience & Capabilities Match
    let experienceScore = 70;
    const tenderText = `${tenderTitle} ${tenderDesc} ${tenderRaw}`.toLowerCase();
    const matchedServices = companyServices.filter((service) =>
      service && tenderText.includes(service.toLowerCase()),
    );

    if (matchedServices.length > 0) {
      experienceScore = Math.min(100, 60 + matchedServices.length * 20);
      reasons.push(`Service Capability Match (${experienceScore}%): Capabilities match core tender services (${matchedServices.join(', ')})`);
      metRequirements.push(`Proven capabilities in ${matchedServices.join(', ')}`);
    } else {
      experienceScore = 50;
      reasons.push(`Capability Gap (${experienceScore}%): Core services offer partial overlap with tender deliverables`);
      missingRequirements.push('Direct historical case studies matching precise tender deliverables');
    }

    // Overall Score weighted formula
    const overallScore = Math.round(
      industryScore * 0.35 + countryScore * 0.25 + certScore * 0.25 + experienceScore * 0.15,
    );

    return {
      overallScore,
      industryMatchScore: industryScore,
      countryMatchScore: countryScore,
      certMatchScore: certScore,
      experienceScore,
      reasons,
      metRequirements,
      missingRequirements,
    };
  }
}
