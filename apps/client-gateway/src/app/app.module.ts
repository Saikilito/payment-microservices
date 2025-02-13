import { Module } from '@nestjs/common';

import { API } from '@pay-ms/nest-modules';

import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [API.HealthModule, AuthModule, ProductsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
