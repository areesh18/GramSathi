import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, IndianRupee, Clock, CheckCircle } from 'lucide-react';

const Rozgar = () => {
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);

  // Dummy User Data
  const jobData = {
    cardNo: "UP-24-001-992",
    daysWorked: 72,
    daysGuaranteed: 100,
    pendingWages: 4500,
    lastPayment: "₹2,100 on 12 Oct"
  };

  const handleRequestWork = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000); // Reset after 3s
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="bg-orange-600 p-6 rounded-3xl text-white shadow-lg mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Gram Rozgar 🛠️</h1>
            <p className="text-orange-100 text-sm">MNREGA Job Card & Work Status</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* 1. Digital Job Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
            Active
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <Briefcase size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Mahatma Gandhi Job Card</h2>
              <p className="text-gray-500 text-sm font-mono">{jobData.cardNo}</p>
            </div>
          </div>
          
          {/* Progress Bar for 100 Days */}
          <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
            <span>Work Completed</span>
            <span>{jobData.daysWorked} / {jobData.daysGuaranteed} Days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-1000" 
              style={{ width: `${(jobData.daysWorked / jobData.daysGuaranteed) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">28 days of guaranteed work remaining this year.</p>
        </div>

        {/* 2. Wages Tracker */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm">
              <Clock size={16} /> Pending
            </div>
            <h3 className="text-2xl font-bold text-red-500">₹{jobData.pendingWages}</h3>
            <p className="text-xs text-gray-400 mt-1">Due since 15 Nov</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2 text-sm">
              <CheckCircle size={16} /> Received
            </div>
            <h3 className="text-2xl font-bold text-green-600">{jobData.lastPayment}</h3>
            <p className="text-xs text-gray-400 mt-1">Direct to Bank</p>
          </div>
        </div>

        {/* 3. Action: Request Work */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-2xl text-white shadow-lg text-center">
          <h3 className="text-xl font-bold mb-2">Need Work?</h3>
          <p className="opacity-90 mb-6 text-sm">Apply for new MNREGA work in your village immediately.</p>
          
          {requestSent ? (
            <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 w-full animate-in zoom-in">
              <CheckCircle size={20} /> Request Submitted
            </button>
          ) : (
            <button 
              onClick={handleRequestWork}
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition w-full shadow-md active:scale-95"
            >
              <Calendar className="inline mr-2" size={20} />
              Request 15 Days Work
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Rozgar;