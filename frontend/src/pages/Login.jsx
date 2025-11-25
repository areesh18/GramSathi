import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, User, MapPin, WifiOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  
  // Start with navigator status, but update if fetch fails
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
  }, []);

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
    navigate("/dashboard");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "login";
    const payload = isRegister
      ? { name, email, password, village }
      : { email, password };

    try {
      // 5 Second Timeout to detect server down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
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
      // THIS IS THE FIX: Force offline mode if fetch fails
      setIsOffline(true);
      // Don't alert, just let the UI update to show the Guest button
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Language Toggle */}
        <div className="flex justify-end pt-4 pr-6">
          <button
            onClick={() => setLang("hi")}
            className="text-sm font-bold text-blue-600 mr-2"
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang("en")}
            className="text-sm font-bold text-gray-500"
          >
            English
          </button>
        </div>

        <div className="text-center mb-4 px-8">
          <h1 className="text-3xl font-bold text-gray-800">GramSathi</h1>
          <p className="text-gray-500">{t("welcome")}</p>
        </div>

        {/* Offline Warning & Guest Button */}
        {isOffline ? (
          <div className="m-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center animate-pulse">
            <WifiOff className="mx-auto text-yellow-600 mb-2" />
            <p className="text-sm text-yellow-800 font-bold mb-3">
              {t("offline_mode")}
            </p>
            <button
              onClick={handleGuestLogin}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg font-bold shadow-md active:scale-95"
            >
              {t("guest")}
            </button>
          </div>
        ) : (
          /* Standard Login Form - Hides when offline */
          <div className="p-8 pt-0">
            <div className="text-center mb-8">
              <p className="text-gray-500">
                {isRegister ? "Create Citizen Account" : "Secure Login"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && (
                <>
                  <div className="relative animate-in slide-in-from-top">
                    <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative animate-in slide-in-from-top">
                    <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Village Name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 mt-6">
                {isRegister ? "Join GramSathi" : t('login')} <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 font-medium hover:underline"
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "New Citizen? Register"}
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 text-xs text-gray-500 text-center border-t border-gray-100">
          <p className="font-bold">Hackathon Demo Access:</p>
          <p>👮‍♂️ Admin: admin@gramsathi.in / admin123</p>
          <p>🧑‍🌾 Citizen: Any Registered User</p>
        </div>
      </div>
    </div>
  );
};

export default Login;