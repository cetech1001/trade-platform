import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Stock, StockAssetType, StockExchange} from "@coinvant/types";

@Entity('stocks')
export class StockEntity implements Stock{
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	symbol: string;

	@Column({ nullable: true })
	name: string;

	@Column({ type: 'enum', enum: StockExchange })
	exchange: StockExchange;

	@Column({ type: 'enum', enum: StockAssetType })
	assetType: StockAssetType;
}
