import { NestFactory } from '@nestjs/core';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';

import { Core } from '@pay-ms/nest-modules';

import { envs } from './config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.useGlobalFilters(new Core.Exceptions.RpcCustomExceptionFilter());

  await app.listen(envs.port);

  Logger.log(
    `![Client Gateway] ::: 🚀🚀🚀 is running on: http://localhost:${envs.port}/${globalPrefix}`
  );
}

bootstrap();
