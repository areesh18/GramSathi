import React, { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Filter,
  Calculator,
  Ticket,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Mandi = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rates"); // 'rates' or 'sell'
  const [selectedCrop, setSelectedCrop] = useState("All");

  // Sell Simulator State
  const [sellForm, setSellForm] = useState({
    crop: "Wheat (Gehu)",
    qty: "",
    quality: "A",
  });
  const [showPass, setShowPass] = useState(false);

  // Dummy data
  const marketData = [
    {
      id: 1,
      crop: "Wheat (Gehu)",
      market: "Rampur Mandi",
      price: 2125,
      change: "+1.2%",
      isUp: true,
    },
    {
      id: 2,
      crop: "Rice (Dhaan)",
      market: "Rampur Mandi",
      price: 2040,
      change: "-0.5%",
      isUp: false,
    },
    {
      id: 3,
      crop: "Mustard",
      market: "Sitapur Mandi",
      price: 5450,
      change: "+2.8%",
      isUp: true,
    },
    {
      id: 4,
      crop: "Potato",
      market: "Local Haat",
      price: 850,
      change: "-1.0%",
      isUp: false,
    },
  ];

  const filteredData =
    selectedCrop === "All"
      ? marketData
      : marketData.filter((m) => m.crop.includes(selectedCrop));

  const handleGeneratePass = (e) => {
    e.preventDefault();
    // Simulate processing delay
    setShowPass(true);
  };

  // Calculate earnings - moved outside conditional for consistency
  const calculateEarnings = () => {
    if (!sellForm.qty) return 0;
    const selectedPrice =
      marketData.find((m) => m.crop === sellForm.crop)?.price || 0;
    return parseInt(sellForm.qty) * selectedPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mandi Bhav 💰</h1>
          <p className="text-sm text-gray-500">
            Real-time rates & selling tools
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6">
        <button
          onClick={() => setActiveTab("rates")}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${
            activeTab === "rates"
              ? "bg-orange-100 text-orange-700"
              : "text-gray-500"
          }`}
        >
          📊 Live Rates
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${
            activeTab === "sell"
              ? "bg-orange-100 text-orange-700"
              : "text-gray-500"
          }`}
        >
          🚜 Sell Crop
        </button>
      </div>

      {/* --- TAB 1: RATES --- */}
      {activeTab === "rates" && (
        <div className="animate-in slide-in-from-left">
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
            {["All", "Wheat", "Rice", "Potato", "Mustard"].map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                  selectedCrop === crop
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {item.crop}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Filter size={12} /> {item.market}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-gray-900">
                    ₹{item.price}
                  </div>
                  <div
                    className={`text-xs font-bold flex items-center justify-end gap-1 ${
                      item.isUp ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.isUp ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: SELL SIMULATOR --- */}
      {activeTab === "sell" && (
        <div className="animate-in slide-in-from-right">
          {!showPass ? (
            <form
              onSubmit={handleGeneratePass}
              className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100"
            >
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="text-orange-600" size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Calculate & Generate Pass
                </h2>
                <p className="text-xs text-gray-500">
                  Get your digital gate pass before visiting Mandi.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Select Crop
                  </label>
                  <select
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 font-bold text-gray-700"
                    value={sellForm.crop}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, crop: e.target.value })
                    }
                  >
                    {marketData.map((m) => (
                      <option key={m.id} value={m.crop}>
                        {m.crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Quantity (Quintal)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 font-bold"
                      placeholder="0"
                      required
                      value={sellForm.qty}
                      onChange={(e) =>
                        setSellForm({ ...sellForm, qty: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Quality
                    </label>
                    <select
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 mt-1 font-bold"
                      value={sellForm.quality}
                      onChange={(e) =>
                        setSellForm({ ...sellForm, quality: e.target.value })
                      }
                    >
                      <option>Grade A</option>
                      <option>Grade B</option>
                      <option>Grade C</option>
                    </select>
                  </div>
                </div>

                {/* FIXED: Real-time Calculation - Always Visible */}
                <div
                  className={`bg-blue-50 p-4 rounded-xl flex justify-between items-center border border-blue-100 transition-all ${
                    !sellForm.qty ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <span className="text-blue-800 font-medium text-sm">
                    Est. Earnings:
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    ₹{calculateEarnings().toLocaleString()}
                  </span>
                </div>

                <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 flex items-center justify-center gap-2">
                  <Ticket size={20} /> Generate Gate Pass
                </button>
              </div>
            </form>
          ) : (
            // THE GENERATED PASS
            <div className="bg-white p-0 rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-in zoom-in">
              <div className="bg-orange-600 p-6 text-white text-center relative">
                <div className="w-3 h-3 bg-gray-50 rounded-full absolute -bottom-1.5 -left-1.5"></div>
                <div className="w-3 h-3 bg-gray-50 rounded-full absolute -bottom-1.5 -right-1.5"></div>
                <CheckCircle
                  className="mx-auto mb-2 text-orange-200"
                  size={48}
                />
                <h2 className="text-2xl font-bold uppercase tracking-widest">
                  Gate Pass
                </h2>
                <p className="text-orange-100 text-sm">Rampur APMC Mandi</p>
              </div>
              <div className="p-6 space-y-4 border-b-2 border-dashed border-gray-200 relative">
                <div className="w-3 h-3 bg-gray-50 rounded-full absolute -bottom-1.5 -left-1.5"></div>
                <div className="w-3 h-3 bg-gray-50 rounded-full absolute -bottom-1.5 -right-1.5"></div>

                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Farmer</span>
                  <span className="font-bold text-gray-800">Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Crop</span>
                  <span className="font-bold text-gray-800">
                    {sellForm.crop}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Quantity</span>
                  <span className="font-bold text-gray-800">
                    {sellForm.qty} Quintal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="font-bold text-gray-800">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Show this QR at the entry gate
                </p>
                <div className="bg-white p-2 inline-block rounded-lg border border-gray-200">
                  {/* Fake QR */}
                  <div className="grid grid-cols-4 gap-1 w-24 h-24">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`bg-black ${
                          Math.random() > 0.5 ? "opacity-100" : "opacity-10"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowPass(false)}
                  className="block w-full mt-4 text-orange-600 font-bold text-sm"
                >
                  Create New Pass
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mandi;
