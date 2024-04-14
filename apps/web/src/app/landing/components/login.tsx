import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigateTo = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLogin = async () => {
    try {
      setIsError(false);
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access_token);
      navigateTo('/platform');
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
      {isError && <div className={"auth-error"}>
        Invalid login details
      </div>}
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
