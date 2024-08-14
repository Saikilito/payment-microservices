import { Module } from '@nestjs/common';

import { Modules } from '@pay-ms/nest-modules';

import { OrderModule } from './order/order.module';

const { PrismaModule } = Modules.Prisma;
@Module({
  imports: [OrderModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
