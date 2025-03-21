import {Home} from "./screens/home";
import '../../styles/Landing.css';
import { useIsMobile } from '../../../hooks';
import { Navbar } from './screens/navbar';

export const Landing = () => {
  const isMobile = useIsMobile();
  return (
    <div className="landing">
      {isMobile && <Navbar />}
      <div className="main-content">
        <Home/>
      </div>
    </div>
  );
};
