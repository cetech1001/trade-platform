import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {Landing} from "./components/landing";
import {Alert} from "./components/shared/alert";
import {connect} from "react-redux";
import { AuthState } from '@coinvant/types';
import { refreshUserProfile, RootState } from '@coinvant/store';
import { Dashboard } from './components/dashboard';
import { useAppDispatch } from '../hooks';
import { useEffect } from 'react';

interface IProps {
  auth: AuthState,
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

export const App = connect(mapStateToProps)((props: IProps) => {
  const GuestRoute = () => {
    return !props.auth.user ? <Outlet/> : <Navigate to={'/platform'}/>
  }

  const ProtectedRoute = () => {
    return props.auth.user ? <Outlet/> : <Navigate to={'/'}/>
  };

  return (
    <>
      <Alert />
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
