import { Controller, Get, Param, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { SourceService } from './source.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('sources')
@UseGuards(JwtAuthGuard)
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  findAllSources() {
    return this.sourceService.findAllSources();
  }

  @Post(':id/sync')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  syncSource(@Param('id') id: string) {
    return this.sourceService.syncSource(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  toggleStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.sourceService.toggleSourceStatus(id, status);
  }
}
