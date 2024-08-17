import {PickType} from "@nestjs/swagger";
import {DepositEntity} from "../entities/deposit.entity";
import {CreateDeposit} from "@coinvant/types";

export class CreateDepositDto
	extends PickType(DepositEntity, ['amount', 'paymentMethod'])
	implements CreateDeposit {}
