import { Controller, Get, Post, Param, Body, Query, Patch, UseGuards } from '@nestjs/common';
import { SourceService } from './source.service';
import { SchedulerService } from './scheduler.service';
import { PublisherStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('publishers')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Get()
  async getPublishers(@Query('country') country?: string) {
    return this.sourceService.findAllPublishers(country);
  }

  @Get('daily-summary')
  async getDailySummary() {
    return this.sourceService.getDailyIngestionSummary();
  }

  @Get('daily-freshness/status')
  async getDailyFreshnessStatus() {
    return this.schedulerService.getDailyFreshnessStatus();
  }

  @Post('daily-freshness')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async triggerDailyFreshness(@Body('targetCount') targetCount?: number) {
    return this.schedulerService.ensureDailyFreshnessGuarantee(targetCount || 15);
  }

  @Get('sync-logs')
  async getSyncLogs(@Query('limit') limit?: string) {
    return this.sourceService.getSyncLogs(limit ? parseInt(limit, 10) : 50);
  }

  @Get(':id')
  async getPublisherById(@Param('id') id: string) {
    return this.sourceService.findPublisherById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async createPublisher(@Body() body: any) {
    return this.sourceService.createPublisher(body);
  }

  @Post(':id/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async syncPublisher(@Param('id') id: string) {
    return this.sourceService.syncPublisher(id);
  }

  @Post(':id/discover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async discoverPublisher(@Param('id') id: string) {
    return this.sourceService.discoverPublisher(id);
  }

  @Post('sync-all-hourly')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async triggerGlobalSync() {
    return this.schedulerService.runHourlyProcurementSync();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  async updateStatus(@Param('id') id: string, @Body('status') status: PublisherStatus) {
    return this.sourceService.togglePublisherStatus(id, status);
  }
}
