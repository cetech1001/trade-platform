import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {CreateTrade} from "./components/create-trade";
import {Chart} from "./components/chart";
import {useState} from "react";
import {Trades} from "./components/trades";
import {ROUTES} from "./constants";
import {TradeHistory} from "./components/trade-history";
import {Settings} from "./components/settings";
import {Payments} from "./components/payments";

export const App = () => {
  const [activeNav, setActiveNav] = useState<ROUTES>(ROUTES.trades);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const toggleSidebar = (component: 'settings' | 'payments') => {
    if (component === 'settings') {
      setIsSettingsOpen(!isSettingsOpen);
    } else {
      setIsPaymentsOpen(!isPaymentsOpen);
    }
  };

  const toggleNav = (route: ROUTES) => {
    setActiveNav(route);
  }

  return (
    <div className={'main'}>
      <Nav activeTab={activeNav} toggleNav={toggleNav}/>
      {activeNav === ROUTES.home && <Assets/>}
      {activeNav === ROUTES.trades && <Trades toggleNav={toggleNav}/>}
      {activeNav === ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
      <Chart/>
      <CreateTrade toggleSidebar={toggleSidebar}/>
      <Settings isOpen={isSettingsOpen} toggleSidebar={() => toggleSidebar('settings')}/>
      <Payments isOpen={isPaymentsOpen} toggleSidebar={() => toggleSidebar('payments')}/>
    </div>
  );
}
