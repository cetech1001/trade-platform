import {AuthUser, Modals} from "@coinvant/types";
import {formatCurrency} from "../../../helpers";
import {closeModal, logout, openModal, RootState} from "@coinvant/store";
import {connect} from "react-redux";

interface IProps {
  user: AuthUser | null;
  activeModal: Modals | null;
  logout: () => void;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  activeModal: state.modal.activeModal,
});

const actions = {
  openModal,
  closeModal,
  logout,
};

export const Settings = connect(mapStateToProps, actions)((props: IProps) => {
  return (
    <div className={`sidebar ${props.activeModal === Modals.settings ? 'open' : ''}`}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div/>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"title"} style={{padding: 0, flexDirection: 'column'}}>
          <h3 style={{color: "#FFF"}}>{props.user?.name}</h3>
          <h5 style={{color: "#FFF"}}>{formatCurrency(props.user?.walletBalance || 0)}</h5>
        </div>
        <div className="title" style={{padding: 0}}>
          <h5 style={{color: "#FFF"}}>Edit Profile</h5>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={"sidebar-option"}
               onClick={() => props.openModal(Modals.personal)}>
            <i className="fa-solid fa-user"></i>
            <div className={"info"}>
              <h5>Personal</h5>
              <p>Name and contacts</p>
            </div>
          </div>
          <div className={"sidebar-option"}
               onClick={() => props.openModal(Modals.password)}>
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
});
