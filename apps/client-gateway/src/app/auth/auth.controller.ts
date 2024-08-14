import { Get, Post, Inject, Controller } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';

const { EVENT_MESSAGES, KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly natsClient: ClientProxy
  ) {}

  @Post('register')
  register() {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.REGISTER, {});
  }

  @Post('login')
  login() {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.LOGIN, {});
  }

  @Get('verify')
  verifyUser() {
    return this.natsClient.send(EVENT_MESSAGES.AUTH.VERIFY, {});
  }
}
