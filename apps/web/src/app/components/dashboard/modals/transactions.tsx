import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {
	DepositStatus,
	Modals,
	TradeStatus,
	Transaction, FindTransactionsQueryParams, TransactionStatus, TransactionStatusEnum,
	TransactionType, WithdrawalStatus, Account
} from '@coinvant/types';
import {FilterDropdown} from "../shared/filter-dropdown";
import {capitalizeFirstLetter, formatCurrency, formatDate, groupTransactionsByDate} from "../../../helpers";
import {connect} from "react-redux";
import {closeModal, fetchTransactions, openModal, RootState} from "@coinvant/store";

interface IProps {
	account: Account | null;
	activeModal: Modals | null;
	transactions: Transaction[];
	totalTransactions: number;
	openModal: (payload: Modals) => void;
	closeModal: () => void;
	fetchTransactions: (query?: FindTransactionsQueryParams) => void;
}

const mapStateToProps = (state: RootState) => ({
	account: state.user.selectedAccount,
	transactions: state.transaction.list,
	totalTransactions: state.transaction.totalCount,
	activeModal: state.modal.activeModal,
});

const actions = {
	openModal,
	closeModal,
	fetchTransactions,
};

export const Transactions = connect(mapStateToProps, actions)((props: IProps) => {
	if (props.activeModal !== Modals.transactions) return null;

	const [options, setOptions] = useState<FindTransactionsQueryParams>({
		page: 1,
		limit: 5,
		accountID: props.account?.id,
	});
	const [status, setStatus] = useState<TransactionStatus | "">("");
	const [type, setType] = useState<TransactionType | "">("");
	const [transactionBlocks, setTransactionBlocks] = useState<Transaction[][]>([]);

	useEffect(() => {
		setTransactionBlocks(groupTransactionsByDate(props.transactions));
	}, [props.transactions]);

	useEffect(() => {
		props.fetchTransactions({
			...options,
			type: type || undefined,
			status: status || undefined,
		})
	}, [type, status]);

	const totalPages = useMemo(() => {
		return Math.ceil(props.totalTransactions / options.limit);
	}, [options.limit, props.totalTransactions]);

	const isExhausted = useCallback(() => {
		if (props.transactions.length <= options.limit) {
			return true;
		}
		return options.page * options.limit === props.totalTransactions;
	}, [options.limit, options.page, props.totalTransactions, props.transactions.length]);

	const onPrevClick = () => {
		if (options.page > 1) {
			setOptions(prevState => ({
				...prevState,
				page: prevState.page - 1,
			}));
		}
	}

	const onNextClick = () => {
		if (!isExhausted()) {
			setOptions(prevState => ({
				...prevState,
				page: prevState.page + 1,
			}));
		}
	}

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
				<FilterDropdown title={"All Transaction Types"} options={Object.values(TransactionType)}
				                default={"All"} action={onTypeSelect}/>
				<FilterDropdown title={"Any Status"} options={Object.values(TransactionStatusEnum)}
				                default={"All"} action={onStatusSelect}/>
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
			<div style={{display: 'flex', gap: '16px', justifyContent: "center", marginBottom: "1rem"}}>
				<i className="cursor-pointer fa-solid fa-angles-left" style={{ color: "#ffffff" }}
				   onClick={onPrevClick}></i>
				<span style={{ color: "#ffffff" }}>Page {options.page} of {totalPages}</span>
				<i className="cursor-pointer fa-solid fa-angles-right" style={{ color: "#ffffff" }}
				   onClick={onNextClick}></i>
			</div>
		</div>
	);
});
