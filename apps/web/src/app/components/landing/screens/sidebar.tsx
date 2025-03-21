import {useState} from 'react';
import {Login} from "./login";
import {Signup} from "./signup";
import { OTP } from './otp';
import { ActiveTab } from '@coinvant/types';

interface IProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = (props: IProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.login);

  if(!props.isSidebarOpen) {
    return null;
  }

  return (
    <div className={'sidebar open'}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.toggleSidebar}></i>
        </div>
        <div className="tabs">
          {activeTab !== ActiveTab.otp ? (
            <>
              <button className={`${activeTab === ActiveTab.login && 'active'}`}
                      onClick={() => setActiveTab(ActiveTab.login)}>Login
              </button>
              <button className={`${activeTab === ActiveTab.signup && 'active'}`}
                      onClick={() => setActiveTab(ActiveTab.signup)}>Sign Up
              </button>
            </>
          ) : (
            <button className={'active'}>OTP</button>
          )}
        </div>
        {activeTab === ActiveTab.login && <Login setActiveTab={setActiveTab}/>}
        {activeTab === ActiveTab.signup && <Signup setActiveTab={setActiveTab}/>}
        {activeTab === ActiveTab.otp && <OTP setActiveTab={setActiveTab}/>}
      </div>
    </div>
  );
};
