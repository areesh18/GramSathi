import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Send, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Complaint = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [formData, setFormData] = useState({ type: '', desc: '' });

  // Dummy History Data
  const history = [
    { id: 1, type: "Water Supply", date: "12 Oct", status: "Resolved", color: "text-green-600", icon: <CheckCircle size={16} /> },
    { id: 2, type: "Street Light", date: "05 Nov", status: "Pending", color: "text-orange-500", icon: <Clock size={16} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call and Point Reward
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    try {
      // Award points for "Active Citizenship"
      await fetch('http://localhost:8080/api/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          user_id: storedUser.id,
          module_id: 'grievance_filed',
          points: 20
        })
      });
      alert("📢 Complaint Filed Successfully! ID: #GR-2024-998");
      setActiveTab('history');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="bg-rose-700 p-6 rounded-3xl text-white shadow-lg mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Gram Awaaz 📢</h1>
            <p className="text-rose-100 text-sm">Raise your voice, fix your village.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-xl shadow-sm mb-6 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'new' ? 'bg-rose-100 text-rose-700' : 'text-gray-500'}`}
        >
          New Complaint
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'history' ? 'bg-rose-100 text-rose-700' : 'text-gray-500'}`}
        >
          My History
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 animate-in slide-in-from-left">
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm">Issue Type</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-rose-500"
                required
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="">Select Problem...</option>
                <option value="Water">🚰 Water Supply</option>
                <option value="Road">🛣️ Broken Road</option>
                <option value="Electricity">💡 Electricity/Street Light</option>
                <option value="Sanitation">🧹 Garbage/Sanitation</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm">Photo Evidence</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                <Camera size={24} className="mb-2" />
                <span className="text-xs">Tap to Upload</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-sm">Description (Optional)</label>
              <textarea 
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-rose-500 h-24 resize-none"
                placeholder="Describe the issue..."
              ></textarea>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <MapPin size={14} className="text-rose-500" />
              <span>Location auto-detected: Rampur, Ward 4</span>
            </div>

            <button className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-rose-700 transition flex items-center justify-center gap-2">
              <Send size={18} /> Submit Complaint
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-right">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.type}</h3>
                    <p className="text-xs text-gray-400">Filed on {item.date}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${item.color}`}>
                  {item.icon} {item.status}
                </div>
              </div>
            ))}
            <div className="text-center text-xs text-gray-400 mt-8">
              Showing last 6 months history
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaint;