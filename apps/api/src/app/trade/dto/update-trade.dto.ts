import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { TradeStatus, UpdateTrade } from '@coinvant/types';
import {TradeEntity} from "../entities/trade.entity";
import { IsIn, IsOptional } from 'class-validator';

export class UpdateTradeDto extends PartialType(PickType(TradeEntity, ['takeProfit', 'stopLoss'])) implements UpdateTrade {
  @IsOptional()
  @IsIn(Object.values(TradeStatus))
  @ApiProperty({ type: String, enum: TradeStatus, required: false })
  status: TradeStatus;
}
