import React, { useState, useEffect } from 'react';
import { Search, Landmark, Stethoscope, Sprout, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: null },
  { id: 'gov', label: 'Gov Schemes', icon: <Landmark size={16} /> },
  { id: 'finance', label: 'Finance', icon: <Landmark size={16} /> },
  { id: 'health', label: 'Health', icon: <Stethoscope size={16} /> },
  { id: 'agri', label: 'Agriculture', icon: <Sprout size={16} /> },
];

// Removed hardcoded 'servicesData'

const Services = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [services, setServices] = useState([]); // State for data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:8080/api/schemes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setServices(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching schemes:", err);
      setLoading(false);
    });
  }, []);

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header - Same as before */}
      <div className="bg-blue-700 p-8 md:p-12 rounded-b-[2rem] md:rounded-none text-white shadow-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Services 🇮🇳</h1>
          <p className="text-blue-100 text-base md:text-lg">Access 50+ Government Services in one place</p>
          
          <div className="mt-6 bg-white/10 backdrop-blur-md p-2 rounded-xl flex items-center border border-white/20 max-w-2xl">
            <Search className="text-white ml-3 opacity-70" size={20} />
            <input 
              type="text" 
              placeholder="Search services (e.g., 'Pension')..." 
              className="bg-transparent border-none outline-none text-white placeholder-blue-200 ml-3 w-full p-1"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
        {/* Category Tabs - Same as before */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id 
                  ? 'bg-blue-700 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading Government Schemes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${service.color} group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{service.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;