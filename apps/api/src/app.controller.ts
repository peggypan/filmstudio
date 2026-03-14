import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getHello() {
    return {
      name: 'FilmStudio API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/docs',
    };
  }

  @Get('health')
  async healthCheck() {
    try {
      // 检查数据库连接
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          api: 'up',
          database: 'up',
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          api: 'up',
          database: 'down',
        },
        error: error.message,
      };
    }
  }
}
