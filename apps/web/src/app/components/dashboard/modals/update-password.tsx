import {useState} from 'react';
import {AlertState, AuthUser, Modals, UpdateUser} from "@coinvant/types";
import {connect} from "react-redux";
import {closeModal, editUser, openModal, RootState, showAlert} from "@coinvant/store";

interface IProps {
  activeModal: Modals | null;
  user: AuthUser | null;
  openModal: (payload: Modals) => void;
  closeModal: () => void;
  editUser: (id: string, payload: UpdateUser) => Promise<void>;
  showAlert: (payload: AlertState) => void;
}

const mapStateToProps = (state: RootState) => ({
  activeModal: state.modal.activeModal,
  user: state.auth.user,
});

const actions = {
  openModal,
  closeModal,
  editUser,
  showAlert,
};

export const UpdatePassword = connect(mapStateToProps, actions)((props: IProps) => {
  if (props.activeModal !== Modals.password) return null;

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSave = async () => {
    if (password !== rePassword) {
      return props.showAlert({
        type: 'error',
        message: 'Passwords do not match',
        show: true,
      });
    }
    try {
      setIsSubmitting(true);
      if (props.user) {
        await props.editUser(props.user?.id, { password });
        setPassword("");
        setRePassword("");
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
    <div className={'sidebar open'}>
      <form>
        <div className={"flex-row-space-between close-button"}>
          <i className="fa-solid fa-long-arrow-left cursor-pointer"
             onClick={() => props.openModal(Modals.settings)}></i>
          <i className="fa-solid fa-xmark cursor-pointer"
             onClick={props.closeModal}></i>
        </div>
        <div className="title" style={{padding: 0, marginTop: "2rem"}}>
          <h5 style={{color: "#FFF"}}>Change Password</h5>
        </div>
        <div className={"flex-column"} style={{gap: "1rem"}}>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Password</span>
              <div className={'input-field'}>
                <input type={showPassword ? 'text' : 'password'} value={password} autoComplete={"current-password"}
                       onChange={e => setPassword(e.target.value)} required/>
                {showPassword ? (
                  <i className={"fa-solid fa-eye-slash cursor-pointer"} key={'change-password-eye'}
                     onClick={() => setShowPassword(false)}></i>
                ) : (
                  <i className={"fa-solid fa-eye cursor-pointer"} key={'change-password-eye-slash'}
                     onClick={() => setShowPassword(true)}></i>
                )}
              </div>
            </div>
          </div>
          <div className={'sl-tp-option'}>
            <div className={'input'}>
              <span>Re-type Password</span>
              <div className={'input-field'}>
                <input type={showRePassword ? 'text' : 'password'} value={rePassword} autoComplete={"current-password"}
                       onChange={e => setRePassword(e.target.value)} required/>
                {showRePassword ? (
                  <i className={"fa-solid fa-eye-slash cursor-pointer"} key={'change-re-password-eye'}
                     onClick={() => setShowRePassword(false)}></i>
                ) : (
                  <i className={"fa-solid fa-eye cursor-pointer"} key={'change-re-password-eye-slash'}
                     onClick={() => setShowRePassword(true)}></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div style={{display: 'flex'}}>
        <button className={"button bg-primary"} style={{marginBottom: "1rem"}} onClick={onSave}>
          {isSubmitting ? 'Saving...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
});
