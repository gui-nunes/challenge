import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(first_name: string, password: string): Promise<any> {
    const user = await this.usersService.login(first_name);
    const hash = await bcrypt.hash(password, 10);
    const match = await bcrypt.compare(password, hash);
    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.first_name, sub: user.id };
    return {
      acess_token: this.jwtService.sign(payload),
    };
  }
}
