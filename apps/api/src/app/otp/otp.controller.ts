import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OTPService } from './otp.service';
import { CurrentUser, Roles } from '../../decorators';
import { User, UserRole } from '@coinvant/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards';
import { RolesGuard } from '../../guards/roles.guard';

@ApiTags('OTP Controller')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Roles(UserRole.user)
  @Post('generate')
  generateOTP(@CurrentUser() user: User) {
    return this.otpService.generateOTP(user);
  }

  @Roles(UserRole.user)
  @Post('verify')
  verifyOTP(@Body('otp') otp: string, @CurrentUser() user: User) {
    return this.otpService.verifyOTP(otp, user);
  }
}
