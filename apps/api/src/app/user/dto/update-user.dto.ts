import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { KYCStatus, UpdateUser } from '@coinvant/types';
import { IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto
	extends PartialType(CreateUserDto)
	implements UpdateUser{

	@IsOptional()
	@IsIn(Object.values(KYCStatus))
	@ApiProperty({ type: String, enum: KYCStatus })
	kycStatus: KYCStatus;
}
