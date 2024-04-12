import {Route, Routes} from "react-router-dom";
import {User} from "./user";
import {Landing} from "./landing";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path={'/platform'} element={<User/>}/>
    </Routes>
  );
}
