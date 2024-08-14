import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';
import { Core } from '@pay-ms/nest-modules';

import { OrderService } from './order.service';

const { TCP_EVENTS } = CONSTANTS;

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: TCP_EVENTS.ORDER.CREATE })
  async create(@Payload() createOrderDto: Core.DTO.Orders.CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);
    const paymentSession = await this.orderService.createPaymentSession(order);

    return {
      order,
      paymentSession,
    };
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

  // TODO: event to const
  @EventPattern('payment.succeeded')
  async payOrder(@Payload() paidOrderDTO: Core.DTO.Orders.PaidOrderDTO) {
    return await this.orderService.changeOrderAsPaid(paidOrderDTO);
  }
}
