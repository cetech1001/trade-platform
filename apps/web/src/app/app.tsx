import {Nav} from "./components/layout/nav";
import {Home} from "./components/pages/home";

export const App = () => {
  return (
    <div className={'main'}>
        <Nav/>
        <Home/>
    </div>
  );
}
