import { NestFactory } from '@nestjs/core';
import { SeederModule } from './db/seeder/seeder.module';
import { SeederService } from './db/seeder/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seeder');
  // Crée un contexte d'application standalone
  const app = await NestFactory.createApplicationContext(SeederModule);

  logger.log('Seeding application context created.');

  const seeder = app.get(SeederService);

  try {
    await seeder.seed();
    logger.log('Seeding finished successfully.');
  } catch (error) {
    logger.error('Seeding failed!');
    logger.error(error);
  } finally {
    await app.close();
  }
}

bootstrap();
