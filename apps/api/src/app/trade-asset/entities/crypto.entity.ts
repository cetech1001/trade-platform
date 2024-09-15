import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CryptoCurrency, Trade} from "@coinvant/types";
import {TradeEntity} from "../../trade/entities/trade.entity";

@Entity('crypto_currencies')
export class CryptoEntity implements CryptoCurrency {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	symbol: string;

	@Column()
	name: string;

	@Column()
	image: string;

	@Column({ unique: true })
	currencyID: string;

	@OneToMany(() => TradeEntity, ({ crypto }) => crypto)
	trades: Trade[];
}
