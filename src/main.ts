import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import cookieparser from 'cookie-parser';
import { createCsrfProtection } from './shared/csrf.config';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);

  const port = configService.get('app.port');
  const mongoose = configService.get('db.mongodb.compassUrl');

  console.log(`server running at ${port}`);
  console.log(`mongoose db connected ${mongoose}`);
  const { doubleCsrfProtection } = createCsrfProtection(
    configService,
    jwtService,
  );

  app.useGlobalPipes(new ValidationPipe());

  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(cookieparser());
  app.use(doubleCsrfProtection);

  const config = new DocumentBuilder()
    .setTitle('We-Swipe API')
    .setDescription('API documentation for We-Swipe social media backend')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accesstoken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}
bootstrap();
