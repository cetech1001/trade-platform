import {useNavigate} from "react-router-dom";
import {FC, useState} from "react";
import {connect} from "react-redux";
import {register} from "../../../store";
import {RegisterRequest} from "@coinvant/types";

interface IProps {
  register: (payload: RegisterRequest) => Promise<void>;
}

const Component: FC<IProps> = (props) => {
  const navigateTo = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      setIsSubmitting(true);
      props.register({
        name,
        email,
        password,
      }).then(() => navigateTo('/platform'));
      navigateTo('/platform');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Name</span>
          <div className={'input-field'}>
            <input type={'text'} value={name}
                   onChange={e => setName(e.target.value)} required/>
          </div>
        </div>
      </div>
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
            <input type={'password'} value={password}
                   onChange={e => setPassword(e.target.value)} required/>
            {showPassword ? (
              <i className={"fa-solid fa-eye-slash cursor-pointer"} key={'signup-eye'}
                 onClick={() => setShowPassword(false)}></i>
            ) : (
              <i className={"fa-solid fa-eye cursor-pointer"} key={'signup-eye-slash'}
                 onClick={() => setShowPassword(true)}></i>
            )}
          </div>
        </div>
      </div>
      <button className={"button bg-primary"} onClick={handleSignup} disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </button>
    </div>
  );
};

export const Signup = connect(null, { register })(Component);
