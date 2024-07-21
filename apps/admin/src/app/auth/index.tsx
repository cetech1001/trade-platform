import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import {ForgotPassword} from "./pages/forgot-password";
import {ResetPassword} from "./pages/reset-password";
import {AdminRoutes, AuthRoutes} from "../routes";
import {AuthUser} from "@coinvant/types";
import {RootState} from "@coinvant/store";
import { connect } from "react-redux";

interface IProps {
    authUser: AuthUser | null;
}

const mapStateToProps = (state: RootState) => ({
    authUser: state.auth.user,
});

export const Auth = connect(mapStateToProps)((props: IProps) => {
    if (props.authUser) {
        return <Navigate to={`/${AdminRoutes.overview}`} />;
    }

    return (
    <Routes>
        <Route path={""} element={<Navigate to={AuthRoutes.login}/>}/>
        <Route path={AuthRoutes.login} element={<Login/>}/>
        <Route path={AuthRoutes.forgotPassword} element={<ForgotPassword/>}/>
        <Route path={AuthRoutes.resetPassword} element={<ResetPassword/>}/>
    </Routes>
    );
});
