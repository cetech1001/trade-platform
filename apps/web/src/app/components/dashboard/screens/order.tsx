import {Popup} from "../shared/popup";
import {ChangeEvent, useState} from "react";
import {StopLossTakeProfitOptions} from "../shared/stop-loss-take-profit";
import { Account, AlertState, CreateTrade, CurrentAsset, Modals } from '@coinvant/types';
import {closeModal, openModal, placeBid, refreshUserProfile, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";
import { Link } from 'react-router-dom';

interface IProps {
	asset: CurrentAsset | null;
	account: Account | null;
	openModal: (payload: Modals) => void;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
	placeBid: (payload: CreateTrade) => Promise<void>;
	refreshUserProfile: () => Promise<void>;
}

const mapStateToProps = (state: RootState) => ({
	asset: state.tradeAsset.currentAsset,
	account: state.user.currentAccount,
});

const actions = {
	openModal,
	closeModal,
	showAlert,
	placeBid,
	refreshUserProfile,
};

export const Order = connect(mapStateToProps, actions)((props: IProps) => {
	const [bidAmount, setBidAmount] = useState("");
	const [leverage, setLeverage] = useState(1);
	const [stopLoss, setStopLoss] = useState("");
	const [takeProfit, setTakeProfit] = useState("");
	const [openingPrice, setOpeningPrice] = useState("");
	const [executeAt, setExecuteAt] = useState<string>();
	const [time, setTime] = useState("");

	const reset = () => {
		setBidAmount("");
		setLeverage(1);
		setStopLoss("");
		setTakeProfit("");
		setOpeningPrice("");
		setExecuteAt(undefined);
		setTime("");
	}

	const add = () => {
		const remainder = +bidAmount % 10;
		setBidAmount(`${+bidAmount + (10 - remainder)}`);
	}

	const subtract = () => {
		if (+bidAmount > 0) {
			const remainder = +bidAmount % 10;
			if (remainder > 0) {
				setBidAmount(`${+bidAmount - remainder}`);
			} else {
				setBidAmount(`${+bidAmount - 10}`);
			}
		}
	}

	const handleTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedTime = event.target.value;
		setTime(selectedTime);

		const currentDate = new Date();
		const [hours, minutes] = selectedTime.split(':');

		const selectedDateTime = new Date();
		selectedDateTime.setHours(parseInt(hours));
		selectedDateTime.setMinutes(parseInt(minutes));
		selectedDateTime.setSeconds(0);

		if (selectedDateTime > currentDate) {
			setExecuteAt(selectedDateTime.toDateString());
		} else {
			props.showAlert({
				show: true,
				message: 'Selected time must be in the future',
				type: 'error',
			});
		}
	};

	const onBid = async (isShort?: boolean) => {
		if (!props.asset) {
			return props.showAlert({
				show: true,
				message: 'Please select a trading asset',
				type: 'error',
			});
		}

		if (!props.account) {
			return props.showAlert({
				show: true,
				message: 'Please select a trading account',
				type: 'error',
			});
		}

		if (!bidAmount || +bidAmount < 10) {
			return props.showAlert({
				show: true,
				message: 'Please select an amount greater than 10',
				type: 'error',
			});
		}

		await props.placeBid({
			bidAmount: +bidAmount,
			leverage,
			stopLoss: stopLoss ? +stopLoss : undefined,
			takeProfit: takeProfit ? +takeProfit : undefined,
			isShort: !!isShort,
			openingPrice: openingPrice ? +openingPrice : undefined,
			executeAt: executeAt || undefined,
			assetType: props.asset.type,
			assetID: props.asset.id,
			accountID: props.account.id,
		});
		await props.refreshUserProfile();
		reset();
	}

	const Multiplier = () => (
		<div className={'multiplier'}>
			<span>Multiplier</span>
			<p className={'option'}>
				<span className={'x-sign'}>x</span>{leverage}
			</p>
		</div>
	);

	const PendingOrders = () => (
		<div className={'enable-orders'}>
			<span>Pending Orders</span>
			<i className="fa-solid fa-clock"></i>
		</div>
	)

	const MultiplierOptions = () => (
		<div className={'trade-options'}>
			<p>Multiplier</p>
			<div className={'options-block'}>
				<div className={'options'}>
					<div className={`option ${leverage === 1 && 'active'}`}
					     onClick={() => setLeverage(1)}>
						<span className={'x-sign'}>x</span>1
					</div>
					<div className={`option ${leverage === 10 && 'active'}`}
					     onClick={() => setLeverage(10)}>
						<span className={'x-sign'}>x</span>10
					</div>
				</div>
				<div className={'options'}>
					<div className={`option ${leverage === 25 && 'active'}`}
					     onClick={() => setLeverage(25)}>
						<span className={'x-sign'}>x</span>25
					</div>
					<div className={`option ${leverage === 50 && 'active'}`}
					     onClick={() => setLeverage(50)}>
						<span className={'x-sign'}>x</span>50
					</div>
				</div>
			</div>
		</div>
	);

	const PendingOrderOptions = () => {
		const [activeTab, setActiveTab] = useState<'bp' | 'bt'>('bp');
		return (
			<div className={'trade-options'}>
				<p>Execute Order At</p>
				<div className="tabs">
					<button className={`${activeTab === 'bp' && 'active'}`}
					        onClick={() => setActiveTab('bp')}>Price
					</button>
					<button className={`${activeTab === 'bt' && 'active'}`}
					        onClick={() => setActiveTab('bt')}>Time
					</button>
				</div>
				<div className={'sl-tp-option'}>
					{activeTab === 'bp' && (
						<div className={'input'}>
							<span>Opening Price</span>
							<div className={'input-field'}>
								<input type={'number'} step={0.00000001} value={openingPrice}
								       onChange={e =>
									       setOpeningPrice(e.target.value)}/>
							</div>
						</div>
					)}
					{activeTab === 'bt' && (
						<div className={'input'}>
							<span>Opening Time</span>
							<div className={'input-field'}>
								<input type={'time'} onChange={handleTimeChange} value={time}/>
							</div>
						</div>
					)}
				</div>
				{/*<button className={"save"} onClick={}>Save</button>*/}
			</div>
		);
	};

	return (
		<div className="create-trade">
			<div className={'top-buttons'}>
				<button onClick={() => props.openModal(Modals.payments)}>
					Payments
				</button>
				<Link to={"#"} className={"icon"}
				      onClick={() => props.openModal(Modals.settings)}>
					<i className="fa-solid fa-user"></i>
				</Link>
			</div>
			<div>
				<div className={'amount-input'}>
					<span>Selected Trade Asset</span>
					<input type={'text'} value={props.asset?.symbol || 'N/A'} readOnly={true}/>
				</div>
				<div className={'amount-input'}>
					<span>Amount, $</span>
					<input type={'number'} placeholder={'0'} onChange={e =>
						setBidAmount(e.target.value)} value={bidAmount} />
				</div>
				<div className={'amount-change'}>
					<div className={'subtract'} onClick={subtract}>-</div>
					<div style={{ backgroundColor: 'rgba(14, 15, 18, 1)', flex: 0.1 }} />
					<div className={'add'} onClick={add}>+</div>
				</div>
			</div>
			<Popup popupLauncher={<Multiplier />} popupContent={<MultiplierOptions />} />
			<StopLossTakeProfitOptions takeProfit={takeProfit} setTakeProfit={setTakeProfit}
			                           stopLoss={stopLoss} setStopLoss={setStopLoss}/>
			<Popup popupLauncher={<PendingOrders/>} popupContent={<PendingOrderOptions/>} top={-75}/>
			<div className={'order-buttons'}>
				<button className={'bg-positive cursor-pointer'} onClick={() => onBid()}>
					<span>Buy</span>
					<i className="fa-solid fa-arrow-up"></i>
				</button>
				<button className={'bg-negative cursor-pointer'} onClick={() => onBid(true)}>
					<span>Sell</span>
					<i className="fa-solid fa-arrow-down"></i>
				</button>
			</div>
		</div>
	);
});
