import { Controller, Request, Post } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  @Post('auth/login')
  @Unprotected()
  async login(@Request() req) {
    return req.body;
  }
}
