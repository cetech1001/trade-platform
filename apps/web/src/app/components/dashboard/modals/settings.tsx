import { Account, AuthUser, KYCStatus, Modals } from '@coinvant/types';
import { capitalizeFirstLetter, formatCurrency } from '../../../helpers';
import { addAccount, closeModal, logout, openModal, RootState, setCurrentAccount } from '@coinvant/store';
import { connect } from 'react-redux';

interface IProps {
  user: AuthUser | null;
  account: Account | null;
  activeModal: Modals | null;
  logout: () => void;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  setCurrentAccount: (account?: Account) => void;
  addAccount: () => void;
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  account: state.account.highlightedAccount,
  activeModal: state.modal.activeModal,
});

const actions = {
  openModal,
  closeModal,
  logout,
  setCurrentAccount,
  addAccount,
};

export const Settings = connect(mapStateToProps, actions)((props: IProps) => {
  if (props.activeModal !== Modals.settings) return null;

  return (
    <div className={'sidebar open'}>
      <div>
        <div className={"flex-row-space-between close-button"}>
          <div />
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className={"title"} style={{ padding: 0, flexDirection: 'column' }}>
          <h3 style={{ color: "#FFF" }}>{props.user?.name}</h3>
          <h5 style={{ color: "#FFF" }}>{formatCurrency(props.account?.walletBalance)}</h5>
        </div>
        <div className={"flex-column"}>
          <div className="title" style={{ padding: 0 }}>
            <h5 style={{ color: "#FFF" }}>Accounts</h5>
          </div>
          <div className={'flex-column'}>
            {props.user?.accounts.map((account) => (
              <div className={'sidebar-option'} key={account.id}
                   onClick={() => props.setCurrentAccount(account)}>
                <i className="fa-solid fa-dollar-sign"></i>
                <div className={'info'}>
                  <h5>{capitalizeFirstLetter(account.type)} Account</h5>
                  <i>{account.id === props.account?.id
                    ? 'Active' : 'Switch to this account'}</i>
                </div>
              </div>
            ))}
            {props.user?.accounts.length === 1
              && props.user.kycStatus === KYCStatus.verified
              && (
              <div className={'sidebar-option'}
                   onClick={props.addAccount}>
                <i className="fa-solid fa-plus"></i>
                <div className={'info'}>
                  <h5>New Account</h5>
                  <p>Create a Live Trading Account</p>
                </div>
              </div>
            )}
          </div>
          <div className="title" style={{ padding: 0 }}>
            <h5 style={{ color: '#FFF' }}>KYC Verification</h5>
          </div>
          <div className={'flex-column'}>
            <div className={'sidebar-option'}
                 onClick={() => {
                   if (props.user?.kycStatus === KYCStatus.notStarted) {
                     props.openModal(Modals.kycVerification);
                   } else {
                     return;
                   }
                 }}>
              <i className="fa-solid fa-user"></i>
              <div className={"info"}>
                <h5>Identity Verification</h5>
                {props.user?.kycStatus === KYCStatus.notStarted && (
                  <p>Please verify your identity</p>
                )}
                {props.user?.kycStatus === KYCStatus.pending && (
                  <i>Your identity is being verified, we will get back to you shortly</i>
                )}
                {props.user?.kycStatus === KYCStatus.verified && (
                  <p>Your identity has been verified</p>
                )}
              </div>
            </div>
          </div>
          <div className="title" style={{ padding: 0 }}>
            <h5 style={{ color: "#FFF" }}>Edit Profile</h5>
          </div>
          <div className={"flex-column"} style={{ gap: "1rem" }}>
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
      </div>
      <div style={{ display: 'flex' }}>
        <button className={"button bg-negative"} style={{ marginBottom: "1rem" }} onClick={props.logout}>
          <i className={"fa-solid fa-sign-out-alt"}></i> Logout
        </button>
      </div>
    </div>
  );
});
