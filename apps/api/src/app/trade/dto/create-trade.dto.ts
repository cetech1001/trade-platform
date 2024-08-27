import {ApiProperty, PickType} from "@nestjs/swagger";
import {TradeEntity} from "../entities/trade.entity";
import {CreateTrade} from "@coinvant/types";
import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreateTradeDto extends PickType(TradeEntity, [
	'bidAmount',
	'leverage',
	'assetType',
	'takeProfit',
	'stopLoss',
	'executeAt',
	'isShort'
]) implements CreateTrade {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	assetID: string;

	@IsOptional()
	@Transform(v => +v.value)
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: false })
	openingPrice: number;
}
