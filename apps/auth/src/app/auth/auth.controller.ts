import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';

import { AuthService } from './auth.service';

const { EVENT_MESSAGES } = CONSTANTS;

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(EVENT_MESSAGES.AUTH.REGISTER)
  register() {
    return 'register';
  }

  @MessagePattern(EVENT_MESSAGES.AUTH.LOGIN)
  login() {
    return 'login';
  }

  @MessagePattern(EVENT_MESSAGES.AUTH.VERIFY)
  verifyToken() {
    return 'verify';
  }
}
