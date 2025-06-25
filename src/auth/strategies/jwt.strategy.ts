import { Injectable, UnauthorizedException   } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './../../user/user.service'; // Assurez-vous d'avoir un UserService


@Injectable() // La classe JwtStrategy est injectable, ce qui permet à NestJS de l'utiliser dans d'autres parties de l'application
// PassportStrategy est une classe abstraite qui permet de créer des stratégies personnalisées pour Passport.js
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { 
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrait le JWT du header Authorization sous la forme "Bearer <token>"
      // Si vous utilisez un cookie, vous pouvez utiliser ExtractJwt.fromExtractors([...])
      ignoreExpiration: false, // Ne pas ignorer l'expiration du token
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'), // Clé secrète pour vérifier la signature du JWT
    });
  }

  async validate(payload: any) { // La méthode validate est appelée par Passport.js pour valider le JWT
    // Le payload contient les données du JWT, comme l'ID de l'utilisateur et son email
    
    // Ici, on va vérifier si l'utilisateur existe dans la base de données et s'il a un token de rafraîchissement valide
    // On utilise le UserService pour trouver l'utilisateur par son ID (payload.sub)
    const user = await this.userService.findOneWithCurrentHashedRefreshToken(payload.sub);
    
    // Vérifie si l'utilisateur existe et s'il a un token de rafraîchissement valide
    // Si l'utilisateur n'existe pas ou n'a pas de token de rafraîchissement valide, on lève une exception UnauthorizedException
    // Cela empêchera l'accès aux routes protégées par ce guard
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }
    // req.user sera peuplé avec cet objet
    return { userId: payload.sub, email: payload.email };
  }
}
