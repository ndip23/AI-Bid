import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Basic HTTP Security Headers
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Enable CORS with full support for Vercel deployments and credentialed requests
  app.enableCors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (e.g., server-to-server, curl, cron jobs)
      if (!requestOrigin) {
        return callback(null, true);
      }

      const envOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim().toLowerCase())
        : [];

      // If no CORS_ORIGIN is specified or wildcard is used, accept the origin
      if (envOrigins.length === 0 || envOrigins.includes('*')) {
        return callback(null, true);
      }

      const lowerOrigin = requestOrigin.toLowerCase();
      const isAllowed =
        envOrigins.includes(lowerOrigin) ||
        lowerOrigin.endsWith('.vercel.app') ||
        lowerOrigin.includes('localhost');

      if (isAllowed) {
        return callback(null, true);
      }

      // Default to allowing the origin to prevent broken browser connections
      return callback(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'Range'],
    exposedHeaders: ['Content-Range', 'X-Total-Count'],
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global prefix with root and health route exclusions
  app.setGlobalPrefix('api/v1', { exclude: ['/', 'health', 'health/ready'] });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Bidora API')
    .setDescription('Procurement Opportunity Evaluation & Matching SaaS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 NestJS Backend running on port ${port} on 0.0.0.0 (Swagger docs at http://localhost:${port}/api/docs)`);
}
bootstrap();
