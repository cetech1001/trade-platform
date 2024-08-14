import {Nav} from "./components/nav";
// import {Assets} from "./components/assets";
import {CreateTrade} from "./components/create-trade";
import {Chart} from "./components/chart";
import {useState} from "react";
import {Trades} from "./components/trades";
import {USER_ROUTES} from "../../routes";
import {TradeHistory} from "./components/trade-history";
import {Settings} from "./components/settings";
import {Payments} from "./components/payments";
import {connect} from "react-redux";
import {closeModal, logout, RootState, openModal, editUser, showAlert, refreshUserProfile} from "@coinvant/store";
import {AlertState, AuthUser, Modals, UpdateUser} from "@coinvant/types";
import {UpdateProfile} from "./components/update-profile";
import {UpdatePassword} from "./components/update-password";


interface IProps {
  user: Omit<AuthUser, 'password'> | null;
  activeModal: Modals | null;
  logout: () => void;
  openModal: (activeModal: Modals) => void;
  closeModal: () => void;
  editUser: (id: string, payload: UpdateUser) => Promise<void>;
  showAlert: (payload: AlertState) => void;
  refreshUserProfile: () => Promise<void>;
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  activeModal: state.modal.activeModal,
});

const actions = {
    logout,
    openModal,
    closeModal,
    editUser,
    showAlert,
    refreshUserProfile,
};

export const User = connect(mapStateToProps, actions)((props: IProps) => {
    const [activeNav, setActiveNav] = useState<USER_ROUTES>(USER_ROUTES.home);

    const toggleNav = (route: USER_ROUTES) => {
        setActiveNav(route);
    }

    return (
        <div className={'main'}>
            <Nav activeTab={activeNav} toggleNav={toggleNav} logout={props.logout}
                 openModal={props.openModal} activeModal={props.activeModal}/>
            {/*{activeNav === USER_ROUTES.home && <Assets/>}*/}
            {activeNav === USER_ROUTES.trades && <Trades toggleNav={toggleNav}/>}
            {activeNav === USER_ROUTES.history && <TradeHistory toggleNav={toggleNav}/>}
            <Chart/>
            <CreateTrade openModal={props.openModal} closeModal={props.closeModal}/>
            <Settings openModal={props.openModal} activeModal={props.activeModal}
                      logout={props.logout} user={props.user} closeModal={props.closeModal}/>
            <Payments openModal={props.openModal} activeModal={props.activeModal}
                      closeModal={props.closeModal}/>
            <UpdateProfile openModal={props.openModal} activeModal={props.activeModal}
                           closeModal={props.closeModal} user={props.user}
                           editUser={props.editUser} showAlert={props.showAlert}
                           refreshUserProfile={props.refreshUserProfile}/>
            <UpdatePassword activeModal={props.activeModal} openModal={props.openModal}
                            closeModal={props.closeModal}/>
        </div>
    );
});
