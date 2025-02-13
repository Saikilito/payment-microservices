import { Module } from '@nestjs/common';

import { API } from '@pay-ms/nest-modules';

import { StripeWebhookModule } from './stripe/stripe-webhook.module';

@Module({
  imports: [API.HealthModule, StripeWebhookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
