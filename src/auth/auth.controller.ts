import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) // Ce guard va déclencher la LocalStrategy
  @Post('login')
  async login(@Request() req) {
    // Si on arrive ici, l'utilisateur a été validé par la stratégie
    // et `req.user` contient les informations de l'utilisateur retournées par `validate()`
    return this.authService.login(req.user);
  }
}