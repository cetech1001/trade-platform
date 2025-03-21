import { Dispatch, SetStateAction, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import { completeAuth, verifyOTP } from '@coinvant/store';
import { ActiveTab, VerifyOTP } from '@coinvant/types';

interface IProps {
  verifyOTP: (payload: VerifyOTP) => Promise<boolean>;
  completeAuth: () => Promise<void>;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

const actions = { verifyOTP, completeAuth };

export const OTP = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const [otp, setOTP] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const email = localStorage.getItem("email") || '';
    props
      .verifyOTP({ otp, email })
      .then(() => props.completeAuth())
      .then(() => navigateTo('/platform'))
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  const onCancel = () => {
    props.setActiveTab(ActiveTab.login);
  }

  return (
      <form className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
        <div className={'sl-tp-option'}>
          <div className={'input'}>
            <span>Enter OTP</span>
            <div className={'input-field'}>
              <input type={'text'} value={otp} autoComplete={"new-password"}
                     maxLength={6} minLength={6}
                     onChange={e =>
                       setOTP(e.target.value)} required/>
            </div>
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", gap: "1rem"}}>
          <button className={"button"} onClick={onCancel}
                  style={{backgroundColor: "rgb(220,53,69)", flex: 1}}>
            Cancel
          </button>
          <button className={"button bg-primary"} style={{ flex: 1 }}
                  onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
  );
});
