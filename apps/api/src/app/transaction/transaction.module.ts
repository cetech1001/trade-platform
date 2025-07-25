import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TransactionEntity} from "./entities/transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
