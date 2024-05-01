import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {User} from "./user";
import {Landing} from "./landing";
import {Alert} from "./shared/alert";
import {connect} from "react-redux";
import {AuthState} from "@coinvant/types";
import {FC} from "react";
import {RootState} from "@coinvant/store";

interface IProps {
  auth: AuthState,
}

const Component: FC<IProps> = (props) => {
  const GuestRoute = () => {
    return !props.auth.user ? <Outlet/> : <Navigate to={'/platform'}/>
  }

  const ProtectedRoute = () => {
    return props.auth.user ? <Outlet/> : <Navigate to={'/'}/>
  };

  return (
    <>
      <Alert/>
      <Routes>
        <Route path="/" element={<GuestRoute/>}>
          <Route path="/" element={<Landing/>}/>
        </Route>
        <Route path={'/platform'} element={<ProtectedRoute/>}>
          <Route path="/platform" element={<User/>}/>
        </Route>
      </Routes>
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
})

export const App = connect(mapStateToProps)(Component);
