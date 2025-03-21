import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { TradeStatus, UpdateTrade } from '@coinvant/types';
import {TradeEntity} from "../entities/trade.entity";
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTradeDto extends PartialType(PickType(TradeEntity, ['takeProfit', 'stopLoss'])) implements UpdateTrade {
  @IsOptional()
  @IsIn(Object.values(TradeStatus))
  @ApiProperty({ type: String, enum: TradeStatus, required: false })
  status: TradeStatus;

  @IsOptional()
  @Transform((v) => +v.value)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  currentPrice: number;

  @IsOptional()
  @Transform((v) => +v.value)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  openingPrice: number;

  @IsOptional()
  @Transform((v) => +v.value)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  profitOrLoss: number;

}
