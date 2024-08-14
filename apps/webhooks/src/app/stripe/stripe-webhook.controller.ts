import { CONSTANTS } from '@pay-ms/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Get, Post, Request, Response } from '@nestjs/common';

import { StripeSessionDTO } from './dto/create-session.dto';
import { StripeWebhookService } from './stripe-webhook.service';

const { EVENT_MESSAGES } = CONSTANTS;

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly paymentService: StripeWebhookService) {}

  @Get('success')
  success() {
    return this.paymentService.success();
  }

  @Get('cancel')
  cancel() {
    return this.paymentService.cancel();
  }

  @MessagePattern(EVENT_MESSAGES.PAYMENT.SESSION)
  createSession(@Payload() createSession: StripeSessionDTO) {
    return this.paymentService.createSession(createSession);
  }

  @Post('webhook')
  stripeWebhook(@Request() req, @Response() res) {
    return this.paymentService.stripeWebhook(req, res);
  }
}
