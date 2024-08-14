import {Modal} from "react-bootstrap";
import {CreatePaymentMethod, Modals, PaymentMethodStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent, useState} from "react";
import {addPaymentMethod, closeModal, RootState} from "@coinvant/store";
import {connect} from "react-redux";
import {PaymentMethodForm} from "./payment-method-form";

interface IProps {
	activeModal: Modals | null;
	closeModal: () => void;
	addPaymentMethod: (payload: CreatePaymentMethod) => void;
}

const initialState = {
	name: "",
	code: "",
	network: "",
	walletAddress: "",
	status: PaymentMethodStatus.active,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
});

const actions = {
	addPaymentMethod,
	closeModal,
}

export const AddPaymentMethodModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<CreatePaymentMethod>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onClose = () => {
		setPayload(initialState);
		props.closeModal();
	}

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			props.addPaymentMethod(payload);
			props.closeModal();
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
		<Modal show={props.activeModal === Modals.addPaymentMethod} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Add PaymentMethod</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PaymentMethodForm payload={payload} onSave={onSave} onChange={onChange} isSubmitting={isSubmitting}/>
			</Modal.Body>
		</Modal>
	);
});
