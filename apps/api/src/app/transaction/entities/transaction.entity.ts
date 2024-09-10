import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Transaction, TransactionStatus, TransactionStatusEnum, TransactionType, Account} from "@coinvant/types";
import {AccountEntity} from "../../account/entities/account.entity";

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

	@ManyToOne(
		() => AccountEntity,
		(account) => account.transactions,
		{ onUpdate: 'CASCADE', onDelete: 'CASCADE' }
	)
	@JoinColumn({ name: 'accountID' })
	account: Account;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
