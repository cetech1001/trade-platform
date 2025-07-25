import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import {PaginationOptions} from "@coinvant/types";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {paginate, Pagination} from "nestjs-typeorm-paginate";
import {PaymentMethodEntity} from "./entities/payment-method.entity";

@Injectable()
export class PaymentMethodService {
  constructor(@InjectRepository(PaymentMethodEntity) private readonly paymentMethodRepo: Repository<PaymentMethodEntity>) {
  }

  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodRepo.save(createPaymentMethodDto);
  }

  find() {
    return this.paymentMethodRepo.find();
  }

  findAll(options: PaginationOptions): Promise<Pagination<PaymentMethodEntity>> {
    return paginate(this.paymentMethodRepo, options);
  }

  findOne(id: string) {
    return this.paymentMethodRepo.findOne({ where: { id } });
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    await this.paymentMethodRepo.update(id, updatePaymentMethodDto);
    return await this.findOne(id);
  }

  remove(id: string) {
    return this.paymentMethodRepo.delete(id);
  }
}
