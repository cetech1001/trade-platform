import {ApiProperty, PickType} from "@nestjs/swagger";
import {TradeEntity} from "../entities/trade.entity";
import {CreateTrade} from "@coinvant/types";
import {IsNotEmpty, IsString} from "class-validator";

export class CreateTradeDto extends PickType(TradeEntity, [
    'bidAmount',
    'targetPrice',
    'multiplier',
    'executeAt',
    'assetType'
]) implements CreateTrade {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  assetID: string;
}
