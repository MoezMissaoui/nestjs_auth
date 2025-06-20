import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Assurez-vous d'avoir un UserService
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  /**
   * Valide si un utilisateur existe et si le mot de passe correspond.
   * Retourne l'utilisateur sans le mot de passe si valide, sinon null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email); // Vous devez créer cette méthode dans UserService
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user; // Exclut le mot de passe du résultat
      return result;
    }
    return null;
  }

  /**
   * Crée un token JWT pour un utilisateur validé.
   */
  async login(user: any) {
    console.log(user);
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }
}