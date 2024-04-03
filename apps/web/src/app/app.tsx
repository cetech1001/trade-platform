import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/home";
import {Nav} from "./layout/nav";

export const App = () => {
  return (
    <div className={'main'}>
      <Nav/>
      <Routes>
        <Route path={'/'} element={<Home/>}/>
      </Routes>
    </div>
  );
}
