import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';

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

  //đăng kí sử dụng Interceptors trên toàn ứng dụng
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  await app.listen(configService.get<string>('PORT') ?? 3000);
}
bootstrap();
