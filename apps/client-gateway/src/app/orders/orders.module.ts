import { Module } from '@nestjs/common';

import { Core } from '@nms/nest-modules';
import { OrdersController } from './orders.controller';
import { envs } from '../../config';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [OrdersController],
  imports: [NatsModule],
})
export class OrdersModule {}
