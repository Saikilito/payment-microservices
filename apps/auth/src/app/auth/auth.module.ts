import { Module } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';
import { envs } from '../../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [NatsModule],
})
export class AuthModule {}
