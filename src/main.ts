import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Billing Microservice API')
    .setDescription(
      'Microservicio de facturación: administra el catálogo de planes y las suscripciones de cada tenant, incluyendo sus límites de almacenamiento y ejecuciones.',
    )
    .setVersion('1.0')
    .addTag('Plans', 'Gestión del catálogo de planes')
    .addTag('Subscriptions', 'Gestión de las suscripciones de los tenants')
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
