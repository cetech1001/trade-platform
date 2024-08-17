import {Transaction} from "@coinvant/types";

export const formatCurrency = (amount: number | string): string => {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number(amount));
}

export const groupTransactionsByDate = (transactions: Transaction[]) => {
	const groupedTransactions: Record<string, Transaction[]> = {};

	transactions.forEach((transaction) => {
		const date = new Date(transaction.createdAt).toISOString().split('T')[0];
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
