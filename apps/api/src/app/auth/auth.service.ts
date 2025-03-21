import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@coinvant/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string,
    role = UserRole.user
  ): Promise<User> {
    return this.usersService.findOne({
      email,
      password,
      role,
    });
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({ ...user }),
      user,
    };
  }
}
