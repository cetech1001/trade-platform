import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {StockOption, StockAssetType, StockExchange, Trade} from "@coinvant/types";
import {TradeEntity} from "../../trade/entities/trade.entity";

@Entity('stocks')
export class StockEntity implements StockOption{
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	symbol: string;

	@Column({ nullable: true })
	name: string;

	@Column({ type: 'enum', enum: StockExchange })
	exchange: StockExchange;

	@Column({ type: 'enum', enum: StockAssetType })
	assetType: StockAssetType;

	@OneToMany(() => TradeEntity, ({ stock }) => stock)
	trades: Trade[];
}
