import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { Account, Withdrawal, WithdrawalStatus } from '@coinvant/types';
import {IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('withdrawals')
export class WithdrawalEntity implements Withdrawal {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('decimal', {
		precision: 8,
		scale: 2,
		default: 0,
	})
	@IsNotEmpty()
	@Transform(v => +v.value)
	@IsNumber()
	@ApiProperty({ type: Number, required: true })
	amount: number;

	@Column()
	@IsString()
	@ApiProperty({ type: String, required: true })
	paymentMethod: string;

	@Column()
	@IsString()
	@ApiProperty({ type: String, required: true })
	network: string;

	@Column()
	@IsString()
	@ApiProperty({ type: String, required: true })
	walletAddress: string;

	@Column({
		type: 'enum',
		enum: WithdrawalStatus,
		default: WithdrawalStatus.pending,
	})
	@IsIn(Object.values(WithdrawalStatus))
	@ApiProperty({ type: String, enum: WithdrawalStatus })
	status: WithdrawalStatus;

	@ManyToOne(
		() => AccountEntity,
		(account) => account.withdrawals,
		{ eager: true }
	)
	@JoinColumn({ name: 'accountID' })
	account: Account;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
