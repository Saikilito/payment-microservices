import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  Controller,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { catchError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';
import { Core } from '@pay-ms/nest-modules';

type PaginationDTO = Core.DTO.PaginationDTO;

const { EVENT_MESSAGES, KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly orderClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: Core.DTO.Orders.CreateOrderDto) {
    return this.orderClient
      .send(EVENT_MESSAGES.ORDER.CREATE, createOrderDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Get()
  findAll(@Query() paginationDto: Core.DTO.Orders.OrderPaginationDTO) {
    return this.orderClient
      .send(EVENT_MESSAGES.ORDER.FIND_ALL, paginationDto)
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderClient.send(EVENT_MESSAGES.ORDER.FIND_ONE, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get('status/:status')
  findByStatus(
    @Param('status') status: Core.DTO.Orders.StatusDTO,
    @Query() paginationDTO: PaginationDTO
  ) {
    return this.orderClient
      .send(EVENT_MESSAGES.ORDER.FIND_ALL, { status, ...paginationDTO })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: Core.DTO.Orders.StatusDTO
  ) {
    return this.orderClient
      .send(EVENT_MESSAGES.ORDER.UPDATE_STATUS, { id, status })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }
}
