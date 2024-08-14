import { Module } from '@nestjs/common';

import { Core, Modules } from '@pay-ms/nest-modules';

import { envs } from '../../config';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

const { PrismaProductsService } = Modules.Prisma;

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaProductsService],
  imports: [NatsModule],
})
export class ProductModule {}
