import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetPassword, showAlert } from '@coinvant/store';
import { AuthRoutes } from '../../../helpers';
import { AlertState, ResetPasswordRequest } from '@coinvant/types';

interface IProps {
  resetPassword: (payload: ResetPasswordRequest) => Promise<void>;
  showAlert: (payload: AlertState) => void;
}

const actions = {
  resetPassword,
  showAlert
};

export const ResetPassword = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    if (password !== rePassword) {
      return props.showAlert({
        message: 'Passwords do not match',
        type: 'error',
        show: true,
      });
    }

    setIsSubmitting(true);
    props.resetPassword({
      password,
      otp: searchParams.get('token') || '',
      email: searchParams.get('email') || '',
    })
      .then(() => {
        navigateTo(AuthRoutes.login);
      })
      .catch(() => {
        setPassword("");
        setRePassword("");
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="home">
      <div className={'image'}>
        <div className="logo-wrap">
          <div className={"logo"}>
            <img
              src="/assets/images/logo.png"
              className="logo"
              alt={'Logo'}
            />
          </div>
          <p>AIM HIGH, REACH HIGH</p>
        </div>
        <img
          src="/assets/images/astronaut.png"
          alt="Astronaut"
          className="astronaut"
        />
      </div>
      <div className="content">
        <div className={"form-box"}>
          <p className={"title"}>Client Portal</p>
          <div className={"tabs"}>
            <div className={"tab"}>
              <span>Reset Password</span>
              <div className={"active-block"}></div>
            </div>
          </div>
          <div className={"input-group"}>
            <label><span>*</span> Password</label>
            <input className={"input"} type={showPassword ? "text" : "password"}
                   name={"password"} value={password} disabled={isSubmitting}
                   onChange={e =>
                     setPassword(e.target.value)} required/>
          </div>
          <div className={"input-group"}>
            <label><span>*</span> Re-type Password</label>
            <input className={"input"} type={showPassword ? "text" : "password"}
                   name={"rePassword"} value={rePassword} disabled={isSubmitting}
                   onChange={e =>
                     setRePassword(e.target.value)} required/>
          </div>
          <div className={"input-group"}>
            <label>
              <div style={{ fontSize: '8px' }}>
                <input type={"checkbox"} name={"showPassword"}
                       checked={showPassword}
                       onChange={e =>
                         setShowPassword(e.target.checked)}/>
              </div>
              Show Password
            </label>
          </div>
          <button disabled={isSubmitting} onClick={onSubmit}>
            { isSubmitting ? 'Verifying...' : 'Verify' }
          </button>
          <Link to={AuthRoutes.login} className={"auth-link"}>
            Back to login?
          </Link>
        </div>
      </div>
    </div>
  );
});
