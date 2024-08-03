import { Module } from '@nestjs/common';

import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [ProductsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
