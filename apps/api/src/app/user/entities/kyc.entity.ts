import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { KYC } from '@coinvant/types';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('kyc')
export class KycEntity implements KYC{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'John' })
  @Column()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'Doe' })
  @Column()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: '13/10/1985' })
  @Column()
  dob: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'American' })
  @Column()
  nationality: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '12 Court Road, Albany, NY 10171'
  })
  @Column()
  residentialAddress: string;

  @Column()
  idCard: string;

  @Column()
  photo: string;

  @Column()
  proofOfAddress: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
