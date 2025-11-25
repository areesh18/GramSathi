import React from 'react';
import { Bell, MapPin, Shield, PlayCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Top Header - High contrast for readability */}
      <header className="bg-blue-700 text-white p-6 rounded-b-3xl shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-200 text-sm font-medium">Namaste, Rajesh 🙏</p>
            <h1 className="text-2xl font-bold">GramSathi</h1>
          </div>
          <div className="bg-blue-600 p-2 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-blue-600"></span>
          </div>
        </div>

        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full text-xs mb-4">
          <MapPin size={12} />
          <span>Village: Rampur, UP</span>
        </div>

        {/* Search Bar Placeholder (Voice enabled visual) */}
        <div className="bg-white text-gray-500 p-3 rounded-xl flex justify-between items-center shadow-sm">
          <span>Search for schemes...</span>
          <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">🎤</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        
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
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700">
                        <PlayCircle size={24} />
                    </div>
                    <span className="font-semibold text-gray-700">Learn Digital</span>
                </div>
            </div>
        </div>

        {/* Banner / Notification */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-md flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">Kisan Samman Nidhi</h3>
                <p className="text-purple-200 text-xs">Next installment arriving soon.</p>
            </div>
            <button className="bg-white text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold">Check</button>
        </div>

      </div>
    </div>
  );
};

export default Home;