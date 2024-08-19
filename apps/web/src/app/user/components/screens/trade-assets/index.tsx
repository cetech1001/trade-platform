import {useState} from "react";
import {USER_ROUTES} from "../../../../../routes";
import {
	CryptoCurrency,
	FindCryptoCurrencies,
	FindForexPairs,
	FindStockOptions,
	ForexPair,
	ForexType,
	StockAssetType,
	StockExchange,
	StockOption,
	TradeAssetType
} from "@coinvant/types";
import {Filters} from "./partials/filters";
import {StockOptions} from "./partials/stock-options";
import {ForexPairs} from "./partials/forex-pairs";
import {CryptoCurrencies} from "./partials/crypto-currencies";

interface IProps {
	stockOptions: StockOption[];
	forexPairs: ForexPair[];
	cryptoCurrencies: CryptoCurrency[];
	toggleNav: (route: USER_ROUTES) => void;
	fetchStockOptions: (query: FindStockOptions) => void;
	fetchCryptoCurrencies: (query: FindCryptoCurrencies) => Promise<void>;
	fetchForexPairs: (query: FindForexPairs) => void;
}

export const Assets = (props: IProps) => {
	const [activeTab, setActiveTab] = useState<TradeAssetType>(TradeAssetType.crypto);
	const [search, setSearch] = useState("");

	const [symbol, setSymbol] = useState("");
	const [name, setName] = useState("");
	const [pairType, setPairType] = useState<ForexType | "">("");
	const [exchange, setExchange] = useState<StockExchange | "">("");
	const [assetType, setAssetType] = useState<StockAssetType | "">("");

	const onSearch = () => {
		setSymbol(search);
		setName(search);
	}

	return (
		<div className={"assets"}>
			<div className="asset-list">
				<div className={"title"}>
					<h3>Assets</h3>
					<div className={"icons"}>
						<i className="fa-solid fa-xmark"
						   onClick={() => props.toggleNav(USER_ROUTES.blank)}></i>
					</div>
				</div>
				<div className="tabs">
					<button className={`${activeTab === TradeAssetType.forex && 'active'}`}
					        onClick={() => setActiveTab(TradeAssetType.forex)}>Forex</button>
					<button className={`${activeTab === TradeAssetType.crypto && 'active'}`}
					        onClick={() => setActiveTab(TradeAssetType.crypto)}>Cryptocurrencies</button>
					<button className={`${activeTab === TradeAssetType.stocks && 'active'}`}
					        onClick={() => setActiveTab(TradeAssetType.stocks)}>Stocks</button>
				</div>
				<div className={'assets-body'}>
					<div style={{ padding: '0 16px' }}>
						<div className={'search'}>
							<input type="search" placeholder="Search"
							       onChange={e => setSearch(e.target.value)}/>
							<i className="fa-solid fa-magnifying-glass cursor-pointer" onClick={onSearch}></i>
						</div>
					</div>
					<Filters activeTab={activeTab} pairType={pairType} assetType={assetType} exchange={exchange}
					         setPairType={setPairType} setAssetType={setAssetType} setExchange={setExchange}/>
					{activeTab === TradeAssetType.stocks && (<StockOptions assets={props.stockOptions}/>)}
					{activeTab === TradeAssetType.forex && (<ForexPairs assets={props.forexPairs}/>)}
					{activeTab === TradeAssetType.crypto && (<CryptoCurrencies symbol={symbol} name={name}/>)}
				</div>
			</div>
		</div>
	);
};
