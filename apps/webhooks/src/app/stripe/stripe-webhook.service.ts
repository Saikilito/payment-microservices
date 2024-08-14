import { Stripe } from 'stripe';
import { Request, Response } from 'express';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CONSTANTS } from '@pay-ms/shared';

import { envs } from '../../config';
import { StripeService } from './stripe.service';
import { StripeSessionDTO } from './dto/create-session.dto';

const { KEY_MICROSERVICES_SERVICES } = CONSTANTS;

@Injectable()
export class StripeWebhookService {
  private readonly stripe = this.stripeService.stripe;
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    @Inject(KEY_MICROSERVICES_SERVICES.NATS_SERVICE)
    private readonly natsClient: ClientProxy,
    private readonly stripeService: StripeService
  ) {}

  success() {
    return { ok: true, message: 'Payment Successfully' };
  }

  cancel() {
    return { ok: false, message: 'Payment Cancelled' };
  }

  async createSession(createSession: StripeSessionDTO) {
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: createSession.orderId,
        },
      },
      line_items: createSession.items.map((item) => ({
        price_data: {
          currency: createSession.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: envs.stripeSuccessURL,
      cancel_url: envs.stripeSuccessURL,
    });

    return {
      url: session.url,
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
    };
  }

  async stripeWebhook(req: Request, res: Response) {
    let event: Stripe.Event = null;
    const signature = req.headers['stripe-signature'];

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        envs.stripeEndpointSecret
      );
    } catch (error) {
      console.error(error);
      return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
    }

    if (event.type !== 'charge.succeeded') {
      return res.status(409).send('Event not handled');
    }

    const chargeSucceeded = event.data.object;
    const payload = {
      stripePaymentId: chargeSucceeded.id,
      orderId: chargeSucceeded.metadata.orderId,
      receiptUrl: chargeSucceeded.receipt_url,
    };

    this.logger.log({ payload });

    this.natsClient.emit('payment.succeeded', payload);

    return res.json({ signature });
  }
}
