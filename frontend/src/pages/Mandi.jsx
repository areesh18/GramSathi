import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mandi = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState('All');

  // Dummy data simulating "Live" market rates
  const marketData = [
    { id: 1, crop: "Wheat (Gehu)", market: "Rampur Mandi", price: "₹2,125", change: "+1.2%", isUp: true },
    { id: 2, crop: "Rice (Dhaan)", market: "Rampur Mandi", price: "₹2,040", change: "-0.5%", isUp: false },
    { id: 3, crop: "Mustard", market: "Sitapur Mandi", price: "₹5,450", change: "+2.8%", isUp: true },
    { id: 4, crop: "Potato", market: "Local Haat", price: "₹850/qt", change: "-1.0%", isUp: false },
    { id: 5, crop: "Wheat (Gehu)", market: "Sitapur Mandi", price: "₹2,140", change: "+0.8%", isUp: true },
  ];

  const filteredData = selectedCrop === 'All' 
    ? marketData 
    : marketData.filter(m => m.crop.includes(selectedCrop));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mandi Bhav 💰</h1>
          <p className="text-sm text-gray-500">Real-time market rates for your crops</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {['All', 'Wheat', 'Rice', 'Potato', 'Mustard'].map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
              selectedCrop === crop 
              ? 'bg-green-600 text-white shadow-md' 
              : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      {/* Prices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{item.crop}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Filter size={12} /> {item.market}
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl text-gray-900">{item.price}</div>
              <div className={`text-xs font-bold flex items-center justify-end gap-1 ${item.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {item.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
        📢 <strong>Tip:</strong> Prices are updated daily at 11:00 AM. Visit your nearest APMC for final rates.
      </div>
    </div>
  );
};

export default Mandi;