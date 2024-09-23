import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [OTPController],
  providers: [OTPService],
})
export class OTPModule {}
