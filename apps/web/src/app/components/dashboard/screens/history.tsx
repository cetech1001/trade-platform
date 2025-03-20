import { useEffect, useState } from 'react';
import { USER_ROUTES } from '../../../../routes';
import { fetchTrades, RootState } from '@coinvant/store';
import { connect } from 'react-redux';
import { Account, FindTradesQueryParams, Trade, TradeStatus } from '@coinvant/types';
import { formatDate, groupTransactionsByDate } from '../../../helpers';
import { TradeItem } from '../shared/trade';
import { Pagination } from '../shared/pagination';

interface IProps {
  trades: Trade[];
  account: Account | null;
  totalCount: number;
  totalPages: number;
  toggleNav: (route: USER_ROUTES) => void;
  fetchTrades: (options: FindTradesQueryParams) => void;
}

const mapStateToProps = (state: RootState) => ({
  account: state.user.selectedAccount,
  trades: state.trade.list,
  totalCount: state.trade.totalCount,
  totalPages: state.trade.totalPages,
});

const actions = {
  fetchTrades,
};

export const TradeHistory = connect(mapStateToProps, actions)((props: IProps) => {
  const [activeTab, setActiveTab] = useState<'trades' | 'orders'>('trades');
  const [options, setOptions] = useState<FindTradesQueryParams>({
    page: 1,
    limit: 6,
    accountID: props.account?.id,
  });
  const [tradeBlocks, setTradeBlocks] = useState<Trade[][]>([]);

  useEffect(() => {
    props.fetchTrades(options);
  }, [options]);

  useEffect(() => {
    setTradeBlocks(groupTransactionsByDate(props.trades));
  }, [props.trades]);

  useEffect(() => {
    setOptions(prevState => ({
      ...prevState,
      page: 1,
      status: activeTab === 'orders' ? TradeStatus.pending : undefined,
    }));
  }, [activeTab]);

  return (
    <div className={"assets"}>
      <div className="asset-list">
        <div className={'title'}>
          <h3>History</h3>
          <div className={'icons back'}>
            <i className="fa-solid fa-long-arrow-left cursor-pointer"
               onClick={() => props.toggleNav(USER_ROUTES.trades)}></i>
          </div>
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
          <div className={"trades"} style={{ height: '75vh', overflowY: 'auto' }}>
            {props.totalCount === 0 && (
              <p>No trades.</p>
            )}
            {tradeBlocks.map((block, i) => (
              <div className="history-block" key={i}>
                <span className={'text'}>{formatDate(block[0].createdAt)}</span>
                {block.map((trade, i) => (
                  <TradeItem trade={trade} key={i}/>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination setOptions={setOptions} totalPages={props.totalPages}
                  currentPage={props.totalCount === 0 ? 0 : options.page}/>
    </div>
  );
})
