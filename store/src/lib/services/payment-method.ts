import {api} from "./api";
import {
  CreatePaymentMethod,
  Paginated,
  PaginationOptions,
  UpdatePaymentMethod,
  PaymentMethod} from "@coinvant/types";

export class PaymentMethodService {
  static async getPaymentMethods(options?: PaginationOptions): Promise<Paginated<PaymentMethod>> {
    let { data } =  await api.get('/payment-method', { params: options });
    return data;
  }

  static async createPaymentMethod(payload: CreatePaymentMethod): Promise<PaymentMethod> {
    let { data } = await api.post('/payment-method', payload);
    return data;
  }

  static async updatePaymentMethod(id: string, payload: UpdatePaymentMethod): Promise<PaymentMethod> {
    let { data } = await api.patch(`/payment-method/${id}`, payload);
    return data;
  }

  static async deletePaymentMethod(id: string) {
    await api.delete(`/payment-method/${id}`);
  }
}
