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
  openingPrice: 0,
  profitOrLoss: 0,
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
        openingPrice: props.trade.isShort
          ? props.trade.sellPrice : props.trade.buyPrice,
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

	const onChange = (e: ChangeEvent<{ name: string; value: string; }>) => {
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
						<Form.Select name={"status"} onChange={onChange} required>
							{Object.values(TradeStatus).map((status, i) => (
								<option value={status} key={i}
                        selected={status === payload.status}>{status}</option>
							))}
						</Form.Select>
					</Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opening Price</Form.Label>
            <Form.Control type="text" placeholder="Enter opening price"
                          name={"openingPrice"} value={payload.openingPrice}
                          onChange={onChange} required/>
          </Form.Group>

          {/*<Form.Group className="mb-3">
            <Form.Label>Profit/Loss</Form.Label>
            <Form.Control type="text" placeholder="Enter profit/loss"
                          name={"profitOrLoss"} value={payload.profitOrLoss}
                          onChange={onChange} required/>
          </Form.Group>*/}

					<Button variant="primary" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : 'Submit'}
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
});
