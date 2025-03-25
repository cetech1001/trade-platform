import { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { sendResetLink } from '@coinvant/store';
import { environment } from '../../../../environments/environment';
import { AuthRoutes } from '../../../helpers';

interface IProps {
  sendResetLink: (email: string) => Promise<void>;
}

const actions = {
  sendResetLink
};

export const ForgotPassword = connect(null, actions)((props: IProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);

    props.sendResetLink(email)
      .then(() => setEmail(""))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="home">
      <div className={'image'}>
        <div className="logo-wrap">
          <div className={"logo"}>
            <img
              src="/assets/favicons/web-app-manifest-192x192.png"
              className="logo"
              alt={'Logo'}
            />
          </div>
          <h4>{environment.appName}</h4>
          <p>AIM HIGH, REACH HIGH</p>
        </div>
      </div>
      <div className="content">
        <img
          src="/assets/favicons/web-app-manifest-192x192.png"
          className="logo"
          alt={'Logo'}
        />
        <div className={"form-box"}>
          <p className={"title"}>Client Portal</p>
          <div className={"tabs"}>
            <div className={"tab"}>
              <span>Verify Email</span>
              <div className={"active-block"}></div>
            </div>
          </div>
          <div className={"input-group"}>
            <label><span>*</span> Email</label>
            <input className={"input"} type={"email"} name={"email"} value={email}
                   onChange={e => setEmail(e.target.value)}
                   disabled={isSubmitting} required/>
          </div>
          <button disabled={isSubmitting} onClick={onSubmit}>
            { isSubmitting ? 'Verifying...' : 'Verify' }
          </button>
          <Link to={AuthRoutes.login} className={"auth-link"}>
            Back to login?
          </Link>
        </div>
      </div>
    </div>
  );
});
