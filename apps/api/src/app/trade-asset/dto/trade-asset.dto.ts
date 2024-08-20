import {PaginationOptionsDto} from "../../../dto/pagination.dto";
import {
	FindCryptoCurrencies,
	FindForexPairs,
	FindStockOptions,
	ForexType,
	StockAssetType,
	StockExchange
} from "@coinvant/types";
import {IsIn, IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class FindStockOptionsDto extends PaginationOptionsDto implements FindStockOptions {
	@IsOptional()
	@IsString()
	@Transform(v => v.value.toLowerCase())
	@ApiProperty({ type: String, required: false })
	symbol: string;

	@IsOptional()
	@IsString()
	@Transform(v => v.value.toLowerCase())
	@ApiProperty({ type: String, required: false })
	name: string;

	@IsOptional()
	@IsIn(Object.values(StockAssetType))
	@ApiProperty({
		type: String,
		required: false,
		enum: StockAssetType,
	})
	assetType: StockAssetType;

	@IsOptional()
	@IsIn(Object.values(StockExchange))
	@ApiProperty({
		type: String,
		required: false,
		enum: StockExchange,
	})
	exchange: StockExchange;
}

export class FindForexPairsDto extends PaginationOptionsDto implements FindForexPairs {
	@IsOptional()
	@IsString()
	@Transform(v => {
		if (v && v.value) {
			return v.value.toLowerCase();
		}
	})
	@ApiProperty({ type: String, required: false })
	base: string;

	@IsOptional()
	@IsString()
	@Transform(v => {
		if (v && v.value) {
			return v.value.toLowerCase();
		}
	})
	@ApiProperty({ type: String, required: false })
	term: string;

	@IsOptional()
	@IsIn(Object.values(StockExchange))
	@ApiProperty({
		type: String,
		required: false,
		enum: StockExchange,
	})
	type: ForexType;
}

export class FindCryptoCurrenciesDto extends PaginationOptionsDto implements FindCryptoCurrencies {
	@IsOptional()
	@IsString()
	@Transform(v => v.value.toLowerCase())
	@ApiProperty({ type: String, required: false })
	name: string;

	@IsOptional()
	@IsString()
	@Transform(v => v.value.toLowerCase())
	@ApiProperty({ type: String, required: false })
	symbol: string;
}
