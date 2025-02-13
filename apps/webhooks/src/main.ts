import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';

import { envs } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
      { path: '/health', method: RequestMethod.GET },
      { path: '/ping', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const { makeNatsConfig } = Core.Transports;
  const NatsConfig = makeNatsConfig(envs.natsServers);

  app.connectMicroservice<MicroserviceOptions>(NatsConfig, {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();

  await app.listen(envs.port);
  Logger.log(`![Webhooks Microservice] ::: 🚀🚀🚀 is running`);
}

bootstrap();
