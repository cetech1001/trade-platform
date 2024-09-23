import { api } from './api';

export class OTPService {
  static async sendOTP() {
    const { data } = await api.post('/otp/generate');
    return data;
  }

  static async verifyOTP(otp: string): Promise<boolean> {
    const { data } = await api.post('/otp/verify', { otp });
    return data;
  }
}
