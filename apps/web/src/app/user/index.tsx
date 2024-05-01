import {Nav} from "./components/nav";
import {Assets} from "./components/assets";
import {CreateTrade} from "./components/create-trade";
import {Chart} from "./components/chart";
import {FC, useState} from "react";
import {Trades} from "./components/trades";
import {USER_ROUTES} from "../../routes";
import {TradeHistory} from "./components/trade-history";
import {Settings} from "./components/settings";
import {Payments} from "./components/payments";
import {connect} from "react-redux";
import {closeModal, logout, RootState, openModal} from "@coinvant/store";
import {AuthUser, Modals, ModalState} from "@coinvant/types";
import {UpdateProfile} from "./components/update-profile";
import {UpdatePassword} from "./components/update-password";


interface IProps {
  user: Omit<AuthUser, 'password'> | null;
  activeModal: Modals | null;
  logout: () => void;
  openModal: (payload: ModalState) => void;
  closeModal: () => void;
}

const Component: FC<IProps> = (props) => {
  const [activeNav, setActiveNav] = useState<USER_ROUTES>(USER_ROUTES.trades);

  const toggleNav = (route: USER_ROUTES) => {
    setActiveNav(route);
  }

  return (
    <div className={'main'}>
      <Nav activeTab={activeNav} toggleNav={toggleNav}/>
      {activeNav === USER_ROUTES.home && <Assets/>}
      {activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
      {activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
      <Chart/>
      <CreateTrade openModal={props.openModal} closeModal={props.closeModal}/>
      <Settings openModal={props.openModal} activeModal={props.activeModal}
                logout={props.logout} user={props.user} closeModal={props.closeModal}/>
      <Payments openModal={props.openModal} activeModal={props.activeModal}
                closeModal={props.closeModal}/>
      <UpdateProfile openModal={props.openModal} activeModal={props.activeModal}
                closeModal={props.closeModal} user={props.user}/>
      <UpdatePassword activeModal={props.activeModal} openModal={props.openModal} closeModal={props.closeModal}/>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  activeModal: state.modal.activeModal,
});

export const User = connect(mapStateToProps, {
  logout,
  openModal,
  closeModal,
})(Component);
