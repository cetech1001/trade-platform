import {PickType} from "@nestjs/swagger";
import {WithdrawalEntity} from "../entities/withdrawal.entity";
import {CreateWithdrawal} from "@coinvant/types";

export class CreateWithdrawalDto
	extends PickType(WithdrawalEntity, [
		'amount',
		'paymentMethod',
		'network',
		'walletAddress'
	])
	implements CreateWithdrawal {}
