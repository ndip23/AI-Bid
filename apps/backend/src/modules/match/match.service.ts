import { Injectable } from '@nestjs/common';
import { Company, Tender, AiSummary } from '@prisma/client';
import { ExtractedRequirement } from '../ai/ai.service';

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
  calculateMatch(company: Company, tender: Tender, aiSummary?: AiSummary | null): MatchCalculationResult {
    const reasons: string[] = [];
    const metRequirements: string[] = [];
    const missingRequirements: string[] = [];

    // 1. Industry Match
    let industryScore = 40;
    const compIndustryLower = company.industry.toLowerCase();
    const tendIndustryLower = tender.industry.toLowerCase();

    if (compIndustryLower === tendIndustryLower || tendIndustryLower.includes(compIndustryLower) || compIndustryLower.includes(tendIndustryLower)) {
      industryScore = 100;
      reasons.push(`Industry Match (100%): Perfect alignment in ${tender.industry}`);
    } else if (
      (compIndustryLower.includes('technology') || compIndustryLower.includes('it')) &&
      (tendIndustryLower.includes('cloud') || tendIndustryLower.includes('software') || tendIndustryLower.includes('cyber'))
    ) {
      industryScore = 85;
      reasons.push(`Industry Alignment (85%): ${company.industry} aligns closely with ${tender.industry}`);
    } else {
      reasons.push(`Industry Mismatch (${industryScore}%): Company is focused on ${company.industry} while Tender requires ${tender.industry}`);
    }

    // 2. Country / Geography Match
    let countryScore = 0;
    const isCountryMatch = company.countries.some(
      (c) => c.toLowerCase() === tender.buyerCountry.toLowerCase() || c.toLowerCase() === 'global',
    );

    if (isCountryMatch) {
      countryScore = 100;
      reasons.push(`Country Coverage (100%): Buyer country (${tender.buyerCountry}) is within company operating regions`);
      metRequirements.push(`Operational presence in ${tender.buyerCountry}`);
    } else {
      countryScore = 0;
      reasons.push(`Geographic Exclusion (0%): Buyer is in ${tender.buyerCountry}, which is not in company operational regions (${company.countries.join(', ')})`);
      missingRequirements.push(`Active business registration / operations in ${tender.buyerCountry}`);
    }

    // 3. Certifications Match
    let certScore = 100;
    const reqs = (aiSummary?.requirements as unknown as ExtractedRequirement[]) || [];
    const certReqs = reqs.filter((r) => r.category === 'Certification' || r.description.toLowerCase().includes('iso') || r.description.toLowerCase().includes('soc'));

    if (certReqs.length > 0) {
      let matchedCertsCount = 0;
      for (const req of certReqs) {
        const hasCert = company.certifications.some((cert) =>
          req.description.toLowerCase().includes(cert.toLowerCase()),
        );
        if (hasCert) {
          matchedCertsCount++;
          metRequirements.push(req.description);
        } else {
          missingRequirements.push(req.description);
        }
      }

      certScore = Math.round((matchedCertsCount / certReqs.length) * 100);
      if (certScore === 100) {
        reasons.push(`Certification Coverage (100%): Holds all required certifications (${company.certifications.join(', ')})`);
      } else {
        reasons.push(`Certification Deficit (${certScore}%): Missing required certifications mandated by tender specification`);
      }
    } else {
      reasons.push(`Certification Standard (100%): Company holds recognized industry certifications (${company.certifications.join(', ')})`);
      metRequirements.push('Standard compliance & certification baseline');
    }

    // 4. Experience & Capabilities Match
    let experienceScore = 70;
    const tenderText = `${tender.title} ${tender.description} ${tender.rawContent}`.toLowerCase();
    const matchedServices = company.services.filter((service) =>
      tenderText.includes(service.toLowerCase()),
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
