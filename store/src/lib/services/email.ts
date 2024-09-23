import { api } from './api';
import { SupportEmailPayload } from '@coinvant/types';

export class EmailService {
  static async sendSupportEmail(payload: SupportEmailPayload) {
    const { data } = await api.post('/email/support', payload);
    return data;
  }
}
