import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/products';

@Injectable()
export class PrismaProductsService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaProductsService.name);

  async onModuleInit() {
    this.logger.log('Prisma Products Connected');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Prisma Products disconnected');
    await this.$disconnect();
  }
}
