import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/auth';

@Injectable()
export class PrismaAuthService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaAuthService.name);

  async onModuleInit() {
    this.logger.log('Prisma Auth Connected');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Prisma Auth disconnected');
    await this.$disconnect();
  }
}
