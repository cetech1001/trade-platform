import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";
import {ForexPair, ForexType} from "@coinvant/types";

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
}
