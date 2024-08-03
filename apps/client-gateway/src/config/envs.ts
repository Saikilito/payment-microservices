import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform((port) => parseInt(port, 10)),
  PRODUCT_MICROSERVICE_HOST: z.string().optional().nullable(),
  PRODUCT_MICROSERVICE_PORT: z
    .string()
    .transform((port) => parseInt(port, 10))
    .optional()
    .nullable(),
  ORDER_MICROSERVICE_HOST: z.string().optional().nullable(),
  ORDER_MICROSERVICE_PORT: z
    .string()
    .transform((port) => parseInt(port, 10))
    .optional()
    .nullable(),
  NATS_SERVERS: z.string().transform((servers) => servers.split(',')),
});

const parseEnv = envSchema.parse(process.env);

export const envs = {
  port: parseEnv.PORT,
  productMicroserviceHost: parseEnv.PRODUCT_MICROSERVICE_HOST,
  productMicroservicePort: parseEnv.PRODUCT_MICROSERVICE_PORT,
  orderMicroserviceHost: parseEnv.ORDER_MICROSERVICE_HOST,
  orderMicroservicePort: parseEnv.ORDER_MICROSERVICE_PORT,
  natsServers: parseEnv.NATS_SERVERS,
};
