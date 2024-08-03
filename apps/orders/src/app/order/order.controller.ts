import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from '@nms/shared';
import { Core } from '@nms/nest-modules';

import { OrderService } from './order.service';

const { TCP_EVENTS } = CONSTANTS;

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.CREATE })
  create(@Payload() createOrderDto: Core.DTO.Orders.CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.FIND_ALL })
  findAll(@Payload() paginationDTO: Core.DTO.Orders.OrderPaginationDTO) {
    return this.orderService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.FIND_ALL })
  findByStatus(@Payload() paginationDTO: Core.DTO.Orders.OrderPaginationDTO) {
    return this.orderService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.FIND_ONE })
  findOne(@Payload('id') id: string) {
    return this.orderService.findOne(id);
  }

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.UPDATE_STATUS })
  updateStatus(@Payload() updateOrderDto: Core.DTO.Orders.UpdateStatusDTO) {
    return this.orderService.updateStatus(
      updateOrderDto.id,
      updateOrderDto.status
    );
  }
}
