import {FC, useState} from "react";
import {TradeItem} from "../../shared/trade";
import {FilterDropdown} from "../../shared/filter-dropdown";
import "../../../styles/TradeHistory.css";
import {USER_ROUTES} from "../../../../../routes";

interface IProps {
  toggleNav: (route: USER_ROUTES) => void;
}

interface TradeFiltersProps {
  activeTab: 'trades' | 'orders';
}

const TradeFilters: FC<TradeFiltersProps> = (props) => {
  const action = (value: string) => {}

  const Assets = () => {
    const options = [
      'Commodities',
      'Composites',
      'Crypto',
      'Currencies',
      'ETF',
      'Indices',
      'Metals',
      'Stocks'
    ];
    return (
      <FilterDropdown title={"All Assets"} options={options} default={"All"} action={action}/>
    )
  }

  const Time = () => {
    const options = ['Over 90%', 'Over 80%', 'Over 70%'];
    return (
      <FilterDropdown title={"Any Time"} options={options} default={"All"} action={action}/>
    )
  }

  const Result = () => {
    const options = ['Any Result', 'With Profit', 'With Loss'];
    return (
      <FilterDropdown title={"Any Result"} options={options} default={"All"} action={action}/>
    );
  }

  const Status = () => {
    const options = ['Any Status', 'Executed', 'Cancelled'];
    return (
      <FilterDropdown title={"Any Status"} options={options} default={"All"} action={action}/>
    );
  }

  return (
    <div className={'filters'}>
      <Time/>
      <Assets/>
      {props.activeTab === 'trades' ? <Result/> : <Status/>}
    </div>
  );
}

export const TradeHistory: FC<IProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'trades' | 'orders'>('trades');
  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={"flex-row-space-between"} style={{paddingRight: 16, paddingLeft: 16}}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={() => props.toggleNav(USER_ROUTES.trades)}></i>
          <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
        </div>
        <div className={"title"}>
          <h3>History</h3>
        </div>
        <div className="tabs">
          <button className={`${activeTab === 'trades' && 'active'}`}
                  onClick={() => setActiveTab('trades')}>Trades
          </button>
          <button className={`${activeTab === 'orders' && 'active'}`}
                  onClick={() => setActiveTab('orders')}>Orders
          </button>
        </div>
        <div className={'assets-body'}>
          <TradeFilters activeTab={activeTab}/>
          <div className={"trades"}>
            <div className="history-block">
              <span className={"text"}>APRIL 10</span>
              {/*<TradeItem/>
              <TradeItem/>*/}
            </div>
            <div className="history-block">
              <span className={"text"}>APRIL 5</span>
              {/*<TradeItem/>
              <TradeItem/>
              <TradeItem/>*/}
            </div>
            <div className="history-block">
              <span className={"text"}>FEBRUARY 29</span>
              {/*<TradeItem/>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
