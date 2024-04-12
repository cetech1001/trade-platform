import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {User} from "./user";
import {Landing} from "./landing";

const GuestRoute = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return !isAuthenticated ? <Outlet/> : <Navigate to={'/platform'}/>
}

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <Outlet/> : <Navigate to={'/'}/>
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GuestRoute/>}>
        <Route path="/" element={<Landing/>}/>
      </Route>
      <Route path={'/platform'} element={<ProtectedRoute/>}>
        <Route path="/platform" element={<User/>}/>
      </Route>
    </Routes>
  );
}
