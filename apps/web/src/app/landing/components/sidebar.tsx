import {FC, useState} from 'react';

interface IProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: FC<IProps> = (props) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className={`sidebar ${props.isOpen ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.toggleSidebar}></i>
        </div>
        <div className="tabs">
          <button className={`${activeTab === 'login' && 'active'}`}
                  onClick={() => setActiveTab('login')}>Login
          </button>
          <button className={`${activeTab === 'signup' && 'active'}`}
                  onClick={() => setActiveTab('signup')}>Sign Up
          </button>
        </div>
        <div className={"flex-column"} style={{gap: "1rem", marginTop: "2rem"}}>
          {activeTab === 'signup' && (
            <div className={'sl-tp-option'}>
              <div className={'input'}>
                <span>Name</span>
                <div className={'input-field'}>
                  <input type={'text'} required/>
                </div>
              </div>
            </div>
          )}
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Email</span>
              <div className={'input-field'}>
                <input type={'email'} required/>
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Password</span>
              <div className={'input-field'}>
                <input type={'password'} required/>
                <i className={"fa-solid fa-eye"}></i>
              </div>
            </div>
          </div>
          <button className={"button bg-primary"}>
            {activeTab === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
