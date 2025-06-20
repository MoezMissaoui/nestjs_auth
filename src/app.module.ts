import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../datasource.config'; // <-- 1. IMPORTEZ la config

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions), // <-- 2. Utilisez la config ici
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
