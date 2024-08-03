import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseIntPipe } from '@nestjs/common';

import { CONSTANTS } from '@nms/shared';
import { Core } from '@nms/nest-modules';

import { ProductService } from './product.service';

type PaginationDTO = Core.DTO.PaginationDTO;

const { TCP_EVENTS } = CONSTANTS;

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.CREATE })
  create(@Payload() createProductDto: Core.DTO.Products.CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.FIND_ALL })
  findAll(@Payload() paginationDTO: PaginationDTO) {
    return this.productService.findAll(paginationDTO);
  }

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.FIND_ONE })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.UPDATE })
  update(@Payload() updateProductDto: Core.DTO.Products.UpdateProductDto) {
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.DELETE })
  remove(@Payload('id') id: string) {
    return this.productService.remove(+id);
  }

  @MessagePattern({ cmd: TCP_EVENTS.PRODUCT.VALIDATE })
  validateProduct(@Payload('ids') ids: number[]) {
    return this.productService.validateProducts(ids);
  }
}
