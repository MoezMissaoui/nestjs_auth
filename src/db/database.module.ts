import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../../datasource.config';

@Module({
  imports: [
    // On configure la connexion principale ici une seule fois
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  // On exporte TypeOrmModule pour que les autres modules qui importent DatabaseModule
  // puissent utiliser TypeOrmModule.forFeature()
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
