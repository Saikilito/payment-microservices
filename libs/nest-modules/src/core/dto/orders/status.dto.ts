import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/orders';

import { OrderStatusList } from './lib';

export class StatusDTO {
  // TODO: Why Optional?
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `status must be one of the following values: ${OrderStatusList}`,
  })
  status?: OrderStatus;
}
