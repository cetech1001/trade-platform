import {Modal} from "react-bootstrap";
import {AlertState, Modals, UpdatePaymentMethod, PaymentMethod, PaymentMethodStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {PaymentMethodForm} from "./payment-method-form";
import {editPaymentMethod, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	paymentMethod: PaymentMethod | null;
	editPaymentMethod: (id: string, payload: UpdatePaymentMethod) => void;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
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
	paymentMethod: state.paymentMethod.highlightedPaymentMethod,
});

const actions = {
	editPaymentMethod,
	closeModal,
	showAlert,
}

export const EditPaymentMethodModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdatePaymentMethod>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.paymentMethod) {
			setPayload({
				name: props.paymentMethod.name,
				code: props.paymentMethod.code,
				network: props.paymentMethod.network,
				status: props.paymentMethod.status,
				walletAddress: props.paymentMethod.walletAddress,
			});
		}
	}, [props.paymentMethod]);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.paymentMethod) {
				setIsSubmitting(true);
				props.editPaymentMethod(props.paymentMethod.id, payload);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'PaymentMethod not provided',
					show: true,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	}

	const onChange = (e: ChangeEvent<{ value: string; name: string; }>) => {
		const { name, value } = e.target;
		setPayload(prevState => ({
			...prevState,
			[name]: value,
		}));
	}

	return (
		<Modal show={props.activeModal === Modals.editPaymentMethod} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit PaymentMethod</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PaymentMethodForm payload={payload} onSave={onSave} onChange={onChange} isSubmitting={isSubmitting}/>
			</Modal.Body>
		</Modal>
	);
});
