import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalTenders, openTenders, totalCompanies, totalUsers, totalSaved] = await Promise.all([
      this.prisma.tender.count(),
      this.prisma.tender.count({ where: { status: 'OPEN' } }),
      this.prisma.company.count(),
      this.prisma.user.count(),
      this.prisma.savedTender.count(),
    ]);

    const totalValueAgg = await this.prisma.tender.aggregate({
      _sum: { estimatedValue: true },
      where: { status: 'OPEN' },
    });

    const recentTenders = await this.prisma.tender.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      totalTenders,
      openTenders,
      totalCompanies,
      totalUsers,
      totalSaved,
      totalOpenOpportunityValue: totalValueAgg._sum.estimatedValue || 0,
      recentTenders,
    };
  }

  async getAllCompanies() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: { users: true, savedTenders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        company: {
          select: { id: true, name: true, industry: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
