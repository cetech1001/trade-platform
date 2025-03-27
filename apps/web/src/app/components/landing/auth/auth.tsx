import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginRequest, RegisterRequest, VerifyOTP } from '@coinvant/types';
import { connect } from 'react-redux';
import { completeAuth, login, register, verifyOTP } from '@coinvant/store';
import { AuthRoutes } from '../../../helpers';

enum ActiveTab {
  login = 'login',
  signup = 'signup',
  otp = 'otp',
}

interface IProps {
  login: (payload: LoginRequest) => Promise<{ skipVerification: boolean } | void>;
  register: (payload: RegisterRequest) => Promise<{ skipVerification: boolean } | void>;
  verifyOTP: (payload: VerifyOTP) => Promise<boolean>;
  completeAuth: () => Promise<void>;
}

const actions = {
  login,
  register,
  verifyOTP,
  completeAuth
};

export const Authenticate = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = () => {
    setIsSubmitting(true);
    props
      .login({ email, password })
      .then((data) => {
        if (data?.skipVerification) {
          return navigateTo('/platform');
        }
        setActiveTab(ActiveTab.otp);
      })
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  const onSignUp = () => {
    setIsSubmitting(true);
    props
      .register({ name, email, password })
      .then((data) => {
        if (data?.skipVerification) {
          return navigateTo('/platform');
        }
        setActiveTab(ActiveTab.otp);
      })
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  const onOTPSubmit = async () => {
    setIsSubmitting(true);
    const email = localStorage.getItem("email") || '';
    props
      .verifyOTP({ otp, email })
      .then(() => props.completeAuth())
      .then(() => {
        setActiveTab(ActiveTab.login);
        navigateTo('/platform');
      })
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

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
            {activeTab !== ActiveTab.otp && (
              <>
                <div className={"tab"}>
                  <span onClick={() => !isSubmitting
                    && setActiveTab(ActiveTab.login)}>
                    Login
                  </span>
                  {activeTab === ActiveTab.login && (
                    <div className={"active-block"}></div>
                  )}
                </div>
                <div className={"tab"}>
                  <span onClick={() => !isSubmitting
                    && setActiveTab(ActiveTab.signup)}>
                    Register
                  </span>
                  {activeTab === ActiveTab.signup && (
                    <div className={"active-block"}></div>
                  )}
                </div>
              </>
            )}
            {activeTab === ActiveTab.otp && (
              <div className={"tab"}>
                <span>OTP</span>
                <div className={"active-block"}></div>
              </div>
            )}
          </div>
          {activeTab === ActiveTab.signup && (
            <div className={"input-group"}>
              <label><span>*</span> Name</label>
              <input className={"input"} type={"text"} name={"name"} value={name}
                     onChange={e => setName(e.target.value)}
                     disabled={isSubmitting} required/>
            </div>
          )}
          {activeTab !== ActiveTab.otp && (
            <>
              <div className={"input-group"}>
                <label><span>*</span> Email</label>
                <input className={"input"} type={"email"} name={"email"} value={email}
                       onChange={e => setEmail(e.target.value)}
                       disabled={isSubmitting} required/>
              </div>
              <div className={"input-group"}>
                <label><span>*</span> Password</label>
                <input className={"input"} type={showPassword ? "text" : "password"}
                       name={"password"} value={password} disabled={isSubmitting}
                       onChange={e =>
                         setPassword(e.target.value)} required/>
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
            </>
          )}
          {activeTab === ActiveTab.otp && (
            <div className={"input-group"}>
              <label><span>*</span> OTP</label>
              <input className={"input"} type={"text"} name={"rePassword"}
                     minLength={6} maxLength={6} onChange={e =>
                setOTP(e.target.value)} disabled={isSubmitting} required/>
            </div>
          )}
          {activeTab === ActiveTab.login && (
            <button disabled={isSubmitting} onClick={onLogin}>
              { isSubmitting ? 'Logging in...' : 'Log in' }
            </button>
          )}
          {activeTab === ActiveTab.signup && (
            <button disabled={isSubmitting} onClick={onSignUp}>
              { isSubmitting ? 'Creating your account...' : 'Sign up' }
            </button>
          )}
          {activeTab === ActiveTab.otp && (
            <button disabled={isSubmitting} onClick={onOTPSubmit}>
              { isSubmitting ? 'Verifying...' : 'Verify' }
            </button>
          )}
          {activeTab === ActiveTab.login && (
            <Link to={AuthRoutes.forgotPassword}
                  className={"auth-link"}>
              Forgot Password?
            </Link>
          )}
          {activeTab === ActiveTab.otp && (
            <Link to={'#'} onClick={() => setActiveTab(ActiveTab.login)}
                  className={"auth-link"}>Back to login?</Link>
          )}
        </div>
      </div>
    </div>
  );
});
