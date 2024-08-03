import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONSTANTS } from '@nms/shared';

export const makeTCPModule = (
  key: keyof typeof CONSTANTS.KEY_MICROSERVICES_SERVICES,
  host: string,
  port: number
) =>
  ClientsModule.register([
    {
      name: key,
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  ]);
