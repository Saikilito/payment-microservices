import { Prisma } from '@prisma/products';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DefaultArgs } from '@prisma/products/runtime/library';

import { Core, Modules } from '@pay-ms/nest-modules';

type PaginationDTO = Core.DTO.PaginationDTO;

const { PrismaProductsService } = Modules.Prisma;
type PrismaProductsService = Modules.Prisma.PrismaProductsService;

@Injectable()
export class ProductService {
  private readonly repository: Prisma.ProductDelegate<DefaultArgs>;

  constructor(private readonly prismaService: PrismaProductsService) {
    this.repository = prismaService.product;
  }

  async create(createProductDto: Core.DTO.Products.CreateProductDto) {
    return this.repository.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { page, limit } = paginationDTO;

    const where = { available: true };
    const totalCount = await this.repository.count({
      where,
    });

    const data = await this.repository.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where,
    });

    return {
      data,
      meta: {
        page,
        total: totalCount,
        lastPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findOne(id: number) {
    const data = await this.repository.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!data) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return data;
  }

  async update(
    id: number,
    updateProductDto: Core.DTO.Products.UpdateProductDto
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.repository.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.repository.delete({
      where: { id },
    });
  }

  async validateProducts(ids: number[]) {
    const uniqueIds = Array.from(new Set<number>(ids));
    const products = await this.repository.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return products;
  }
}
