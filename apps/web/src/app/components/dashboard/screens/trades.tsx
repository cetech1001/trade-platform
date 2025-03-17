import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TradeItem } from '../shared/trade';
import { USER_ROUTES } from '../../../../routes';
import {
  Account,
  FindTradeAmountsQueryParams,
  FindTradesQueryParams,
  Trade,
  TradeAssetType,
  TradeStatus,
} from '@coinvant/types';
import {
  fetchTotalActiveBid,
  fetchTotalActivePL,
  fetchTrades,
  RootState,
} from '@coinvant/store';
import { connect } from 'react-redux';
import { capitalizeFirstLetter, formatCurrency } from '../../../helpers';
import { Pagination } from '../shared/pagination';

interface IProps {
  trades: Trade[];
  account: Account | null;
  limit: number;
  totalCount: number;
  totalPages: number;
  totalActivePL: number;
  totalActiveBid: number;
  toggleNav: (route: USER_ROUTES) => void;
  fetchTrades: (options: FindTradesQueryParams) => void;
  fetchTotalActivePL: (query: FindTradeAmountsQueryParams) => void;
  fetchTotalActiveBid: (query: FindTradeAmountsQueryParams) => void;
}

const mapStateToProps = (state: RootState) => ({
  account: state.user.selectedAccount,
  trades: state.trade.list,
  limit: state.trade.limit,
  totalCount: state.trade.totalCount,
  totalPages: state.trade.totalPages,
  totalActivePL: state.trade.totalActivePL,
  totalActiveBid: state.trade.totalActiveBid,
});

const actions = {
  fetchTrades,
  fetchTotalActivePL,
  fetchTotalActiveBid,
};

export const Trades = connect(mapStateToProps, actions)((props: IProps) => {
  const [activeTab, setActiveTab]
      = useState<TradeAssetType>(TradeAssetType.forex);
  const [options, setOptions] = useState<FindTradesQueryParams>({
    page: 1,
    limit: props.limit,
    assetType: activeTab,
    status: TradeStatus.active,
    accountID: props.account?.id,
  });

  useEffect(() => {
    props.fetchTrades(options);
  }, [options]);

  useEffect(() => {
    const query = {
      assetType: options.assetType || activeTab,
      status: options.status || TradeStatus.active,
      accountID: options.accountID || '',
    };

    props.fetchTotalActivePL(query);
    props.fetchTotalActiveBid(query);
  }, [options.assetType, options.accountID, options.status]);

  useEffect(() => {
    setOptions(prevState => ({
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
                        setActiveTab(assetType);
                      }}>
                <span>{capitalizeFirstLetter(assetType)}</span>
                {activeTab === assetType && (
                    <>
                      <span>•</span>
                      <span>{props.totalCount}</span>
                    </>
                )}
              </button>
          ))}
        </div>
        <div className={'assets-body'} style={{ height: "80vh", overflowY: "auto" }}>
          <div className={"title"}>
            <h5>Active Trades</h5>
          </div>
          <div className={"subtitle"}>
            <div>
              <span className={"text"}>Total Amount</span>
              <span>{formatCurrency(props.totalActiveBid)}</span>
            </div>
            <div>
              <span className={"text"}>Profit and loss</span>
              <span className={props.totalActivePL >= 0 ? "positive" : "negative"}
                    style={{textAlign: 'right'}}>
                {formatCurrency(props.totalActivePL)}
              </span>
            </div>
          </div>
          <div className={"trades"}>
            {props.trades
              .map((trade) => (
                <TradeItem trade={trade} key={trade.id}/>
              ))}
          </div>
          <Pagination setOptions={setOptions} totalPages={props.totalPages}
                      currentPage={props.totalCount === 0 ? 0 : options.page}/>
          <div>
            <div className={"title"} style={{ marginTop: 16 }}>
              <h5>History</h5>
              <Link to={'#'} className={"link"}
                    onClick={() => props.toggleNav(USER_ROUTES.history)}>
                Show all
                <i className="fa-solid fa-chevron-right"></i>
              </Link>
            </div>
            <div className={"trades"}>
              <div className={"history-button"}
                   onClick={() => props.toggleNav(USER_ROUTES.history)}>
                Open Full History
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
