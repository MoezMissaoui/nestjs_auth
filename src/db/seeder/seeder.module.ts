import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { DatabaseModule } from '../database.module';

@Module({
  // Nous importons TypeOrmModule.forFeature pour pouvoir injecter le Repository
  // et AppModule pour avoir accès à la configuration de la base de données
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [SeederService],
})
export class SeederModule {}