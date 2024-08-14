import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { envs } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('AuthMicroservice');
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(envs.port);
  logger.log(`🚀 Auth Microservice is running on port ${envs.port}`);
}

bootstrap();
