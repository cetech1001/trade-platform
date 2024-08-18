import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DepositEntity} from "./entities/deposit.entity";
import {PaymentMethodModule} from "../payment-method/payment-method.module";
import {TransactionModule} from "../transaction/transaction.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([DepositEntity]),
      PaymentMethodModule,
      TransactionModule,
      UserModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
