import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { Core, Modules } from '@pay-ms/nest-modules';

import { envs } from '../../config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

const { PrismaAuthService } = Modules.Prisma;

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaAuthService],
  imports: [
    NatsModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthModule {}
