import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupportEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  message: string;
}
