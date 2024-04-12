import React, {FC} from 'react';
import {useNavigate} from "react-router-dom";

import '../styles/Sidebar.css';

interface IProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Settings: FC<IProps> = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  }

  return (
    <div className={`sidebar ${props.isOpen ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.toggleSidebar}></i>
        </div>
        <div className={"title"} style={{padding: 0}}>
          <h3 style={{color: "#FFF"}}>Settings</h3>
        </div>
        <div className="title" style={{padding: 0}}>
          <h5 style={{color: "#FFF"}}>Profile</h5>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={"sidebar-option"}>
            <i className="fa-solid fa-user"></i>
            <div className={"info"}>
              <h5>Personal</h5>
              <p>Name and contacts</p>
            </div>
          </div>
          <div className={"sidebar-option"}>
            <i className="fa-solid fa-key"></i>
            <div className={"info"}>
              <h5>Password</h5>
              <p>Keep your account secure</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <button className={"button bg-negative"} style={{ marginBottom: "1rem" }} onClick={logout}>
          <i className={"fa-solid fa-sign-out-alt"}></i> Logout
        </button>
      </div>
    </div>
  );
};
