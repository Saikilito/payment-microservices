import { Module } from '@nestjs/common';
import { PrismaOrdersService } from './prisma-orders.service';
import { PrismaProductsService } from './prisma-products.service';

@Module({
  providers: [PrismaOrdersService, PrismaProductsService],
  exports: [PrismaOrdersService, PrismaProductsService],
})
export class PrismaModule {}
