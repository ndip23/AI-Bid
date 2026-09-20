import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getRoot() {
    let dbStatus = 'CONNECTED';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DISCONNECTED';
    }

    return {
      name: 'Bidora Backend API',
      status: dbStatus === 'CONNECTED' ? 'ONLINE' : 'DEGRADED',
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      docs: '/api/docs',
      endpoints: {
        tenders: '/api/v1/tenders',
        publishers: '/api/v1/publishers',
        adminStats: '/api/v1/admin/stats',
      },
    };
  }

  @Get('health')
  getLiveness() {
    return {
      status: 'ok',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ready')
  async getReadiness(@Res() res: Response) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return res.status(HttpStatus.OK).json({
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'not_ready',
        database: 'error',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
