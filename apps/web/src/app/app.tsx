import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {CreateTrade} from "./components/create-trade";
import {Chart} from "./components/chart";
import {useState} from "react";
import {Trades} from "./components/trades";
import {ROUTES} from "./constants";
import {TradeHistory} from "./components/trade-history";
import {Settings} from "./components/settings";

export const App = () => {
  const [activeNav, setActiveNav] = useState<ROUTES>(ROUTES.trades);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <Settings isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
    </div>
  );
}
