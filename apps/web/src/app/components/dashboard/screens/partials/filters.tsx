import {ForexType, StockAssetType, StockExchange, TradeAssetType} from "@coinvant/types";
import {FilterDropdown} from "../../shared/filter-dropdown";
import {Dispatch, SetStateAction} from "react";

interface IProps {
	activeTab: TradeAssetType;
	pairType: ForexType | "";
	assetType: StockAssetType | "";
	exchange: StockExchange | "";
	setPairType: Dispatch<SetStateAction<ForexType | "">>;
	setAssetType: Dispatch<SetStateAction<StockAssetType | "">>;
	setExchange: Dispatch<SetStateAction<StockExchange | "">>;
}

export const Filters = (props: IProps) => {
	const pairTypeAction = (value: string) => {
		if (value !== props.pairType) {
			props.setPairType(value as ForexType);
		}
	}

	const assetTypeAction = (value: string) => {
		if (value !== props.assetType) {
			props.setAssetType(value as StockAssetType);
		}
	}

	const exchangeAction = (value: string) => {
		if (value !== props.exchange) {
			props.setExchange(value as StockExchange);
		}
	}

	return (
		<div className={'filters'}>
			{props.activeTab === TradeAssetType.forex && (
				<FilterDropdown title={"All Pair Types"} options={Object.values(ForexType)}
				                default={"All"} action={pairTypeAction}/>
			)}
			{props.activeTab === TradeAssetType.stock && (
				<FilterDropdown title={"All Exchanges"} options={Object.values(StockExchange)}
				                default={"All"} action={exchangeAction}/>
			)}
			{props.activeTab === TradeAssetType.stock && (
				<FilterDropdown title={"All Asset Types"} options={Object.values(StockAssetType)}
				                default={"All"} action={assetTypeAction}/>
			)}
		</div>
	);
}
