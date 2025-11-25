import React from 'react';
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Bell, MapPin, Shield, Smartphone, Trophy } from 'lucide-react'; // Import Smartphone icon

const Home = () => {
    const [user, setUser] = useState({ name: "Loading...", score: 0 });
    // Fetch User Data on Load
  useEffect(() => {
    fetch('http://localhost:8080/api/user')
      .then(res => res.json())
      .then(data => setUser({ name: data.name, score: data.total_score }))
      .catch(err => console.error("Failed to fetch user", err));
  }, []);
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Top Header */}
      <header className="bg-blue-700 text-white p-6 rounded-b-3xl shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-sm font-medium">Namaste, Rajesh 🙏</p>
            <h1 className="text-2xl font-bold">GramSathi</h1>
          </div>
          {/* LIVE SCORE DISPLAY */}
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/30">
            <Trophy size={16} className="text-yellow-300" />
            <span className="font-bold">{user.score} Pts</span>
          </div>
          <div className="bg-blue-600 p-2 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-blue-600"></span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full text-xs mb-4">
          <MapPin size={12} />
          <span>Village: Rampur, UP</span>
        </div>

        <div className="bg-white text-gray-500 p-3 rounded-xl flex justify-between items-center shadow-sm">
          <span>Search for schemes...</span>
          <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">🎤</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        
        {/* --- NEW: Interactive Learning Card --- */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3 text-lg">Daily Challenge</h2>
          <Link to="/simulation/upi">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100 relative overflow-hidden group active:scale-95 transition-transform">
              <div className="absolute right-0 top-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                +50 pts
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition">
                  <Smartphone className="text-blue-600" size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Practice UPI Payment</h4>
                  <p className="text-xs text-gray-500 mt-1">Learn to scan & pay safely without real money.</p>
                  <span className="text-blue-600 text-sm font-bold mt-2 inline-block group-hover:underline">Start Lesson →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div>
            <h2 className="font-bold text-gray-800 mb-3 text-lg">Quick Services</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                        <Shield size={24} />
                    </div>
                    <span className="font-semibold text-gray-700">Gov Schemes</span>
                </div>
                {/* Placeholder for another service */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700">
                        <span className="text-2xl">🏥</span>
                    </div>
                    <span className="font-semibold text-gray-700">Find Doctor</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;