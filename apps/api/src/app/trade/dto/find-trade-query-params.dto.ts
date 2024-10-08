import {FindTradesQueryParams, TradeAssetType, TradeStatus} from "@coinvant/types";
import {PaginationOptionsDto} from "../../../dto/pagination.dto";
import {IsIn, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FindTradeQueryParamsDto extends PaginationOptionsDto implements FindTradesQueryParams {
	@IsOptional()
	@IsIn(Object.values(TradeAssetType))
	@ApiProperty({ type: String, required: true, enum: TradeAssetType })
	assetType: TradeAssetType;

	@IsOptional()
	@IsIn(Object.values(TradeStatus))
	@ApiProperty({ type: String, required: false, enum: TradeStatus })
	status: TradeStatus;
}
