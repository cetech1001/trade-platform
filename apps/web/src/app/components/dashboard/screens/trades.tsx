import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {TradeItem} from "../shared/trade";
import {USER_ROUTES} from "../../../../routes";
import { Account, FindTradeQueryParams, Trade, TradeAssetType, TradeStatus } from '@coinvant/types';
import {fetchTrades, RootState} from "@coinvant/store";
import {connect} from "react-redux";
import {capitalizeFirstLetter, formatCurrency} from "../../../helpers";

interface IProps {
  trades: Trade[];
  account: Account | null;
  limit: number;
  totalCount: number;
  toggleNav: (route: USER_ROUTES) => void;
  fetchTrades: (query: FindTradeQueryParams) => void;
}

const mapStateToProps = (state: RootState) => ({
  account: state.user.currentAccount,
  trades: state.trade.list,
  limit: state.trade.limit,
  totalCount: state.trade.totalCount,
});

const actions = {
  fetchTrades,
};

export const Trades = connect(mapStateToProps, actions)((props: IProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab]
      = useState<TradeAssetType>(TradeAssetType.forex);
  const [totalPL, setTotalPL] = useState(0);
  const [query, setQuery] = useState<FindTradeQueryParams>({
    page: 1,
    limit: props.limit,
    assetType: activeTab,
    accountID: props.account?.id,
  });
  const [activeTradeCount, setActiveTradeCount] = useState(0);
  const [activeAmount, setActiveAmount] = useState(0);

  const handleScroll = () => {
    /*const container = scrollContainerRef.current;
    if (container) {
      const bottom =
          container.scrollHeight - container.scrollTop <= container.clientHeight + 500;
      if (bottom && !isLoading && query.page < props.totalPages) {
        setQuery(prevState => ({
          ...prevState,
          page: prevState.page + 1,
        }))
      }
    }*/
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    props.fetchTrades(query);
  }, [query]);

  useEffect(() => {
    if (props.trades.length > 0) {
      const activeTrades = props.trades.filter(t => t.status === TradeStatus.active);
      setActiveTradeCount(activeTrades.length);
      setActiveAmount(() => activeTrades.reduce((acc, curr) => acc + (+curr.bidAmount), 0));
      setTotalPL(() => activeTrades.reduce((acc, curr) => acc + (+curr.profitOrLoss), 0))
    }
  }, [props.trades]);

  useEffect(() => {
    setQuery(prevState => ({
      ...prevState,
      assetType: activeTab,
    }));
  }, [activeTab]);

  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={"title"}>
          <h3>Trades</h3>
          <div className={"icons"}>
            <i className="fa-solid fa-xmark"
               onClick={() => props.toggleNav(USER_ROUTES.chart)}></i>
          </div>
        </div>
        <div className="tabs">
          {Object.values(TradeAssetType).map((assetType, i) => (
              <button key={i} className={`${activeTab === assetType && 'active'}`}
                      onClick={() => {
                        setTotalPL(0);
                        setActiveAmount(0);
                        setActiveTradeCount(0);
                        setActiveTab(assetType);
                      }}>
                <span>{capitalizeFirstLetter(assetType)}</span>
                {activeTab === assetType && activeTradeCount > 0 && (
                    <>
                      <span>•</span>
                      <span>{activeTradeCount}</span>
                    </>
                )}
              </button>
          ))}
        </div>
        <div className={'assets-body'} style={{ height: "80vh", overflowY: "auto" }} ref={scrollContainerRef}>
          <div className={"title"}>
            <h5>Active Trades</h5>
          </div>
          <div className={"subtitle"}>
            <div>
              <span className={"text"}>Total Amount</span>
              <span>{formatCurrency(activeAmount)}</span>
            </div>
            <div>
              <span className={"text"}>Profit and loss</span>
              <span className={totalPL >= 0 ? "positive" : "negative"} style={{textAlign: 'right'}}>
                {formatCurrency(totalPL)}
              </span>
            </div>
          </div>
          <div className={"trades"}>
            {props.trades
                .filter((_, i) => i < activeTradeCount)
                .map((trade) => (
                <TradeItem trade={trade} key={trade.id}/>
            ))}
          </div>
          <div className={"title"} style={{ marginTop: 16 }}>
            <h5>History</h5>
            <Link to={'#'} className={"link"} onClick={() => props.toggleNav(USER_ROUTES.history)}>
              Show all
              <i className="fa-solid fa-chevron-right"></i>
            </Link>
          </div>
          <div className={"trades"} style={{ marginTop: -8 }}>
            {props.trades.slice(activeTradeCount).map((trade) => (
                <TradeItem trade={trade} key={trade.id}/>
            ))}
            <div className={"history-button"} onClick={() => props.toggleNav(USER_ROUTES.history)}>
              Open Full History
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
