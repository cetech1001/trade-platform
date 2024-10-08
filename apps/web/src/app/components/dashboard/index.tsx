import { useEffect, useState } from 'react';
import { USER_ROUTES } from '../../../routes';
import { useIsMobile } from '../../../hooks';
import { TopBar } from './layout/top-bar';
import { Nav } from './layout/nav';
import { Assets } from './screens/assets';
import { Trades } from './screens/trades';
import { TradeHistory } from './screens/history';
import { Chart } from './screens/chart';
import { Order } from './screens/order';
import { Modals } from './modals';
import { Support } from './screens/support';
import '../../styles/Assets.css';
import '../../styles/Chart.css';
import '../../styles/Order.css';
import '../../styles/Deposit.css';
import '../../styles/Dropdown.css';
import '../../styles/Nav.css';
import '../../styles/Popup.css';
import '../../styles/Sidebar.css';
import '../../styles/TradeHistory.css';
import '../../styles/Trades.css';
import '../../styles/TopBar.css';
import '../../styles/OTP.css';
import { connect } from 'react-redux';
import { refreshUserProfile } from '@coinvant/store';

interface IProps {
	refreshUserProfile: () => Promise<void>;
}

const actions = {
	refreshUserProfile,
}

export const Dashboard = connect(null, actions)((props: IProps) => {
	const isMobile = useIsMobile();
	const [activeNav, setActiveNav] = useState<USER_ROUTES>(isMobile ? USER_ROUTES.chart : USER_ROUTES.home);

	const toggleNav = (route: USER_ROUTES) => {
		setActiveNav(route);
	}

	useEffect(() => {
		const handleRefresh = async () => {
			await props.refreshUserProfile();
		};

		window.addEventListener('load', handleRefresh);

		return () => {
			window.removeEventListener('load', handleRefresh);
		};
	}, []);

	return (
		<div className={'main'}>
			<TopBar/>
			<Nav activeTab={activeNav} toggleNav={toggleNav}/>
			{!isMobile ? (
				<>
					{activeNav === USER_ROUTES.home && <Assets toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.help && <Support toggleNav={toggleNav}/>}
					<Chart/>
					<Order/>
				</>
			) : (
				<div className={'main-content'}>
					{activeNav === USER_ROUTES.home && <Assets toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
					{activeNav === USER_ROUTES.chart && <Chart/>}
					{activeNav === USER_ROUTES.order && <Order/>}
					{activeNav === USER_ROUTES.help && <Support toggleNav={toggleNav}/>}
				</div>
			)}
			<Modals/>
		</div>
	);
});
