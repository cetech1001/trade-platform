import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import {ForgotPassword} from "./pages/forgot-password";
import {ResetPassword} from "./pages/reset-password";

export const Auth = () => {
  return (
    <Routes>
      <Route path={''} element={<Login/>}/>
      <Route path={'forgot/password'} element={<ForgotPassword/>}/>
      <Route path={'reset/password'} element={<ResetPassword/>}/>
    </Routes>
  );
}
