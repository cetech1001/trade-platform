import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {StockEntity} from "./entities/stock.entity";
import {Brackets, Repository} from "typeorm";
import {ForexEntity} from "./entities/forex.entity";
import {CryptoEntity} from "./entities/crypto.entity";
import {
	CreateCryptoCurrency,
	CreateForex,
	CreateStock,
	FindCryptoCurrencies,
	FindForexPairs,
	FindStockOptions,
	ForexType,
	StockOption, TradeAssetType
} from "@coinvant/types";
import fs from 'fs';
import path from "path";
import csv from 'csv-parser';
import axios from "axios";
import {paginate} from "nestjs-typeorm-paginate";

@Injectable()
export class TradeAssetService {
	constructor(
		@InjectRepository(StockEntity) private readonly stockRepo: Repository<StockEntity>,
		@InjectRepository(ForexEntity) private readonly forexRepo: Repository<ForexEntity>,
		@InjectRepository(CryptoEntity) private readonly cryptoRepo: Repository<CryptoEntity>,
	) {}

	importStockOptions() {
		const stocks: CreateStock[] = [];
		return new Promise<StockOption[]>((resolve, reject) => {
			const filePath = path.join(process.cwd(), 'apps', 'api', 'src', 'assets', 'stocks.csv');
			fs.createReadStream(filePath)
				.pipe(csv())
				.on('data', (row) => {
					const stock: CreateStock = {
						symbol: row.symbol,
						name: row.name,
						exchange: row.exchange,
						assetType: row.assetType,
					};
					stocks.push(stock);
				})
				.on('end', async () => {
					try {
						const savedStocks = await this.stockRepo.save(stocks);
						resolve(savedStocks);
					} catch (error) {
						console.error('Error storing data in the database', error);
						reject(error);
					}
				})
				.on('error', (error) => {
					console.error('Error reading the CSV file', error);
					reject(error);
				});
		});
	}

