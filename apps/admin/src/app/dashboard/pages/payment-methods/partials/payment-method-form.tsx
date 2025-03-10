import {Button, Form} from "react-bootstrap";
import {CreatePaymentMethod, UpdatePaymentMethod, PaymentMethodStatus} from "@coinvant/types";
import {ChangeEvent, FormEvent} from "react";

interface IProps {
	payload: CreatePaymentMethod | UpdatePaymentMethod;
	onSave: (e: FormEvent) => void;
	onChange: (e: ChangeEvent<{ value: string; name: string }>) => void;
	isSubmitting: boolean;
}

export const PaymentMethodForm = (props: IProps) => {
	return (
		<Form onSubmit={props.onSave}>
			<Form.Group className="mb-3">
				<Form.Label>Name</Form.Label>
				<Form.Control type="text" placeholder="Enter name" name={"name"}
					          value={props.payload.name} onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Code</Form.Label>
				<Form.Control type="text" placeholder="Enter code" name={"code"}
					          value={props.payload.code} onChange={props.onChange}
                      required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Network</Form.Label>
				<Form.Control type="text" placeholder="Enter network" name={"network"}
					          value={props.payload.network} onChange={props.onChange}
                      required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Wallet Address</Form.Label>
				<Form.Control type="text" placeholder="Enter walletAddress"
                      name={"walletAddress"} value={props.payload.walletAddress}
                      onChange={props.onChange} required/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Select Status</Form.Label>
				<Form.Select defaultValue={props.payload.status} name={"status"}
                     onChange={props.onChange} required>
					{Object.values(PaymentMethodStatus).map((status, i) => (
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
