export interface PaginationOptions {
	limit: number;
	page: number;
}

export interface Paginated<T> {
	items: T[];
	meta: {
		totalItems: number;
		itemCount: number;
		itemsPerPage: number;
		totalPages: number;
		currentPage: number;
	}
}
