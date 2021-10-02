import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // setting view template engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const logger = app.get<Logger>(Logger);
  logger.setContext(`Bootstrap`);

  // dto-validation 적용 (whitelist,forbidNonWhitelisted 옵션 추가 -> 정의되지 않은 property 전달 시 exception 발생)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = configService.get('APP_PORT') || 8080;

  await app.listen(port).then(() => {
    logger.log(`Server is listening on port : ${port}`);
  });
}
bootstrap();
