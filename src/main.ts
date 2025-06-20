import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';

async function bootstrap() {
  log('Starting NestJS application...');
  log(`Environment: ${process.env.DB_HOST}`);
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
