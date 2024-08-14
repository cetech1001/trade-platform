import React, {FC, useState} from 'react';
import '../styles/Sidebar.css';
import {Modals} from "@coinvant/types";

interface IProps {
  activeModal: Modals | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
}

export const UpdatePassword: FC<IProps> = (props) => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  return (
    <div className={`sidebar ${props.activeModal === Modals.password ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={() => props.openModal(Modals.settings)}></i>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className="title" style={{padding: 0, marginTop: "2rem"}}>
          <h5 style={{color: "#FFF"}}>Change Password</h5>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Password</span>
              <div className={'input-field'}>
                <input type={'password'} value={password}
                       onChange={e => setPassword(e.target.value)} required/>
                {showPassword ? (
                  <i className={"fa-solid fa-eye-slash cursor-pointer"} key={'change-password-eye'}
                     onClick={() => setShowPassword(false)}></i>
                ) : (
                  <i className={"fa-solid fa-eye cursor-pointer"} key={'change-password-eye-slash'}
                     onClick={() => setShowPassword(true)}></i>
                )}
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Re-type Password</span>
              <div className={'input-field'}>
                <input type={'password'} value={rePassword}
                       onChange={e => setRePassword(e.target.value)} required/>
                {showRePassword ? (
                  <i className={"fa-solid fa-eye-slash cursor-pointer"} key={'change-re-password-eye'}
                     onClick={() => setShowRePassword(false)}></i>
                ) : (
                  <i className={"fa-solid fa-eye cursor-pointer"} key={'change-re-password-eye-slash'}
                     onClick={() => setShowRePassword(true)}></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <button className={"button bg-primary"} style={{marginBottom: "1rem"}}>
          Change Password
        </button>
      </div>
    </div>
  );
};
