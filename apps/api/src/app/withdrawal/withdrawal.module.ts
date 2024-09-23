import { Module } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {WithdrawalEntity} from "./entities/withdrawal.entity";
import {TransactionModule} from "../transaction/transaction.module";
import { AccountModule } from '../account/account.module';
import { EmailModule } from '../email/email.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WithdrawalEntity]),
    TransactionModule,
    AccountModule,
    EmailModule,
    PaymentMethodModule,
  ],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
