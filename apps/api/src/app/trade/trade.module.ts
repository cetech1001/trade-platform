import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {TradeAssetModule} from "../trade-asset/trade-asset.module";
import {TransactionModule} from "../transaction/transaction.module";
import { AccountModule } from '../account/account.module';
import { EmailModule } from '../email/email.module';
import { TradeJob } from './jobs/trade.job';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeEntity]),
    TradeAssetModule,
    TransactionModule,
    AccountModule,
    EmailModule,
    UserModule,
    CommonModule,
  ],
  controllers: [TradeController],
  providers: [TradeService, TradeJob],
})
export class TradeModule {}
