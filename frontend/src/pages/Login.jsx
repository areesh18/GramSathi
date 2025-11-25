import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, User, MapPin, WifiOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { t, setLang } = useLanguage();

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);

    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }

    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, [navigate]);

  const handleGuestLogin = () => {
    const guestUser = {
      id: "guest",
      name: "Guest User",
      role: "user",
      village: "Offline Village",
      total_score: 0,
    };
    localStorage.setItem("token", "guest-token");
    localStorage.setItem("user", JSON.stringify(guestUser));

    // Update auth state
    if (setIsAuthenticated) {
      setIsAuthenticated(true);
    }

    navigate("/dashboard");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "login";
    const payload = isRegister
      ? { name, email, password, village }
      : { email, password };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        if (isRegister) {
          alert("Registration Successful! Please Login.");
          setIsRegister(false);
        } else {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // Update auth state
          if (setIsAuthenticated) {
            setIsAuthenticated(true);
          }

          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        alert("Credentials Invalid.");
      }
    } catch (err) {
      console.error(err);
      setIsOffline(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Language Toggle */}
        <div className="flex justify-end pt-4 pr-6 gap-2">
          <button
            onClick={() => setLang("hi")}
            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              t("welcome") === "स्वागत"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang("en")}
            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
              t("welcome") === "Welcome"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            English
          </button>
        </div>

        {/* Header */}
        <div className="text-center pt-6 pb-6 px-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg mx-auto mb-4">
            G
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            GramSathi
          </h1>
          <p className="text-gray-500 text-sm font-light">{t("welcome")}</p>
        </div>

        {/* Offline Warning & Guest Button */}
        {isOffline ? (
          <div className="m-6 bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-center">
            <WifiOff className="mx-auto text-yellow-600 mb-2" size={20} />
            <p className="text-sm text-yellow-800 font-medium mb-3">
              {t("offline_mode")}
            </p>
            <button
              onClick={handleGuestLogin}
              className="w-full bg-yellow-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
            >
              {t("guest")}
            </button>
          </div>
        ) : (
          /* Standard Login Form */
          <div className="px-8 pb-8">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm">
                {isRegister ? "Create your account" : "Sign in to continue"}
              </p>
            </div>

            <div className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Village Name
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Enter village name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleAuth}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center gap-2"
              >
                {isRegister ? "Create Account" : t("login")}
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isRegister
                  ? "Already have an account? Sign in"
                  : "New user? Create account"}
              </button>
            </div>
          </div>
        )}

        {/* Demo Credentials */}
        <div className="bg-gray-50 p-4 text-xs text-gray-500 text-center border-t border-gray-100">
          <p className="font-medium mb-1">Demo Access</p>
          <p>👮‍♂️ Admin: admin@gramsathi.in / admin123</p>
          <p>🧑‍🌾 User: Any registered account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
