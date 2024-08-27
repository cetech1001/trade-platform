import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {TradeAssetModule} from "../trade-asset/trade-asset.module";
import {TransactionModule} from "../transaction/transaction.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([TradeEntity]),
      TradeAssetModule,
      TransactionModule,
      UserModule,
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
