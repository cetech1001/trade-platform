import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {Sidebar} from "./components/sidebar";
import {Chart} from "./components/chart";
import {useState} from "react";
import {Trades} from "./components/trades";
import {ROUTES} from "./constants";

export const App = () => {
  const [activeNav, setActiveNav] = useState<ROUTES>(ROUTES.trades);
  return (
    <div className={'main'}>
      <Nav activeTab={activeNav} setActiveNav={setActiveNav} />
      {activeNav === 'home' && (<Assets/>)}
      {activeNav === 'trades' && (<Trades/>)}
      <Chart/>
      <Sidebar/>
    </div>
  );
}
