import {Button, Modal} from "react-bootstrap";
import { AlertState, Modals, KYC } from '@coinvant/types';
import {FormEvent, useState} from "react";
import {removeKYC, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	kyc: KYC | null;
	closeModal: () => void;
	removeKYC: (id: string) => Promise<void>;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	kyc: state.user.currentKYC,
});

const actions = {
	removeKYC,
	closeModal,
	showAlert,
}

export const DeleteKYCModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = async (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.kyc) {
				setIsDeleting(true);
				await props.removeKYC(props.kyc.id);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'KYC not provided',
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
		<Modal show={props.activeModal === Modals.deleteKYC} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete KYC</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete {props.kyc?.user.name}'s documents?
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
