import { Injectable, UnauthorizedException   } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './../../user/user.service'; // Assurez-vous d'avoir un UserService


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneWithCurrentHashedRefreshToken(payload.sub);
    console.log('user:', user.currentHashedRefreshToken);
    
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }
    // req.user sera peuplé avec cet objet
    return { userId: payload.sub, email: payload.email };
  }
}
