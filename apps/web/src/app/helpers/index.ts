import {Trade, TradeAssetType} from "@coinvant/types";
import axios from "axios";

export const formatCurrency = (amount: number | string = 0): string => {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number(amount));
}

export const groupTransactionsByDate = <T>(transactions: T[]) => {
	const groupedTransactions: Record<string, T[]> = {};

	transactions.forEach((transaction) => {
		// @ts-expect-error idk
		const date = new Date(transaction['createdAt']).toISOString().split('T')[0];
		if (!groupedTransactions[date]) {
			groupedTransactions[date] = [];
		}
		groupedTransactions[date].push(transaction);
	});

	return Object.values(groupedTransactions);
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);

	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).toUpperCase();
};

export const capitalizeFirstLetter = (word: string) => {
	if (!word) return '';
	return word.charAt(0).toUpperCase() + word.slice(1);
}

export const wrapWord = (word: string) => {
	const str = word.slice(0, 16);
	if (word.length > 16) {
		return str + '...';
	}
	return str;
}

export const roundPercent = (number = 0) => {
	return number.toFixed(2);
}

export const getCurrentPriceForStock = async (symbol: string) => {
	const { data } = await axios.get(`https://www.alphavantage.co/query`, {
		params: {
			function: 'TIME_SERIES_INTRADAY',
			symbol: symbol,
			interval: '5min',
			apikey: '4SSFX5O7DOW5SK3C',
		},
	});

	const timeSeries = data['Time Series (5min)'];
	const latestTime = Object.keys(timeSeries)[0];
	const latestData = timeSeries[latestTime];
	return parseFloat(latestData['1. open']);
}

export const getCurrentPriceForForex = async (symbol: string) => {
	const [base, term] = symbol.split('/');
	const { data } = await axios.get(`https://api.frankfurter.app/latest?amount=1&from=${base}&to=${term}`);
	return data.rates[term];
}

export const getCurrentPriceForCrypto = async (currencyID: string) => {
	const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${currencyID}`);
	return data[0].current_price;
}

export const getCurrentPrice = async (trade: Trade): Promise<number> => {
	if (trade.assetType === TradeAssetType.crypto) {
		return getCurrentPriceForCrypto(trade.crypto.currencyID!);
	} else if (trade.assetType === TradeAssetType.forex) {
		const { base, term } = trade.forex;
		return getCurrentPriceForForex(`${base}/${term}`);
	}
	return getCurrentPriceForStock(trade.stock.symbol);
}

const calculatePLForCrypto = (trade: Trade, currentPrice: number) => {
	let priceMovement: number;
	if (trade.isShort) {
		priceMovement = trade.sellPrice - currentPrice;
	} else {
		priceMovement = currentPrice - trade.buyPrice;
	}
	return trade.units * trade.leverage * priceMovement;
}

const calculatePLForForex = async (trade: Trade, currentPrice: number) => {
	let priceMovement: number;
	if (trade.isShort) {
		priceMovement = trade.sellPrice - currentPrice;
	} else {
		priceMovement = currentPrice - trade.buyPrice;
	}
	const profitOrLoss = trade.units * priceMovement;
	const [base, term] = trade.asset.symbol.split('/');
	if (base === 'USD') {
		return profitOrLoss / currentPrice;
	} else if (term === 'USD') {
		return profitOrLoss;
	}
	const rate = await getCurrentPriceForForex(`${term}/USD`);
	return profitOrLoss * rate;
}

const calculatePLForStock = (trade: Trade, currentPrice: number) => {
	let priceMovement: number;
	if (trade.isShort) {
		priceMovement = trade.sellPrice - currentPrice;
	} else {
		priceMovement = currentPrice - trade.buyPrice;
	}
	return trade.units * priceMovement;
}

export const calculateProfitOrLoss = (trade: Trade, currentPrice: number) => {
	if (trade.assetType === TradeAssetType.stock) {
		return calculatePLForStock(trade, currentPrice);
	} else if (trade.assetType === TradeAssetType.crypto) {
		return calculatePLForCrypto(trade, currentPrice);
	}
	return calculatePLForForex(trade, currentPrice);
}
