import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  // 1. On déclare que ce module utilise l'entité `User`.
  //    Cela rend le `UserRepository` disponible pour l'injection.
  imports: [TypeOrmModule.forFeature([User])],
  
  // 2. On déclare le `UserService` comme un "provider" de ce module.
  providers: [UserService],
  
  // 3. On n'a PAS de `controllers` car ce module n'expose pas de routes HTTP.

  // 4. ON EXPORTE le `UserService`. C'est la clé pour que
  //    le `AuthModule` puisse l'utiliser.
  exports: [UserService],
})
export class UserModule {}
