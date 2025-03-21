import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User, UserRole } from '@coinvant/types';
import { environment } from '../../../environments/environment';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(@Req() request: Request): Promise<User> {
    const origin = request['origin'];
    const isAdmin = origin === environment.adminUrl;
    const user = await this.authService
      .validateUser(request.body['email'],
        request.body['password'],
        isAdmin ? UserRole.admin : UserRole.user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
