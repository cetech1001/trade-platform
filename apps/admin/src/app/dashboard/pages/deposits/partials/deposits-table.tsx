import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import {Modals, PaginationOptions, Deposit, DepositState, DepositStatus} from "@coinvant/types";
import {TablePagination} from "../../../../shared/table-pagination";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentDeposit} from "@coinvant/store";
import {EditDepositModal} from "./edit-deposit";
import {DeleteDepositModal} from "./delete-deposit";
import {formatCurrency, formatDate} from "../../../../helpers";
import {environment} from "../../../../../environments/environment";

interface IProps {
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
	deposit: DepositState;
	setCurrentDeposit: (deposit: Deposit) => void;
	openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
	deposit: state.deposit,
});

const actions = {
	setCurrentDeposit,
	openModal,
};

export const DepositsTable = connect(mapStateToProps, actions)((props: IProps) => {
	const TableRow = (deposit: Deposit) => {
		const statusVariant = useMemo(() => {
			return deposit.status === DepositStatus.confirmed
				? "success" : (DepositStatus.pending ? "warning" : "danger");
		}, [deposit]);

		const onEditClick = useCallback(() => {
			props.setCurrentDeposit(deposit);
			props.openModal(Modals.editDeposit);
		}, [deposit]);

		const onDeleteClick = useCallback(() => {
			props.setCurrentDeposit(deposit);
			props.openModal(Modals.deleteDeposit);
		}, [deposit]);

		return (
			<tr>
				<td>
	              <span className="fw-normal">
	                {deposit.account.user?.name}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {formatCurrency(deposit.amount)}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {deposit.paymentMethod}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                <a href={`${environment.api.baseURL}/uploads/${deposit.proof}`} target="_blank">
		                <i className="fa-solid fa-file"></i>
	                </a>
	              </span>
				</td>
				<td>
	              <span className={`fw-normal text-${statusVariant}`}>
	                {deposit.status}
	              </span>
				</td>
				<td>
	              <span className={`fw-normal`}>
	                {formatDate(deposit.createdAt)}
	              </span>
				</td>
				<td>
					<Dropdown as={ButtonGroup}>
						<Dropdown.Toggle as={Button} split variant="link" className="text-dark m-0 p-0">
			              <span className="icon icon-sm">
			                <i className="fa-solid fa-ellipsis icon-dark"/>
			              </span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={onEditClick}>
								<i className="fa-solid fa-pen-to-square me-2"/> Edit
							</Dropdown.Item>
							<Dropdown.Item className="text-danger" onClick={onDeleteClick}>
								<i className="fa-solid fa-delete-left me-2"/> Remove
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
				<Table hover className="deposit-table align-items-center">
					<thead>
					<tr>
						<th className="border-bottom">User</th>
						<th className="border-bottom">Amount</th>
						<th className="border-bottom">Payment Method</th>
						<th className="border-bottom">Proof</th>
						<th className="border-bottom">Status</th>
						<th className="border-bottom">Date</th>
						<th className="border-bottom">Action</th>
					</tr>
					</thead>
					<tbody>
					{props.deposit.list.map(deposit => (
						<TableRow key={deposit.id} {...deposit}/>
					))}
					</tbody>
				</Table>
				<TablePagination itemsCount={props.deposit.list.length}
                         totalItemsCount={props.deposit.totalCount}
                         options={props.options} setOptions={props.setOptions}
                         totalPages={props.deposit.totalPages} />
			</Card.Body>
			<EditDepositModal/>
			<DeleteDepositModal/>
		</Card>
	);
});
