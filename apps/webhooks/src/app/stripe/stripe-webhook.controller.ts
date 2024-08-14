import { Controller, Get, Post, Request, Response } from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';

import { StripeSessionDTO } from './dto/create-session.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

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

  // TODO: Change to Constant
  @MessagePattern('create.payment.session')
  createSession(@Payload() createSession: StripeSessionDTO) {
    return this.paymentService.createSession(createSession);
  }

  @Post('webhook')
  stripeWebhook(@Request() req, @Response() res) {
    return this.paymentService.stripeWebhook(req, res);
  }
}
