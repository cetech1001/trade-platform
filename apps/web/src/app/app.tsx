import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {Landing} from "./components/landing";
import {Alert} from "./components/shared/alert";
import {connect} from "react-redux";
import { AuthState } from '@coinvant/types';
import { Dashboard } from './components/dashboard';
import { refreshUserProfile, RootState } from '@coinvant/store';
import { useEffect } from 'react';
import PullToRefresh from 'pulltorefreshjs';

interface IProps {
  auth: AuthState;
  refreshUserProfile: () => void;
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
});

const actions = {
  refreshUserProfile,
}

export const App = connect(mapStateToProps, actions)((props: IProps) => {
  const GuestRoute = () => {
    return !props.auth.user ? <Outlet/> : <Navigate to={'/platform'}/>
  }

  const ProtectedRoute = () => {
    return props.auth.user ? <Outlet/> : <Navigate to={'/'}/>
  };

  useEffect(() => {
    PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
        // window.location.reload();
        props.refreshUserProfile();
      },
      instructionsPullToRefresh: 'Pull down to refresh...',
      instructionsReleaseToRefresh: 'Release to refresh...',
      instructionsRefreshing: 'Refreshing...'
    });

    return () => {
      PullToRefresh.destroyAll();
    };
  }, []);

  return (
    <>
      <Alert />
      <Routes>
        <Route path="/" element={<GuestRoute />}>
          <Route path="/" element={<Landing />} />
        </Route>
        <Route path={'/platform'} element={<ProtectedRoute />}>
          <Route path="/platform" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
});
