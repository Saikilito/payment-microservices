import { firstValueFrom } from 'rxjs';
import { Product } from '@prisma/products';
import { Prisma, OrderStatus } from '@prisma/orders';
import { DefaultArgs } from '@prisma/orders/runtime/library';
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';
import { Core, Modules } from '@pay-ms/nest-modules';

import { OrderWithProduct } from './models/index.type';

const { PrismaOrdersService } = Modules.Prisma;
type PrismaOrdersService = Modules.Prisma.PrismaOrdersService;

const { EVENT_MESSAGES, KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly repository: Prisma.OrderDelegate<DefaultArgs>;

  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly natsClient: ClientProxy,
    private readonly prismaService: PrismaOrdersService
  ) {
    this.repository = prismaService.order;
  }

  async create(createOrderDto: Core.DTO.Orders.CreateOrderDto) {
    try {
      const productIds = createOrderDto.items.map((item) => item.productId);
      const products: Product[] = await firstValueFrom(
        this.natsClient.send(EVENT_MESSAGES.PRODUCT.VALIDATE, {
          ids: productIds,
        })
      );

      if (!products) {
        throw new RpcException('Products not found');
      }

      const totalAmount = createOrderDto.items.reduce((acc, curr) => {
        const product = products.find(
          (product) => product.id === curr.productId
        );
        return acc + product.price * curr.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);

      const order = await this.repository.create({
        data: {
          totalAmount,
          totalItems,
          orderItem: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                price: products.find((product) => product.id === item.productId)
                  .price,
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
        include: {
          orderItem: {
            select: {
              price: true,
              productId: true,
              quantity: true,
            },
          },
        },
      });

      return {
        ...order,
        orderItem: order.orderItem.map((item) => ({
          ...item,
          name: products.find((product) => product.id === item.productId).name,
        })),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll(paginationDTO: Core.DTO.Orders.OrderPaginationDTO) {
    const { page, limit } = paginationDTO;

    const totalCount = await this.repository.count({
      where: {
        status: paginationDTO.status,
      },
    });

    const data = await this.repository.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        status: paginationDTO.status,
      },
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

  async findOne(id: string) {
    const data = await this.repository.findFirst({
      where: {
        id,
      },
      include: {
        orderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });

    const productIds = data.orderItem.map((item) => item.productId);
    const products: Product[] = await firstValueFrom(
      this.natsClient.send(EVENT_MESSAGES.PRODUCT.VALIDATE, { ids: productIds })
    );

    if (!data) {
      throw new RpcException({
        message: `Order with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return {
      ...data,
      orderItem: data.orderItem.map((item) => ({
        ...item,
        name: products.find((product) => product.id === item.productId).name,
      })),
    };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.repository.update({
      where: { id },
      data: { status },
    });
  }

  async createPaymentSession(order: OrderWithProduct) {
    const paymentSession = await firstValueFrom(
      this.natsClient.send('create.payment.session', {
        orderId: order.id,
        currency: 'usd',
        items: order.orderItem.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    );
    return paymentSession;
  }

  async changeOrderAsPaid(paidOrderDTO: Core.DTO.Orders.PaidOrderDTO) {
    this.logger.log('Order PAID');
    this.logger.log(paidOrderDTO);

    return await this.repository.update({
      where: { id: paidOrderDTO.orderId },
      data: {
        status: OrderStatus.PAID,
        paid: true,
        paidAt: new Date(),
        stripeChargeId: paidOrderDTO.stripePaymentId,

        OrderReceipt: {
          create: {
            receiptUrl: paidOrderDTO.receiptUrl,
          },
        },
      },
    });
  }
}
