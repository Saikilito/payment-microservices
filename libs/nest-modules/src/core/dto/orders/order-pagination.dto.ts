import { OrderStatus } from '@prisma/orders';
import { IsEnum, IsOptional } from 'class-validator';

import { OrderStatusList } from './lib';
import { PaginationDTO } from '../pagination.dto';

export class OrderPaginationDTO extends PaginationDTO {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`,
  })
  status?: OrderStatus;
}
