import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Forex, ForexType} from "@coinvant/types";

@Entity('foreign_exchanges')
export class ForexEntity implements Forex {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ length: 3 })
	base: string;

	@Column({ length: 3 })
	term: string;

	@Column({ type: 'enum', enum: ForexType })
	type: ForexType;
}
