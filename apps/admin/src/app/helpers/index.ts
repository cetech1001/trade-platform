export const formatCurrency = (amount: number | string = 0): string => {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(Number(amount));
}

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const formattedDate = date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).toUpperCase();
	const formattedTime = date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});

	return `${formattedDate}, ${formattedTime}`;
};
