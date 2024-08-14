import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [AuthModule, ProductsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
