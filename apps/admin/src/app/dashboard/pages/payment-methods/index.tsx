import {Button, Col, Row} from "@themesberg/react-bootstrap";
import {connect} from "react-redux";
import {addPaymentMethod, closeModal, editPaymentMethod, fetchPaymentMethods, openModal, removePaymentMethod, RootState} from "@coinvant/store";
import {CreatePaymentMethod, Modals, PaginationOptions, UpdatePaymentMethod, PaymentMethodState} from "@coinvant/types";
import {useEffect, useState} from "react";
import {PaymentMethodsTable} from "./partials/payment-methods-table";
import {AddPaymentMethodModal} from "./partials/add-payment-method";

interface IProps {
  paymentMethod: PaymentMethodState;
  activeModal: Modals | null;
  fetchPaymentMethods: (options?: PaginationOptions) => void;
  addPaymentMethod: (payload: CreatePaymentMethod) => void;
  editPaymentMethod: (id: string, payload: UpdatePaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  openModal: (activeModal: Modals) => void;
  closeModal: () => void;
}

const mapStateToProps = (state: RootState) => ({
  paymentMethod: state.paymentMethod,
  activeModal: state.modal.activeModal,
});

const actions = {
  fetchPaymentMethods,
  addPaymentMethod,
  editPaymentMethod,
  removePaymentMethod,
  openModal,
  closeModal,
}

export const PaymentMethods = connect(mapStateToProps, actions) ((props: IProps) => {
  const [options, setOptions] = useState<PaginationOptions>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    props.fetchPaymentMethods(options);
  }, []);

  return (
    <>
      <Row>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <Button variant="outline-primary" onClick={() => props.openModal(Modals.addPaymentMethod)}>
            Add Payment Method
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <PaymentMethodsTable options={options} setOptions={setOptions}/>
        </Col>
      </Row>
      <AddPaymentMethodModal/>
    </>
  );
});
