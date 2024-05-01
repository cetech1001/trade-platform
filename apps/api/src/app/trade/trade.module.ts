import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TradeEntity} from "./entities/trade.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TradeEntity])],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
