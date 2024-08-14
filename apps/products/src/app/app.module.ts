import { Module } from '@nestjs/common';

import { Modules } from '@pay-ms/nest-modules';

import { ProductModule } from './product/product.module';

const { PrismaModule } = Modules.Prisma;

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
