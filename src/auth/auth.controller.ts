import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Body,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    console.log('Registering user:', registerDto);
    
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local')) // Ce guard va déclencher la LocalStrategy
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    // Si on arrive ici, l'utilisateur a été validé par la stratégie
    // et `req.user` contient les informations de l'utilisateur retournées par `validate()`
    return this.authService.login(req.user);
  }

  // Cette route est protégée par le JWT Access Token
  @UseGuards(AuthGuard('jwt')) // Ce guard va déclencher la JwtStrategy
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {
    return this.authService.profile(req.user.userId);
  }

  // Cette route est protégée par le JWT Refresh Token
  @UseGuards(AuthGuard('jwt-refresh')) // Ce guard va déclencher la JwtRefreshStrategy
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Request() req) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // Route pour se déconnecter
  // Elle invalide le refresh token de l'utilisateur
  @UseGuards(AuthGuard('jwt')) // Assurez-vous que l'utilisateur est authentifié avant de pouvoir se déconnecter
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req) {
    this.authService.logout(req.user.userId);
    return {
      message: 'Déconnexion réussie'
    };
  }
}
