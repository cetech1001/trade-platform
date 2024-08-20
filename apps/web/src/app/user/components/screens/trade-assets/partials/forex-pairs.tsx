import {ForexPair, FindForexPairs} from "@coinvant/types";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {fetchForexPairs, RootState, setCurrentAsset} from "@coinvant/store";

interface IProps {
	base: string;
	term: string;
	assets: ForexPair[];
	totalPages: number;
	fetchForexPairs: (query: FindForexPairs) => Promise<void>;
	setCurrentAsset: (symbol: string) => void;
}

const mapStateToProps = (state: RootState) => ({
	assets: state.tradeAsset.forex.list,
	totalPages: state.tradeAsset.forex.totalPages,
});

const actions = {
	fetchForexPairs,
	setCurrentAsset,
}

export const ForexPairs = connect(mapStateToProps, actions)((props: IProps) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState<FindForexPairs>({
		page: 1,
		limit: 10,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [pairs, setPairs]
		= useState<(ForexPair & { isActive: boolean })[]>([]);

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
		props.fetchForexPairs(query)
			.finally(() => setIsLoading(false));
	}, [query]);

	useEffect(() => {
		setPairs(props.assets.map(asset => ({
			...asset,
			isActive: false,
		})));
	}, [props.assets]);

	useEffect(() => {
		const queryOptions = {
			...query,
			base: props.base || undefined,
			term: props.term || undefined,
		}
		if (query.base !== queryOptions.base || query.term !== queryOptions.term) {
			setQuery({
				...queryOptions,
				page: 1,
			});
		}
	}, [props.base, props.term]);

	const setAsActive = (pair: ForexPair) => {
		const items = pairs.map(asset => {
			if (asset.isActive) {
				return { ...asset, isActive: false };
			}
			return asset;
		});
		setPairs(items.map(asset => {
			if (asset.id === pair.id) {
				return { ...asset, isActive: true };
			}
			return asset;
		}));
		props.setCurrentAsset(`${pair.base}/${pair.term}`);
	}

	const AssetItem = (
		{ asset }: {
			asset: ForexPair & { isActive: boolean };
		}
	) => {
		const [rate, setRate] = useState(0);

		useEffect(() => {
			if (asset) {
				axios.get(`https://api.frankfurter.app/latest?amount=1&from=${asset.base}&to=${asset.term}`)
					.then(({ data }) => setRate(data.rates[asset.term]));
			}
		}, [asset]);

		return (
			<div className={`asset-item ${asset.isActive && 'asset-active'}`}
			     onClick={() => setAsActive(asset)}>
				<div className="flag">
					{asset.image && (
						<img src={asset.image} alt={`${asset.base}/${asset.term} symbol`}
						     style={{ width: "30px", height: "30px" }}/>
					)}
				</div>
				<span className={'name-price'}>
					<span className="name">{asset.base}/{asset.term}</span>
					<span className="price">{rate}</span>
				</span>
				<span className={'change'}>
					<span>{asset.type} Pair</span>
				</span>
			</div>
		)
	}

	return (
		<>
			<div className={'table-header'}>
				<div className={'flag'}>Symbol</div>
				<span className={'name-price'}>Name, Price</span>
				<span className={'change'}>Pair Type</span>
			</div>
			<div className={"table-body"} style={{ height: '55vh' }} ref={scrollContainerRef}>
				{pairs.map((asset) => (
					<AssetItem asset={asset}/>
				))}
			</div>
			<div className={"is-loading"}>
				{isLoading && "Loading..."}
			</div>
		</>
	)
});
