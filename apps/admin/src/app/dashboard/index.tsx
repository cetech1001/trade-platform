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
import { KYC } from './pages/kyc';
import { Trades } from './pages/trades';
import { Accounts } from './pages/accounts';

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

    const formatRoute = (url: string) => {
        return url.replace(/dashboard\//, "");
    }

    return (
      <>
        <Sidebar />
        <main className="content">
          <TopNav />
          <Routes>
            <Route path="" element={<Home />} />
            <Route path={formatRoute(AdminRoutes.users)} element={<Users />} />
            <Route
              path={`${formatRoute(AdminRoutes.accounts)}/:userID`}
              element={<Accounts />}
            />
            <Route
              path={formatRoute(AdminRoutes.paymentMethods)}
              element={<PaymentMethods />}
            />
            <Route
              path={formatRoute(AdminRoutes.trades)}
              element={<Trades />}
            />
            <Route
              path={formatRoute(AdminRoutes.deposits)}
              element={<Deposits />}
            />
            <Route
              path={formatRoute(AdminRoutes.withdrawals)}
              element={<Withdrawals />}
            />
            <Route
              path={formatRoute(AdminRoutes.profile)}
              element={<Profile />}
            />
            <Route path={formatRoute(AdminRoutes.kyc)} element={<KYC />} />
          </Routes>
        </main>
      </>
    );
});
