import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PaymentMethodEntity} from "./entities/payment-method.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
