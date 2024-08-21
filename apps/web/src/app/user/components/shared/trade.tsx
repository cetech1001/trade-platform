import {FC, useState} from "react";
import {StopLossTakeProfitOptions} from "./stop-los-take-profit";

interface ITrade {
	isActive?: boolean;
}

const ExpandedActiveTrade = () => {
	const [stopLoss, setStopLoss] = useState(0);
	const [takeProfit, setTakeProfit] = useState(0);
	return (
		<div className="flex-column" style={{ marginTop: 15 }}>
			<button className={"close-trade-button"} style={{ marginBottom: 15 }}>
				Close Trade: $0.97
			</button>
			<div className="flex-row-space-between">
				<p className={"text"}>Current Quote</p>
				<p style={{fontSize: "0.875rem"}}>2719.405</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Opening Quote</p>
				<p style={{fontSize: "0.875rem"}}>2719.415</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Amount</p>
				<p style={{fontSize: "0.875rem"}}>$119.40</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Trade ID</p>
				<p style={{fontSize: "0.875rem"}}>2719.405</p>
			</div>
			<div className="flex-row-space-between">
				<p className={"text"}>Time</p>
				<p style={{fontSize: "0.875rem"}}>Mar 5, 21:33:07.293</p>
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
				<p className={"text"}>Income</p>
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
				<p className={"text"}>Amount</p>
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

export const Trade: FC<ITrade> = (props) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className={`trade ${isExpanded && 'bg-light-grey'}`}>
			<div className={"flex-row-space-between"} onClick={() => setIsExpanded(!isExpanded)}>
				<div className="asset">
					<img src={"https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg"}
					     alt={"Asset"} className={"symbol"}/>
					<div className={"description"}>
						<span className={"text"}>Bitcoin</span>
						<span className={"amount"}>
            $1.00 <i className={"fa-solid fa-long-arrow-up positive"}></i>
          </span>
					</div>
				</div>
				<span className={"positive"}>-$2.45</span>
			</div>
			{isExpanded && (props.isActive ? <ExpandedActiveTrade/> : <ExpandedTrade/>)}
		</div>
	);
}
