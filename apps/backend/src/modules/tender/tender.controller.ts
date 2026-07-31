import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TenderService } from './tender.service';
import { CreateTenderDto, QueryTendersDto, SaveTenderDto } from './dto/tender.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('tenders')
@UseGuards(JwtAuthGuard)
export class TenderController {
  constructor(private readonly tenderService: TenderService) {}

  @Get()
  findAll(
    @Query() query: QueryTendersDto,
    @GetUser('companyId') companyId: string,
  ) {
    return this.tenderService.findAll(query, companyId);
  }

  @Get('saved')
  getSavedTenders(@GetUser('companyId') companyId: string) {
    return this.tenderService.getSavedTenders(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser('companyId') companyId: string,
  ) {
    return this.tenderService.findOne(id, companyId);
  }

  @Post(':id/save')
  saveTender(
    @Param('id') id: string,
    @GetUser('companyId') companyId: string,
    @Body() dto: SaveTenderDto,
  ) {
    return this.tenderService.saveTender(id, companyId, dto);
  }

  @Delete(':id/save')
  removeSavedTender(
    @Param('id') id: string,
    @GetUser('companyId') companyId: string,
  ) {
    return this.tenderService.removeSavedTender(id, companyId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  create(@Body() dto: CreateTenderDto) {
    return this.tenderService.create(dto);
  }
}
