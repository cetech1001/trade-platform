import { Route, Routes } from 'react-router-dom';
import { AUTH_ROUTES } from '../../../helpers';
import { Authenticate } from './auth';
import { ForgotPassword } from './forgot-password';
import { ResetPassword } from './reset-password';

export const Auth = () => {
  return (
    <div className="landing">
      <div className="main-content">
        <Routes>
          <Route path={AUTH_ROUTES.login} element={<Authenticate/>}/>
          <Route path={AUTH_ROUTES.forgotPassword} element={<ForgotPassword/>}/>
          <Route path={AUTH_ROUTES.resetPassword} element={<ResetPassword/>}/>
        </Routes>
      </div>
    </div>
  )
}
