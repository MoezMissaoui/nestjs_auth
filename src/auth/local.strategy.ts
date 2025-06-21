import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // On dit à Passport que le "username" est le champ "email"
  }

  async validate(email: string, password: string): Promise<any> { // Cette méthode est appelée par Passport pour valider l'utilisateur
    // On utilise le service d'authentification pour valider l'utilisateur
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Identifiants incorrects");
    }
    return user;
  }
}