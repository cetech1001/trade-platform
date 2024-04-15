import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsIn, IsNotEmpty, IsString} from "class-validator";
import {UserRole} from "@coinvant/types";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'John Doe' })
  name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'johndoe@mail.com' })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  @IsIn(Object.values(UserRole))
  @ApiProperty({ type: String, enum: UserRole, default: UserRole.user })
  role: UserRole;

  @Column('decimal', {
    precision: 8,
    scale: 2,
    default: 0,
  })
  walletBalance: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'Pa$$word1' })
  password: string;
}
