import React, { useState, useEffect } from "react";
import {
  Search,
  Landmark,
  Stethoscope,
  Sprout,
  ChevronRight,
  BookOpen,
  Info,
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
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2 text-blue-600">
            <BookOpen size={20} />
            <span className="font-medium uppercase tracking-wider text-xs">
              Practice Mode
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Service Simulator
          </h1>
          <p className="text-gray-600 text-base md:text-lg font-light">
            Learn how to use 50+ Government Services without any risk.
          </p>

          {/* FIXED: Search box with loading state */}
          <div className="mt-6 relative max-w-2xl">
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                loading
                  ? "Loading lessons..."
                  : "Search lessons (e.g., 'How to apply for Pension')..."
              }
              disabled={loading}
              className={`w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none text-sm transition-all ${
                loading
                  ? "cursor-wait opacity-60"
                  : "focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              }`}
            />
            {loading && (
              <div className="absolute right-4 top-3.5">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Educational Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 mb-8 rounded-xl flex gap-3 items-start">
          <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              This is a Training Sandbox
            </h4>
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              Actions taken here are{" "}
              <span className="font-medium">simulations</span>. No real money is
              deducted, and no official forms are submitted. Use this to
              practice safely.
            </p>
          </div>
        </div>

        {/* Tabs - Disabled while loading */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => !loading && setActiveTab(cat.id)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                loading
                  ? "opacity-50 cursor-wait"
                  : activeTab === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading Practice Modules...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    alert("This learning module is coming soon!");
                  }
                }}
                className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${service.color} group-hover:scale-105 transition-transform`}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3 font-light">
                        {service.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-md uppercase tracking-wide border border-gray-100">
                          <BookOpen size={10} /> Tutorial
                        </span>
                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[10px] font-medium rounded-md border border-green-100">
                          +50 Pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-medium mb-1">No lessons found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
