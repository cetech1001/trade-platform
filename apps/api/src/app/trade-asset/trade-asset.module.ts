import { Module } from '@nestjs/common';
import { TradeAssetService } from './trade-asset.service';
import { TradeAssetController } from './trade-asset.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StockEntity} from "./entities/stock.entity";
import {ForexEntity} from "./entities/forex.entity";
import {CryptoEntity} from "./entities/crypto.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([
			StockEntity,
			ForexEntity,
			CryptoEntity,
		]),
	],
	controllers: [TradeAssetController],
	providers: [TradeAssetService],
	exports: [TradeAssetService],
})
export class TradeAssetModule {}
