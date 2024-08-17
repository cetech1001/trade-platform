import React, {FC, useEffect, useState} from 'react';
import '../styles/Sidebar.css';
import '../styles/Deposit.css';
import {AlertState, Modals, PaymentMethod} from "@coinvant/types";
import axios from "axios";
import QRCode from 'qrcode.react';
import {Form} from "react-bootstrap";

interface IProps {
  activeModal: Modals | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  showAlert: (payload: AlertState) => void;
  paymentMethods: PaymentMethod[];
  addDeposit: (payload: FormData) => Promise<void>;
}

export const Deposit: FC<IProps> = (props) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [proof, setProof] = useState(null);

  useEffect(() => {
    if (paymentMethod !== "") {
      setMethod(() => props.paymentMethods.find(({ id }) =>
          id === paymentMethod));
    }
  }, [paymentMethod]);

  const reset = () => {
    setStep(1);
    setAmount(10);
    setPaymentMethod("");
    setCryptoAmount(0);
    setMethod(undefined);
    setProof(null);
  }

  const goForward = () => {
    if (amount > 0 && method) {
      axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${method.code}&tsyms=USD`)
          .then((response) => {
            setCryptoAmount(amount / response.data["USD"]);
          })
          .catch((error) => {
            console.error('Error fetching conversion rate:', error);
            props.showAlert({
              show: true,
              type: "error",
              message: "Error fetching conversion rate",
            });
          });
      setStep(2);
    } else {
      props.showAlert({
        show: true,
        type: "error",
        message: "Please select a payment method / Enter an amount greater than 0",
      });
    }
  }

  const submit = async () => {
    if (proof) {
      const formData = new FormData();
      formData.append("proof", proof);
      formData.append("paymentMethod", paymentMethod);
      formData.append("amount", `${amount}`);

      await props.addDeposit(formData);
      props.closeModal();
      reset();
    } else {
      props.showAlert({
        show: true,
        type: "error",
        message: "Please upload proof of payment to continue",
      });
    }
  }

  const onConfirm = async () => {
    if (step === 1) {
      goForward();
    } else {
      await submit();
    }
  }

  const onFileUpload = (e: any) => {
    setProof(e.target.files[0]);
  }

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      props.openModal(Modals.payments);
    }
  }

  return (
    <div className={`sidebar ${props.activeModal === Modals.deposit ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={goBack}></i>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"flex-column"} style={{gap: "2rem", marginTop: "2rem"}}>
          {step === 1 && <>
            <div className="title" style={{padding: 0}}>
              <h5 style={{color: "#FFF"}}>Deposit</h5>
            </div>
            <div>
              <div className={'sl-tp-option'}>
                <div className={'input'}>
                  <span>Amount</span>
                  <div className={'input-field'}>
                    <input type={'number'} value={amount} step={0.01} min={10}
                           onChange={e =>
                               setAmount(+e.target.value)} required/>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className={'sl-tp-option'}>
                <div className={'input'}>
                  <span>Payment Method</span>
                  <div className={'input-field'}>
                    <select name={'payment-method'} value={paymentMethod}
                            onChange={e =>
                                setPaymentMethod(e.target.value)}>
                      <option value={""}>-- SELECT PAYMENT METHOD --</option>
                      {props.paymentMethods.map((method: PaymentMethod) => (
                          <option key={method.id} value={method.id}>
                            {`${method.name} (${method.code}) - ${method.network}`}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </>}
          {step === 2 && <>
            <div className="title" style={{padding: 0}}>
              <h5 style={{color: "#FFF"}}>Confirm Payment</h5>
            </div>
            <div className={'qr-code'}>
              <QRCode value={`${method?.code}:${method?.walletAddress}`} style={{ border: "2px solid #ffffff" }}/>
            </div>
            <div className={"amount"}>
              <h4 style={{color: "#9CB0C2"}}>Payment Amount</h4>
              <h3 style={{color: "#fff"}}>{cryptoAmount.toFixed(6)} {method?.code}</h3>
            </div>
            <div className={"payment-info"}>
              <div className={"info"}>
                <div className="lead">Payment Method</div>
                <div className="sub">{method?.name}</div>
              </div>
              <div className={"info"}>
                <div className="lead">Network</div>
                <div className="sub">{method?.network}</div>
              </div>
              <div className={"info"}>
                <div className="lead">Currency</div>
                <div className="sub">{method?.code}</div>
              </div>
            </div>
            <Form.Group controlId="proof" className="mb-3">
              <Form.Label style={{ color: "#fff", fontSize: "12px" }}>
                Upload proof of payment
              </Form.Label>
              <Form.Control type="file" size="sm" onChange={onFileUpload} />
            </Form.Group>
          </>}
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <button className={`button bg-${step === 2 && !proof ? 'disabled' : 'primary'}`}
                onClick={onConfirm} style={{marginBottom: "1rem"}}
                disabled={step === 2 && !proof}>
          {step === 1 ? 'Next' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};
