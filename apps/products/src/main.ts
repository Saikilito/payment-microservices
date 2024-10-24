import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';

import { Core } from '@pay-ms/nest-modules';

import { envs } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('ProductMicroservice');

  const { makeNatsConfig } = Core.Transports;
  const NatsConfig = makeNatsConfig(envs.natsServers);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    NatsConfig
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen();
  Logger.log(`[Product Microservice] ::: 🚀🚀🚀 is running`);
}

bootstrap();