	importForexPairs() {
		const pairs: CreateForex[] = [
			{ base: 'EUR', term: 'USD', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURUSD.2d7d9de55f45290ec68a8cce3745ad1c.svg' },
			{ base: 'NZD', term: 'USD', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/NZDUSD.428d7e022ab3645e272183bfdc28e0a6.svg' },
			{ base: 'GBP', term: 'USD', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/GBPUSD.f41d029153f50eca50f1f211918a83b9.svg' },
			{ base: 'USD', term: 'CHF', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/USDCHF.a9619651af02bddcc3df587c0ab4b6ca.svg' },
			{ base: 'USD', term: 'JPY', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/USDJPY.6941889ed0187dc0c0ac42d408d1b783.svg' },
			{ base: 'AUD', term: 'USD', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/AUDUSD.a74df9911943f5ad60b9d7ba24765e83.svg' },
			{ base: 'USD', term: 'CAD', type: ForexType.major, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/USDCAD.c0f602222e6e6422635050ad7f42a49a.svg' },
			{ base: 'AUD', term: 'CAD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/AUDCAD.e901ac3802ec313628b2d1a3a121d422.svg' },
			{ base: 'AUD', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/AUDJPY.62f918a3c8acaa210c86d7190b007d56.svg' },
			{ base: 'AUD', term: 'NZD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/AUDNZD.309b167151cbe54cf78ac4a3ffbb2aa9.svg' },
			{ base: 'CAD', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/CADJPY.87537c5c39a93e224ec413f8fc41fb10.svg' },
			{ base: 'CHF', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/CHFJPY.8cfb87e72124a83c27e82681e1983481.svg' },
			{ base: 'EUR', term: 'AUD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURAUD.3a523ed37f9f8b78108d2e887fc857ee.svg' },
			{ base: 'EUR', term: 'CAD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURCAD.8d112c82057d2b7f1d458ee2dabd4083.svg' },
			{ base: 'EUR', term: 'CHF', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURCHF.1d9cc4d34dd660c37972d5747dfde449.svg' },
			{ base: 'EUR', term: 'GBP', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURGBP.66ee38b922e9db47105741fca893eb29.svg' },
			{ base: 'EUR', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/EURJPY.bdaf28e94b58c589d5161c88be663f7e.svg' },
			{ base: 'EUR', term: 'TRY', type: ForexType.cross, image: '' },
			{ base: 'GBP', term: 'AUD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/GBPAUD.33175b985c8bed2d14b6e5d80e26b4b7.svg' },
			{ base: 'GBP', term: 'CAD', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/GBPCAD.8b8e6092799ade4c0fcef3089d857393.svg' },
			{ base: 'GBP', term: 'CHF', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/GBPCHF.9000e9ef3be565a89920e62626a7c0ce.svg' },
			{ base: 'GBP', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/GBPJPY.9d2b025afa32ebbde15319e894527b87.svg' },
			{ base: 'NZD', term: 'JPY', type: ForexType.cross, image: 'https://cfcdn.olymptrade.com/assets1/instrument/vector/NZDJPY.04c84605853eecf9e2d1c5b4ba52a2d8.svg' },
			// { base: 'XAG', term: 'USD', type: ForexType.commodity, image: '' },
			// { base: 'XAU', term: 'USD', type: ForexType.commodity, image: '' },
			{ base: 'USD', term: 'MXN', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'SGD', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'TRY', type: ForexType.emergingMarket, image: '' },
			// { base: 'USD', term: 'CNH', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'CNY', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'INR', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'KRW', type: ForexType.emergingMarket, image: '' },
			{ base: 'USD', term: 'TWD', type: ForexType.emergingMarket, image: '' },
		];
		return this.forexRepo.save(pairs);
	}

	async importCryptoCurrencies() {
		const {data} = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd");
		const currencies: CreateCryptoCurrency = data.map(c => ({
			symbol: c.symbol,
			name: c.name,
			image: c.image,
		}));
		return await this.cryptoRepo.save(currencies);
	}

	findStockOptions(query: FindStockOptions) {
		const {
			symbol,
			name,
			exchange,
			assetType,
			...options
		} = query;
		const queryBuilder = this.stockRepo.createQueryBuilder('S');
		if (symbol || name) {
			queryBuilder.where(
				new Brackets(qb => {
					if (symbol) {
						qb.orWhere(
							'LOWER(S.symbol) LIKE :symbol',
							{ symbol: `%${symbol}%` }
						);
					}
					if (name) {
						qb.orWhere(
							'LOWER(S.name) LIKE :name',
							{ name: `%${name}%` }
						);
					}
				})
			)
		}
		if (exchange) {
			queryBuilder.andWhere('S.exchange = :exchange', { exchange });
		}
		if (assetType) {
			queryBuilder.andWhere('S.assetType = :assetType', { assetType });
		}

		return paginate(queryBuilder, options);
	}

	findCryptoCurrencies(query: FindCryptoCurrencies) {
		const {
			symbol,
			name,
			...options
		} = query;
		const queryBuilder = this.cryptoRepo.createQueryBuilder('C');
		if (symbol || name) {
			queryBuilder.where(
				new Brackets(qb => {
					if (symbol) {
						qb.orWhere(
							'LOWER(C.symbol) LIKE :symbol',
							{ symbol: `%${symbol}%` }
						);
					}
					if (name) {
						qb.orWhere('LOWER(C.name) LIKE :name', { name: `%${name}%` });
					}
				})
			);
		}

		return paginate(queryBuilder, options);
	}

	findForexPairs(query: FindForexPairs) {
		const {
			base,
			term,
			type,
			...options
		} = query;
		const queryBuilder = this.forexRepo.createQueryBuilder('F');
		if (base || term) {
			queryBuilder.where(
				new Brackets(qb => {
					if (base) {
						qb.orWhere('LOWER(F.base) LIKE :base', { base: `%${base}%` });
					}
					if (term) {
						qb.orWhere('LOWER(F.term) LIKE :term', { term: `%${term}%` });
					}
				})
			)
		}
		if (type) {
			queryBuilder.andWhere('F.type = :type', { type });
		}

		return paginate(queryBuilder, options);
	}

	findAsset(id: string, assetType: TradeAssetType) {
		switch (assetType) {
			case TradeAssetType.crypto:
				return this.cryptoRepo.findOneBy({ id });
			case TradeAssetType.forex:
				return this.forexRepo.findOneBy({ id });
			default:
				return this.stockRepo.findOneBy({ id });
		}
	}

}
