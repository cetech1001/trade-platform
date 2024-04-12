import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {User} from "./user";
import {Landing} from "./landing";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet/> : <Navigate to={'/login'}/>
};

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path={'/platform'} element={<ProtectedRoute/>}>
        <Route path="/platform" element={<User/>}/>
      </Route>
    </Routes>
  );
}
