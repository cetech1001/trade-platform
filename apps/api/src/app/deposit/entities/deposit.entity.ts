import { Account, Deposit, DepositStatus } from '@coinvant/types';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('deposits')
export class DepositEntity implements Deposit {
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
	proof: string;

	@Column()
	@IsString()
	@ApiProperty({ type: String, required: true })
	paymentMethod: string;

	@ManyToOne(
		() => AccountEntity,
		(account) => account.deposits,
		{ eager: true }
	)
	@JoinColumn({ name: 'accountID' })
	account: Account;

	@Column({
		type: 'enum',
		enum: DepositStatus,
		default: DepositStatus.pending,
	})
	@IsIn(Object.values(DepositStatus))
	@ApiProperty({type: String, enum: DepositStatus})
	status: DepositStatus;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
