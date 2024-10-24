import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NATS_SERVERS: z.string().transform((servers) => servers.split(',')),
  JWT_SECRET: z.string(),
});

const parseEnv = envSchema.parse(process.env);

export const envs = {
  natsServers: parseEnv.NATS_SERVERS,
  jwtSecret: parseEnv.JWT_SECRET,
};
