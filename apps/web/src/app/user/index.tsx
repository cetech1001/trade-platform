import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {CreateTrade} from "./components/create-trade";
import {Chart} from "./components/chart";
import {FC, useState} from "react";
import {Trades} from "./components/trades";
import {USER_ROUTES} from "../../routes";
import {TradeHistory} from "./components/trade-history";
import {Settings} from "./components/settings";
import {Payments} from "./components/payments";
import {connect} from "react-redux";
import {logout, RootState} from "../../store";
import {AuthUser} from "@coinvant/types";


interface IProps {
  user: Omit<AuthUser, 'password'> | null;
  logout: () => void;
}

const Component: FC<IProps> = (props) => {
  const [activeNav, setActiveNav] = useState<USER_ROUTES>(USER_ROUTES.trades);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const toggleSidebar = (component: 'settings' | 'payments') => {
    if (component === 'settings') {
      setIsSettingsOpen(!isSettingsOpen);
    } else {
      setIsPaymentsOpen(!isPaymentsOpen);
    }
  };

  const toggleNav = (route: USER_ROUTES) => {
    setActiveNav(route);
  }

  return (
    <div className={'main'}>
      <Nav activeTab={activeNav} toggleNav={toggleNav}/>
      {activeNav === USER_ROUTES.home && <Assets/>}
      {activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
      {activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
      <Chart/>
      <CreateTrade toggleSidebar={toggleSidebar}/>
      <Settings isOpen={isSettingsOpen} toggleSidebar={() => toggleSidebar('settings')}
                logout={props.logout} user={props.user}/>
      <Payments isOpen={isPaymentsOpen} toggleSidebar={() => toggleSidebar('payments')}/>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
});

export const User = connect(mapStateToProps, {
  logout
})(Component);
