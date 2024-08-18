import {Button, Modal} from "react-bootstrap";
import {AlertState, Modals, Deposit} from "@coinvant/types";
import {FormEvent, useState} from "react";
import {removeDeposit, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	deposit: Deposit | null;
	closeModal: () => void;
	removeDeposit: (id: string) => void;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	deposit: state.deposit.currentDeposit,
});

const actions = {
	removeDeposit,
	closeModal,
	showAlert,
}

export const DeleteDepositModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.deposit) {
				setIsDeleting(true);
				props.removeDeposit(props.deposit.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Deposit not provided',
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
		<Modal show={props.activeModal === Modals.deleteDeposit} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Deposit</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this deposit?
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
