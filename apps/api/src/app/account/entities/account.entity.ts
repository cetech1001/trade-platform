import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional} from "class-validator";
import {Transform} from "class-transformer";
import { Account, AccountType, Deposit, Trade, Transaction, User, Withdrawal } from '@coinvant/types';
import { UserEntity } from '../../user/entities/user.entity';
import { DepositEntity } from '../../deposit/entities/deposit.entity';
import { TradeEntity } from '../../trade/entities/trade.entity';
import { WithdrawalEntity } from '../../withdrawal/entities/withdrawal.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';

@Entity('accounts')
export class AccountEntity implements Account{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsOptional()
  @Transform(v => +v.value)
  @IsNumber()
  @ApiProperty({ type: Number, example: 0.00 })
  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  walletBalance: number;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.demo,
  })
  type: AccountType;

  @ManyToOne(
    () => UserEntity,
    (user) => user.accounts,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userID' })
  user: User;

  @OneToMany(() => DepositEntity, (deposit) => deposit.account)
  deposits: Deposit[];

  @OneToMany(() => TradeEntity, (trade) => trade.account)
  trades: Trade[];

  @OneToMany(() => WithdrawalEntity, (withdrawal) => withdrawal.account)
  withdrawals: Withdrawal[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
