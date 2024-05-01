import {Navigate, Route, Routes} from 'react-router-dom';
import "../scss/volt.scss";
import {Auth} from "./auth";
import {Dashboard} from "./dashboard";

export const App = () => {
  return (
      <Routes>
        <Route path={'/dashboard/*'} element={<Dashboard/>}/>
        <Route path={'/*'} element={<Auth/>}/>
      </Routes>
  );
}
