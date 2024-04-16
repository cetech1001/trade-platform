import React, {FC} from 'react';

import '../styles/Sidebar.css';
import {AuthUser, Modals, ModalState} from "@coinvant/types";

interface IProps {
  user: AuthUser | null;
  logout: () => void;
  activeModal: Modals | null;
  openModal: (payload: ModalState) => void;
  closeModal: () => void;
}

export const Settings: FC<IProps> = (props) => {
  return (
    <div className={`sidebar ${props.activeModal === Modals.settings ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"title"} style={{padding: 0}}>
          <h3 style={{color: "#FFF"}}>Settings</h3>
        </div>
        <div className="title" style={{padding: 0}}>
          <h5 style={{color: "#FFF"}}>Profile</h5>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={"sidebar-option"}
               onClick={() => props.openModal({ activeModal: Modals.personal })}>
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
        <button className={"button bg-negative"} style={{ marginBottom: "1rem" }} onClick={props.logout}>
          <i className={"fa-solid fa-sign-out-alt"}></i> Logout
        </button>
      </div>
    </div>
  );
};
