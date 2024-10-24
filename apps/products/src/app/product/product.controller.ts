import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseIntPipe } from '@nestjs/common';

import { CONSTANTS } from '@pay-ms/shared';
import { Core } from '@pay-ms/nest-modules';

import { ProductService } from './product.service';

type PaginationDTO = Core.DTO.PaginationDTO;

const { EVENT_MESSAGES } = CONSTANTS;

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.CREATE })
  create(@Payload() createProductDto: Core.DTO.Products.CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.FIND_ALL })
  findAll(@Payload() paginationDTO: PaginationDTO) {
    return this.productService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.FIND_ONE })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.UPDATE })
  update(@Payload() updateProductDto: Core.DTO.Products.UpdateProductDto) {
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.DELETE })
  remove(@Payload('id') id: string) {
    return this.productService.remove(+id);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.PRODUCT.VALIDATE })
  validateProduct(@Payload('ids') ids: number[]) {
    return this.productService.validateProducts(ids);
  }
}
