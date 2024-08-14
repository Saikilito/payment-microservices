import { Module } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';

import { envs } from '../../config';
import { StripeService } from './stripe.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookController } from './stripe-webhook.controller';

const { makeNatsModule } = Core.Transports;
const NatsModule = makeNatsModule(envs.natsServers);

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, StripeService],
  imports: [NatsModule],
})
export class StripeWebhookModule {}
