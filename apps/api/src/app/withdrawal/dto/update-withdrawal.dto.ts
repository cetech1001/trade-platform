import {PickType} from '@nestjs/swagger';
import {WithdrawalEntity} from "../entities/withdrawal.entity";

export class UpdateWithdrawalDto
	extends PickType(WithdrawalEntity, ['status'])
	implements UpdateWithdrawalDto {}
