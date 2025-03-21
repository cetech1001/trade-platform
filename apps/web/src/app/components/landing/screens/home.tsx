import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginRequest, RegisterRequest } from '@coinvant/types';
import { connect } from 'react-redux';
import { login, register } from '@coinvant/store';

enum ActiveTab {
  login = 'login',
  signup = 'signup',
}

interface IProps {
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
}

const actions = { login, register }

export const Home = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = () => {
    setIsSubmitting(true);
    props.login({email, password})
      .then(() => navigateTo('/platform'))
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  const onSignUp = () => {
    setIsSubmitting(true);
    props.register({ name, email, password })
      .then(() => navigateTo('/platform'))
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="home">
      <div className={'image'}>
        <div className="logo-wrap">
          <img
            src="/assets/images/logo.png"
            className="logo"
            alt={'Logo'}
          />
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
          </div>
          {activeTab === ActiveTab.signup && (
            <div className={"input-group"}>
              <label><span>*</span> Name</label>
              <input className={"input"} type={"text"} name={"name"} value={name}
                     onChange={e => setName(e.target.value)}
                     disabled={isSubmitting} required/>
            </div>
          )}
          <div className={"input-group"}>
            <label><span>*</span> Email</label>
            <input className={"input"} type={"email"} name={"email"} value={email}
                   onChange={e => setEmail(e.target.value)}
                   disabled={isSubmitting} required/>
          </div>
          <div className={"input-group"}>
            <label><span>*</span> Password</label>
            <input className={"input"} type={showPassword ? "text" : "password"}
                   name={"email"} value={password} disabled={isSubmitting}
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
          {/*{activeTab === ActiveTab.signup && (
            <div className={"input-group"}>
              <label><span>*</span> Re-type Password</label>
              <input type={"text"} name={"rePassword"} disabled={isSubmitting} required/>
            </div>
          )}*/}
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
        </div>
      </div>
    </div>
  );
});
