import {Modal} from "react-bootstrap";
import {CreateUser, Modals, UserRole, UserStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent, useState} from "react";
import {addUser, closeModal, RootState} from "@coinvant/store";
import {connect} from "react-redux";
import {UserForm} from "./user-form";

interface IProps {
	activeModal: Modals | null;
	closeModal: () => void;
	addUser: (payload: CreateUser) => void;
}

const initialState = {
	email: "",
	name: "",
	password: "",
	role: UserRole.user,
  twoFA: false,
	status: UserStatus.active,
};

const mapStateToProps = (state: RootState) => ({
	activeModal: state.modal.activeModal,
});

const actions = {
	addUser,
	closeModal,
}

export const AddUserModal = connect(mapStateToProps, actions)((props: IProps) => {
	const [payload, setPayload] = useState<CreateUser>(initialState);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onClose = () => {
		setPayload(initialState);
		props.closeModal();
	}

	const onSave = (e: FormEvent) => {
		e.preventDefault();
		try {
			setIsSubmitting(true);
			props.addUser(payload);
			props.closeModal();
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
      [name]: name !== "twoFA" ? value : (value === "true"),
		}));
	}

	return (
		<Modal show={props.activeModal === Modals.addUser} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Add User</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<UserForm payload={payload} onSave={onSave} onChange={onChange} isSubmitting={isSubmitting}/>
			</Modal.Body>
		</Modal>
	);
});
