import { api } from './api';
import { VerifyOTP } from '@coinvant/types';

export class OTPService {
  static async sendOTP(email: string) {
    const { data } = await api.post(`/otp/generate`, { email });
    return data;
  }

  static async verifyOTP(payload: VerifyOTP): Promise<boolean> {
    const { data } = await api.post(`/otp/verify`, payload);
    return data;
  }
}
