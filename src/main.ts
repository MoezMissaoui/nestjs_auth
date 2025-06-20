import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {

  log('Starting NestJS auth application...');
  
  const app = await NestFactory.create(AppModule);
  // Ajoute le préfixe '/api' à toutes les routes
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
