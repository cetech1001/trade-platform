import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DepositEntity} from "./entities/deposit.entity";
import {PaymentMethodModule} from "../payment-method/payment-method.module";
import {TransactionModule} from "../transaction/transaction.module";
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([DepositEntity]),
      PaymentMethodModule,
      TransactionModule,
      AccountModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
