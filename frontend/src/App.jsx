import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Grid, User, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Services from './pages/Services';
import UPISimulation from './pages/Simulation';
import Admin from './pages/Admin';

// Placeholders
const Learn = () => <div className="p-8 text-center text-gray-500">Course Library Coming Soon</div>;
const Profile = () => <div className="p-8 text-center text-gray-500">User Profile Settings</div>;

// --- DESKTOP SIDEBAR ---
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  const NavItem = ({ to, icon: Icon, label }) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive(to) ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
        <span className="text-xl font-bold text-gray-800">GramSathi</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={HomeIcon} label="Dashboard" />
        <NavItem to="/services" icon={Grid} label="Services" />
        <NavItem to="/learn" icon={BookOpen} label="Learn" />
        <NavItem to="/admin" icon={User} label="Admin View" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl w-full transition">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

// --- MOBILE BOTTOM NAV ---
const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
  // Hide on simulation page or Admin page (Admin usually desktop)
  if (location.pathname.includes('/simulation')) return null;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(to) ? 'text-blue-600' : 'text-gray-400'}`}>
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center px-2">
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
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Sidebar />
        
        {/* Main Content Area - Shifts right on Desktop */}
        <div className="md:ml-64 min-h-screen transition-all duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/services" element={<Services />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/simulation/upi" element={<UPISimulation />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;