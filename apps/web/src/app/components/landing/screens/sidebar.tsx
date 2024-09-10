import {useState} from 'react';
import {Login} from "./login";
import {Signup} from "./signup";

interface IProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

enum ActiveTab {
  login = 'login',
  signup = 'signup',
}

export const Sidebar = (props: IProps) => {
  const [activeTab, setActiveTab]
    = useState<ActiveTab>(ActiveTab.login);

  return (
    <div className={`sidebar ${props.isSidebarOpen ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.toggleSidebar}></i>
        </div>
        <div className="tabs">
          <button className={`${activeTab === ActiveTab.login && 'active'}`}
                  onClick={() => setActiveTab(ActiveTab.login)}>Login
          </button>
          <button className={`${activeTab === ActiveTab.signup && 'active'}`}
                  onClick={() => setActiveTab(ActiveTab.signup)}>Sign Up
          </button>
        </div>
        {activeTab === ActiveTab.login ? <Login/> : <Signup/>}
      </div>
    </div>
  );
};
