import {
  Get,
  Query,
  Param,
  Delete,
  Inject,
  Controller,
  ParseIntPipe,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { catchError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';
import { Core } from '@pay-ms/nest-modules';

const { EVENT_MESSAGES, KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly natsClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createProductDto: Core.DTO.Products.CreateProductDto) {
    return this.natsClient.send(
      EVENT_MESSAGES.PRODUCT.CREATE,
      createProductDto
    );
  }

  @Get()
  findAll(@Query() paginationDto: Core.DTO.PaginationDTO) {
    return this.natsClient.send(EVENT_MESSAGES.PRODUCT.FIND_ALL, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send(EVENT_MESSAGES.PRODUCT.FIND_ONE, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: Omit<Core.DTO.Products.UpdateProductDto, 'id'>
  ) {
    return this.natsClient.send(EVENT_MESSAGES.PRODUCT.UPDATE, {
      id,
      ...updateProductDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send(EVENT_MESSAGES.PRODUCT.DELETE, { id });
  }
}
