import { Module } from '@nestjs/common';

import { Modules } from '@nms/nest-modules';

import { ProductModule } from './product/product.module';

const { PrismaModule } = Modules.Prisma;

@Module({
  imports: [ProductModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
