import { Module } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {WithdrawalEntity} from "./entities/withdrawal.entity";
import {TransactionService} from "../transaction/transaction.service";
import {TransactionModule} from "../transaction/transaction.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([WithdrawalEntity]),
      TransactionModule,
  ],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
