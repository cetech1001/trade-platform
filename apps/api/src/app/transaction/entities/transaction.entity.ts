import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Transaction, TransactionStatus, TransactionStatusEnum, TransactionType, User} from "@coinvant/types";
import {UserEntity} from "../../user/entities/user.entity";

@Entity('transactions')
export class TransactionEntity implements Transaction{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('decimal', {
		precision: 8,
		scale: 2,
		default: 0,
	})
	amount: number;

	@Column()
	transactionID: string;

	@Column({
		type: 'enum',
		enum: TransactionStatusEnum,
	})
	status: TransactionStatus;

	@Column({
		type: 'enum',
		enum: TransactionType,
	})
	type: TransactionType;

	@ManyToOne(() => UserEntity, (user) => user.withdrawals)
	@JoinColumn({ name: 'userID' })
	user: User;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
