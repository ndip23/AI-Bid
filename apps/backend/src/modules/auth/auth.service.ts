import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUsername) {
      throw new BadRequestException('Username is already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Create company if name provided, unpopulated so user fills their own capability profile
    let company = null;
    if (dto.companyName) {
      company = await this.prisma.company.create({
        data: {
          name: dto.companyName,
          industry: dto.industry || 'Cloud & IT Infrastructure',
          countries: [],
          certifications: [],
          services: [],
          teamSize: 1,
          taxId: null,
          description: null,
        },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username,
        passwordHash,
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

  async updateProfile(userId: string, dto: { username?: string; email?: string }) {
    const data: any = {};
    if (dto.username) data.username = dto.username.trim();
    if (dto.email) data.email = dto.email.trim().toLowerCase();

    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: dto.username.trim(), NOT: { id: userId } },
      });
      if (existing) {
        throw new BadRequestException('Username is already taken');
      }
    }

    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email.trim().toLowerCase(), NOT: { id: userId } },
      });
      if (existing) {
        throw new BadRequestException('Email is already registered by another account');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      include: { company: true },
    });

    const { passwordHash: _, ...userWithoutPassword } = updated;
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
