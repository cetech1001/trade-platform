import {useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export const Signup = () => {
  const navigateTo = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });
      localStorage.setItem('access_token', response.data.access_token);
      navigateTo('/platform');
    } catch (error) {
      console.error('Sign up failed', error);
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
