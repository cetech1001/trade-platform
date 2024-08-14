import {Modal} from "react-bootstrap";
import {AlertState, Modals, UpdateUser, User, UserRole, UserStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {UserForm} from "./user-form";
import {editUser, closeModal, RootState, showAlert} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
	activeModal: Modals | null;
	user: User | null;
	editUser: (id: string, payload: UpdateUser) => void;
	closeModal: () => void;
	showAlert: (payload: AlertState) => void;
}

const initialState = {
	email: "",
	name: "",
	password: "",
	role: UserRole.user,
	status: UserStatus.active,
	walletBalance: 0,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
	user: state.user.currentUser,
});

const actions = {
	editUser,
	closeModal,
	showAlert,
}

export const EditUserModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<UpdateUser>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (props.user) {
			setPayload({
				email: props.user.email,
				name: props.user.name,
				password: props.user.password,
				role: props.user.role,
				status: props.user.status,
				walletBalance: props.user.walletBalance,
			});
		}
	}, [props.user]);

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			if (props.user) {
				setIsSubmitting(true);
				props.editUser(props.user.id, payload);
				props.closeModal();
			} else {
				props.showAlert({
					type: 'error',
					message: 'User not provided',
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
		<Modal show={props.activeModal === Modals.editUser} onHide={props.closeModal}>
			<Modal.Header closeButton>
				<Modal.Title>Edit User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<UserForm payload={payload} onSave={onSave} onChange={onChange} isSubmitting={isSubmitting}/>
			</Modal.Body>
		</Modal>
	);
});
