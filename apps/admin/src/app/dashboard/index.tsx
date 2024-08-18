import {Navigate, Route, Routes} from "react-router-dom";
import {Home} from "./pages/home";
import {TopNav} from "./layout/top-nav";
import {Sidebar} from "./layout/sidebar";
import {connect} from "react-redux";
import {RootState} from "@coinvant/store";
import {AuthUser} from "@coinvant/types";
import {AdminRoutes, AuthRoutes} from "../routes";
import {Users} from "./pages/users";
import {PaymentMethods} from "./pages/payment-methods";
import {Deposits} from "./pages/deposits";
import {Withdrawals} from "./pages/withdrawals";
import {Profile} from "./pages/profile";

interface IProps {
    authUser: AuthUser | null;
}

const mapStateToProps = (state: RootState) => ({
    authUser: state.auth.user,
});

export const Dashboard = connect(mapStateToProps)((props: IProps) => {
    if (!props.authUser) {
        return <Navigate to={`/${AuthRoutes.login}`} />;
    }

    const removeDashboardFromUrl = (url: string) => {
        return url.replace(/dashboard\//, "");
    }

    return (
        <>
            <Sidebar />
            <main className="content">
                <TopNav/>
                <Routes>
                    <Route path="" element={<Home/>}/>
                    <Route path={removeDashboardFromUrl(AdminRoutes.users)}
                           element={<Users/>}/>
                    <Route path={removeDashboardFromUrl(AdminRoutes.paymentMethods)}
                           element={<PaymentMethods/>}/>
                    <Route path={removeDashboardFromUrl(AdminRoutes.deposits)}
                           element={<Deposits/>}/>
                    <Route path={removeDashboardFromUrl(AdminRoutes.withdrawals)}
                           element={<Withdrawals/>}/>
                    <Route path={removeDashboardFromUrl(AdminRoutes.profile)}
                           element={<Profile/>}/>
                </Routes>
            </main>
        </>
    );
});
