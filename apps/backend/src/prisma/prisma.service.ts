import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let dbUrl =
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgrespassword2026@localhost:5432/bidora_db?schema=public';

    // Strip channel_binding if present as it causes Prisma connection issues with Neon
    dbUrl = dbUrl.replace(/([?&])channel_binding=[^&]*(&|$)/g, '$1').replace(/&$/, '').replace(/\?$/, '');

    if (!dbUrl.includes('connect_timeout=')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'connect_timeout=30';
    }
    if (!dbUrl.includes('pool_timeout=')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'pool_timeout=60';
    }
    if (!dbUrl.includes('connection_limit=')) {
      dbUrl += (dbUrl.includes('?') ? '&' : '?') + 'connection_limit=20';
    }

    super({
      datasources: {
        db: { url: dbUrl },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.warn(`Failed to connect to database on startup: ${error.message}. Queries will retry connecting on demand.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

