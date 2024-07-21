import {Button, Form} from "react-bootstrap";
import {CreateUser, UpdateUser, UserRole, UserStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent} from "react";

interface IProps {
	payload: CreateUser | UpdateUser;
	onSave: (e: FormEvent) => void;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
	isSubmitting: boolean;
}

export const UserForm = (props: IProps) => {
	return (
		<Form onSubmit={props.onSave}>
			<Form.Group className="mb-3">
				<Form.Label>Full name</Form.Label>
				<Form.Control type="text" placeholder="Enter name" name={"name"}
					// @ts-ignore
					          value={props.payload.name} onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Email address</Form.Label>
				<Form.Control type="email" placeholder="Enter email" name={"email"}
					// @ts-ignore
					          value={props.payload.email} onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Password</Form.Label>
				<Form.Control type="text" placeholder="Password" name={"password"}
					// @ts-ignore
					          value={props.payload.password} onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Wallet Balance</Form.Label>
				<Form.Control type="number" placeholder="Wallet Balance" step={0.01}
				              name={"walletBalance"} value={props.payload.walletBalance}
					// @ts-ignore
					          onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Select Role</Form.Label>
				<Form.Select defaultValue={props.payload.role} name={"role"} onChange={props.onChange} required>
					{Object.values(UserRole).map((role, i) => (
						<option value={role} key={i}>{role}</option>
					))}
				</Form.Select>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Select Status</Form.Label>
				<Form.Select defaultValue={props.payload.status} name={"status"} onChange={props.onChange} required>
					{Object.values(UserStatus).map((status, i) => (
						<option value={status} key={i}>{status}</option>
					))}
				</Form.Select>
			</Form.Group>

			<Button variant="primary" type="submit" disabled={props.isSubmitting}>
				{props.isSubmitting ? 'Submitting...' : 'Submit'}
			</Button>
		</Form>
	)
}
