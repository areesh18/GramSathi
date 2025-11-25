import React, { useState, useEffect } from "react";
import {
  Search,
  Landmark,
  Stethoscope,
  Sprout,
  ChevronRight,
  BookOpen, // Added icon
  Info, // Added icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "all", label: "All Lessons", icon: null },
  { id: "gov", label: "Gov Schemes", icon: <Landmark size={16} /> },
  { id: "finance", label: "Finance", icon: <Landmark size={16} /> },
  { id: "health", label: "Health", icon: <Stethoscope size={16} /> },
  { id: "agri", label: "Agriculture", icon: <Sprout size={16} /> },
];

const Services = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/schemes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching schemes:", err);
        setLoading(false);
      });
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesTab = activeTab === "all" || service.category === activeTab;
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Revised Header for Educational Context */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-8 md:p-12 rounded-b-[2rem] md:rounded-none text-white shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <BookOpen size={20} className="text-yellow-300" />
            <span className="font-bold text-yellow-300 uppercase tracking-wider text-sm">
              Practice Mode
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Service Simulator 🇮🇳
          </h1>
          <p className="text-indigo-100 text-base md:text-lg">
            Learn how to use 50+ Government Services without any risk.
          </p>

          <div className="mt-6 bg-white/10 backdrop-blur-md p-2 rounded-xl flex items-center border border-white/20 max-w-2xl">
            <Search className="text-white ml-3 opacity-70" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lessons (e.g., 'How to apply for Pension')..."
              className="bg-transparentKv border-none outline-none text-white placeholder-indigo-200 ml-3 w-full p-1"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
        {/* Educational Disclaimer Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg flex gap-3 items-start shadow-sm">
          <Info className="text-yellow-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">
              This is a Training Sandbox
            </h4>
            <p className="text-sm text-gray-600">
              Actions taken here are <b>simulations</b>. No real money is
              deducted, and no official forms are submitted. Use this to
              practice safely.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? "bg-indigo-700 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading Practice Modules...
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  // Routing Logic: Prioritize Simulations
                  if (service.title.includes("PM Kisan")) {
                    navigate("/simulation/form");
                  } else if (service.title.includes("UPI")) {
                    navigate("/simulation/upi");
                  } else if (service.title.includes("DigiLocker")) {
                    navigate("/simulation/digilocker");
                  } else if (service.title.includes("Mandi")) {
                    navigate("/services/mandi");
                  } else if (service.title.includes("Tele-Medicine")) {
                    navigate("/services/doctors");
                  } else {
                    // Fallback for demo purposes
                    alert("This learning module is coming soon!");
                  }
                }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${service.color} group-hover:scale-110 transition-transform`}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {service.desc}
                    </p>

                    {/* Visual Cue that this is a lesson */}
                    <div className="flex gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase tracking-wide">
                        <BookOpen size={10} /> Tutorial
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">
                        +50 Pts
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            No lessons found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
