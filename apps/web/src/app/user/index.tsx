import {Nav} from "./components/layout/nav";
import {CreateTrade} from "./components/screens/create-trade";
import {Chart} from "./components/screens/chart";
import {useEffect, useState} from "react";
import {Trades} from "./components/screens/trades";
import {USER_ROUTES} from "../../routes";
import {TradeHistory} from "./components/screens/trade-history";
import {Settings} from "./components/modals/settings";
import {Payments} from "./components/modals/payments";
import {connect} from "react-redux";
import {
	closeModal,
	logout,
	RootState,
	openModal,
	editUser,
	showAlert,
	refreshUserProfile,
	fetchPaymentMethods,
	addDeposit,
	addWithdrawal,
	fetchTransactions, fetchStockOptions
} from "@coinvant/store";
import {
	AlertState,
	AuthUser,
	CreateWithdrawal, CryptoCurrency, FindCryptoCurrencies, FindForexPairs, FindStockOptions, ForexPair,
	Modals, PaginationOptions,
	PaymentMethod, StockOption, Transaction, TransactionsQuery,
	UpdateUser
} from "@coinvant/types";
import {UpdateProfile} from "./components/modals/update-profile";
import {UpdatePassword} from "./components/modals/update-password";
import {Deposit} from "./components/modals/deposit";
import {Withdrawal} from "./components/modals/withdrawal";
import {Transactions} from "./components/modals/transactions";
import {Assets} from "./components/screens/trade-assets";

import "./styles/Assets.css";
import "./styles/Chart.css";
import "./styles/CreateTrade.css";
import "./styles/Deposit.css";
import "./styles/Dropdown.css";
import "./styles/Nav.css";
import "./styles/Popup.css";
import "./styles/Sidebar.css";
import "./styles/TradeHistory.css";
import "./styles/Trades.css";


interface IProps {
	user: Omit<AuthUser, 'password'> | null;
	activeModal: Modals | null;
	paymentMethods: PaymentMethod[];
	transactions: Transaction[];
	totalTransactions: number;
	stockOptions: StockOption[];
	forexPairs: ForexPair[];
	cryptoCurrencies: CryptoCurrency[];
	logout: () => void;
	openModal: (activeModal: Modals) => void;
	closeModal: () => void;
	editUser: (id: string, payload: UpdateUser) => Promise<void>;
	showAlert: (payload: AlertState) => void;
	refreshUserProfile: () => Promise<void>;
	fetchPaymentMethods: (options?: PaginationOptions) => void;
	addDeposit: (payload: FormData) => Promise<void>;
	addWithdrawal: (payload: CreateWithdrawal) => Promise<void>;
	fetchTransactions: (options?: TransactionsQuery) => void;
	fetchStockOptions: (query: FindStockOptions) => void;
}

const mapStateToProps = (state: RootState) => ({
	user: state.auth.user,
	activeModal: state.modal.activeModal,
	paymentMethods: state.paymentMethod.list,
	transactions: state.transaction.list,
	totalTransactions: state.transaction.count,
	stockOptions: state.tradeAsset.stock.list,
	forexPairs: state.tradeAsset.forex.list,
	cryptoCurrencies: state.tradeAsset.crypto.list,
});

const actions = {
	logout,
	openModal,
	closeModal,
	editUser,
	showAlert,
	refreshUserProfile,
	fetchPaymentMethods,
	addDeposit,
	addWithdrawal,
	fetchTransactions,
	fetchStockOptions,
};

export const User = connect(mapStateToProps, actions)((props: IProps) => {
	const [activeNav, setActiveNav] = useState<USER_ROUTES>(USER_ROUTES.home);

	useEffect(() => {
		props.fetchPaymentMethods();
	}, []);

	const toggleNav = (route: USER_ROUTES) => {
		setActiveNav(route);
	}

	return (
		<div className={'main'}>
			<Nav activeTab={activeNav} toggleNav={toggleNav} logout={props.logout}
			     openModal={props.openModal} activeModal={props.activeModal}/>
			{activeNav === USER_ROUTES.home
				&& <Assets toggleNav={toggleNav} cryptoCurrencies={props.cryptoCurrencies}
				           forexPairs={props.forexPairs} stockOptions={props.stockOptions}
				           fetchStockOptions={props.fetchStockOptions}/>}
			{activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
			{activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
			<Chart/>
			<CreateTrade openModal={props.openModal} closeModal={props.closeModal}/>
			<Settings openModal={props.openModal} activeModal={props.activeModal}
			          logout={props.logout} user={props.user} closeModal={props.closeModal}/>
			<Payments openModal={props.openModal} activeModal={props.activeModal}
			          closeModal={props.closeModal}/>
			<UpdateProfile openModal={props.openModal} activeModal={props.activeModal}
			               closeModal={props.closeModal} user={props.user}
			               editUser={props.editUser} showAlert={props.showAlert}
			               refreshUserProfile={props.refreshUserProfile}/>
			<UpdatePassword activeModal={props.activeModal} openModal={props.openModal}
			                closeModal={props.closeModal} user={props.user}
			                editUser={props.editUser} showAlert={props.showAlert}/>
			<Deposit/>
			<Withdrawal/>
			<Transactions/>
		</div>
	);
});
