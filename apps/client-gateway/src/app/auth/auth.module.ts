import { Module } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';

import { envs } from '../../config';
import { AuthController } from './auth.controller';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [AuthController],
  imports: [NatsModule],
})
export class AuthModule {}
