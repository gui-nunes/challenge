import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(first_name: string, pass: string): Promise<any> {
    const user = await this.userService.login(first_name);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { first_name: user.first_name, sub: user.uid };
    return {
      acess_token: this.jwtService.sign(payload),
    };
  }
}
