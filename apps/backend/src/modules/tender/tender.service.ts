import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { MatchService } from '../match/match.service';
import { CreateTenderDto, QueryTendersDto, SaveTenderDto } from './dto/tender.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenderService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private matchService: MatchService,
  ) {}

  async findAll(query: QueryTendersDto, companyId?: string) {
    const where: Prisma.TenderWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { refNumber: { contains: query.search, mode: 'insensitive' } },
        { buyerName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.industry) {
      where.industry = { contains: query.industry, mode: 'insensitive' };
    }

    if (query.country) {
      const c = query.country.toLowerCase();
      if (c.includes('cameroon') || c.includes('cameroun') || c.includes('cmr')) {
        where.OR = [
          ...(where.OR || []),
          { buyerCountry: { contains: 'Cameroon', mode: 'insensitive' } },
          { buyerCountry: { contains: 'Cameroun', mode: 'insensitive' } },
          { buyerCountry: { contains: 'CMR', mode: 'insensitive' } },
          { title: { contains: 'Cameroon', mode: 'insensitive' } },
          { title: { contains: 'Cameroun', mode: 'insensitive' } },
          { title: { contains: 'ARMP', mode: 'insensitive' } },
          { title: { contains: 'COLEPS', mode: 'insensitive' } },
          { title: { contains: 'MINTP', mode: 'insensitive' } },
          { title: { contains: 'MINSANTE', mode: 'insensitive' } },
          { title: { contains: 'MINMAP', mode: 'insensitive' } },
          { publisher: { country: { contains: 'Cameroon', mode: 'insensitive' } } },
        ];
      } else {
        where.buyerCountry = { contains: query.country, mode: 'insensitive' };
      }
    }

    if (query.status) {
      where.status = query.status;
    } else {
      // By default: Return OPEN active tenders (ignoring expired past deadlines)
      where.status = 'OPEN';
      where.deadline = { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    }

    let orderBy: Prisma.TenderOrderByWithRelationInput = { deadline: 'asc' };
    if (query.sortBy === 'publishDate') {
      orderBy = { publishDate: 'desc' };
    } else if (query.sortBy === 'estimatedValue') {
      orderBy = { estimatedValue: 'desc' };
    }

    const tenders = await this.prisma.tender.findMany({
      where,
      orderBy,
      include: {
        aiSummary: true,
        savedTenders: companyId
          ? {
              where: { companyId },
            }
          : false,
      },
    });

    // If companyId is provided, enrich tenders with real-time calculated match scores
    let userCompany = null;
    if (companyId) {
      userCompany = await this.prisma.company.findUnique({
        where: { id: companyId },
      });
    }

    const enriched = tenders.map((tender) => {
      let matchScoreData = null;
      if (userCompany) {
        matchScoreData = this.matchService.calculateMatch(userCompany, tender, tender.aiSummary);
      }

      const savedInfo = tender.savedTenders?.[0] || null;

      return {
        ...tender,
        isSaved: !!savedInfo,
        savedStatus: savedInfo?.status || null,
        matchScore: matchScoreData?.overallScore ?? null,
        matchDetails: matchScoreData,
      };
    });

    if (query.minScore && userCompany) {
      return enriched.filter((t) => (t.matchScore || 0) >= query.minScore);
    }

    return enriched;
  }

  async findOne(id: string, companyId?: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id },
      include: {
        aiSummary: true,
        savedTenders: companyId
          ? {
              where: { companyId },
            }
          : false,
      },
    });

    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    // Ensure AI Summary exists
    let aiSummary = tender.aiSummary;
    if (!aiSummary) {
      const summaryData = await this.aiService.generateTenderSummary(
        tender.title,
        tender.description,
        tender.rawContent,
      );

      aiSummary = await this.prisma.aiSummary.create({
        data: {
          tenderId: tender.id,
          executiveSummary: summaryData.executiveSummary,
          requirements: JSON.parse(JSON.stringify(summaryData.requirements)),
          deliverables: JSON.parse(JSON.stringify(summaryData.deliverables)),
          deadlineSummary: summaryData.deadlineSummary,
          risks: JSON.parse(JSON.stringify(summaryData.risks)),
        },
      });
    }

    let matchCalculation = null;
    if (companyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
      });
      if (company) {
        matchCalculation = this.matchService.calculateMatch(company, tender, aiSummary);

        // Store or update cached match score in DB
        const existingScore = await this.prisma.matchScore.findFirst({
          where: { companyId, tenderId: id },
        });

        const scoreData = {
          companyId,
          tenderId: id,
          overallScore: matchCalculation.overallScore,
          industryMatchScore: matchCalculation.industryMatchScore,
          countryMatchScore: matchCalculation.countryMatchScore,
          experienceScore: matchCalculation.experienceScore,
          certMatchScore: matchCalculation.certMatchScore,
          reasons: JSON.parse(JSON.stringify(matchCalculation.reasons)),
          metRequirements: JSON.parse(JSON.stringify(matchCalculation.metRequirements)),
          missingRequirements: JSON.parse(JSON.stringify(matchCalculation.missingRequirements)),
        };

        if (existingScore) {
          await this.prisma.matchScore.update({
            where: { id: existingScore.id },
            data: scoreData,
          });
        } else {
          await this.prisma.matchScore.create({
            data: scoreData,
          });
        }
      }
    }

    const savedInfo = tender.savedTenders?.[0] || null;

    return {
      ...tender,
      aiSummary,
      matchDetails: matchCalculation,
      isSaved: !!savedInfo,
      savedInfo,
    };
  }

  async saveTender(tenderId: string, companyId: string, dto: SaveTenderDto) {
    if (!companyId) {
      throw new BadRequestException('Company profile required to save tenders');
    }

    const tender = await this.prisma.tender.findUnique({ where: { id: tenderId } });
    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    return this.prisma.savedTender.upsert({
      where: {
        companyId_tenderId: { companyId, tenderId },
      },
      create: {
        companyId,
        tenderId,
        status: dto.status || 'BOOKMARKED',
        priority: dto.priority || 'MEDIUM',
        notes: dto.notes || '',
      },
      update: {
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: {
        tender: true,
      },
    });
  }

  async removeSavedTender(tenderId: string, companyId: string) {
    return this.prisma.savedTender.delete({
      where: {
        companyId_tenderId: { companyId, tenderId },
      },
    });
  }

  async getSavedTenders(companyId: string) {
    if (!companyId) {
      return [];
    }

    const saved = await this.prisma.savedTender.findMany({
      where: { companyId },
      include: {
        tender: {
          include: {
            aiSummary: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });

    return saved.map((s) => {
      const matchDetails = company
        ? this.matchService.calculateMatch(company, s.tender, s.tender.aiSummary)
        : null;

      return {
        ...s,
        matchDetails,
      };
    });
  }

  async create(dto: CreateTenderDto) {
    const existing = await this.prisma.tender.findUnique({
      where: { refNumber: dto.refNumber },
    });

    if (existing) {
      throw new BadRequestException(`Tender with reference number ${dto.refNumber} already exists`);
    }

    const tender = await this.prisma.tender.create({
      data: {
        title: dto.title,
        refNumber: dto.refNumber,
        buyerName: dto.buyerName,
        buyerCountry: dto.buyerCountry,
        industry: dto.industry,
        estimatedValue: dto.estimatedValue,
        currency: dto.currency || 'USD',
        publishDate: new Date(dto.publishDate),
        deadline: new Date(dto.deadline),
        description: dto.description,
        rawContent: dto.rawContent,
        sourceUrl: dto.sourceUrl,
        attachments: dto.attachments || [],
      },
    });

    // Auto-generate AI Summary asynchronously/inline
    const summaryData = await this.aiService.generateTenderSummary(
      tender.title,
      tender.description,
      tender.rawContent,
    );

    await this.prisma.aiSummary.create({
      data: {
        tenderId: tender.id,
        executiveSummary: summaryData.executiveSummary,
        requirements: JSON.parse(JSON.stringify(summaryData.requirements)),
        deliverables: JSON.parse(JSON.stringify(summaryData.deliverables)),
        deadlineSummary: summaryData.deadlineSummary,
        risks: JSON.parse(JSON.stringify(summaryData.risks)),
      },
    });

    return tender;
  }
}
