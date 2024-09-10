import { PickType } from '@nestjs/swagger';
import { AccountEntity } from '../entities/account.entity';

export class UpdateAccountDto extends PickType(AccountEntity, ['walletBalance']) {}
