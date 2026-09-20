import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { TenderModule } from './modules/tender/tender.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AdminModule } from './modules/admin/admin.module';
import { AiModule } from './modules/ai/ai.module';
import { MatchModule } from './modules/match/match.module';
import { QueueModule } from './modules/queue/queue.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { SourceModule } from './modules/source/source.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute window
        limit: 120, // 120 requests per minute per IP for normal browsing
      },
    ]),
    PrismaModule,
    AiModule,
    MatchModule,
    QueueModule,
    CloudinaryModule,
    AuthModule,
    CompanyModule,
    TenderModule,
    NotificationModule,
    AdminModule,
    SourceModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
