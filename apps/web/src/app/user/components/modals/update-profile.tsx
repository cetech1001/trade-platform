import React, {FC, useState} from 'react';
import '../../styles/Sidebar.css';
import {AlertState, AuthUser, Modals, UpdateUser} from "@coinvant/types";

interface IProps {
  activeModal: Modals | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  user: AuthUser | null;
  editUser: (id: string, payload: UpdateUser) => Promise<void>;
  showAlert: (payload: AlertState) => void;
  refreshUserProfile: () => Promise<void>;
}

export const UpdateProfile: FC<IProps> = (props) => {
  const [name, setName] = useState(props.user?.name);
  const [email, setEmail] = useState(props.user?.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSave = async () => {
    try {
      setIsSubmitting(true);
      if (props.user) {
        await props.editUser(props.user?.id, {name, email});
        await props.refreshUserProfile();
      } else {
        props.showAlert({
          type: 'error',
          message: 'User not provided',
          show: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={`sidebar ${props.activeModal === Modals.personal ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={() => props.openModal(Modals.settings)}></i>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"flex-column"} style={{gap: "2rem", marginTop: "2rem"}}>
          <div>
            <div className="title" style={{padding: 0}}>
              <h5 style={{color: "#FFF"}}>Personal</h5>
            </div>
            <div className={'sl-tp-option'}>
              <div className={'input'}>
                <span>Name</span>
                <div className={'input-field'}>
                  <input type={'text'} value={name}
                         onChange={e =>
                             setName(e.target.value)}
                         required/>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="title" style={{padding: 0}}>
              <h5 style={{color: "#FFF"}}>Contacts</h5>
            </div>
            <div className={'sl-tp-option'}>
              <div className={'input'}>
                <span>Email</span>
                <div className={'input-field'}>
                  <input type={'email'} value={email}
                         onChange={e =>
                             setEmail(e.target.value)}
                         required/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <button className={"button bg-primary"} onClick={onSave} style={{ marginBottom: "1rem" }}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
