import { OrderStatus } from '@prisma/orders';
import { IsEnum, IsUUID } from 'class-validator';

import { OrderStatusList } from './lib';

export class UpdateStatusDTO {
  @IsUUID()
  id!: string;

  @IsEnum(OrderStatusList, {
    message: `status must be one of the following values: ${OrderStatusList}`,
  })
  status!: OrderStatus;
}
