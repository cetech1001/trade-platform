import {Navigate, Route, Routes} from "react-router-dom";
import {Home} from "./pages/home";
import {TopNav} from "./pages/layout/top-nav";
import {Sidebar} from "./pages/layout/sidebar";
import {connect} from "react-redux";
import {RootState} from "@coinvant/store";
import {AuthUser} from "@coinvant/types";
import {AuthRoutes} from "../../routes";

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
    return (
        <>
            <Sidebar />
            <main className="content">
                <TopNav/>
                <Routes>
                    <Route path="" element={<Home/>}/>
                </Routes>
            </main>
        </>
    );
});
