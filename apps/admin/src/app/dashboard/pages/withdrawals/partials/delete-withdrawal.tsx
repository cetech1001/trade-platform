import {Button, Modal} from "react-bootstrap";
import {AlertState, Modals, Withdrawal} from "@coinvant/types";
import {FormEvent, useState} from "react";
import {removeWithdrawal, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	withdrawal: Withdrawal | null;
	closeModal: () => void;
	removeWithdrawal: (id: string) => void;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	withdrawal: state.withdrawal.currentWithdrawal,
});

const actions = {
	removeWithdrawal,
	closeModal,
	showAlert,
}

export const DeleteWithdrawalModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.withdrawal) {
				setIsDeleting(true);
				props.removeWithdrawal(props.withdrawal.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Withdrawal not provided',
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
		<Modal show={props.activeModal === Modals.deleteWithdrawal} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Withdrawal</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this withdrawal?
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
