import { ClientProxy } from '@nestjs/microservices';
import { Get, Post, Inject, Controller, Body } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';
import { CONSTANTS } from '@pay-ms/shared';

const { EVENT_MESSAGES, KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly natsClient: ClientProxy
  ) {}

  @Post('register')
  register(@Body() registerDTO: Core.DTO.Auth.RegisterDTO) {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.REGISTER, registerDTO);
  }

  @Post('login')
  login(@Body() loginDTO: Core.DTO.Auth.LoginDTO) {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.LOGIN, loginDTO);
  }

  @Get('verify')
  verifyUser() {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.LOGIN, {});
  }
}
