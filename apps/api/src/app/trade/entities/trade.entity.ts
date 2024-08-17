import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {Trade, TradeStatus, User} from "@coinvant/types";
import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {UserEntity} from "../../user/entities/user.entity";

@Entity('trades')
export class TradeEntity implements Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsNotEmpty()
  @Transform(v => +v)
  @IsNumber()
  @ApiProperty({ type: Number, required: true })
  amount: number;

  @Column()
  asset: string;

  @Column()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  duration: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @Transform(v => +v)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  enableByPrice: number;

  @Column()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  enableByTime: string;

  @Column()
  endTime: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @Transform(v => +v)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  leverage: number;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  lowerLimit: number;

  @Column()
  startTime: string;

  @Column({
    type: 'enum',
    enum: TradeStatus,
    default: TradeStatus.pending,
  })
  status: TradeStatus;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @Transform(v => +v)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  stopLoss: number;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @Transform(v => +v)
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  takeProfit: number;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  upperLimit: number;

  @ManyToOne(() => UserEntity, (user) => user.trades)
  @JoinColumn({ name: 'userID' })
  user: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
