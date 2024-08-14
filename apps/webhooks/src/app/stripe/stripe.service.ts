import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

import { envs } from '../../config';

@Injectable()
export class StripeService {
  public readonly stripe = new Stripe(envs.stripeSecret);
}
