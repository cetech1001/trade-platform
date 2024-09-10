import { ApiProperty, PickType } from '@nestjs/swagger';
import {DepositEntity} from "../entities/deposit.entity";
import {CreateDeposit} from "@coinvant/types";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepositDto
	extends PickType(DepositEntity, ['amount', 'paymentMethod'])
	implements CreateDeposit {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	accountID: string;
}
