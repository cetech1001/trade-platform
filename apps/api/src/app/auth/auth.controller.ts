import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalAuthGuard} from "../../guards";
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import { LoginDto, SendResetTokenDto } from './dto/login.dto';
import {User, UserRole} from "@coinvant/types";
import {CurrentUser} from "../../decorators";
import { OTPService } from '../otp/otp.service';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private otpService: OTPService,
    private userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Body() _: LoginDto, @CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create({
      ...createUserDto,
      role: UserRole.user,
    });
    return await this.authService.login(user);
  }

  @Post('reset-password')
  async sendResetLink(@Body() resetDto: SendResetTokenDto) {
    return this.otpService.generateResetLink(resetDto.email);
  }
}
