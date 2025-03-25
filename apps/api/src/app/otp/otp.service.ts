import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { UserRole } from '@coinvant/types';
import { environment } from '../../environments/environment';

interface OTPData {
  otp: string;
  expiresAt: number;
}

@Injectable()
export class OTPService {
  private otpStore: Map<string, OTPData> = new Map();
  private rateLimitStore: Map<string, number> = new Map();

  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService) {
    setInterval(() => {
      const now = Date.now();
      for (const [email, data] of this.otpStore.entries()) {
        if (data.expiresAt < now) {
          this.otpStore.delete(email);
        }
      }
      for (const [email, timestamp] of this.rateLimitStore.entries()) {
        if (now - timestamp > 10 * 60 * 1000) {
          this.rateLimitStore.delete(email);
        }
      }
    }, 60 * 1000);
  }

  async generateOTP(email: string) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const now = Date.now();
    const lastRequestTime = this.rateLimitStore.get(email);
    if (lastRequestTime && now - lastRequestTime < 60000) {
      throw new BadRequestException('Too many OTP requests. Please wait before trying again.');
    }
    this.rateLimitStore.set(email, now);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStore.set(email, { otp, expiresAt });
    return this.emailService.sendMail(email, 'One Time Pin', './user/otp', {
      name: user.name,
      otp,
    });
  }

  async generateResetLink(email: string) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const now = Date.now();
    const lastRequestTime = this.rateLimitStore.get(email);
    if (lastRequestTime && now - lastRequestTime < 60000) {
      throw new BadRequestException('Too many reset requests. Please wait before trying again.');
    }
    this.rateLimitStore.set(email, now);

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.otpStore.set(email, { otp, expiresAt });
    return this.emailService.sendMail(email, 'Reset Password', './reset-password', {
      name: user.name,
      link: `${user.role === UserRole.admin ? environment.adminUrl : environment.webUrl}/reset/password?token=${otp}&email=${user.email}`,
    });
  }

  verifyOTP(verifyOTPDto: VerifyOTPDto): boolean {
    const otpData = this.otpStore.get(verifyOTPDto.email);

    if (!otpData) {
      throw new BadRequestException('OTP not found or expired');
    }

    if (otpData.expiresAt < Date.now()) {
      this.otpStore.delete(verifyOTPDto.email);
      throw new BadRequestException('OTP has expired');
    }

    if (otpData.otp !== verifyOTPDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    this.otpStore.delete(verifyOTPDto.email);
    return true;
  }
}
