import { Link } from 'react-router-dom';
import { Modals } from '@coinvant/types';
import { logout, openModal, RootState } from '@coinvant/store';
import { connect } from 'react-redux';


interface IProps {
  activeModal: Modals | null;
  logout: () => void;
  openModal: (activeModal: Modals) => void;
}

const mapStateToProps = (state: RootState) => ({
  activeModal: state.modal.activeModal,
});

const actions = {
  openModal,
  logout,
};

export const TopBar = connect(mapStateToProps, actions)((props: IProps) => {
  return (
    <div className={"top-bar"}>
      <div className={'nav'}>
        <div className={'navbar'}>
          <Link to={'#'} onClick={() => props.openModal(Modals.settings)}
                className={`nav-item ${props.activeModal === Modals.settings && 'nav-item-active'}`}>
            <i className="fas fa-cog"></i>
            <p>Settings</p>
          </Link>
          <div className={'logo'}>
            <img src={"/assets/images/logo.png"} style={{ height: "40px" }} alt={'Logo'} />
          </div>
          <Link to={'#'} onClick={props.logout} className={`nav-item text-danger`}>
            <i className="fas fa-sign-out-alt" style={{ color: "red" }}></i>
            <p>Logout</p>
          </Link>
        </div>
      </div>
    </div>
  );
});
