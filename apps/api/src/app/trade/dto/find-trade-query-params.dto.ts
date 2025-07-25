import { FindTradeAmountsQueryParams, FindTradesQueryParams, TradeAssetType, TradeStatus } from '@coinvant/types';
import {PaginationOptionsDto} from "../../common/dto/pagination.dto";
import { IsIn, IsOptional, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class FindTradeQueryParamsDto extends PaginationOptionsDto implements FindTradesQueryParams {
	@IsOptional()
	@IsIn(Object.values(TradeAssetType))
	@ApiProperty({ type: String, required: false, enum: TradeAssetType })
	assetType: TradeAssetType;

	@IsOptional()
	@IsIn(Object.values(TradeStatus))
	@ApiProperty({ type: String, required: false, enum: TradeStatus })
	status: TradeStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  accountID: string;
}

export class FindTradeAmountsQueryParamsDto implements FindTradeAmountsQueryParams {
  @IsIn(Object.values(TradeAssetType))
  @ApiProperty({ type: String, required: true, enum: TradeAssetType })
  assetType: TradeAssetType;

  @IsIn(Object.values(TradeStatus))
  @ApiProperty({ type: String, required: true, enum: TradeStatus })
  status: TradeStatus;

  @IsString()
  @ApiProperty({ type: String, required: true })
  accountID: string;
}
