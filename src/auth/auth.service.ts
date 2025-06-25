import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './../user/user.service'; // Assurez-vous d'avoir un UserService
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { RegisterDto } from './DTO/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Enregistre un nouvel utilisateur.
   * Vérifie si l'email est déjà utilisé, hache le mot de passe et crée l'utilisateur.
   * Retourne les tokens d'accès et de rafraîchissement.
   */
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email déjà utilisé');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      // Ajoute d'autres champs ici si besoin
    });
    // Optionnel : login automatique après inscription
    return this.login(user);
  }

  /**
   * Valide si un utilisateur existe et si le mot de passe correspond.
   * Retourne l'utilisateur sans le mot de passe si valide, sinon null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email); // Vous devez créer cette méthode dans UserService
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user; // Exclut le mot de passe du résultat
      return result;
    }
    return null;
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn:
            this.configService.get<string>('ACCESS_TOKEN_TTL') || '15m', // Durée de validité du token d'accès,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn:
            this.configService.get<string>('REFRESH_TOKEN_TTL') || '1y', // Durée de validité du token de rafraîchissement,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    await user.setCurrentHashedRefreshToken(refreshToken);
    // Vous devez avoir une méthode dans UserService pour sauvegarder l'utilisateur
    await this.userService.save(user);
  }

  /**
   * Crée un token JWT pour un utilisateur validé.
   */
  async login(user: User) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return { tokens: tokens, user: user }; // Retourne les tokens et l'utilisateur sans le mot de passe
  }

  /**
   * Vérifie si le token de rafraîchissement est valide.
   * Si oui, retourne l'utilisateur associé.
   */
  async logout(userId: number) {
    const user = await this.userService.findOneById(userId);
    user.currentHashedRefreshToken = null;
    await this.userService.save(user);
  }

  /**
   * Rafraîchit les tokens d'accès et de rafraîchissement.
   * Vérifie si le token de rafraîchissement est valide avant de générer de nouveaux tokens.
   */
  async refreshTokens(userId: number, refreshToken: string) {
    const user =
      await this.userService.findOneWithCurrentHashedRefreshToken(userId);
    if (!user || !user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Accès refusé');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return { tokens: tokens };
  }

  /**
   * Récupère le profil de l'utilisateur par son ID.
   * Cette méthode est utilisée pour obtenir les informations de l'utilisateur connecté.
   */
  async profile(userId: number) {
    return await this.userService.findOneById(userId);
  }
}
