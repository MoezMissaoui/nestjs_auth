import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import {
  ValidationPipe,
  UnprocessableEntityException,
  RequestMethod,
} from '@nestjs/common';

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
