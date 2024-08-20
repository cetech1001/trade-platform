import {Nav} from "./components/layout/nav";
import {CreateTrade} from "./components/screens/create-trade";
import {Chart} from "./components/screens/chart";
import {useState} from "react";
import {Trades} from "./components/screens/trades";
import {USER_ROUTES} from "../../routes";
import {TradeHistory} from "./components/screens/trade-history";
import {Settings} from "./components/modals/settings";
import {Payments} from "./components/modals/payments";
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

export const User = () => {
	const [activeNav, setActiveNav] = useState<USER_ROUTES>(USER_ROUTES.home);

	const toggleNav = (route: USER_ROUTES) => {
		setActiveNav(route);
	}

	return (
		<div className={'main'}>
			<Nav activeTab={activeNav} toggleNav={toggleNav}/>
			{activeNav === USER_ROUTES.home && <Assets toggleNav={toggleNav}/>}
			{activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
			{activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
			<Chart/>
			<CreateTrade/>
			<Settings/>
			<Payments/>
			<UpdateProfile/>
			<UpdatePassword/>
			<Deposit/>
			<Withdrawal/>
			<Transactions/>
		</div>
	);
};
