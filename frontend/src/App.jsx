import React, { useEffect, useState } from "react";
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
  BarChart3,
  RefreshCw,
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
import OnboardingTutorial from "./components/OnboardingTutorial";
import { useLanguage } from "./context/LanguageContext";
import DigiLockerSim from "./pages/DigiLockerSim";
import { syncOfflineActions } from "./utils/offlineSync";

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;

  return children;
};

// --- DESKTOP SIDEBAR ---
const Sidebar = ({ onReplayTutorial }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const { t, lang, setLang } = useLanguage();

  // Get user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
        isActive(to)
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-50 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
          G
        </div>
        <span className="text-lg font-semibold text-gray-900">GramSathi</span>
      </div>

      <nav className="space-y-1 flex-1">
        {isAdmin ? (
          <>
            <NavItem to="/admin" icon={BarChart3} label="Dashboard" />
            <NavItem to="/profile" icon={User} label={t("profile")} />
          </>
        ) : (
          <>
            <NavItem to="/dashboard" icon={HomeIcon} label={t("dashboard")} />
            <NavItem to="/services" icon={Grid} label={t("practice")} />
            <NavItem to="/learn" icon={BookOpen} label={t("learn")} />
            <NavItem to="/profile" icon={User} label={t("profile")} />
          </>
        )}
      </nav>

      {/* Replay Tutorial Button */}
      {!isAdmin && (
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={onReplayTutorial}
            className="flex items-center gap-3 px-4 py-2.5 text-purple-600 hover:bg-purple-50 rounded-lg w-full transition-colors text-sm font-medium"
          >
            <RefreshCw size={18} />
            <span>Replay Tutorial</span>
          </button>
        </div>
      )}

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg">
          <div className="flex items-center gap-2 text-gray-600">
            <Globe size={16} />
            <span className="text-sm font-medium">
              {lang === "en" ? "English" : "हिंदी"}
            </span>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Change
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">{t("logout")}</span>
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

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  if (location.pathname.includes("/simulation")) return null;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
        isActive(to) ? "text-blue-600" : "text-gray-400"
      }`}
    >
      <Icon size={22} strokeWidth={isActive(to) ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 h-16 z-50 flex justify-around items-center px-2 pb-safe">
      {isAdmin ? (
        <>
          <NavItem to="/admin" icon={BarChart3} label="Dashboard" />
          <NavItem to="/profile" icon={User} label={t("profile")} />
        </>
      ) : (
        <>
          <NavItem to="/dashboard" icon={HomeIcon} label={t("dashboard")} />
          <NavItem to="/learn" icon={BookOpen} label={t("learn")} />
          <NavItem to="/services" icon={Grid} label={t("practice")} />
          <NavItem to="/profile" icon={User} label={t("profile")} />
        </>
      )}
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check authentication status on mount and update
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      // Show onboarding ONLY for first-time authenticated users (not guests)
      if (isAuth && token !== "guest-token") {
        const hasCompletedOnboarding = localStorage.getItem(
          "onboarding_completed"
        );
        if (!hasCompletedOnboarding) {
          // Small delay to let the dashboard render first
          setTimeout(() => setShowOnboarding(true), 500);
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Global offline sync listener
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Back Online! Attempting sync...");
      syncOfflineActions();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      syncOfflineActions();
    }

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleReplayTutorial = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboarding_completed", "true");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
        <OfflineBanner />

        {/* Sidebar - Show only when authenticated */}
        {isAuthenticated && <Sidebar onReplayTutorial={handleReplayTutorial} />}

        <div
          className={
            isAuthenticated
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
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
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
                  {/* Pass the replay handler here */}
                  <Profile onReplayTutorial={handleReplayTutorial} />
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

        {/* Bottom Nav - Show only when authenticated */}
        {isAuthenticated && <BottomNav />}

        {/* Onboarding Tutorial Overlay */}
        {showOnboarding && (
          <OnboardingTutorial onComplete={handleOnboardingComplete} />
        )}
      </div>
    </Router>
  );
}

export default App;
