import {Route, Routes, Navigate, Outlet, useLocation} from "react-router-dom";
import {Landing} from "./components/landing";
import {Alert} from "./components/shared/alert";
import {connect} from "react-redux";
import { AuthState } from '@coinvant/types';
import { Dashboard } from './components/dashboard';
import { refreshUserProfile, RootState } from '@coinvant/store';
import { useEffect, useState } from 'react';
import PullToRefresh from 'pulltorefreshjs';
import { AuthRoutes } from './helpers';

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

  // Handle PWA install prompt when URL contains ?install=true
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const beforeInstallListener = (e: any) => {
      console.log("Listener invoked");
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', beforeInstallListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallListener);
    };
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("install") === "true" && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  }, [location.search, deferredPrompt]);

  useEffect(() => {
    PullToRefresh.init({
      mainElement: 'body',
      onRefresh() {
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
          <Route path={"/*"} element={<Landing />} />
          <Route path={"/"} element={<Navigate to={AuthRoutes.login}/>}/>
        </Route>
        <Route path={'/platform'} element={<ProtectedRoute />}>
          <Route path={'/platform'} element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
});
