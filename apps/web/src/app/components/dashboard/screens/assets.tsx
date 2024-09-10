import {useState} from "react";
import {USER_ROUTES} from "../../../../routes";
import {
	ForexType,
	StockAssetType,
	StockExchange,
	TradeAssetType
} from "@coinvant/types";
import {Filters} from "./partials/filters";
import {StockOptions} from "./partials/stock-options";
import {ForexPairs} from "./partials/forex-pairs";
import {CryptoCurrencies} from "./partials/crypto-currencies";

interface IProps {
	toggleNav: (route: USER_ROUTES) => void;
}

export const Assets = (props: IProps) => {
	const [activeTab, setActiveTab] = useState<TradeAssetType>(TradeAssetType.forex);
	const [search, setSearch] = useState("");
	const [base, setBase] = useState("");
	const [term, setTerm] = useState("");
	const [cryptoSymbol, setCryptoSymbol] = useState("");
	const [cryptoName, setCryptoName] = useState("");
	const [stockSymbol, setStockSymbol] = useState("");
	const [stockName, setStockName] = useState("");
	const [pairType, setPairType] = useState<ForexType | "">("");
	const [exchange, setExchange] = useState<StockExchange | "">("");
	const [assetType, setAssetType] = useState<StockAssetType | "">("");

	const onSearch = () => {
		if (activeTab === TradeAssetType.forex) {
			setBase(search);
			setTerm(search);
		} else if (activeTab === TradeAssetType.crypto) {
			setCryptoSymbol(search);
			setCryptoName(search);
		} else {
			setStockSymbol(search);
			setStockName(search);
		}
	}

	const changeActiveTab = (activeTab: TradeAssetType) => {
		setActiveTab(prevState => {
			setSearch("");
			if (prevState === TradeAssetType.forex) {
				setBase("");
				setTerm("");
			} else if (prevState === TradeAssetType.crypto) {
				setCryptoSymbol("");
				setCryptoName("");
			} else {
				setStockSymbol("");
				setStockName("");
			}
			return activeTab;
		});
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
					        onClick={() => changeActiveTab(TradeAssetType.forex)}>Forex</button>
					<button className={`${activeTab === TradeAssetType.crypto && 'active'}`}
					        onClick={() => changeActiveTab(TradeAssetType.crypto)}>
						Cryptocurrencies
					</button>
					<button className={`${activeTab === TradeAssetType.stock && 'active'}`}
					        onClick={() => changeActiveTab(TradeAssetType.stock)}>Stocks</button>
				</div>
				<div className={'assets-body'}>
					<div style={{ padding: '0 16px' }}>
						<div className={'search'}>
							<input type="search" placeholder="Search"
							       onChange={e =>
								       setSearch(e.target.value)}/>
							<i className="fa-solid fa-magnifying-glass cursor-pointer"
							   onClick={onSearch}></i>
						</div>
					</div>
					<Filters activeTab={activeTab} pairType={pairType}
					         assetType={assetType} exchange={exchange}
					         setPairType={setPairType} setAssetType={setAssetType}
					         setExchange={setExchange}/>
					{activeTab === TradeAssetType.stock
						&& (<StockOptions symbol={stockSymbol} name={stockName}/>)}
					{activeTab === TradeAssetType.forex
						&& (<ForexPairs base={base} term={term}/>)}
					{activeTab === TradeAssetType.crypto
						&& (<CryptoCurrencies symbol={cryptoSymbol} name={cryptoName}/>)}
				</div>
			</div>
		</div>
	);
};
