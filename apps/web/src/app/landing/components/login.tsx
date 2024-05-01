import {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import {LoginRequest} from "@coinvant/types";
import {connect} from "react-redux";
import {login} from "@coinvant/store";

interface IProps {
  login: (payload: LoginRequest) => Promise<void>;
}

const Component: FC<IProps> = (props) => {
  const navigateTo = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    try {
      setIsSubmitting(true);
      props.login({
        email,
        password,
      }).then(() => navigateTo('/platform'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Email</span>
          <div className={'input-field'}>
            <input type={'email'} value={email}
                   onChange={e => setEmail(e.target.value)} required/>
          </div>
        </div>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Password</span>
          <div className={'input-field'}>
            <input type={showPassword ? 'text' : 'password'} value={password}
                   onChange={e => setPassword(e.target.value)} required/>
            {showPassword ? (
              <i className={"fa-solid fa-eye-slash cursor-pointer"} onClick={() => setShowPassword(false)}></i>
            ) : (
              <i className={"fa-solid fa-eye cursor-pointer"} onClick={() => setShowPassword(true)}></i>
            )}
          </div>
        </div>
      </div>
      <button className={"button bg-primary"} onClick={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>
    </div>
  );
};

export const Login = connect(null, { login })(Component);
