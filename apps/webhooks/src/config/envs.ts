import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform((port) => parseInt(port, 10)),
  NATS_SERVERS: z.string().transform((servers) => servers.split(',')),
  STRIPE_SECRET: z.string(),
  STRIPE_ENDPOINT_SECRET: z.string(),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),
});

const parseEnv = envSchema.parse(process.env);

export const envs = {
  port: parseEnv.PORT,
  natsServers: parseEnv.NATS_SERVERS,
  stripeSecret: parseEnv.STRIPE_SECRET,
  stripeEndpointSecret: parseEnv.STRIPE_ENDPOINT_SECRET,
  stripeSuccessURL: parseEnv.STRIPE_SUCCESS_URL,
  stripeCancelURL: parseEnv.STRIPE_CANCEL_URL,
};
