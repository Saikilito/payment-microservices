import {
  ClientProviderOptions,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

import { CONSTANTS } from '@nms/shared';

export const makeNatsConfig = (natsServers: string[]): MicroserviceOptions => ({
  transport: Transport.NATS,
  options: {
    servers: natsServers,
  },
});

export const makeNatsModule = (natsServers: string[]) => {
  const NatsConfig = makeNatsConfig(natsServers) as ClientProviderOptions;

  return ClientsModule.register([
    {
      ...NatsConfig,
      name: CONSTANTS.KEY_MICROSERVICES_SERVICES.NATS_SERVICE,
    },
  ]);
};
