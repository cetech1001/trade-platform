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
            <svg width="28" height="30" viewBox="0 0 14 15">
              <g transform="translate(2 8.25)">
                <path fill="#1FBF75"
                      d="m4.8828.6523-3.948 5.108c-.075.098-.006.24.118.24h7.894c.124 0 .194-.142.119-.24L5.1168.6523c-.059-.077-.174-.077-.234 0"></path>
              </g>
              <g transform="translate(0 -.75)">
                <path fill="currentColor"
                      d="m2.7324 13.0918 1.954-2.561c.046-.059.036-.142-.02-.193-.9-.81-1.391-2.063-1.066-3.433.298-1.257 1.32-2.277 2.581-2.563 2.289-.518 4.319 1.208 4.319 3.408 0 1.031-.456 1.948-1.166 2.588-.057.051-.067.134-.021.194l1.954 2.56c.052.068.153.081.219.025 1.481-1.238 2.444-3.076 2.51-5.142.122-3.835-3.044-7.162-6.88-7.224-3.919-.063-7.116 3.094-7.116 6.999 0 2.157.978 4.084 2.513 5.367.066.056.167.043.219-.025"></path>
              </g>
            </svg>
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
