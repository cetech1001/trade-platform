import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CryptoCurrency} from "@coinvant/types";

@Entity('crypto_currencies')
export class CryptoEntity implements CryptoCurrency {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	symbol: string;

	@Column()
	name: string;

	@Column()
	image: string;
}
