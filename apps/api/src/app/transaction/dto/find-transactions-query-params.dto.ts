import {PaginationOptionsDto} from "../../../dto/pagination.dto";
import { IsIn, IsOptional, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {
	FindTransactionsQueryParams,
	TransactionStatus,
	TransactionStatusEnum,
	TransactionType
} from "@coinvant/types";

export class FindTransactionsQueryParamsDto extends PaginationOptionsDto implements FindTransactionsQueryParams{
	@IsOptional()
	@IsIn(Object.values(TransactionType))
	@ApiProperty({
		type: String,
		required: false,
		enum: TransactionType,
	})
	type: TransactionType;

	@IsOptional()
	@IsIn(Object.values(TransactionStatusEnum))
	@ApiProperty({
		type: String,
		required: false,
		enum: TransactionStatusEnum,
	})
	status: TransactionStatus;

	@IsOptional()
	@IsString()
	@ApiProperty({ type: String, required: false })
	accountID: string;
}
