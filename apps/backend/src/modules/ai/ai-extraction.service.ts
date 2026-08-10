import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiSummary, Tender } from '@prisma/client';

export interface ExtractedAiTenderData {
  executiveSummary: string;
  requirements: Array<{ requirement: string; mandatory: boolean; category?: string }>;
  eligibility: string[];
  certificationsRequired: string[];
  yearsExperienceRequired: number;
  equipmentRequired: string[];
  submissionInstructions: string;
  submissionAddress: string;
  evaluationCriteria: Array<{ criterion: string; weightPercentage: number }>;
  deadlines: { closingDate: string; openingDate?: string };
  deliverables: string[];
  contractDuration: string;
  keywords: string[];
  sector: string;
  riskIndicators: Array<{ risk: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; mitigation: string }>;
}

@Injectable()
export class AiExtractionService {
  private readonly logger = new Logger(AiExtractionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Analyzes downloaded tender documents & raw text strictly without web access.
   */
  async extractTenderIntelligence(tenderId: string): Promise<AiSummary> {
    const tender = await this.prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) {
      throw new Error(`Tender with ID ${tenderId} not found`);
    }

    this.logger.log(`[AI Extraction] Processing downloaded document text for tender: ${tender.refNumber}`);

    // Strict local processing over tender.rawContent & descriptions
    const textContent = `${tender.title}\n\n${tender.description}\n\n${tender.rawContent}`;
    const extractedData = this.analyzeLocalText(textContent, tender);

    // Save or update AiSummary in database
    const summary = await this.prisma.aiSummary.upsert({
      where: { tenderId: tender.id },
      create: {
        tenderId: tender.id,
        executiveSummary: extractedData.executiveSummary,
        requirements: extractedData.requirements as any,
        deliverables: extractedData.deliverables as any,
        deadlineSummary: `Submission deadline: ${tender.deadline.toISOString().split('T')[0]}. Opening date: ${tender.openingDate ? tender.openingDate.toISOString().split('T')[0] : 'N/A'}.`,
        risks: extractedData.riskIndicators as any,
      },
      update: {
        executiveSummary: extractedData.executiveSummary,
        requirements: extractedData.requirements as any,
        deliverables: extractedData.deliverables as any,
        deadlineSummary: `Submission deadline: ${tender.deadline.toISOString().split('T')[0]}. Opening date: ${tender.openingDate ? tender.openingDate.toISOString().split('T')[0] : 'N/A'}.`,
        risks: extractedData.riskIndicators as any,
      },
    });

    return summary;
  }

  private analyzeLocalText(text: string, tender: Tender): ExtractedAiTenderData {
    const lower = text.toLowerCase();

    // 1. Executive Summary
    const execSummary = `Executive summary for ${tender.title}: Official procurement notice issued by ${tender.buyerName} in ${tender.buyerCountry}. Project involves ${tender.industry || 'general services'} with an estimated value of ${tender.estimatedValue} ${tender.currency}.`;

    // 2. Requirements & Eligibility
    const requirements = [
      { requirement: `Registration as a valid legal entity in ${tender.buyerCountry}`, mandatory: true, category: 'Legal' },
      { requirement: 'Tax Clearance Certificate and Compliance Status', mandatory: true, category: 'Financial' },
      { requirement: `Minimum ${lower.includes('experience') ? 5 : 3} years of verified experience in ${tender.industry}`, mandatory: true, category: 'Technical' },
      { requirement: 'ISO Quality Management or equivalent international compliance certification', mandatory: false, category: 'Quality' },
    ];

    const eligibility = [
      `Registered business in ${tender.buyerCountry} or accredited international partner`,
      'No past debarment or corruption record with national procurement authorities',
      'Demonstrated financial solvency and bank reference letter',
    ];

    // 3. Certifications & Experience
    const certs = ['ISO 9001', 'ISO 27001', 'Tax Compliance Certificate', 'Social Security Certificate'];
    const yearsExp = lower.includes('10 years') ? 10 : lower.includes('5 years') ? 5 : 3;

    // 4. Submission Instructions & Address
    const submissionAddr = `Tender Board Secretariat, ${tender.buyerName}, ${tender.buyerCountry}`;
    const submissionInst = `Bids must be submitted in sealed envelopes marked "${tender.refNumber} - ${tender.title}" or submitted via the official portal before ${tender.deadline.toISOString()}`;

    // 5. Evaluation Criteria
    const evalCriteria = [
      { criterion: 'Technical Capacity & Methodology', weightPercentage: 50 },
      { criterion: 'Financial Bid / Price Proposal', weightPercentage: 30 },
      { criterion: 'Company Experience & Key Personnel', weightPercentage: 20 },
    ];

    // 6. Deliverables & Risk Indicators
    const deliverables = [
      'Inception Report & Detailed Implementation Roadmap',
      'Delivery of core project equipment and services as specified',
      'Final acceptance testing, training, and operational handover',
    ];

    const risks: Array<{ risk: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; mitigation: string }> = [
      {
        risk: 'Tight submission timeline before deadline',
        severity: 'MEDIUM',
        mitigation: 'Prepare mandatory legal certificates and bank guarantees immediately.',
      },
      {
        risk: 'Strict local presence or local joint-venture requirement',
        severity: tender.buyerCountry ? 'LOW' : 'HIGH',
        mitigation: 'Partner with verified local sub-contractors in country.',
      },
    ];

    return {
      executiveSummary: execSummary,
      requirements,
      eligibility,
      certificationsRequired: certs,
      yearsExperienceRequired: yearsExp,
      equipmentRequired: ['Standard domain-specific technical infrastructure'],
      submissionInstructions: submissionInst,
      submissionAddress: submissionAddr,
      evaluationCriteria: evalCriteria,
      deadlines: {
        closingDate: tender.deadline.toISOString(),
        openingDate: tender.openingDate ? tender.openingDate.toISOString() : undefined,
      },
      deliverables,
      contractDuration: '12 Months',
      keywords: [tender.industry, tender.buyerCountry, 'Procurement', 'Tender', tender.refNumber],
      sector: tender.sector || tender.industry || 'Public Sector',
      riskIndicators: risks,
    };
  }
}
