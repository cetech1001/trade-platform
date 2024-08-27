import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ForexPair, ForexType, Trade} from "@coinvant/types";
import {TradeEntity} from "../../trade/entities/trade.entity";

@Entity('foreign_exchanges')
@Index(['base', 'term'], { unique: true })
export class ForexEntity implements ForexPair {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 3 })
	base: string;

	@Column({ length: 3 })
	term: string;

	@Column({ type: 'enum', enum: ForexType })
	type: ForexType;

	@Column({ nullable: true })
	image: string;

	@OneToMany(() => TradeEntity, ({ forex }) => forex)
	trades: Trade[];

	get symbol(): string {
		return `${this.base}/${this.term}`;
	}
}
