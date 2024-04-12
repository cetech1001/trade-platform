import {FC, useState} from 'react';
import {Login} from "./login";
import {Signup} from "./signup";

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
        {activeTab === 'login' ? <Login/> : <Signup/>}
      </div>
    </div>
  );
};
