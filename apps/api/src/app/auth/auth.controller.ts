import { Controller, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LocalAuthGuard} from "../../guards";
import {ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import { LoginDto, ResetPasswordDto, SendResetTokenDto } from './dto/login.dto';
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

  @Post('send-reset-link')
  async sendResetLink(@Body() resetDto: SendResetTokenDto) {
    return this.otpService.generateResetLink(resetDto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    const { password, ...verifyDto } = resetDto;
    const isValid = this.otpService.verifyOTP(verifyDto);
    if (isValid) {
      const user = await this.userService.findOne({ email: verifyDto.email });
      if (user) {
        return this.userService.update(user.id, { password });
      }
      throw new BadRequestException("User not found");
    }
  }
}
