import {useState} from "react";
import {useNavigate} from "react-router-dom";

import axios from "axios";

export const Login = () => {
  const navigateTo = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigateTo('/platform');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Email</span>
          <div className={'input-field'}>
            <input type={'email'}
                   onChange={e => setUsername(e.target.value)} required/>
          </div>
        </div>
      </div>
      <div className={'sl-tp-option'}>
        <div className={'input'}>
          <span>Password</span>
          <div className={'input-field'}>
            <input type={showPassword ? 'text' : 'password'}
                   onChange={e => setPassword(e.target.value)} required/>
            {showPassword ? (
              <i className={"fa-solid fa-eye-slash cursor-pointer"} onClick={() => setShowPassword(false)}></i>
            ) : (
              <i className={"fa-solid fa-eye cursor-pointer"} onClick={() => setShowPassword(true)}></i>
            )}
          </div>
        </div>
      </div>
      <button className={"button bg-primary"}>Login</button>
    </div>
  );
};
