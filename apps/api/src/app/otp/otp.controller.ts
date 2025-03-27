import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';
import { ApiTags } from '@nestjs/swagger';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@ApiTags('OTP Controller')
@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('generate')
  generateOTP(@Body('email') email: string) {
    return this.otpService.generateOTP(email);
  }

  @Post('verify')
  verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
    return this.otpService.verifyOTP(verifyOTPDto);
  }
}
