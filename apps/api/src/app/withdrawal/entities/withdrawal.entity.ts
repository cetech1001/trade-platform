import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {DepositStatus, User, Withdrawal, WithdrawalStatus} from "@coinvant/types";
import {IsIn, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {UserEntity} from "../../user/entities/user.entity";

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
	@IsIn(Object.values(DepositStatus))
	@ApiProperty({ type: String, enum: DepositStatus })
	status: WithdrawalStatus;

	@ManyToOne(() => UserEntity, (user) => user.withdrawals)
	@JoinColumn({ name: 'userID' })
	user: User;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
