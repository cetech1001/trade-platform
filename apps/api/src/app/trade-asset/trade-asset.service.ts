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
	StockOption
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
			{ base: 'EUR', term: 'USD', type: ForexType.major },
			{ base: 'NZD', term: 'USD', type: ForexType.major },
			{ base: 'GBP', term: 'USD', type: ForexType.major },
			{ base: 'USD', term: 'CHF', type: ForexType.major },
			{ base: 'USD', term: 'JPY', type: ForexType.major },
			{ base: 'AUD', term: 'USD', type: ForexType.major },
			{ base: 'USD', term: 'CAD', type: ForexType.major },
			{ base: 'AUD', term: 'CAD', type: ForexType.cross },
			{ base: 'AUD', term: 'JPY', type: ForexType.cross },
			{ base: 'AUD', term: 'NZD', type: ForexType.cross },
			{ base: 'CAD', term: 'JPY', type: ForexType.cross },
			{ base: 'CHF', term: 'JPY', type: ForexType.cross },
			{ base: 'EUR', term: 'AUD', type: ForexType.cross },
			{ base: 'EUR', term: 'CAD', type: ForexType.cross },
			{ base: 'EUR', term: 'CHF', type: ForexType.cross },
			{ base: 'EUR', term: 'GBP', type: ForexType.cross },
			{ base: 'EUR', term: 'JPY', type: ForexType.cross },
			{ base: 'EUR', term: 'TRY', type: ForexType.cross },
			{ base: 'GBP', term: 'AUD', type: ForexType.cross },
			{ base: 'GBP', term: 'CAD', type: ForexType.cross },
			{ base: 'GBP', term: 'CHF', type: ForexType.cross },
			{ base: 'GBP', term: 'JPY', type: ForexType.cross },
			{ base: 'NZD', term: 'JPY', type: ForexType.cross },
			{ base: 'XAG', term: 'USD', type: ForexType.commodity },
			{ base: 'XAU', term: 'USD', type: ForexType.commodity },
			{ base: 'USD', term: 'MXN', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'SGD', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'TRY', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'CNH', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'CNY', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'INR', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'KRW', type: ForexType.emergingMarket },
			{ base: 'USD', term: 'TWD', type: ForexType.emergingMarket },
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

}
