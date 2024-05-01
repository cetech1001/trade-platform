import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import {ForgotPassword} from "./pages/forgot-password";
import {ResetPassword} from "./pages/reset-password";
import {AuthRoutes} from "../../routes";

export const Auth = () => {
  return (
    <Routes>
      <Route path={""} element={<Navigate to={AuthRoutes.login}/>}/>
      <Route path={AuthRoutes.login} element={<Login/>}/>
      <Route path={AuthRoutes.forgotPassword} element={<ForgotPassword/>}/>
      <Route path={AuthRoutes.resetPassword} element={<ResetPassword/>}/>
    </Routes>
  );
}
