import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
} from 'typeorm';
import {AccountEntity} from "../../account/entities/account.entity";
import {
  CryptoCurrency,
  ForexPair,
  StockOption,
  Trade,
  TradeAssetType, TradeClosureReason,
  TradeStatus,
  Account, TradeAsset
} from '@coinvant/types';
import {StockEntity} from "../../trade-asset/entities/stock.entity";
import {ForexEntity} from "../../trade-asset/entities/forex.entity";
import {CryptoEntity} from "../../trade-asset/entities/crypto.entity";
import {IsBoolean, IsDate, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

@Entity('trades')
export class TradeEntity implements Trade{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@IsNotEmpty()
	@Transform(v => +v.value)
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: true })
	@Column({ type: 'decimal', precision: 10, scale: 2 })
	bidAmount: number;

	@Column({ type: 'decimal', precision: 16, scale: 8, nullable: true })
	currentPrice: number;

	@Column({ type: 'decimal', precision: 16, scale: 8, nullable: true })
	buyPrice: number;

	@Column({ type: 'decimal', precision: 16, scale: 8, nullable: true })
	sellPrice: number;

	@Column({ type: 'decimal', precision: 16, scale: 8, nullable: true })
	units: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	profitOrLoss: number;

	@IsOptional()
	@Transform(v => +v.value)
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: false })
	@Column({ type: 'decimal', precision: 5, scale: 2, default: 1.00 })
	leverage: number;

	@IsOptional()
	@IsDate()
	@ApiProperty({ type: Date, required: false })
	@Column({ type: 'timestamp', nullable: true })
	executeAt: string;

	@Column({ type: 'timestamp', nullable: true })
	closedAt: string;

	@IsOptional()
	@Transform(v => +v.value)
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: false })
	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	takeProfit: number;

	@IsOptional()
	@Transform(v => +v.value)
	@IsNumber()
	@IsPositive()
	@ApiProperty({ type: Number, required: false })
	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	stopLoss: number;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({ type: Boolean, required: false })
	@Column({ default: false })
	isShort: boolean;

	@Column({ type: 'enum', enum: TradeClosureReason, nullable: true, default: null })
	closureReason: TradeClosureReason;

	@IsNotEmpty()
	@IsIn(Object.values(TradeAssetType))
	@ApiProperty({ type: String, required: true, enum: TradeAssetType })
	@Column({ type: 'enum', enum: TradeAssetType })
	assetType: TradeAssetType;

	@Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.pending })
	status: TradeStatus;

	@ManyToOne(
		() => AccountEntity,
		account => account.trades,
		{ eager: true, onDelete: 'CASCADE' }
	)
	@JoinColumn({ name: 'accountID' })
	account: Account;

	@ManyToOne(
		() => StockEntity,
		({ trades }) => trades,
		{ nullable: true, eager: true }
	)
	@JoinColumn({ name: 'stockID' })
	stock: StockOption;

	@ManyToOne(
		() => ForexEntity,
		({ trades }) => trades,
		{ nullable: true, eager: true }
	)
	@JoinColumn({ name: 'forexID' })
	forex: ForexPair;

	@ManyToOne(
		() => CryptoEntity,
		({ trades }) => trades,
		{ nullable: true, eager: true }
	)
	@JoinColumn({ name: 'cryptoID' })
	crypto: CryptoCurrency;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	get asset(): TradeAsset {
		return this.stock || this.forex || this.crypto;
	}
}
