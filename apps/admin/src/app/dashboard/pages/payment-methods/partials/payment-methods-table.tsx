import {Button, ButtonGroup, Card, Dropdown, Table} from "@themesberg/react-bootstrap";
import {Modals, PaginationOptions, PaymentMethod, PaymentMethodState, PaymentMethodStatus} from "@coinvant/types";
import {Dispatch, SetStateAction, useCallback, useMemo} from "react";
import {connect} from "react-redux";
import {openModal, RootState, setCurrentPaymentMethod} from "@coinvant/store";
import {EditPaymentMethodModal} from "./edit-payment-method";
import {DeletePaymentMethodModal} from "./delete-payment-method";
import {formatCurrency} from "../../../../helpers";
import {TablePagination} from "../../../../shared/table-pagination";

interface IProps {
	options: PaginationOptions;
	setOptions: Dispatch<SetStateAction<PaginationOptions>>;
	paymentMethod: PaymentMethodState;
	setCurrentPaymentMethod: (paymentMethod: PaymentMethod) => void;
	openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
	paymentMethod: state.paymentMethod,
});

const actions = {
	setCurrentPaymentMethod,
	openModal,
};

export const PaymentMethodsTable = connect(mapStateToProps, actions)((props: IProps) => {
	const TableRow = (paymentMethod: PaymentMethod) => {
		const statusVariant = useMemo(() =>
			paymentMethod.status === PaymentMethodStatus.active ? "success" : "danger", [paymentMethod]);

		const onEditClick = useCallback(() => {
			props.setCurrentPaymentMethod(paymentMethod);
			props.openModal(Modals.editPaymentMethod);
		}, [paymentMethod]);

		const onDeleteClick = useCallback(() => {
			props.setCurrentPaymentMethod(paymentMethod);
			props.openModal(Modals.deletePaymentMethod);
		}, [paymentMethod]);

		return (
			<tr>
				<td>
	              <span className="fw-normal">
	                {paymentMethod.name}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {paymentMethod.code}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {paymentMethod.network}
	              </span>
				</td>
				<td>
	              <span className="fw-normal">
	                {paymentMethod.walletAddress}
	              </span>
				</td>
				<td>
	              <span className={`fw-normal text-${statusVariant}`}>
	                {paymentMethod.status}
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
				<Table hover className="user-table align-items-center">
					<thead>
					<tr>
						<th className="border-bottom">Name</th>
						<th className="border-bottom">Code</th>
						<th className="border-bottom">Network</th>
						<th className="border-bottom">Wallet Address</th>
						<th className="border-bottom">Status</th>
						<th className="border-bottom">Action</th>
					</tr>
					</thead>
					<tbody>
					{props.paymentMethod.list.map(paymentMethod => (
						<TableRow key={paymentMethod.id} {...paymentMethod}/>
					))}
					</tbody>
				</Table>
				<TablePagination itemsCount={props.paymentMethod.list.length}
				                 totalItemsCount={props.paymentMethod.totalCount}
                         totalPages={props.paymentMethod.totalPages}
				                 options={props.options} setOptions={props.setOptions}/>
			</Card.Body>
			<EditPaymentMethodModal/>
			<DeletePaymentMethodModal/>
		</Card>
	);
});
