import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_if7xDJ4EnXjQ@ep-shiny-union-ay635har-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
    if (dbUrl.includes('neon.tech') && !dbUrl.includes('-pooler')) {
      dbUrl = dbUrl.replace('ep-shiny-union-ay635har', 'ep-shiny-union-ay635har-pooler');
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

