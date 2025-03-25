import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Account,
  DepositStatus,
  FindTransactionsQueryParams,
  Modals,
  TradeStatus,
  Transaction,
  TransactionStatus,
  TransactionStatusEnum,
  TransactionType,
  WithdrawalStatus
} from '@coinvant/types';
import { FilterDropdown } from '../shared/filter-dropdown';
import { capitalizeFirstLetter, formatCurrency, formatDate, groupTransactionsByDate } from '../../../helpers';
import { connect } from 'react-redux';
import { closeModal, fetchTransactions, openModal, RootState } from '@coinvant/store';
import { Pagination } from '../shared/pagination';

interface IProps {
  account: Account | null;
  activeModal: Modals | null;
  transactions: Transaction[];
  totalCount: number;
  totalPages: number;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  fetchTransactions: (query?: FindTransactionsQueryParams) => void;
}

const mapStateToProps = (state: RootState) => ({
	account: state.account.highlightedAccount,
	transactions: state.transaction.list,
	totalCount: state.transaction.totalCount,
	activeModal: state.modal.activeModal,
  totalPages: state.transaction.totalPages,
});

const actions = {
	openModal,
	closeModal,
	fetchTransactions,
};

export const Transactions = connect(mapStateToProps, actions)((props: IProps) => {
	if (props.activeModal !== Modals.transactions) {
    return null;
  }

	const [options, setOptions] = useState<FindTransactionsQueryParams>({
		page: 1,
		limit: 5,
		accountID: props.account?.id,
	});
	const [status, setStatus] = useState<TransactionStatus | "">("");
	const [type, setType] = useState<TransactionType | "">("");
	const [transactionBlocks, setTransactionBlocks] = useState<Transaction[][]>([]);
  const [statusList, setStatusList] = useState<string[]>(Object.values(TransactionStatusEnum));

	useEffect(() => {
		setTransactionBlocks(groupTransactionsByDate(props.transactions));
	}, [props.transactions]);

	useEffect(() => {
    switch (type) {
      case TransactionType.deposit:
        setStatusList(Object.values(DepositStatus));
        break;
      case TransactionType.withdrawal:
        setStatusList(Object.values(WithdrawalStatus));
        break;
      case TransactionType.trade:
        setStatusList(Object.values(TradeStatus));
        break;
      default:
        setStatusList(Object.values(TransactionStatusEnum));
        break;
    }

		props.fetchTransactions({
			...options,
			type: type || undefined,
			status: status || undefined,
		});
	}, [type, status, options]);

	const onTypeSelect = (value: string) => {
		if (value !== type) {
			setType(value as TransactionType);
		}
	}

	const onStatusSelect = (value: string) => {
		if (value !== status) {
			setStatus(value as TransactionStatus);
		}
	}

	const TransactionFilters = () => {
		return (
			<div className={'filters'}>
				<div>
          <FilterDropdown title={"All Transaction Types"}
                          options={Object.values(TransactionType)}
                          default={"All"} action={onTypeSelect}/>
            {type && (
              <span className="selected-filter">
                {capitalizeFirstLetter(type)}
                  <i className="fa-solid fa-xmark" onClick={() => setType("")}
                     style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
              </span>
            )}
        </div>
				<div>
          <FilterDropdown title={"Any Status"} options={statusList}
                          default={"All"} action={onStatusSelect}/>
          {status && (
            <span className="selected-filter">
                {capitalizeFirstLetter(status)}
              <i className="fa-solid fa-xmark" onClick={() => setStatus("")}
                 style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
              </span>
          )}
        </div>
			</div>
		);
	}

	const Transaction: FC<{ transaction: Transaction }> = ({ transaction }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		const symbol = useMemo(() => {
			if (transaction.type === TransactionType.deposit) {
				return '+';
			}
			if (transaction.type === TransactionType.withdrawal) {
				return '-';
			}
			return '';
		}, [transaction]);

		const color = useMemo(() => {
			if (transaction.type === TransactionType.deposit) {
				return '#1B985E';
			}
			if (transaction.type === TransactionType.withdrawal) {
				return '#E24F32';
			}
			return '#FFF';
		}, [transaction]);

		const statusColor = useMemo(() => {
			if ([
				DepositStatus.confirmed,
				WithdrawalStatus.paid,
				TradeStatus.closed,
				TradeStatus.active].includes(transaction.status)) {
				return '#1B985E';
			}
			if ([DepositStatus.rejected,
				WithdrawalStatus.cancelled,
				TradeStatus.cancelled].includes(transaction.status)) {
				return '#E24F32';
			}

			return '#FFF000';
		}, [transaction]);

		return (
			<div className={'trade'}>
				<div className={"flex-row-space-between"} onClick={() => setIsExpanded(!isExpanded)}>
					<div className="asset">
						{transaction.type === TransactionType.deposit
							&& <i className={"fa-solid fa-wallet symbol"}></i>}
						{transaction.type === TransactionType.withdrawal
							&& <i className="fa-solid fa-hand-holding-dollar"></i>}
						{transaction.type === TransactionType.trade
							&& <i className="fas fa-chart-line"></i>}
						<div className={"description"}>
							<span className={"amount"}>
								{capitalizeFirstLetter(transaction.type)}
							</span>
							<span className={"text"} style={{color: statusColor}}>
								{capitalizeFirstLetter(transaction.status)}
							</span>
						</div>
					</div>
					<span style={{color}}>
						{`${symbol} ${formatCurrency(transaction.amount || 0)}`}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className={'sidebar open'}>
			<div>
				<div className={"flex-row-space-between close-button"}>
					<i className="fa-solid fa-long-arrow-left cursor-pointer"
					   onClick={() => props.openModal(Modals.payments)}></i>
					<i className="fa-solid fa-xmark cursor-pointer"
					   onClick={props.closeModal}></i>
				</div>
				<div className="title" style={{padding: 0}}>
					<h5 style={{color: "#FFF"}}>Transactions</h5>
				</div>
				<div className={"assets"} style={{ height: "100%" }}>
					<div className={'assets-body'}>
					<TransactionFilters/>
					<div className={"trades"}>
            {props.totalCount === 0 && (
              <p className={"text-center"}>No transactions found.</p>
            )}
						{transactionBlocks.map((block, i) => (
							<div className="history-block" key={i}>
								<span className={"text"}>{formatDate(block[0].createdAt)}</span>
								{block.map(transaction => (
									<Transaction transaction={transaction} key={transaction.id}/>
								))}
							</div>
						))}
					</div>
					</div>
				</div>
			</div>
			<Pagination setOptions={setOptions} totalPages={props.totalPages}
                  currentPage={props.totalCount === 0 ? 0 : options.page}/>
		</div>
	);
});
