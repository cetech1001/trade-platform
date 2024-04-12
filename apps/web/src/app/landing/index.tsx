import { useState } from 'react';
import {Navbar} from './components/navbar';
import {Sidebar} from './components/sidebar';
import './styles/Landing.css';
import {Home} from "./components/home";

export const Landing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="landing">
      <Navbar onToggleSidebar={toggleSidebar} isOpen={sidebarOpen}/>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="main-content">
        <Home toggleSidebar={toggleSidebar}/>
      </div>
    </div>
  );
};
