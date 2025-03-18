import { useState } from 'react';
import {Home} from "./screens/home";
import '../../styles/Landing.css';

export const Landing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="landing">
      <div className="main-content">
        <Home toggleSidebar={toggleSidebar}/>
      </div>
    </div>
  );
};
