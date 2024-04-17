import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/home";
import {TopNav} from "./pages/layout/top-nav";
import {Sidebar} from "./pages/layout/sidebar";

export const Dashboard = () => {
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
}
