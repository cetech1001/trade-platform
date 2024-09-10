import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsIn, IsNotEmpty, IsOptional, IsString} from "class-validator";
import { Account, KYCStatus, User, UserRole, UserStatus } from '@coinvant/types';
import { AccountEntity } from '../../account/entities/account.entity';

@Entity('users')
export class UserEntity implements User{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  @Column()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'johndoe@mail.com' })
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'Pa$$word1' })
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: KYCStatus,
    default: KYCStatus.notStarted,
  })
  kycStatus: KYCStatus;

  @IsOptional()
  @IsIn(Object.values(UserRole))
  @ApiProperty({ type: String, enum: UserRole, default: UserRole.user })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @IsOptional()
  @IsIn(Object.values(UserStatus))
  @ApiProperty({
    type: String,
    required: false,
    enum: UserStatus,
    default: UserStatus.active
  })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.active,
  })
  status: UserStatus;

  @OneToMany(
    () => AccountEntity,
    (account) => account.user,
    { eager: true }
  )
  accounts: Account[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
