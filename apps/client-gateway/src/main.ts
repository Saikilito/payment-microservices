import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Core } from '@nms/nest-modules';

import { envs } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('ClientGateway');
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

  app.useGlobalFilters(new Core.Exceptions.RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(
    `🚀 Application is running on: http://localhost:${envs.port}/${globalPrefix}`
  );
}

bootstrap();
