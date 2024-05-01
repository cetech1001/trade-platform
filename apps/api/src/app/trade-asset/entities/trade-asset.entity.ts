import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Trade, TradeAsset, TradeAssetCountry, TradeAssetMarket, TradeAssetType} from "@coinvant/types";
import {IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {TradeEntity} from "../../trade/entities/trade.entity";

@Entity('trade_assets')
export class TradeAssetEntity implements TradeAsset{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  changeRate: number;

  @Column()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  closingTime: string;

  @Column({
    type: 'enum',
    enum: TradeAssetCountry,
  })
  @IsNotEmpty()
  @IsIn(Object.values(TradeAssetCountry))
  @ApiProperty({ type: String, enum: TradeAssetCountry })
  country: TradeAssetCountry;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  currentPrice: number;

  @Column({
    type: 'enum',
    enum: TradeAssetMarket,
  })
  @IsNotEmpty()
  @IsIn(Object.values(TradeAssetMarket))
  @ApiProperty({ type: String, enum: TradeAssetMarket })
  market: TradeAssetMarket;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  name: string;

  @Column()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  openingTime: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  profitability: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  symbol: string;

  @Column({
    type: 'enum',
    enum: TradeAssetType,
  })
  @IsNotEmpty()
  @IsIn(Object.values(TradeAssetType))
  @ApiProperty({ type: String, enum: TradeAssetType })
  type: TradeAssetType;

  @OneToMany(() => TradeEntity, ({ asset }) => asset)
  trades: Trade[]
}
