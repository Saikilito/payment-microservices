import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/orders';

@Injectable()
export class PrismaOrdersService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaOrdersService.name);

  async onModuleInit() {
    this.logger.log('Prisma Orders Connected');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Prisma Orders disconnected');
    await this.$disconnect();
  }
}
