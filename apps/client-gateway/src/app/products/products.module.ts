import { Module } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';

import { envs } from '../../config';
import { ProductsController } from './products.controller';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [ProductsController],
  imports: [NatsModule],
})
export class ProductsModule {}
