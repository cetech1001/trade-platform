import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import {UserEntity} from "../../user/entities/user.entity";
import {
  CryptoCurrency,
  ForexPair,
  StockOption,
  Trade,
  TradeAssetType,
  TradeStatus,
  User
} from "@coinvant/types";
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

  @IsOptional()
  @Transform(v => +v.value)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  targetPrice: number;

  @IsOptional()
  @Transform(v => +v.value)
  @IsNumber()
  @IsPositive()
  @ApiProperty({ type: Number, required: false })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.00 })
  multiplier: number;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: Date, required: false })
  @Column({ type: 'timestamp', nullable: true })
  executeAt: Date;

  @Column({ default: false })
  isExecuted: boolean;

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

  @IsNotEmpty()
  @IsIn(Object.values(TradeAssetType))
  @ApiProperty({ type: String, required: true, enum: TradeAssetType })
  @Column({ type: 'enum', enum: TradeAssetType })
  assetType: TradeAssetType;

  @IsOptional()
  @IsIn(Object.values(TradeStatus))
  @ApiProperty({ type: String, required: false, enum: TradeStatus })
  @Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.pending })
  status: TradeStatus;

  @ManyToOne(
      () => UserEntity,
          user => user.trades,
      { eager: true }
  )
  @JoinColumn({ name: 'userID' })
  user: User;

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
}
