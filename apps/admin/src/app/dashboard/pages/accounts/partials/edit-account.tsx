import {Modal} from "react-bootstrap";
import { AlertState, Modals, UpdateAccount, Account } from '@coinvant/types';
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {AccountForm} from "./account-form";
import {editAccount, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	account: Account | null;
	editAccount: (id: string, payload: UpdateAccount) => void;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
}

const initialState = {
	walletBalance: 0,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	account: state.account.highlightedAccount,
});

const actions = {
	editAccount,
	closeModal,
	showAlert,
}

export const EditAccountModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdateAccount>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.account) {
			setPayload({
				walletBalance: props.account.walletBalance,
			});
		}
	}, [props.account]);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.account) {
				setIsSubmitting(true);
				props.editAccount(props.account.id, payload);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'Account not provided',
					show: true,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	}

	const onChange = (e: ChangeEvent<{ value: string; name: string }>) => {
		const { name, value } = e.target;
		setPayload(prevState => ({
			...prevState,
			[name]: value,
		}));
	}

	return (
		<Modal show={props.activeModal === Modals.editAccount} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit Account</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<AccountForm payload={payload} onSave={onSave} type={props.account?.type}
                     onChange={onChange} isSubmitting={isSubmitting}/>
			</Modal.Body>
		</Modal>
	);
});
