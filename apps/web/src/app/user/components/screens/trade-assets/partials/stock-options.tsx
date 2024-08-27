import {CurrentAsset, FindStockOptions, StockOption, TradeAssetType} from "@coinvant/types";
import {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {fetchStockOptions, RootState, setCurrentAsset} from "@coinvant/store";
import {wrapWord} from "../../../../../helpers";

interface IProps {
	symbol: string;
	name: string;
	assets: StockOption[];
	totalPages: number;
	fetchStockOptions: (query: FindStockOptions) => Promise<void>;
	setCurrentAsset: (asset: CurrentAsset) => void;
}

const mapStateToProps = (state: RootState) => ({
	assets: state.tradeAsset.stock.list,
	totalPages: state.tradeAsset.stock.totalPages,
});

const actions = {
	fetchStockOptions,
	setCurrentAsset,
}

export const StockOptions = connect(mapStateToProps, actions)((props: IProps) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState<FindStockOptions>({
		page: 1,
		limit: 10,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [stockOptions, setStockOptions]
		= useState<(StockOption & { isActive: boolean })[]>([]);

	const handleScroll = () => {
		const container = scrollContainerRef.current;
		if (container) {
			const bottom =
				container.scrollHeight - container.scrollTop <= container.clientHeight + 500;
			if (bottom && !isLoading && query.page < props.totalPages) {
				setQuery(prevState => ({
					...prevState,
					page: prevState.page + 1,
				}))
			}
		}
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [handleScroll]);


	useEffect(() => {
		setIsLoading(true);
		props.fetchStockOptions(query)
			.finally(() => setIsLoading(false));
	}, [query]);

	useEffect(() => {
		setStockOptions(props.assets.map(asset => ({
			...asset,
			isActive: false,
		})));
	}, [props.assets]);

	useEffect(() => {
		const queryOptions = {
			...query,
			symbol: props.symbol || undefined,
			name: props.name || undefined,
		}
		if (query.symbol !== queryOptions.symbol || query.name !== queryOptions.name) {
			setQuery({
				...queryOptions,
				page: 1,
			});
		}
	}, [props.symbol, props.name]);

	const setAsActive = (stock: StockOption) => {
		const items = stockOptions.map(asset => {
			if (asset.isActive) {
				return { ...asset, isActive: false };
			}
			return asset;
		});
		setStockOptions(items.map(asset => {
			if (asset.id === stock.id) {
				return { ...asset, isActive: true };
			}
			return asset;
		}));
		props.setCurrentAsset({
			id: stock.id,
			symbol: stock.symbol,
			type: TradeAssetType.stock,
		});
	}

	const AssetItem = (
		{ asset }: {
			asset: StockOption & { isActive: boolean };
		}
	) => {
		return (
			<div className={`asset-item ${asset.isActive && 'asset-active'}`}
			     onClick={() => setAsActive(asset)}>
				<div className="flag">
					<span>{asset.symbol}</span>
				</div>
				<span className={'name-price'}>
					<span className="name">{wrapWord(asset.name)}</span>
					<span className="price">{asset.assetType}</span>
				</span>
				<span className={'change'}>
					<span>{asset.exchange}</span>
				</span>
			</div>
		)
	}

	return (
		<>
			<div className={'table-header'}>
				<div className={'flag'}>Symbol</div>
				<span className={'name-price'}>Name, Type</span>
				<span className={'change'}>Exchange</span>
			</div>
			<div className={"table-body"} style={{ height: '55vh' }} ref={scrollContainerRef}>
				{stockOptions.map((asset) => (
					<AssetItem asset={asset} key={asset.id}/>
				))}
			</div>
			<div className={"is-loading"}>
				{isLoading && "Loading..."}
			</div>
		</>
	)
});
