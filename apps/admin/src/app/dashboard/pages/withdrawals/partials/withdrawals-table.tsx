import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import {Modals, PaginationOptions, Withdrawal, WithdrawalState, WithdrawalStatus} from "@coinvant/types";
import {TablePagination} from "../../../../shared/table-pagination";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentWithdrawal} from "@coinvant/store";
import {EditWithdrawalModal} from "./edit-withdrawal";
import {DeleteWithdrawalModal} from "./delete-withdrawal";
import {formatCurrency, formatDate} from "../../../../helpers";

interface IProps {
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
	withdrawal: WithdrawalState;
	setCurrentWithdrawal: (withdrawal: Withdrawal) => void;
	openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
	withdrawal: state.withdrawal,
});

const actions = {
	setCurrentWithdrawal,
	openModal,
};

export const WithdrawalsTable = connect(mapStateToProps, actions)((props: IProps) => {
	const TableRow = (withdrawal: Withdrawal) => {
		const statusVariant = useMemo(() => {
			return withdrawal.status === WithdrawalStatus.paid
				? "success" : (WithdrawalStatus.pending ? "warning" : "danger");
		}, [withdrawal]);

		const onEditClick = useCallback(() => {
			props.setCurrentWithdrawal(withdrawal);
			props.openModal(Modals.editWithdrawal);
		}, [withdrawal]);

		const onDeleteClick = useCallback(() => {
			props.setCurrentWithdrawal(withdrawal);
			props.openModal(Modals.deleteWithdrawal);
		}, [withdrawal]);

		return (
			<tr>
				<td>
	              <span className="fw-normal">
	                {withdrawal.user.name}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {formatCurrency(withdrawal.amount)}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {withdrawal.paymentMethod}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {withdrawal.network}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {withdrawal.walletAddress}
	              </span>
				</td>
				<td>
	              <span className={`fw-normal text-${statusVariant}`}>
	                {withdrawal.status}
	              </span>
				</td>
				<td>
	              <span className={`fw-normal`}>
	                {formatDate(withdrawal.createdAt)}
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
				<Table hover className="withdrawal-table align-items-center">
					<thead>
					<tr>
						<th className="border-bottom">User</th>
						<th className="border-bottom">Amount</th>
						<th className="border-bottom">Payment Method</th>
						<th className="border-bottom">Network</th>
						<th className="border-bottom">Wallet Address</th>
						<th className="border-bottom">Status</th>
						<th className="border-bottom">Date</th>
						<th className="border-bottom">Action</th>
					</tr>
					</thead>
					<tbody>
					{props.withdrawal.list.map(withdrawal => (
						<TableRow key={withdrawal.id} {...withdrawal}/>
					))}
					</tbody>
				</Table>
				<TablePagination items={props.withdrawal.list.length} total={props.withdrawal.count}
				                 options={props.options} setOptions={props.setOptions}/>
			</Card.Body>
			<EditWithdrawalModal/>
			<DeleteWithdrawalModal/>
		</Card>
	);
});
