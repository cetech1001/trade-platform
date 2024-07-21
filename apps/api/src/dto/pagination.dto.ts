import {IsInt, IsNumber, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PaginationOptions} from "@coinvant/types";
import {Transform} from "class-transformer";

export class PaginationOptionsDto implements PaginationOptions {
	@IsOptional()
	@Transform(v => Number(v.value))
	@IsNumber()
	@IsInt()
	@ApiProperty({ type: Number, required: false, example: 10 })
	limit = 10;

	@IsOptional()
	@Transform(v => Number(v.value))
	@IsNumber()
	@IsInt()
	@ApiProperty({ type: Number, required: false, example: 1 })
	page = 1;
}
