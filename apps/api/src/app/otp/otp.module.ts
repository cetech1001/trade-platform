import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EmailModule, UserModule],
  controllers: [OTPController],
  providers: [OTPService],
})
export class OTPModule {}
