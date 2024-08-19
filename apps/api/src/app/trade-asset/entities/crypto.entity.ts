import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CryptoCurrency} from "@coinvant/types";

@Entity('crypto_currencies')
export class CryptoEntity implements CryptoCurrency {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	symbol: string;

	@Column()
	name: string;

	@Column()
	image: string;
}
