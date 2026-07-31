import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface QueueJob {
  type: 'DEADLINE_WARNING' | 'NEW_MATCH' | 'STATUS_CHANGE';
  payload: Record<string, unknown>;
}

/**
 * QueueService — lightweight in-process queue using setInterval.
 * For production, swap with @nestjs/bull + BullMQ backed by Redis.
 * Redis is pre-configured in docker-compose.yml (REDIS_HOST, REDIS_PORT).
 */
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly jobQueue: QueueJob[] = [];
  private processingInterval: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {
    this.startProcessor();
  }

  enqueue(job: QueueJob): void {
    this.jobQueue.push(job);
    this.logger.log(`[Queue] Enqueued job: ${job.type}`);
  }

  private startProcessor(): void {
    // Process queue every 5 seconds
    this.processingInterval = setInterval(() => this.processNext(), 5000);
  }

  private async processNext(): Promise<void> {
    if (this.jobQueue.length === 0) return;
    const job = this.jobQueue.shift();
    if (!job) return;

    try {
      this.logger.log(`[Queue] Processing job: ${job.type}`);
      await this.handleJob(job);
    } catch (err) {
      this.logger.error(`[Queue] Job ${job.type} failed: ${err.message}`);
    }
  }

  private async handleJob(job: QueueJob): Promise<void> {
    switch (job.type) {
      case 'DEADLINE_WARNING':
        await this.handleDeadlineWarning(job.payload);
        break;
      case 'NEW_MATCH':
        await this.handleNewMatch(job.payload);
        break;
      case 'STATUS_CHANGE':
        await this.handleStatusChange(job.payload);
        break;
    }
  }

  private async handleDeadlineWarning(payload: Record<string, unknown>): Promise<void> {
    const { tenderId, tenderTitle, daysLeft } = payload;

    // Find all companies that have saved this tender
    const savedTenders = await this.prisma.savedTender.findMany({
      where: { tenderId: tenderId as string },
      include: { company: { include: { users: true } } },
    });

    for (const saved of savedTenders) {
      for (const user of saved.company.users) {
        await this.prisma.notification.create({
          data: {
            userId: user.id,
            title: `⏰ Deadline Alert: ${daysLeft} Days Left`,
            message: `Your saved tender "${tenderTitle}" closes in ${daysLeft} days. Ensure your bid submission is ready.`,
            type: 'DEADLINE_WARNING',
          },
        });
      }
    }

    this.logger.log(`[Queue] Deadline notifications dispatched for tender ${tenderId}`);
  }

  private async handleNewMatch(payload: Record<string, unknown>): Promise<void> {
    const { tenderId, tenderTitle, companyId, score } = payload;

    const company = await this.prisma.company.findUnique({
      where: { id: companyId as string },
      include: { users: true },
    });

    if (!company) return;

    for (const user of company.users) {
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          title: `✨ New ${score}% Match Opportunity!`,
          message: `A new tender "${tenderTitle}" has been published matching your company's capabilities at ${score}%.`,
          type: 'NEW_MATCH',
        },
      });
    }

    this.logger.log(`[Queue] Match notifications dispatched to company ${companyId}`);
  }

  private async handleStatusChange(payload: Record<string, unknown>): Promise<void> {
    const { userId, tenderTitle, newStatus } = payload;

    await this.prisma.notification.create({
      data: {
        userId: userId as string,
        title: `📋 Pipeline Update`,
        message: `Tender "${tenderTitle}" status has been updated to "${newStatus}".`,
        type: 'STATUS_CHANGE',
      },
    });
  }

  /**
   * Scan all open tenders and enqueue deadline warnings for tenders
   * closing within 7 or 14 days. Call this from a cron/scheduler.
   */
  async scanAndEnqueueDeadlineWarnings(): Promise<void> {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingTenders = await this.prisma.tender.findMany({
      where: {
        status: 'OPEN',
        deadline: { lte: in7Days, gte: now },
      },
    });

    for (const tender of upcomingTenders) {
      const daysLeft = Math.ceil((tender.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      this.enqueue({
        type: 'DEADLINE_WARNING',
        payload: { tenderId: tender.id, tenderTitle: tender.title, daysLeft },
      });
    }

    this.logger.log(`[Queue] Scanned ${upcomingTenders.length} tenders for deadline warnings`);
  }

  onModuleDestroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
  }
}
