import {Button, Form, Modal} from "react-bootstrap";
import {
	AlertState,
	WithdrawalStatus,
	Modals,
	UpdateWithdrawal,
	Withdrawal,
} from "@coinvant/types";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {editWithdrawal, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	withdrawal: Withdrawal | null;
	editWithdrawal: (id: string, payload: UpdateWithdrawal) => void;
	closeModal: () => void;
	withdrawalTotal: number;
	showAlert: (payload: AlertState) => void;
}

const initialState = {
	status: WithdrawalStatus.pending,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	withdrawal: state.withdrawal.currentWithdrawal,
	withdrawalTotal: state.withdrawal.total,
});

const actions = {
	editWithdrawal,
	closeModal,
	showAlert,
}

export const EditWithdrawalModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdateWithdrawal>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.withdrawal) {
			setPayload({
				status: props.withdrawal.status,
			});
		}
	}, [props.withdrawal]);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.withdrawal) {
				setIsSubmitting(true);
				props.editWithdrawal(props.withdrawal.id, payload);
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
		<Modal show={props.activeModal === Modals.editWithdrawal} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Withdrawal</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSave}>
					<Form.Group className="mb-3">
						<Form.Label>Select Status</Form.Label>
						<Form.Select defaultValue={payload.status} name={"status"} onChange={onChange} required>
							{Object.values(WithdrawalStatus).map((status, i) => (
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
