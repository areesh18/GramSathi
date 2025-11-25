import React, { useState } from 'react';
import { Search, Landmark, Stethoscope, Sprout, GraduationCap, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'gov', label: 'Gov Schemes', icon: <Landmark size={16} /> },
  { id: 'finance', label: 'Finance', icon: <Landmark size={16} /> },
  { id: 'health', label: 'Health', icon: <Stethoscope size={16} /> },
  { id: 'agri', label: 'Agriculture', icon: <Sprout size={16} /> },
];

const servicesData = [
  { id: 1, title: 'PM Kisan Nidhi', category: 'gov', color: 'bg-green-100 text-green-700', icon: '🌾' },
  { id: 2, title: 'Crop Insurance', category: 'agri', color: 'bg-yellow-100 text-yellow-700', icon: '🛡️' },
  { id: 3, title: 'Tele-Medicine', category: 'health', color: 'bg-blue-100 text-blue-700', icon: '👨‍⚕️' },
  { id: 4, title: 'Practice UPI', category: 'finance', color: 'bg-purple-100 text-purple-700', icon: '💸' },
  { id: 5, title: 'Mandi Prices', category: 'agri', color: 'bg-orange-100 text-orange-700', icon: '💰' },
  { id: 6, title: 'DigiLocker', category: 'gov', color: 'bg-indigo-100 text-indigo-700', icon: '📂' },
];

const Services = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredServices = activeTab === 'all' 
    ? servicesData 
    : servicesData.filter(s => s.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 p-6 rounded-b-3xl text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Services 🇮🇳</h1>
        <p className="text-blue-100 text-sm">Access 50+ Government Services</p>
        
        {/* Search Bar */}
        <div className="mt-4 bg-white/20 backdrop-blur-md p-2 rounded-xl flex items-center border border-white/30">
          <Search className="text-white ml-2" size={20} />
          <input 
            type="text" 
            placeholder="Search services..." 
            className="bg-transparent border-none outline-none text-white placeholder-blue-200 ml-3 w-full"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto p-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === cat.id 
                ? 'bg-blue-700 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="px-4 grid grid-cols-1 gap-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition active:scale-99">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${service.color}`}>
                {service.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{service.title}</h3>
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">{service.category}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-gray-400">
              <ChevronRight size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;