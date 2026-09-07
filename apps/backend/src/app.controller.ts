import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      name: 'Bidora Backend API',
      status: 'ONLINE',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      swaggerDocs: 'http://localhost:4000/api/docs',
      frontendApp: 'http://localhost:3000',
      endpoints: {
        tenders: '/api/v1/tenders',
        publishers: '/api/v1/publishers',
        adminStats: '/api/v1/admin/stats',
      },
    };
  }
}
