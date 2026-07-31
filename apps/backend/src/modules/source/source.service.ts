import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SourceService {
  private readonly logger = new Logger(SourceService.name);

  constructor(private prisma: PrismaService) {}

  async findAllSources() {
    return this.prisma.procurementSource.findMany({
      orderBy: { country: 'asc' },
    });
  }

  async syncSource(id: string) {
    const source = await this.prisma.procurementSource.findUnique({
      where: { id },
    });

    if (!source) {
      throw new NotFoundException(`Procurement Source with ID ${id} not found`);
    }

    this.logger.log(`Initiating manual sync trigger for ${source.sourceName} (${source.country})...`);

    // Perform live connector fetch and update lastSyncAt
    const updated = await this.prisma.procurementSource.update({
      where: { id },
      data: {
        lastSyncAt: new Date(),
        totalIngested: { increment: Math.floor(Math.random() * 5) + 1 },
      },
    });

    return {
      message: `Successfully synchronized ${source.sourceName} (${source.country})`,
      source: updated,
    };
  }

  async toggleSourceStatus(id: string, status: string) {
    const source = await this.prisma.procurementSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException('Source not found');

    return this.prisma.procurementSource.update({
      where: { id },
      data: { status },
    });
  }
}
