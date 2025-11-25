import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Grid, User } from 'lucide-react';
import Home from './pages/Home';

// --- Components for other pages (Placeholders for now) ---
const Learn = () => <div className="p-8 text-center text-gray-500">Course Library Coming Soon</div>;
const Services = () => <div className="p-8 text-center text-gray-500">All Services Page</div>;
const Profile = () => <div className="p-8 text-center text-gray-500">User Profile Settings</div>;

// --- Bottom Navigation Component ---
const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(to) ? 'text-blue-600' : 'text-gray-400'}`}>
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center px-2">
      <NavItem to="/" icon={HomeIcon} label="Home" />
      <NavItem to="/learn" icon={BookOpen} label="Learn" />
      <NavItem to="/services" icon={Grid} label="Services" />
      <NavItem to="/profile" icon={User} label="Profile" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl overflow-hidden relative font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;