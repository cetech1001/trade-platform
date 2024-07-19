import {Route, Routes} from 'react-router-dom';
import "../scss/volt.scss";
import {Auth} from "./auth";
import {Dashboard} from "./dashboard";
import {Alert} from "./shared/alert";

export const App = () => {
    return (
        <>
            <Alert/>
            <Routes>
                <Route path={'/dashboard/*'} element={<Dashboard/>}/>
                <Route path={'/*'} element={<Auth/>}/>
            </Routes>
        </>
    );
};
