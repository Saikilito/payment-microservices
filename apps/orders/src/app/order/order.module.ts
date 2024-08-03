import { Module } from '@nestjs/common';

import { Core, Modules } from '@nms/nest-modules';

import { envs } from '../../config';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

const { PrismaOrdersService } = Modules.Prisma;

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaOrdersService],
  imports: [NatsModule],
})
export class OrderModule {}
