import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import { Modals, PaginationOptions, Trade, TradeAssetType, TradeState, TradeStatus } from '@coinvant/types';
import {TablePagination} from "../../../../shared/table-pagination";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentTrade} from "@coinvant/store";
import {EditTradeModal} from "./edit-trade";
import {DeleteTradeModal} from "./delete-trade";
import {formatCurrency, formatDate} from "../../../../helpers";

interface IProps {
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
	trade: TradeState;
	setCurrentTrade: (trade: Trade) => void;
	openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
	trade: state.trade,
});

const actions = {
	setCurrentTrade,
	openModal,
};

export const TradesTable = connect(mapStateToProps, actions)((props: IProps) => {
	const TableRow = (trade: Trade) => {
		const statusVariant = useMemo(() => {
			return trade.status === TradeStatus.active || TradeStatus.closed
				? "success" : (TradeStatus.pending ? "warning" : "danger");
		}, [trade]);

		const onEditClick = useCallback(() => {
			props.setCurrentTrade(trade);
			props.openModal(Modals.editTrade);
		}, [trade]);

		const onDeleteClick = useCallback(() => {
			props.setCurrentTrade(trade);
			props.openModal(Modals.deleteTrade);
		}, [trade]);

		return (
			<tr>
				<td>
          <span className="fw-normal">
            {trade.account.user?.name}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {trade.isShort ? 'Sell' : 'Buy'}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {formatCurrency(trade.bidAmount)}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {trade.assetType === TradeAssetType.crypto && (
	            <span className={"text"}>{trade.crypto.symbol.toUpperCase()}</span>
            )}
	          {trade.assetType === TradeAssetType.stock && (
		          <span className={"text"}>{trade.stock.symbol.toUpperCase()}</span>
	          )}
	          {trade.assetType === TradeAssetType.forex && (
		          <span className={"text"}>{`${trade.forex.base}/${trade.forex.term}`}</span>
	          )}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {formatCurrency(trade.isShort ? trade.sellPrice : trade.buyPrice)}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {formatCurrency(trade.currentPrice)}
          </span>
				</td>
				<td>
          <span className="fw-normal">
            {formatCurrency(trade.profitOrLoss)}
          </span>
				</td>
				<td>
          <span className={`fw-normal text-${statusVariant}`}>
            {trade.status}
          </span>
				</td>
				<td>
          <span className={`fw-normal`}>
            {formatDate(trade.executeAt)}
          </span>
				</td>
				<td>
					<Dropdown as={ButtonGroup}>
						<Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
			              <span className="icon icon-sm">
			                <i className="fa-solid fa-ellipsis icon-dark" />
			              </span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{/*<Dropdown.Item onClick={onEditClick}>
								<i className="fa-solid fa-pen-to-square me-2" /> Edit
							</Dropdown.Item>*/}
							<Dropdown.Item className="text-danger" onClick={onDeleteClick}>
								<i className="fa-solid fa-delete-left me-2" /> Remove
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</td>
			</tr>
		);
	};

	return (
		<Card border="light" className="table-wrapper table-responsive shadow-sm">
			<Card.Body className="pt-0">
				<Table hover className="trade-table align-items-center">
					<thead>
					<tr>
						<th className="border-bottom">User</th>
						<th className="border-bottom">Type</th>
						<th className="border-bottom">Bid Amount</th>
						<th className="border-bottom">Asset</th>
						<th className="border-bottom">Opening Price</th>
						<th className="border-bottom">Current Price</th>
						<th className="border-bottom">P/L</th>
						<th className="border-bottom">Status</th>
						<th className="border-bottom">Executed At</th>
						<th className="border-bottom">Action</th>
					</tr>
					</thead>
					<tbody>
					{props.trade.list.map((trade: Trade) => (
						<TableRow key={trade.id} {...trade}/>
					))}
					</tbody>
				</Table>
				<TablePagination itemsCount={props.trade.list.length} totalItemsCount={props.trade.totalCount}
                         totalPages={props.trade.totalPages} options={props.options}
                         setOptions={props.setOptions}/>
			</Card.Body>
			<EditTradeModal/>
			<DeleteTradeModal/>
		</Card>
	);
});
