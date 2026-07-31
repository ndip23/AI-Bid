import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
})
export class AppModule {}
