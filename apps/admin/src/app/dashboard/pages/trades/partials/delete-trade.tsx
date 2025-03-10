import {Button, Modal} from "react-bootstrap";
import {AlertState, Modals, Trade} from "@coinvant/types";
import {FormEvent, useState} from "react";
import {removeTrade, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	trade: Trade | null;
	closeModal: () => void;
	removeTrade: (id: string) => Promise<void>;
	showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	trade: state.trade.highlightedTrade,
});

const actions = {
	removeTrade,
	closeModal,
	showAlert,
}

export const DeleteTradeModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const onSave = async (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.trade) {
				setIsDeleting(true);
				await props.removeTrade(props.trade.id);
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
			setIsDeleting(false);
		}
	}

	return (
		<Modal show={props.activeModal === Modals.deleteTrade} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete Trade</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete this trade?
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
