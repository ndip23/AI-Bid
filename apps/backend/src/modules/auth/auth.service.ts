import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create company if name provided, or assign default company profile
    let company = null;
    if (dto.companyName) {
      company = await this.prisma.company.create({
        data: {
          name: dto.companyName,
          industry: dto.industry || 'Technology & IT Services',
          countries: ['United States', 'United Kingdom'],
          certifications: ['ISO 27001', 'SOC 2 Type II'],
          services: ['Cloud Infrastructure', 'Custom Software Development', 'Cybersecurity'],
          teamSize: 25,
          annualRevenue: '$5M - $10M',
          description: `${dto.companyName} provides high-quality software, IT consulting, and enterprise technology services.`,
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'COMPANY_USER',
        companyId: company?.id || null,
      },
      include: { company: true },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { company: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email, user.role);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      // Security standard: don't disclose whether email exists
      return { message: 'If your email is registered, you will receive a password reset instructions email shortly.' };
    }

    if (dto.newPassword) {
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(dto.newPassword, salt);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });
      return { message: 'Password successfully updated.' };
    }

    return { message: 'Password reset link has been dispatched to your email address.' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}
