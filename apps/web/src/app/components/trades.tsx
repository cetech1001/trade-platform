import {useState} from "react";
import "../styles/Trades.css";
import {Link} from "react-router-dom";

const Trade = () => {
  return (
    <div className="trade">
      <div className="asset">
        <img src={"https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg"} alt={"Asset"} className={"symbol"}/>
        <div className={"description"}>
          <span className={"text"}>Bitcoin</span>
          <span className={"amount"}>
            $1.00 <i className={"fa-solid fa-long-arrow-up positive"}></i>
          </span>
        </div>
      </div>
      <span className={"positive"}>-$2.45</span>
    </div>
  );
}

export const Trades = () => {
  const [activeTab, setActiveTab] = useState<'ft' | 'fx' | 'st'>('fx');
  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={"title"}>
          <h3>Trades</h3>
          <div className={"icons"}>
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
            <i className="fa-solid fa-xmark"></i>
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
            <Trade/>
          </div>
          <div className={"title"} style={{ marginTop: 16 }}>
            <h5>History</h5>
            <Link to={'#'} className={"link"}>
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
            <div className={"history-button"}>Open Full History</div>
          </div>
        </div>
      </div>
    </div>
  );
}
