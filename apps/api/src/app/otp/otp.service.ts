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
  private rateLimitStore: Map<string, number> = new Map();

  constructor(private readonly emailService: EmailService) {
    setInterval(() => {
      const now = Date.now();
      // Cleanup expired OTPs
      for (const [email, data] of this.otpStore.entries()) {
        if (data.expiresAt < now) {
          this.otpStore.delete(email);
        }
      }
      // Cleanup old rate limit entries (older than 10 minutes)
      for (const [email, timestamp] of this.rateLimitStore.entries()) {
        if (now - timestamp > 10 * 60 * 1000) {
          this.rateLimitStore.delete(email);
        }
      }
    }, 60 * 1000);
  }

  generateOTP(user: User) {
    const now = Date.now();
    const lastRequestTime = this.rateLimitStore.get(user.email);
    if (lastRequestTime && now - lastRequestTime < 60000) {
      throw new BadRequestException('Too many OTP requests. Please wait before trying again.');
    }
    this.rateLimitStore.set(user.email, now);

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
