import {Link} from "react-router-dom";
import "../styles/Nav.css";
import {FC, useEffect, useState} from "react";
import {USER_ROUTES} from "../../../routes";
import {Modals} from "@coinvant/types";


interface IProps {
  activeTab: USER_ROUTES;
  toggleNav: (route: USER_ROUTES) => void;
  logout: () => void;
  openModal: (activeModal: Modals) => void;
  activeModal: Modals | null;
}

let intervalID: NodeJS.Timeout;

export const Nav: FC<IProps> = (props) => {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    intervalID = setInterval(function() {
      let randomNumber = Math.floor(Math.random() * 9001) + 1000;
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
        <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.home)}
              className={`nav-item ${props.activeTab === USER_ROUTES.home && 'nav-item-active'}`}>
          <i className="fas fa-house"></i>
          <p>Home</p>
        </Link>
        <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.trades)}
              className={`nav-item ${[USER_ROUTES.trades, USER_ROUTES.history].includes(props.activeTab)
              && 'nav-item-active'}`}>
          <div className={'has-badge'}>
            <div className={'badge'}>
              <p>1</p>
            </div>
            <i className="fas fa-chart-line"></i>
          </div>
          <p>Trades</p>
        </Link>
        <Link to={'#'} onClick={() => props.toggleNav(USER_ROUTES.help)}
              className={`nav-item ${props.activeTab === USER_ROUTES.help && 'nav-item-active'}`}>
          <i className="fas fa-circle-question"></i>
          <p>Help</p>
        </Link>
        <Link to={'#'} onClick={() => props.openModal(Modals.settings)}
              className={`nav-item ${props.activeModal === Modals.settings && 'nav-item-active'}`}>
          <i className="fas fa-user"></i>
          <p>My Profile</p>
        </Link>
        <Link to={'#'} onClick={props.logout} className={`nav-item text-danger`}>
          <i className="fas fa-sign-out-alt" style={{ color: "red" }}></i>
          <p>Logout</p>
        </Link>
      </div>
      <div className={'active-users'}>
        <p className={'number'}>{activeUsers}</p>
        <p className={'status'}>online</p>
      </div>
    </div>
  );
}
