import { useState } from 'react';
import {Navbar} from './screens/navbar';
import {Sidebar} from './screens/sidebar';
import {Home} from "./screens/home";
import '../../styles/Landing.css';

export const Landing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="landing">
      <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen}/>
      <Sidebar
        isSidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="main-content">
        <Home toggleSidebar={toggleSidebar}/>
      </div>
    </div>
  );
};
