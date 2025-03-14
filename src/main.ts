import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService); 

  app.useStaticAssets(join(__dirname, '..', 'public')); //js, css
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //view html
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());

  //config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
    }
  );
  await app.listen(configService.get<string>('PORT') ?? 3000);
}
bootstrap();
