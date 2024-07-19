import {IsNumber, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PaginationOptions} from "@coinvant/types";

export class PaginationOptionsDto implements PaginationOptions {
	@IsOptional()
	@IsNumber()
	@ApiProperty({ type: Number, required: false, example: 10 })
	limit = 10;

	@IsOptional()
	@IsNumber()
	@ApiProperty({ type: Number, required: false, example: 1 })
	page = 1;
}
