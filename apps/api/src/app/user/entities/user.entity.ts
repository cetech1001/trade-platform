import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Deposit, KYCStatus, Trade, User, UserRole, UserStatus, Withdrawal } from '@coinvant/types';
import {Transform} from "class-transformer";
import {DepositEntity} from "../../deposit/entities/deposit.entity";
import {TradeEntity} from "../../trade/entities/trade.entity";
import {WithdrawalEntity} from "../../withdrawal/entities/withdrawal.entity";

@Entity('users')
export class UserEntity implements User{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  name: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'johndoe@mail.com' })
  email: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.notStarted,
  })
  kycVerified: KYCStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  @IsOptional()
  @IsIn(Object.values(UserRole))
  @ApiProperty({ type: String, enum: UserRole, default: UserRole.user })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.active,
  })
  @IsOptional()
  @IsIn(Object.values(UserStatus))
  @ApiProperty({
    type: String,
    required: false,
    enum: UserStatus,
    default: UserStatus.active
  })
  status: UserStatus;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @Transform(v => Number(v.value))
  @IsNumber()
  @ApiProperty({ type: Number, example: 0.00 })
  walletBalance: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'Pa$$word1' })
  password: string;

  @OneToMany(() => DepositEntity, (deposit) => deposit.user, { onDelete: 'CASCADE' })
  deposits: Deposit[];

  @OneToMany(() => TradeEntity, (trade) => trade.user, { onDelete: 'CASCADE' })
  trades: Trade[];

  @OneToMany(() => WithdrawalEntity, (withdrawal) => withdrawal.user, { onDelete: 'CASCADE' })
  withdrawals: Withdrawal[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
