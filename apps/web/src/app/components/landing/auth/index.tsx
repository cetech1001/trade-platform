import { Route, Routes } from 'react-router-dom';
import { AUTH_ROUTES } from '../../../helpers';
import { Authenticate } from './auth';
import { ForgotPassword } from './forgot-password';
import { ResetPassword } from './reset-password';
import { Navbar } from '../layout/navbar';
import { useIsMobile } from '../../../../hooks';

export const Auth = () => {
  const isMobile = useIsMobile();

  return (
    <div className="landing">
      {isMobile && <Navbar />}
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
