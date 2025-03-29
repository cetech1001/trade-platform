import {CryptoCurrency, CurrentAsset, FindCryptoCurrencies, TradeAssetType} from "@coinvant/types";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {formatCurrency, roundPercent} from "../../../../helpers";
import {connect} from "react-redux";
import {fetchCryptoCurrencies, RootState, setCurrentAsset} from "@coinvant/store";
import { useIsMobile } from '../../../../../hooks';
import { USER_ROUTES } from '../../../../../routes';

interface IProps {
	symbol: string;
	name: string;
	assets: CryptoCurrency[];
	totalPages: number;
	fetchCryptoCurrencies: (query: FindCryptoCurrencies) => Promise<void>;
	setCurrentAsset: (asset: CurrentAsset) => void;
  toggleNav: (route: USER_ROUTES) => void;
}

const mapStateToProps = (state: RootState) => ({
	assets: state.tradeAsset.crypto.list,
	totalPages: state.tradeAsset.crypto.totalPages,
});

const actions = {
	fetchCryptoCurrencies,
	setCurrentAsset,
}

export const CryptoCurrencies = connect(mapStateToProps, actions)((props: IProps) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState<FindCryptoCurrencies>({
		page: 1,
		limit: 10,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currencies, setCurrencies]
		= useState<(CryptoCurrency & { isActive: boolean })[]>([]);
	const [coins, setCoins] = useState([]);
  const isMobile = useIsMobile();

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
		props.fetchCryptoCurrencies(query)
			.finally(() => setIsLoading(false));
	}, [query]);

	useEffect(() => {
		axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
			.then((response) => setCoins(response.data));
	}, []);

	useEffect(() => {
		setCurrencies(props.assets.map(asset => ({
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

	const setAsActive = (currency: CryptoCurrency) => {
		const items = currencies.map(asset => {
			if (asset.isActive) {
				return { ...asset, isActive: false };
			}
			return asset;
		});
		setCurrencies(items.map(asset => {
			if (asset.id === currency.id) {
				return { ...asset, isActive: true };
			}
			return asset;
		}));
		props.setCurrentAsset({
      id: currency.id,
      symbol: currency.symbol,
      type: TradeAssetType.crypto,
      currencyID: currency.currencyID,
    });

    if (isMobile) {
      props.toggleNav(USER_ROUTES.chart);
    }
	}

	const AssetItem = (
		{ asset, coins }: {
			asset: CryptoCurrency & { isActive: boolean };
			coins: any[];
		}
	) => {
		const [coin, setCoin] = useState<any>();
		const [changeType, setChangeType] = useState("");
		const [changeSign, setChangeSign] = useState("");

		useEffect(() => {
			setCoin(coins.find((c: any) => c.id === asset.currencyID));
		}, []);

		useEffect(() => {
			if (coin) {
				if (coin.price_change_percentage_24h < 0) {
					setChangeType('negative');
				} else if (coin.price_change_percentage_24h > 0) {
					setChangeType('positive');
					setChangeSign('+');
				}
			}
		}, [coin]);

		return (
			<div className={`asset-item ${asset.isActive && 'asset-active'}`}
			     onClick={() => setAsActive(asset)}>
				<div className="flag">
					<img src={asset.image} alt={`${asset.name} symbol`}/>
				</div>
				<span className={'name-price'}>
					<span className="name">{asset.name} ({asset.symbol.toUpperCase()})</span>
					<span className="price">{formatCurrency(coin?.current_price)}</span>
				</span>
				<span className={'change'}>
					<span className={changeType}>
						{`${changeSign}${roundPercent(coin?.price_change_percentage_24h)}`}%
					</span>
				</span>
			</div>
		)
	}

	return (
		<>
			<div className={'table-header'}>
				<div className={'flag'}>Symbol</div>
				<span className={'name-price'}>Name, Price</span>
				<span className={'change'}>24h Price Change</span>
			</div>
			<div className={"table-body"} ref={scrollContainerRef}>
				{coins.length > 0 && currencies.map((asset) => (
					<AssetItem asset={asset} coins={coins} key={asset.id}/>
				))}
			</div>
			<div className={"is-loading"}>
				{isLoading && "Loading..."}
			</div>
		</>
	)
});
