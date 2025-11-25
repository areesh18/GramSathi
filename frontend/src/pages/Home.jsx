import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  MapPin,
  Shield,
  Smartphone,
  Trophy,
  ChevronRight,
  Briefcase,
  AlertTriangle,
  Mic,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 1. Add State for Listening Mode
  const [isListening, setIsListening] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState({
    name: storedUser.name || "Guest",
    score: storedUser.total_score || 0,
  });
  // --- 1. CENTRAL COMMAND PROCESSOR (Updated for Hindi Support) ---
  const processCommand = (rawCommand) => {
    const command = rawCommand.toLowerCase();
    console.log("Processing:", command);

    // 1. UPI / Payment
    if (
      command.includes("upi") ||
      command.includes("pay") ||
      command.includes("paisa") ||
      command.includes("यूपीआई") ||
      command.includes("पे") ||
      command.includes("पैसा")
    ) {
      navigate("/simulation/upi");
    }
    // 2. PM Kisan / Schemes
    else if (
      command.includes("kisan") ||
      command.includes("form") ||
      command.includes("yojana") ||
      command.includes("किसान") ||
      command.includes("फॉर्म") ||
      command.includes("योजना")
    ) {
      navigate("/simulation/form");
    }
    // 3. Mandi / Rates
    else if (
      command.includes("mandi") ||
      command.includes("rate") ||
      command.includes("bhav") ||
      command.includes("मंडी") ||
      command.includes("भाव")
    ) {
      navigate("/services/mandi");
    }
    // 4. Doctor / Health
    else if (
      command.includes("doctor") ||
      command.includes("health") ||
      command.includes("dawa") ||
      command.includes("डॉक्टर") ||
      command.includes("दवा") ||
      command.includes("अस्पताल")
    ) {
      navigate("/services/doctors");
    }
    // 5. Fallback
    else {
      alert(
        `Heard: "${command}". \n\nTry saying: 'Mandi' (मंडी) or 'Kisan' (किसान)`
      );
    }
  };
  // --- 2. ROBUST VOICE LOGIC ---
  const startListening = () => {
    // Feature Check
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      // Fallback for non-Chrome browsers
      const fallback = prompt("🎤 Voice not supported. Type command:");
      if (fallback) processCommand(fallback.toLowerCase());
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      processCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("Speech Error:", event.error);
      setIsListening(false);

      // --- THE HACKATHON SAVER ---
      // If network fails (offline), ask user to type instead.
      if (event.error === "network") {
        const fallback = prompt(
          "⚠️ Offline Voice Error. \n\nType your command (e.g., 'mandi', 'upi'):"
        );
        if (fallback) processCommand(fallback.toLowerCase());
      } else if (event.error === "not-allowed") {
        alert("❌ Permission Denied. Check microphone settings.");
      }
    };

    recognition.start();
  };
  // --- VOICE RECOGNITION LOGIC (FIXED) ---

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (storedUser.id && storedUser.id !== "guest" && navigator.onLine) {
      fetch(`http://localhost:8080/api/user/${storedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setUser({ name: data.name, score: data.total_score });
            localStorage.setItem("user", JSON.stringify(data));
          }
        })
        .catch((err) => console.log("Using offline data"));
    }
  }, []);

  return (
    <div className="pb-24 md:pb-8 min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 md:p-10 rounded-b-[2rem] md:rounded-none shadow-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                {t("welcome")},
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">{user.name} 🙏</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/30">
                <Trophy size={20} className="text-yellow-300" />
                <span className="font-bold text-lg">{user.score} Pts</span>
              </div>
              <div className="bg-white/20 p-2.5 rounded-full cursor-pointer hover:bg-white/30 transition">
                <Bell size={24} />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="inline-flex items-center gap-2 bg-blue-900/40 px-4 py-2 rounded-full text-sm backdrop-blur-sm w-fit">
              <MapPin size={14} />
              <span>Village: Rampur, UP</span>
            </div>

            <div className="flex-1 relative max-w-md">
              <input
                type="text"
                placeholder={
                  isListening
                    ? "Listening..."
                    : "Search schemes (e.g. 'Kisan Credit')"
                }
                className={`w-full border rounded-xl py-3 px-4 text-white placeholder-blue-200 focus:outline-none transition duration-300 ${
                  isListening
                    ? "bg-red-500/20 border-red-400 animate-pulse placeholder-white"
                    : "bg-white/10 border-white/20 focus:bg-white/20"
                }`}
              />

              {/* --- VISUAL FEEDBACK BUTTON --- */}
              <button
                onClick={startListening}
                disabled={isListening}
                className={`absolute right-2 top-2 p-2 rounded-lg transition-all duration-300 shadow-sm ${
                  isListening
                    ? "bg-red-500 text-white scale-110 shadow-red-500/50"
                    : "bg-blue-100 text-blue-700 hover:bg-white hover:scale-105"
                }`}
              >
                {isListening ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Mic size={20} />
                )}
              </button>
              {/* ----------------------------- */}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-8 -mt-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-700 p-1 rounded">
                🔥
              </span>{" "}
              {t("daily_challenge")}
            </h2>
            <Link to="/simulation/upi">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-blue-100 relative overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                <div className="absolute right-0 top-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                  +50 pts
                </div>
                <div className="flex items-center gap-5">
                  <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors shrink-0">
                    <Smartphone className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-xl">
                      Practice UPI Payment
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Learn to scan & pay safely in a risk-free demo
                      environment.
                    </p>
                    <span className="text-blue-600 text-sm font-bold mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Lesson <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div>
            <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="bg-green-100 text-green-700 p-1 rounded">
                📢
              </span>{" "}
              {t("update")}
            </h2>
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-center h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Shield size={100} />
              </div>
              <h3 className="font-bold text-xl relative z-10">
                Kisan Samman Nidhi
              </h3>
              <p className="text-purple-100 text-sm mt-2 relative z-10">
                Next installment of ₹2,000 is arriving next week.
              </p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 border border-white/40 text-white px-4 py-2 rounded-lg text-sm font-bold w-fit transition backdrop-blur-md">
                Check Status
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 mb-4 text-lg">
            {t("quick_services")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: t("schemes"),
                icon: <Shield size={24} />,
                color: "bg-green-100 text-green-700",
                link: "/services",
              },
              {
                title: t("doctors"),
                icon: "🏥",
                color: "bg-orange-100 text-orange-700",
                isTextIcon: true,
                link: "/services/doctors",
              },
              {
                title: t("mandi"),
                icon: "💰",
                color: "bg-yellow-100 text-yellow-700",
                isTextIcon: true,
                link: "/services/mandi",
              },
              {
                title: t("land"),
                icon: "📜",
                color: "bg-teal-100 text-teal-700",
                isTextIcon: true,
                link: "/services/land-records",
              },
              {
                title: t("job"),
                icon: <Briefcase size={24} />,
                color: "bg-orange-100 text-orange-700",
                link: "/services/rozgar",
              },
              {
                title: t("complaint"),
                icon: <AlertTriangle size={24} />,
                color: "bg-rose-100 text-rose-700",
                link: "/services/complaint",
              },
            ].map((item, idx) => (
              <Link
                to={item.link}
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
                >
                  {item.isTextIcon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
