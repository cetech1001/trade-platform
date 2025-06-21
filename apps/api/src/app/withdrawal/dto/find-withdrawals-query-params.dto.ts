import { PaginationOptionsDto } from '../../common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FindWithdrawalsQueryParams } from '@coinvant/types';

export class FindWithdrawalsQueryParamsDto extends PaginationOptionsDto implements FindWithdrawalsQueryParams {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  accountID: string;
}
