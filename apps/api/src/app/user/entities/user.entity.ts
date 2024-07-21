import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {UserRole, UserStatus} from "@coinvant/types";
import {Transform} from "class-transformer";

@Entity('users')
export class User {
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
  @ApiProperty({ type: String, enum: UserStatus, default: UserStatus.active })
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
}
