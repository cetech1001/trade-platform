import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { User } from '@coinvant/types';

interface OTPData {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class OTPService {
  private otpStore: Map<string, OTPData> = new Map();

  constructor(private readonly emailService: EmailService) {}

  generateOTP(user: User) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStore.set(user.email, { otp, expiresAt });
    return this.emailService.sendMail(user.email, 'One Time Pin', './user/otp', {
      name: user.name,
      otp,
    });
  }

  verifyOTP(otp: string, user: User): boolean {
    const otpData = this.otpStore.get(user.email);

    if (!otpData) {
      throw new BadRequestException('OTP not found or expired');
    }

    if (otpData.expiresAt < Date.now()) {
      this.otpStore.delete(user.email);
      throw new BadRequestException('OTP has expired');
    }

    if (otpData.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    this.otpStore.delete(user.email);
    return true;
  }
}
