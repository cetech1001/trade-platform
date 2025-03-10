import { FC, useEffect, useRef, useState } from 'react';
import { FilterDropdown } from '../shared/filter-dropdown';
import { USER_ROUTES } from '../../../../routes';
import { fetchTrades, RootState } from '@coinvant/store';
import { connect } from 'react-redux';
import { Account, FindTradesQueryParams, Trade, TradeStatus } from '@coinvant/types';
import { formatDate, groupTransactionsByDate } from '../../../helpers';
import { TradeItem } from '../shared/trade';

interface IProps {
  trades: Trade[];
  account: Account | null;
  limit: number;
  totalCount: number;
  totalPages: number;
  toggleNav: (route: USER_ROUTES) => void;
  fetchTrades: (query: FindTradesQueryParams) => Promise<void>;
}

interface TradeFiltersProps {
  activeTab: 'trades' | 'orders';
}

const TradeFilters: FC<TradeFiltersProps> = (props) => {
  const action = (value: string) => {
    return;
  }

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

const mapStateToProps = (state: RootState) => ({
  account: state.user.selectedAccount,
  trades: state.trade.list,
  limit: state.trade.limit,
  totalCount: state.trade.totalCount,
  totalPages: state.trade.totalPages,
});

const actions = {
  fetchTrades,
};

export const TradeHistory = connect(mapStateToProps, actions)((props: IProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'trades' | 'orders'>('trades');
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<FindTradesQueryParams>({
    page: 1,
    limit: props.limit,
    accountID: props.account?.id,
  });
  const [tradeBlocks, setTradeBlocks] = useState<Trade[][]>([]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const bottom =
          container.scrollHeight - container.scrollTop <= container.clientHeight + 500;
      if (bottom && !isLoading && query.page < props.totalPages) {
        setQuery(prevState => ({
          ...prevState,
          page: prevState.page + 1,
        }))
      }
    }
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
    setIsLoading(true);
    props.fetchTrades(query)
      .finally(() => setIsLoading(false));
  }, [query]);

  useEffect(() => {
    setTradeBlocks(groupTransactionsByDate(props.trades));
  }, [props.trades]);

  useEffect(() => {
    setQuery(prevState => ({
      ...prevState,
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
        <div className={'assets-body'} ref={scrollContainerRef}>
          {/*<TradeFilters activeTab={activeTab} />*/}
          <div className={"trades"}>
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
        <div className={"is-loading"}>
          {isLoading && "Loading..."}
        </div>
      </div>
    </div>
  );
})
