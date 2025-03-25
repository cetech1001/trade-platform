import {Button, Form} from "react-bootstrap";
import { AccountType, UpdateAccount } from '@coinvant/types';
import {ChangeEvent, FormEvent} from "react";

interface IProps {
  type: AccountType | undefined;
	payload: UpdateAccount;
	onSave: (e: FormEvent) => void;
	onChange: (e: ChangeEvent<{ value: string; name: string }>) => void;
	isSubmitting: boolean;
}

export const AccountForm = (props: IProps) => {
	return (
		<Form onSubmit={props.onSave}>
			<Form.Group className="mb-3">
				<Form.Label>Account Type</Form.Label>
				<Form.Control type="text" value={props.type} disabled/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Wallet Balance</Form.Label>
				<Form.Control type="number" placeholder="Wallet Balance" step={0.01}
				              name={"walletBalance"} value={props.payload.walletBalance}
					          onChange={props.onChange} required/>
			</Form.Group>

			<Button variant="primary" type="submit" disabled={props.isSubmitting}>
				{props.isSubmitting ? 'Submitting...' : 'Submit'}
			</Button>
		</Form>
	)
}
