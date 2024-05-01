import { Module } from '@nestjs/common';
import { TradeAssetService } from './trade-asset.service';
import { TradeAssetController } from './trade-asset.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TradeAssetEntity} from "./entities/trade-asset.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TradeAssetEntity])],
  controllers: [TradeAssetController],
  providers: [TradeAssetService],
})
export class TradeAssetModule {}
