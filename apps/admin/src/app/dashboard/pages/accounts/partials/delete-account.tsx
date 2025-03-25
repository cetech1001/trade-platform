import {Button, Modal} from "react-bootstrap";
import { AlertState, Modals, Account, User } from '@coinvant/types';
import {FormEvent, useState} from "react";
import {removeAccount, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
  user: User | null;
  activeModal: Modals | null;
  account: Account | null;
  closeModal: () => void;
  removeAccount: (id: string) => void;
  showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	account: state.account.highlightedAccount,
  user: state.user.highlightedUser,
});

const actions = {
	removeAccount,
	closeModal,
	showAlert,
}

export const DeleteAccountModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.account) {
				setIsDeleting(true);
				props.removeAccount(props.account.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Account not provided',
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
		<Modal show={props.activeModal === Modals.deleteAccount} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Account</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete {props.user?.name}'s {props.account?.type} account?
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
