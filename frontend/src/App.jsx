import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import {
  Home as HomeIcon,
  BookOpen,
  Grid,
  User,
  LogOut,
  Globe,
} from "lucide-react";
import Home from "./pages/Home";
import Services from "./pages/Services";
import UPISimulation from "./pages/Simulation";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Learn from "./pages/Learn";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Mandi from "./pages/Mandi";
import Quiz from "./pages/Quiz";
import Doctors from "./pages/Doctors";
import FormSim from "./pages/FormSim";
import LandRecords from "./pages/LandRecords";
import Rozgar from "./pages/Rozgar";
import Complaint from "./pages/Complaint";
import OfflineBanner from "./components/OfflineBanner";
import { useLanguage } from "./context/LanguageContext";
import DigiLockerSim from "./pages/DigiLockerSim";
import { syncOfflineActions } from "./utils/offlineSync"; // Import Sync Logic

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;

  return children;
};

// --- DESKTOP SIDEBAR ---
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const { t, lang, setLang } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive(to)
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-blue-50"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          G
        </div>
        <span className="text-xl font-bold text-gray-800">GramSathi</span>
      </div>

      <nav className="space-y-2 flex-1">
        <NavItem to="/" icon={HomeIcon} label={t("dashboard")} />
        <NavItem to="/services" icon={Grid} label={t("practice")} />
        <NavItem to="/learn" icon={BookOpen} label={t("learn")} />
        <NavItem to="/admin" icon={User} label={t("admin")} />
        <NavItem to="/profile" icon={User} label={t("profile")} />
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <Globe size={16} />
            <span className="text-sm font-bold">
              {lang === "en" ? "English" : "हिंदी"}
            </span>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-xs bg-white border border-gray-300 px-2 py-1 rounded shadow-sm hover:bg-gray-100"
          >
            Change
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl w-full transition cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium">{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

// --- MOBILE BOTTOM NAV ---
const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { t } = useLanguage();

  if (location.pathname.includes("/simulation")) return null;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
        isActive(to) ? "text-blue-600" : "text-gray-400"
      }`}
    >
      <Icon size={24} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center px-2">
      <NavItem to="/" icon={HomeIcon} label={t("dashboard")} />
      <NavItem to="/learn" icon={BookOpen} label={t("learn")} />
      <NavItem to="/services" icon={Grid} label={t("practice")} />
      <NavItem to="/profile" icon={User} label={t("profile")} />
    </div>
  );
};

function App() {
  // --- GLOBAL OFFLINE SYNC LISTENER ---
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Back Online! Attempting sync...");
      syncOfflineActions();
    };

    // Add listener
    window.addEventListener("online", handleOnline);

    // Try sync on initial load (in case we refreshed and are now online)
    if (navigator.onLine) {
      syncOfflineActions();
    }

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <OfflineBanner />
        {localStorage.getItem("token") && <Sidebar />}

        <div
          className={
            localStorage.getItem("token")
              ? "md:ml-64 min-h-screen transition-all duration-300"
              : ""
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Landing />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <Learn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulation/upi"
              element={
                <ProtectedRoute>
                  <UPISimulation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/mandi"
              element={
                <ProtectedRoute>
                  <Mandi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/quiz"
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulation/form"
              element={
                <ProtectedRoute>
                  <FormSim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/land-records"
              element={
                <ProtectedRoute>
                  <LandRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/rozgar"
              element={
                <ProtectedRoute>
                  <Rozgar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/complaint"
              element={
                <ProtectedRoute>
                  <Complaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulation/digilocker"
              element={
                <ProtectedRoute>
                  <DigiLockerSim />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {localStorage.getItem("token") && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
