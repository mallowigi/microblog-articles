import { AppModule }          from '@mallowigi/articles/src/app.module';
import { articlesGrpcClient } from '@mallowigi/common';
import { ValidationPipe }     from '@nestjs/common';
import { NestFactory }        from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(articlesGrpcClient);
  app.useGlobalPipes(
    new ValidationPipe({
      transform:            true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.startAllMicroservicesAsync();
  await app.listen(3004);
}

bootstrap();
