import {Button, Modal} from "react-bootstrap";
import {AlertState, Modals, User} from "@coinvant/types";
import {FormEvent, useState} from "react";
import {removeUser, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	user: User | null;
	closeModal: () => void;
	removeUser: (id: string) => void;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	user: state.user.currentUser,
});

const actions = {
	removeUser,
	closeModal,
	showAlert,
}

export const DeleteUserModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.user) {
				setIsDeleting(true);
				props.removeUser(props.user.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'User not provided',
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
		<Modal show={props.activeModal === Modals.deleteUser} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this user's ({props.user?.name}) account?
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
