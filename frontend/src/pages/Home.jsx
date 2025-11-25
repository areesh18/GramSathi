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
  Info,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [showVoiceHints, setShowVoiceHints] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState({
    name: storedUser.name || "Guest",
    score: storedUser.total_score || 0,
  });

  // Voice command hints
  const voiceCommands = [
    { command: "UPI, Pay, Paisa", action: "Open UPI Payment" },
    { command: "Kisan, Form, Yojana", action: "PM Kisan Form" },
    { command: "Mandi, Rate, Bhav", action: "Mandi Prices" },
    { command: "Doctor, Health, Dawa", action: "Find Doctor" },
  ];

  // Voice command processor
  const processCommand = (rawCommand) => {
    const command = rawCommand.toLowerCase();
    console.log("Processing:", command);

    if (
      command.includes("upi") ||
      command.includes("pay") ||
      command.includes("paisa") ||
      command.includes("यूपीआई") ||
      command.includes("पे") ||
      command.includes("पैसा")
    ) {
      navigate("/simulation/upi");
    } else if (
      command.includes("kisan") ||
      command.includes("form") ||
      command.includes("yojana") ||
      command.includes("किसान") ||
      command.includes("फॉर्म") ||
      command.includes("योजना")
    ) {
      navigate("/simulation/form");
    } else if (
      command.includes("mandi") ||
      command.includes("rate") ||
      command.includes("bhav") ||
      command.includes("मंडी") ||
      command.includes("भाव")
    ) {
      navigate("/services/mandi");
    } else if (
      command.includes("doctor") ||
      command.includes("health") ||
      command.includes("dawa") ||
      command.includes("डॉक्टर") ||
      command.includes("दवा") ||
      command.includes("अस्पताल")
    ) {
      navigate("/services/doctors");
    } else {
      setShowVoiceHints(true);
      setTimeout(() => setShowVoiceHints(false), 5000);
    }
  };

  // Voice recognition logic
  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
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

      if (event.error === "network") {
        const fallback = prompt(
          "⚠️ Offline Voice Error. \n\nType your command (e.g., 'mandi', 'upi'):"
        );
        if (fallback) processCommand(fallback.toLowerCase());
      } else if (event.error === "not-allowed") {
        alert("❌ Permission Denied. Check microphone settings.");
      } else if (event.error === "no-speech") {
        setShowVoiceHints(true);
        setTimeout(() => setShowVoiceHints(false), 5000);
      }
    };

    recognition.start();
  };

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
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {t("welcome")},
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                {user.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-4 py-2.5 rounded-lg flex items-center gap-2 border border-blue-100">
                <Trophy size={18} className="text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {user.score}
                </span>
                <span className="text-sm text-gray-500">pts</span>
              </div>
              <button className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg text-sm border border-gray-200 w-fit">
              <MapPin size={14} className="text-gray-500" />
              <span className="text-gray-700 font-medium">
                Village: Rampur, UP
              </span>
            </div>

            <div className="flex-1 relative max-w-md">
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Search schemes..."}
                className={`w-full border rounded-lg py-2.5 px-4 pr-12 text-sm outline-none transition-all ${
                  isListening
                    ? "bg-red-50 border-red-300 placeholder-red-400"
                    : "bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                }`}
              />

              <button
                onClick={startListening}
                disabled={isListening}
                className={`absolute right-2 top-2 p-1.5 rounded-md transition-all ${
                  isListening
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isListening ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Mic size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Voice Command Hints */}
          {showVoiceHints && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 animate-in slide-in-from-top">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">
                    Try saying these commands:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {voiceCommands.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-md p-2 text-xs border border-blue-100"
                      >
                        <span className="font-semibold text-blue-700">
                          "{cmd.command}"
                        </span>
                        <span className="text-gray-500"> → {cmd.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Daily Challenge & Update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Challenge */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
              <span className="text-orange-600">🔥</span>
              {t("daily_challenge")}
            </h2>
            <Link to="/simulation/upi">
              <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Smartphone className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        Practice UPI Payment
                      </h4>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-md">
                    +50 pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Learn to scan & pay safely in a risk-free demo environment.
                </p>
                <span className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Lesson <ChevronRight size={16} />
                </span>
              </div>
            </Link>
          </div>

          {/* Update Card */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
              <span className="text-green-600">📢</span>
              {t("update")}
            </h2>
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-6 text-white h-full flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-semibold text-xl mb-2">
                  Kisan Samman Nidhi
                </h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  Next installment of ₹2,000 is arriving next week.
                </p>
              </div>
              <button className="mt-4 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium w-fit transition-colors">
                Check Status
              </button>
            </div>
          </div>
        </div>

        {/* Quick Services */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 text-base">
            {t("quick_services")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: t("schemes"),
                icon: <Shield size={20} />,
                color: "bg-green-50 text-green-700",
                link: "/services",
              },
              {
                title: t("doctors"),
                icon: "🏥",
                color: "bg-orange-50 text-orange-700",
                isTextIcon: true,
                link: "/services/doctors",
              },
              {
                title: t("mandi"),
                icon: "💰",
                color: "bg-yellow-50 text-yellow-700",
                isTextIcon: true,
                link: "/services/mandi",
              },
              {
                title: t("land"),
                icon: "📜",
                color: "bg-teal-50 text-teal-700",
                isTextIcon: true,
                link: "/services/land-records",
              },
              {
                title: t("job"),
                icon: <Briefcase size={20} />,
                color: "bg-blue-50 text-blue-700",
                link: "/services/rozgar",
              },
              {
                title: t("complaint"),
                icon: <AlertTriangle size={20} />,
                color: "bg-rose-50 text-rose-700",
                link: "/services/complaint",
              },
            ].map((item, idx) => (
              <Link
                to={item.link}
                key={idx}
                className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col items-center gap-3 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}
                >
                  {item.isTextIcon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                </div>
                <span className="font-medium text-gray-700 text-sm text-center">
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
