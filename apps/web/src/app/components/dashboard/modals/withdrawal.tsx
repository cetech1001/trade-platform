import React, {useEffect, useState} from 'react';
import {
  Account,
  AlertState,
  AuthUser,
  CreateWithdrawal,
  Modals,
  PaginationOptions,
  PaymentMethod
} from '@coinvant/types';
import {formatCurrency} from "../../../helpers";
import {connect} from "react-redux";
import {
  addWithdrawal,
  closeModal,
  fetchPaymentMethods,
  openModal,
  RootState,
  sendOTP,
  showAlert
} from '@coinvant/store';
import { OTPModal } from './otp';

interface IProps {
  activeModal: Modals | null;
  paymentMethods: PaymentMethod[];
  user: Omit<AuthUser, 'password'> | null;
  account: Account | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  showAlert: (payload: AlertState) => void;
  addWithdrawal: (payload: CreateWithdrawal) => Promise<void>;
  fetchPaymentMethods: (options?: PaginationOptions) => void;
  sendOTP: (email: string) => Promise<void>;
}

const mapStateToProps = (state: RootState) => ({
  activeModal: state.modal.activeModal,
  paymentMethods: state.paymentMethod.list,
  user: state.auth.user,
  account: state.account.highlightedAccount,
});

const actions = {
  openModal,
  closeModal,
  addWithdrawal,
  showAlert,
  fetchPaymentMethods,
  sendOTP,
};

export const Withdrawal = connect(mapStateToProps, actions)((props: IProps) => {
  if (Modals.withdrawal !== props.activeModal) return null;

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("10");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [method, setMethod] = useState<PaymentMethod | undefined>();
  const [walletAddress, setWalletAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOTPOpen, setIsOTPOpen] = useState(false);

  useEffect(() => {
    if (paymentMethod !== "") {
      setMethod(() => props.paymentMethods.find(({ id }) =>
          id === paymentMethod));
    }
  }, [paymentMethod, props.paymentMethods]);

  useEffect(() => {
    if (props.paymentMethods.length === 0) {
      props.fetchPaymentMethods();
    }
  }, []);

  const reset = () => {
    setStep(1);
    setAmount("10");
    setPaymentMethod("");
    setMethod(undefined);
    setWalletAddress("");
  }

  const validateInputs = () => {
    if (+amount <= 0) {
      props.showAlert({
        show: true,
        type: "error",
        message: "Enter an amount greater than 0",
      });
      return false;
    }

    if (!method) {
      props.showAlert({
        show: true,
        type: "error",
        message: "Select a payment method",
      });
      return false;
    }

    if (!walletAddress) {
      props.showAlert({
        show: true,
        type: "error",
        message: "Enter a wallet address",
      });
      return false;
    }

    if (!props.account || +props.account.walletBalance < +amount) {
      props.showAlert({
        show: true,
        type: "error",
        message: "Insufficient wallet balance",
      });
      return false;
    }

    return true
  }

  const goBack = () => {
    props.openModal(Modals.payments);
  }

  const openOTPModal = async () => {
    if (validateInputs() && method) {
      try {
        setIsSubmitting(true);
        await props.sendOTP(props.user?.email || '');
        setIsOTPOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const submit = async (isValid: boolean) => {
    if (isValid && props.account && method) {
      try {
        setIsOTPOpen(false);
        setIsSubmitting(true);
        await props.addWithdrawal({
          amount: +amount,
          paymentMethod: method.name,
          network: method.network,
          walletAddress,
          accountID: props.account.id,
        });
        setStep(2);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const onConfirm = async () => {
    if (step === 1) {
      await openOTPModal();
    } else {
      props.openModal(Modals.transactions);
      reset();
    }
  }

  const GreenCheckmark = ({ size = 100, color = 'green' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M9 16.2l-3.5-3.5-1.4 1.4 4.9 4.9 11-11-1.4-1.4L9 16.2z"
              fill={color}
          />
        </svg>
    );
  };

  return (
    <div className={'sidebar open'}>
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
              <h5 style={{color: "#FFF"}}>Withdrawal</h5>
            </div>
            <div>
              <div className={'sl-tp-option'}>
                <div className={'input'}>
                  <span>Amount</span>
                  <div className={'input-field'}>
                    <input type={'number'} value={amount} step={0.01} min={10}
                           onChange={e =>
                               setAmount(e.target.value)} required/>
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
            <div>
              <div className={'sl-tp-option'}>
                <div className={'input'}>
                  <span>Wallet Address</span>
                  <div className={'input-field'}>
                    <input type={'string'} value={walletAddress}
                           onChange={e =>
                               setWalletAddress(e.target.value)} required/>
                  </div>
                </div>
              </div>
            </div>
          </>}
          {step === 2 && <>
            <div className="title" style={{padding: 0}}>
              <h5 style={{color: "#FFF"}}>Withdrawal Requested</h5>
            </div>
            <div className={'qr-code'}>
              <GreenCheckmark size={150} color="#28a745" />
            </div>
            <div className={"payment-amount"}>
              <h4 style={{color: "#9CB0C2"}}>Payment Amount</h4>
              <h3 style={{color: "#fff"}}>{formatCurrency(amount)}</h3>
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
                <div className="lead">Wallet Address</div>
                <div className="sub">{walletAddress.substring(0, 10) + '...'}</div>
              </div>
            </div>
            <span style={{ color: "#fff" }}>
              Your withdrawal request is being processed, you will receive your payment within 24 hours.
            </span>
          </>}
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <button className={`button bg-primary`}
                onClick={onConfirm} style={{marginBottom: "1rem"}}>
          {step === 1 ? (!isSubmitting ? 'Confirm' : 'Processing...') : 'Done'}
        </button>
      </div>
      <OTPModal isOpen={isOTPOpen} onClose={() => setIsOTPOpen(false)}
                onSubmit={submit} email={props.user?.email || ''}/>
    </div>
  );
});
