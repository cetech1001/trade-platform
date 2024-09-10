import { PaginationOptionsDto } from '../../../dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FindDepositsQueryParams } from '@coinvant/types';

export class FindDepositsQueryParamsDto extends PaginationOptionsDto implements FindDepositsQueryParams {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  accountID: string;
}
