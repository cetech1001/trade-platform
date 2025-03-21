import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {USER_ROUTES} from "../../../../routes";
import {Modals} from "@coinvant/types";
import {logout, openModal, RootState} from "@coinvant/store";
import {connect} from "react-redux";
import { useIsMobile } from '../../../../hooks';


interface IProps {
  activeTab: USER_ROUTES;
  activeModal: Modals | null;
  toggleNav: (route: USER_ROUTES) => void;
  logout: () => void;
  openModal: (activeModal: Modals) => void;
}

let intervalID: NodeJS.Timeout;

const mapStateToProps = (state: RootState) => ({
  activeModal: state.modal.activeModal,
});

const actions = {
  openModal,
  logout,
};

export const Nav = connect(mapStateToProps, actions)((props: IProps) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    intervalID = setInterval(function() {
      const randomNumber = Math.floor(Math.random() * 9001) + 1000;
      setActiveUsers(randomNumber);
    }, 1000);

    return () => {
      clearInterval(intervalID);
    }
  }, []);

  return (
    <div className={'nav'}>
      <div className={'navbar'}>
        <div className={'logo'}>
          <img src={"/assets/images/logo-short.png"} style={{ height: "50px" }} alt={'Logo'} />
        </div>
        <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.home)}
              className={`nav-item ${props.activeTab === USER_ROUTES.home && 'nav-item-active'}`}>
          <i className="fas fa-house"></i>
          <p>Home</p>
        </Link>
        {!isMobile && (
          <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.trades)}
                className={`nav-item ${[USER_ROUTES.trades, USER_ROUTES.history].includes(props.activeTab)
                && 'nav-item-active'}`}>
            <i className="fas fa-clock-rotate-left"></i>
            <p>Trades</p>
          </Link>
        )}
        {isMobile && (
          <>
            <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.chart)}
                  className={`nav-item ${USER_ROUTES.chart === props.activeTab
                  && 'nav-item-active'}`}>
              <i className="fas fa-chart-line"></i>
              <p>Chart</p>
            </Link>
            <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.order)}
                  className={`nav-item ${USER_ROUTES.order === props.activeTab
                  && 'nav-item-active'}`}>
              <i className="fas fa-compass"></i>
              <p>Order</p>
            </Link>
            <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.trades)}
                  className={`nav-item ${[USER_ROUTES.trades, USER_ROUTES.history].includes(props.activeTab)
                  && 'nav-item-active'}`}>
              <i className="fas fa-clock-rotate-left"></i>
              <p>Trades</p>
            </Link>
          </>
        )}
        <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.help)}
              className={`nav-item ${props.activeTab === USER_ROUTES.help && 'nav-item-active'}`}>
          <i className="fas fa-circle-question"></i>
          <p>Help</p>
        </Link>
        {!isMobile && (
          <>
            <Link to={'#'} onClick={() => props.openModal(Modals.settings)}
                  className={`nav-item ${props.activeModal === Modals.settings && 'nav-item-active'}`}>
              <i className="fas fa-cog"></i>
              <p>Settings</p>
            </Link>
            <Link to={'#'} onClick={props.logout} className={`nav-item text-danger`}>
              <i className="fas fa-sign-out-alt" style={{ color: "red" }}></i>
              <p>Logout</p>
            </Link>
          </>
        )}
      </div>
      <div className={'active-users'}>
        <p className={'number'}>{activeUsers}</p>
        <p className={'status'}>online</p>
      </div>
    </div>
  );
});
