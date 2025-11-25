import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  MapPin,
  Shield,
  Smartphone,
  Trophy,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const [user, setUser] = useState({ name: "Loading...", score: 0 });

  useEffect(() => {
    // Get stored user details
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      fetch(`http://localhost:8080/api/user/${storedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // <--- THE KEY CHANGE
        },
      })
        .then((res) => res.json())
        .then((data) => setUser({ name: data.name, score: data.total_score }))
        .catch((err) => console.error("Failed to fetch user", err));
    }
  }, []);

  return (
    <div className="pb-24 md:pb-8 min-h-screen bg-gray-50">
      {/* Header - Responsive Height and Padding */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 md:p-10 rounded-b-[2rem] md:rounded-none shadow-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Namaste,</p>
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
                placeholder="Search schemes (e.g. 'Kisan Credit')"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 transition"
              />
              <span className="absolute right-3 top-3 bg-blue-100 text-blue-700 p-1 rounded-lg text-xs font-bold cursor-pointer hover:scale-105 transition">
                🎤
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto p-6 space-y-8 -mt-4 relative z-10">
        {/* Daily Challenge Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="bg-yellow-100 text-yellow-700 p-1 rounded">
                🔥
              </span>{" "}
              Daily Challenge
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

          {/* Government Notice Banner */}
          <div>
            <h2 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <span className="bg-green-100 text-green-700 p-1 rounded">
                📢
              </span>{" "}
              Update
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

        {/* Quick Actions Grid */}
        <div className="">
          <h2 className=" font-bold text-gray-800 mb-4 text-lg">
            Quick Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Gov Schemes",
                icon: <Shield size={24} />,
                color: "bg-green-100 text-green-700",
              },
              {
                title: "Find Doctor",
                icon: "🏥",
                color: "bg-orange-100 text-orange-700",
                isTextIcon: true,
              },
              {
                title: "Mandi Prices",
                icon: "💰",
                color: "bg-yellow-100 text-yellow-700",
                isTextIcon: true,
              },
              {
                title: "Land Records",
                icon: "📜",
                color: "bg-teal-100 text-teal-700",
                isTextIcon: true,
              },
            ].map((item, idx) => (
              <Link
                to={item.title === "Mandi Prices" ? "/services/mandi" : "#"}
                key={idx}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
              >
                {" "}
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
