import {Button, Form, Modal} from "react-bootstrap";
import {
	AlertState,
	KYCStatus,
	Modals,
	KYC, UpdateUser
} from '@coinvant/types';
import {FormEvent, useEffect, useState} from "react";
import { closeModal, editUser, RootState, showAlert } from '@coinvant/store';
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	kyc: KYC | null;
	editUser: (id: string, payload: UpdateUser) => Promise<void>;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	kyc: state.user.highlightedKYC,
});

const actions = {
	editUser,
	closeModal,
	showAlert,
}

export const EditKYCModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [status, setStatus] = useState<KYCStatus>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.kyc) {
			setStatus(props.kyc.user.kycStatus);
		}
	}, [props.kyc]);

	const onSave = async (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.kyc) {
				setIsSubmitting(true);
				await props.editUser(props.kyc.user.id, { kycStatus: status });
				window.location.reload();
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'KYC not provided',
					show: true,
				});
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Modal show={props.activeModal === Modals.editKYC} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit KYC Status</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSave}>
					<Form.Group className="mb-3">
						<Form.Label>Select Status</Form.Label>
						<Form.Select value={status} name={"status"}
						             onChange={e =>
							             setStatus(e.target.value as KYCStatus)} required>
							{Object.values(KYCStatus)
								.filter(status => status !== KYCStatus.notStarted)
								.map((status, i) => (
								<option value={status} key={i}>{status}</option>
							))}
						</Form.Select>
					</Form.Group>

					<Button variant="primary" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
});
