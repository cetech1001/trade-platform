import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {Landing} from "./components/landing";
import {Alert} from "./components/shared/alert";
import {connect} from "react-redux";
import { AlertState, AuthState } from '@coinvant/types';
import {RootState} from "@coinvant/store";
import { Dashboard } from './components/dashboard';

interface IProps {
  auth: AuthState,
  alert: AlertState,
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  alert: state.alert,
})

export const App = connect(mapStateToProps)((props: IProps) => {
  const GuestRoute = () => {
    return !props.auth.user ? <Outlet/> : <Navigate to={'/platform'}/>
  }

  const ProtectedRoute = () => {
    return props.auth.user ? <Outlet/> : <Navigate to={'/'}/>
  };

  return (
    <>
      {props.alert.show && <Alert />}
      <Routes>
        <Route path="/" element={<GuestRoute/>}>
          <Route path="/" element={<Landing/>}/>
        </Route>
        <Route path={'/platform'} element={<ProtectedRoute/>}>
          <Route path="/platform" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </>
  );
});
