import {useEffect, useState} from "react";
import {StopLossTakeProfitOptions} from "./stop-loss-take-profit";
import {Trade, TradeAssetType, TradeStatus} from "@coinvant/types";
import {
	calculateProfitOrLoss,
	formatCurrency,
	formatDate,
	getCurrentPrice,
} from "../../../helpers";

interface IProps {
	isActive?: boolean;
	trade: Trade;
}

interface ExpandedActiveTradeProps {
	trade: Trade;
	profitOrLoss: number;
	currentPrice: number;
}


const ExpandedActiveTrade = (props: ExpandedActiveTradeProps) => {
	const [stopLoss, setStopLoss] = useState("0");
	const [takeProfit, setTakeProfit] = useState("0");
	return (
		<div className="flex-column" style={{ marginTop: 15 }}>
			<button className={"close-trade-button"} style={{ marginBottom: 15 }}>
				Close Trade: {formatCurrency(props.profitOrLoss)}
			</button>
			<div className="flex-row-space-between">
				<p className={"text"}>Current Quote</p>
				<p style={{fontSize: "0.875rem"}}>{formatCurrency(props.currentPrice)}</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Opening Quote</p>
				<p style={{fontSize: "0.875rem"}}>
					{formatCurrency(props.trade.buyPrice || props.trade.sellPrice)}
				</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Bid Amount</p>
				<p style={{fontSize: "0.875rem"}}>{formatCurrency(props.trade.bidAmount)}</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Trade ID</p>
				<p style={{fontSize: "0.875rem"}}>{props.trade.id}</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Time</p>
				<p style={{fontSize: "0.875rem"}}>{formatDate(props.trade.executeAt)}</p>
			</div>
			<StopLossTakeProfitOptions takeProfit={takeProfit} setTakeProfit={setTakeProfit}
			                           stopLoss={stopLoss} setStopLoss={setStopLoss}
			                           showFullName={true} top={-120} left={0} showButtons={true}/>
		</div>
	);
}

const ExpandedTrade = () => {
	return (
		<div className="flex-column" style={{ marginTop: 30 }}>
			<div className="flex-row-space-between">
				<p className={"text"}>Profit/Loss</p>
				<p style={{fontSize: "0.875rem"}}>$0.00</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Closed</p>
				<p style={{fontSize: "0.875rem"}}>by Stop Out</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Opening Quote</p>
				<p style={{fontSize: "0.875rem"}}>2719.405</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Closing Quote</p>
				<p style={{fontSize: "0.875rem"}}>2719.415</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Bid Amount</p>
				<p style={{fontSize: "0.875rem"}}>$119.40</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Trade ID</p>
				<p style={{fontSize: "0.875rem"}}>2719.405</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Stop Loss</p>
				<p style={{fontSize: "0.875rem"}}>-</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Take Profit</p>
				<p style={{fontSize: "0.875rem"}}>-</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Trade Opened</p>
				<p style={{fontSize: "0.875rem"}}>Mar 5, 21:30:22.717</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Trade Closed</p>
				<p style={{fontSize: "0.875rem"}}>Mar 5, 21:33:07.293</p>
			</div>
		</div>
	);
}

let intervalID: NodeJS.Timeout;

export const TradeItem = (props: IProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [profitOrLoss, setProfitOrLoss] = useState(0);
	const [currentPrice, setCurrentPrice] = useState(0);

	useEffect(() => {
		if (props.trade && props.trade.status === TradeStatus.active) {
			const { trade } = props;
			intervalID = setInterval(async () => {
				const currentPrice = await getCurrentPrice(trade);
				const profitOrLoss = await calculateProfitOrLoss(trade, currentPrice);
				console.log('Current price: ', currentPrice);
				console.log('Profit or Loss: ', profitOrLoss);
				setCurrentPrice(currentPrice);
				setProfitOrLoss(profitOrLoss);
			}, 30000);
		}

		return () => {
			clearInterval(intervalID);
		}
	}, [props.trade]);

	return (
		<div className={`trade ${isExpanded && 'bg-light-grey'}`}>
			<div className={"flex-row-space-between"} onClick={() => setIsExpanded(!isExpanded)}>
				<div className="asset">
					{[TradeAssetType.forex, TradeAssetType.crypto].includes(props.trade.assetType)
						? (
							<img src={(props.trade.forex || props.trade.crypto).image}
							     alt={"Asset"} className={"symbol"} style={{ height: 24, width: 24 }}/>
						) : (
							<img
								src={"https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg"}
								alt={"Asset"} className={"symbol"}/>
						)}
					<div className={"description"}>
						{props.trade.assetType === TradeAssetType.crypto && (
							<span className={"text"}>{props.trade.crypto.symbol.toUpperCase()}</span>
						)}
						{props.trade.assetType === TradeAssetType.stock && (
							<span className={"text"}>{props.trade.stock.symbol.toUpperCase()}</span>
						)}
						{props.trade.assetType === TradeAssetType.forex && (
							<span className={"text"}>{`${props.trade.forex.base}/${props.trade.forex.term}`}</span>
						)}
						<span className={"amount"}>
				            {formatCurrency(props.trade.bidAmount)}
						</span>
					</div>
				</div>
				{props.trade.status === TradeStatus.active && (
					<span className={profitOrLoss >= 0 ? 'positive' : 'negative'}>
						{profitOrLoss > 0 && '+'}{formatCurrency(profitOrLoss)}&nbsp;
						{profitOrLoss !== 0 && (
							<i className={`fa-solid fa-long-arrow-${profitOrLoss > 0
								? 'up' : 'down'} ${profitOrLoss > 0 ? 'positive' : 'negative'}`}></i>
						)}
					</span>
				)}
				{props.trade.status === TradeStatus.pending && (
					<span>{formatCurrency(0)}</span>
				)}
				{props.trade.status === TradeStatus.pending && (
					<span>{formatCurrency(props.trade.profitOrLoss)}</span>
				)}
			</div>
			{isExpanded && (props.isActive
				? (
					<ExpandedActiveTrade trade={props.trade}
					                     currentPrice={currentPrice}
					                     profitOrLoss={profitOrLoss}/>
				) : <ExpandedTrade/>)}
		</div>
	);
}
