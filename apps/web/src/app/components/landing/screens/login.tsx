import { Dispatch, SetStateAction, useState } from 'react';
import { ActiveTab, LoginRequest } from '@coinvant/types';
import {connect} from "react-redux";
import {login} from "@coinvant/store";
import { useNavigate } from 'react-router-dom';

interface IProps {
  login: (payload: LoginRequest) => Promise<void | { skipVerification: boolean; }>;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
}

const actions = { login };

export const Login = connect(null, actions)((props: IProps) => {
  const navigateTo = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
    props
      .login({ email, password })
      .then((data) => {
        if (data?.skipVerification) {
          return navigateTo('/platform');
        }
        props.setActiveTab(ActiveTab.otp);
      })
      .catch(() => null)
      .finally(() => setIsSubmitting(false));
  };

  return (
      <form className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
        <div className={'sl-tp-option'}>
          <div className={'input'}>
            <span>Email</span>
            <div className={'input-field'}>
              <input type={'email'} value={email} autoComplete={"username"}
                     onChange={e => setEmail(e.target.value)} required/>
            </div>
          </div>
        </div>
        <div className={'sl-tp-option'}>
          <div className={'input'}>
            <span>Password</span>
            <div className={'input-field'}>
              <input type={showPassword ? 'text' : 'password'} value={password} autoComplete={"current-password"}
                     onChange={e => setPassword(e.target.value)} required/>
              {showPassword ? (
                  <i className={"fa-solid fa-eye-slash cursor-pointer"} onClick={() => setShowPassword(false)}></i>
              ) : (
                  <i className={"fa-solid fa-eye cursor-pointer"} onClick={() => setShowPassword(true)}></i>
              )}
            </div>
          </div>
        </div>
        <button className={"button bg-primary"} onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
  );
});
