import {Button, Form, Modal} from "react-bootstrap";
import {
	AlertState,
	DepositStatus,
	Modals,
	UpdateDeposit,
	Deposit,
} from "@coinvant/types";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {editDeposit, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	deposit: Deposit | null;
	editDeposit: (id: string, payload: UpdateDeposit) => void;
	closeModal: () => void;
	depositTotal: number;
	showAlert: (payload: AlertState) => void;
}

const initialState = {
	status: DepositStatus.pending,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	deposit: state.deposit.currentDeposit,
	depositTotal: state.deposit.total,
});

const actions = {
	editDeposit,
	closeModal,
	showAlert,
}

export const EditDepositModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdateDeposit>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.deposit) {
			setPayload({
				status: props.deposit.status,
			});
		}
	}, [props.deposit]);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.deposit) {
				setIsSubmitting(true);
				props.editDeposit(props.deposit.id, payload);
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
			setIsSubmitting(false);
		}
	}

	const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setPayload(prevState => ({
			...prevState,
			[name]: value,
		}));
	}

	return (
		<Modal show={props.activeModal === Modals.editDeposit} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Deposit</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSave}>
					<Form.Group className="mb-3">
						<Form.Label>Select Status</Form.Label>
						<Form.Select defaultValue={payload.status} name={"status"} onChange={onChange} required>
							{Object.values(DepositStatus).map((status, i) => (
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
