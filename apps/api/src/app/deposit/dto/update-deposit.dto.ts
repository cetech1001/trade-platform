import {PickType} from '@nestjs/swagger';
import {DepositEntity} from "../entities/deposit.entity";
import {UpdateDeposit} from "@coinvant/types";

export class UpdateDepositDto
	extends PickType(DepositEntity, ['status'])
	implements UpdateDeposit{}
