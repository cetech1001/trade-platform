import {FC, useState} from "react";
import "../../../styles/Trades.css";
import {Link} from "react-router-dom";
import {Trade} from "../../shared/trade";
import {USER_ROUTES} from "../../../../../routes";

interface IProps {
  toggleNav: (route: USER_ROUTES) => void;
}

export const Trades: FC<IProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'ft' | 'fx' | 'st'>('fx');
  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={"title"}>
          <h3>Trades</h3>
          <div className={"icons"}>
            <i className="fa-solid fa-xmark"
               onClick={() => props.toggleNav(USER_ROUTES.blank)}></i>
          </div>
        </div>
        <div className="tabs">
          <button className={`${activeTab === 'ft' && 'active'}`}
                  onClick={() => setActiveTab('ft')}>Fixed Time</button>
          <button className={`${activeTab === 'fx' && 'active'}`}
                  onClick={() => setActiveTab('fx')}>
            <span>Forex</span>
            <span>•</span>
            <span>1</span>
          </button>
          <button className={`${activeTab === 'st' && 'active'}`}
                  onClick={() => setActiveTab('st')}>Stocks</button>
        </div>
        <div className={'assets-body'}>
          <div className={"title"}>
            <h5>Active Trades</h5>
          </div>
          <div className={"subtitle"}>
            <div>
              <span className={"text"}>Total Amount</span>
              <span>$0.00</span>
            </div>
            <div>
              <span className={"text"}>Profit and loss</span>
              <span className={"negative"} style={{textAlign: 'right'}}>-$1.00</span>
            </div>
          </div>
          <div className={"trades"}>
            <Trade isActive={true}/>
          </div>
          <div className={"title"} style={{ marginTop: 16 }}>
            <h5>History</h5>
            <Link to={'#'} className={"link"} onClick={() => props.toggleNav(USER_ROUTES.history)}>
              Show all
              <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className={"trades"} style={{ marginTop: -8 }}>
            <Trade/>
            <Trade/>
            <Trade/>
            <Trade/>
            <Trade/>
            <div className={"history-button"} onClick={() => props.toggleNav(USER_ROUTES.history)}>
              Open Full History
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
