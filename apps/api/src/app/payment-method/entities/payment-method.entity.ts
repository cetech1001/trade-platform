import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsIn, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {PaymentMethod, PaymentMethodStatus} from "@coinvant/types";

@Entity('payment_methods')
export class PaymentMethodEntity implements PaymentMethod{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	name: string;

	@Column()
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	code: string;

	@Column()
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	network: string;

	@Column()
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: String, required: true })
	walletAddress: string;

	@Column({
		type: 'enum',
		enum: PaymentMethodStatus,
		default: PaymentMethodStatus.active,
	})
	@IsOptional()
	@IsIn(Object.values(PaymentMethodStatus))
	@ApiProperty({
		type: String,
		required: false,
		enum: PaymentMethodStatus,
		default: PaymentMethodStatus.active
	})
	status: PaymentMethodStatus;
}
