import { useEffect, useState } from 'react';
import { StopLossTakeProfitOptions } from './stop-loss-take-profit';
import { Trade, TradeAssetType, TradeStatus, UpdateTrade } from '@coinvant/types';
import { formatCurrency, formatDate } from '../../../helpers';
import { connect } from 'react-redux';
import { updateTrade } from '@coinvant/store';

interface IProps {
	trade: Trade;
	updateTrade: (id: string, payload: UpdateTrade) => Promise<void>;
}

const actions = {
	updateTrade,
};

export const TradeItem = connect(null, actions)((props: IProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const editTrade = (payload: UpdateTrade) => {
		props.updateTrade(props.trade.id, payload)
			.finally(() => setIsExpanded(false));
	}

	const ExpandedActiveTrade = (props: { trade: Trade }) => {
		const [stopLoss, setStopLoss] = useState("");
		const [takeProfit, setTakeProfit] = useState("");

		useEffect(() => {
			if (props.trade.stopLoss) {
				setStopLoss(`${props.trade.stopLoss}`)
			}
			if (props.trade.takeProfit) {
				setTakeProfit(`${props.trade.takeProfit}`)
			}
		}, [props.trade]);

		return (
			<div className="flex-column" style={{ marginTop: 15 }}>
				<button className={"close-trade-button"} style={{ marginBottom: 15 }}
				        onClick={() => editTrade({ status: TradeStatus.closed })}>
					Close Trade: {formatCurrency(props.trade.profitOrLoss)}
				</button>
				<div className="flex-row-space-between">
					<p className={"text"}>Current Quote</p>
					<p style={{fontSize: "0.875rem"}}>{formatCurrency(props.trade.currentPrice)}</p>
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
				                           showFullName={true} left={0} showButtons={true}
				                           onSave={() => editTrade({ stopLoss: +stopLoss, takeProfit: +takeProfit })}/>
			</div>
		);
	}

	const ExpandedTrade = (props: { trade: Trade }) => {
		return (
			<div className="flex-column" style={{ marginTop: 30 }}>
				<div className="flex-row-space-between">
					<p className={"text"}>Profit/Loss</p>
					<p style={{fontSize: "0.875rem"}}>{formatCurrency(props.trade.profitOrLoss)}</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Closed</p>
					<p style={{fontSize: "0.875rem"}}>by {props.trade.closureReason}</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Opening Quote</p>
					<p style={{fontSize: "0.875rem"}}>
						{formatCurrency(props.trade.isShort
							? props.trade.sellPrice : props.trade.buyPrice)}
					</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Closing Quote</p>
					<p style={{fontSize: "0.875rem"}}>
						{formatCurrency(props.trade.isShort
							? props.trade.buyPrice : props.trade.sellPrice)}
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
					<p className={"text"}>Stop Loss</p>
					<p style={{fontSize: "0.875rem"}}>{props.trade.stopLoss || '-'}</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Take Profit</p>
					<p style={{fontSize: "0.875rem"}}>{props.trade.takeProfit || '-'}</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Trade Opened</p>
					<p style={{fontSize: "0.875rem"}}>{formatDate(props.trade.executeAt)}</p>
				</div>
				<div className="flex-row-space-between">
					<p className={"text"}>Trade Closed</p>
					<p style={{fontSize: "0.875rem"}}>{formatDate(props.trade.closedAt)}</p>
				</div>
			</div>
		);
	}

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
					<span className={props.trade.profitOrLoss >= 0 ? 'positive' : 'negative'}>
						{props.trade.profitOrLoss > 0 && '+'}{formatCurrency(props.trade.profitOrLoss)}&nbsp;
						{+props.trade.profitOrLoss !== 0 && (
							<i className={`fa-solid fa-long-arrow-${+props.trade.profitOrLoss > 0
								? 'up' : 'down'} ${+props.trade.profitOrLoss > 0 ? 'positive' : 'negative'}`}></i>
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
			{isExpanded && (props.trade.status === TradeStatus.active
				? <ExpandedActiveTrade trade={props.trade}/>
				: <ExpandedTrade trade={props.trade}/>)}
		</div>
	);
});
