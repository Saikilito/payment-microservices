import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform((port) => parseInt(port, 10)),
  NATS_SERVERS: z.string().transform((servers) => servers.split(',')),
});

const parseEnv = envSchema.parse(process.env);

export const envs = {
  port: parseEnv.PORT,
  natsServers: parseEnv.NATS_SERVERS,
};
