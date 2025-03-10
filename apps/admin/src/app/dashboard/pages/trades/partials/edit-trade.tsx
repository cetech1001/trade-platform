import {Button, Form, Modal} from "react-bootstrap";
import {
	AlertState,
	TradeStatus,
	Modals,
	UpdateTrade,
	Trade,
} from "@coinvant/types";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {updateTrade, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	trade: Trade | null;
	updateTrade: (id: string, payload: UpdateTrade) => Promise<void>;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
}

const initialState = {
	status: TradeStatus.pending,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	trade: state.trade.highlightedTrade,
});

const actions = {
	updateTrade,
	closeModal,
	showAlert,
}

export const EditTradeModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdateTrade>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.trade) {
			setPayload({
				status: props.trade.status,
			});
		}
	}, [props.trade]);

	const onSave = async (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.trade) {
				setIsSubmitting(true);
				await props.updateTrade(props.trade.id, payload);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Trade not provided',
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
		<Modal show={props.activeModal === Modals.editTrade} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Trade</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSave}>
					<Form.Group className="mb-3">
						<Form.Label>Select Status</Form.Label>
						<Form.Select defaultValue={payload.status} name={"status"} onChange={onChange} required>
							{Object.values(TradeStatus).map((status, i) => (
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
