import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './core/auth/local-auth.guard';
import { AuthService } from './core/auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
