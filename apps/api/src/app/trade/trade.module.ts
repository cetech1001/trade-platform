import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";
import {TradeAssetModule} from "../trade-asset/trade-asset.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([TradeEntity]),
      TradeAssetModule,
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
