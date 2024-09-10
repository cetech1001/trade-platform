import { ApiProperty, PickType } from '@nestjs/swagger';
import {WithdrawalEntity} from "../entities/withdrawal.entity";
import {CreateWithdrawal} from "@coinvant/types";
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWithdrawalDto
	extends PickType(WithdrawalEntity, [
		'amount',
		'paymentMethod',
		'network',
		'walletAddress'
	])
	implements CreateWithdrawal {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	accountID: string;
}
