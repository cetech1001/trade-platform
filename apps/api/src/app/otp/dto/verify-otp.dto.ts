import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOTPDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  otp: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true })
  email: string;
}
