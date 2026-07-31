import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AddTeamMemberDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('profile')
  getProfile(@GetUser('companyId') companyId: string) {
    return this.companyService.getProfile(companyId);
  }

  @Put('profile')
  updateProfile(
    @GetUser('companyId') companyId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.updateProfile(companyId, dto);
  }

  @Post('team')
  addTeamMember(
    @GetUser('companyId') companyId: string,
    @Body() dto: AddTeamMemberDto,
  ) {
    return this.companyService.addTeamMember(companyId, dto);
  }

  @Delete('team/:userId')
  removeTeamMember(
    @GetUser('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.companyService.removeTeamMember(companyId, userId);
  }
}
