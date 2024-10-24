import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';
import { Core } from '@pay-ms/nest-modules';

import { AuthService } from './auth.service';

const { EVENT_MESSAGES } = CONSTANTS;

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: EVENT_MESSAGES.AUTH.REGISTER })
  registerUser(@Payload() registerDto: Core.DTO.Auth.RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.AUTH.LOGIN })
  loginUser(@Payload() loginDto: Core.DTO.Auth.LoginDTO) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: EVENT_MESSAGES.AUTH.VERIFY_TOKEN })
  verifyToken(@Payload('token') token: string) {
    return this.authService.verifyToken(token);
  }
}
