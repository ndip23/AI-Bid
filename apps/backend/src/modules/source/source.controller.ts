import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common';
import { SourceService } from './source.service';
import { SchedulerService } from './scheduler.service';
import { PublisherStatus } from '@prisma/client';

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

  @Get('sync-logs')
  async getSyncLogs(@Query('limit') limit?: string) {
    return this.sourceService.getSyncLogs(limit ? parseInt(limit, 10) : 50);
  }

  @Get(':id')
  async getPublisherById(@Param('id') id: string) {
    return this.sourceService.findPublisherById(id);
  }

  @Post()
  async createPublisher(@Body() body: any) {
    return this.sourceService.createPublisher(body);
  }

  @Post(':id/sync')
  async syncPublisher(@Param('id') id: string) {
    return this.sourceService.syncPublisher(id);
  }

  @Post(':id/discover')
  async discoverPublisher(@Param('id') id: string) {
    return this.sourceService.discoverPublisher(id);
  }

  @Post('sync-all-hourly')
  async triggerGlobalSync() {
    return this.schedulerService.runHourlyProcurementSync();
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: PublisherStatus) {
    return this.sourceService.togglePublisherStatus(id, status);
  }
}
