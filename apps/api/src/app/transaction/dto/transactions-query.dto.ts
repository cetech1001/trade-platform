import {PaginationOptionsDto} from "../../../dto/pagination.dto";
import {IsIn, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {
	TransactionsQuery,
	TransactionStatus,
	TransactionStatusEnum,
	TransactionType
} from "@coinvant/types";

export class TransactionsQueryDto extends PaginationOptionsDto implements TransactionsQuery{
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
}
