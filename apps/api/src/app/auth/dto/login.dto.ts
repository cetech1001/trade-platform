import { ApiProperty, PickType } from '@nestjs/swagger';
import {UserEntity} from "../../user/entities/user.entity";
import { LoginRequest, ResetPasswordRequest } from '@coinvant/types';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto extends PickType(UserEntity, ['email', 'password']) implements LoginRequest {}

export class SendResetTokenDto extends PickType(UserEntity, ['email']) implements Pick<LoginRequest, 'email'> {}

export class ResetPasswordDto extends PickType(UserEntity, ['email', 'password']) implements ResetPasswordRequest{
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  otp: string;
}
