import {Button, Modal} from "react-bootstrap";
import {AlertState, Modals, PaymentMethod} from "@coinvant/types";
import {FormEvent, useState} from "react";
import {removePaymentMethod, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	paymentMethod: PaymentMethod | null;
	closeModal: () => void;
	removePaymentMethod: (id: string) => void;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	paymentMethod: state.paymentMethod.currentPaymentMethod,
});

const actions = {
	removePaymentMethod,
	closeModal,
	showAlert,
}

export const DeletePaymentMethodModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.paymentMethod) {
				setIsDeleting(true);
				props.removePaymentMethod(props.paymentMethod.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Payment Method not provided',
					show: true,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Modal show={props.activeModal === Modals.deletePaymentMethod} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Payment Method</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this payment method ({props.paymentMethod?.name})?
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={props.closeModal}>Close</Button>
				<Button variant="danger" onClick={onSave}>
					{isDeleting ? 'Deleting...' : 'Delete'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});
