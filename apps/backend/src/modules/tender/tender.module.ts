import { Module } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderController } from './tender.controller';
import { AiModule } from '../ai/ai.module';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [AiModule, MatchModule],
  controllers: [TenderController],
  providers: [TenderService],
  exports: [TenderService],
})
export class TenderModule {}
