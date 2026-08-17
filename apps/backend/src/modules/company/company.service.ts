import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddTeamMemberDto, UpdateCompanyDto } from './dto/company.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getProfile(companyId: string) {
    if (!companyId) {
      throw new BadRequestException('User is not associated with any company');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company profile not found');
    }

    return company;
  }

  async updateProfile(companyId: string, dto: UpdateCompanyDto) {
    if (!companyId) {
      throw new BadRequestException('User is not associated with any company');
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });
  }

  async addTeamMember(companyId: string, dto: AddTeamMemberDto) {
    if (!companyId) {
      throw new BadRequestException('User is not associated with any company');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      if (existingUser.companyId === companyId) {
        throw new BadRequestException('User is already part of your team');
      }
      throw new BadRequestException('User with this email is already registered elsewhere');
    }

    // Default temp password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Welcome123!', salt);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username || dto.email.split('@')[0],
        passwordHash,
        role: 'COMPANY_USER',
        companyId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  async removeTeamMember(companyId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.companyId !== companyId) {
      throw new NotFoundException('Team member not found in your company');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { companyId: null },
    });
  }
}
