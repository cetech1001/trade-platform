import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {Sidebar} from "./components/sidebar";
import {Chart} from "./components/chart";
import {useState} from "react";
import {Trades} from "./components/trades";
import {ROUTES} from "./constants";
import {TradeHistory} from "./components/trade-history";

export const App = () => {
  const [activeNav, setActiveNav] = useState<ROUTES>(ROUTES.trades);
  return (
    <div className={'main'}>
      <Nav activeTab={activeNav} setActiveNav={setActiveNav}/>
      {activeNav === ROUTES.home && <Assets/>}
      {activeNav === ROUTES.trades && <Trades setActiveNav={setActiveNav}/>}
      {activeNav === ROUTES.history && <TradeHistory setActiveNav={setActiveNav}/>}
      <Chart/>
      <Sidebar/>
    </div>
  );
}
