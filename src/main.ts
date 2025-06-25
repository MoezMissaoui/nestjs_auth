import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import {
  ValidationPipe,
  UnprocessableEntityException,
  RequestMethod,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  log('Starting NestJS auth application...');

  const app = await NestFactory.create(AppModule);
  // Ajoute le préfixe '/api' à toutes les routes
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.ALL }, // root path
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforme les payloads selon les types du DTO
      whitelist: true,
      exceptionFactory: (errors) => {
        // Transforme les erreurs en format désiré
        const formattedErrors = {};
        errors.forEach((err) => {
          formattedErrors[err.property] = err.constraints
            ? Object.values(err.constraints)
            : [];
        });
        return new UnprocessableEntityException({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: formattedErrors,
        });
      },
    }),
  );

  // Enhanced Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Nest Auth API')
    .setDescription('Comprehensive API documentation for the NestJS Auth service.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth', // This name can be referenced in @ApiBearerAuth()
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
