import React, { useState } from 'react';
import { verifyOTP } from '@coinvant/store';
import { connect } from 'react-redux';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isValid: boolean) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
}

const actions = {
  verifyOTP,
}

export const OTPModal = connect(null, actions)((props: IProps) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!props.isOpen) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const isValid = await props.verifyOTP(otp);
      await props.onSubmit(isValid);
    } finally {
      setOtp('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"otp"}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>Enter OTP</h2>
          <p>An OTP was sent to your email. Please enter it below:</p>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>OTP</span>
              <div className={'input-field'}>
                <input type={'text'} value={otp} maxLength={6}
                       onChange={e =>
                         setOtp(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button onClick={handleSubmit} disabled={isSubmitting}
                    className="submit-btn">
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>
            <button onClick={props.onClose} disabled={isSubmitting}
                    className="close-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
});
