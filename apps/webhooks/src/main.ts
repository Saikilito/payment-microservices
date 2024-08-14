import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { envs } from './config';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Core } from '@pay-ms/nest-modules';

async function bootstrap() {
  const logger = new Logger('WebhooksMicroservice');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

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
  logger.log(`🚀 Webhook Microservice is running on port: ${envs.port}`);
}

bootstrap();
