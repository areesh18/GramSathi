import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Smartphone, FileText, Plus, Search, CheckCircle, Shield } from 'lucide-react';

const DigiLockerSim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [documents, setDocuments] = useState([
    { id: 1, title: "Aadhaar Card", issuer: "UIDAI", date: "12 Jan 2022" },
    { id: 2, title: "PAN Card", issuer: "Income Tax Dept", date: "15 Mar 2021" }
  ]);

  // --- ANALYTICS HELPER ---
  const logSuccess = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (token && token !== 'guest-token') {
        await fetch('http://localhost:8080/api/progress', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            user_id: storedUser.id,
            module_id: 'sim_digilocker',
            points: 50
          })
        }).catch(err => console.error(err));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (otp === "1234") {
        setStep(2);
    } else {
        alert("Wrong OTP! Try 1234 (Simulation)");
    }
  };

  const handleFetchDoc = () => {
    // Simulate searching and adding
    setTimeout(() => {
        setDocuments([...documents, { id: 3, title: "COVID Vaccine Cert", issuer: "MoHFW", date: "Today" }]);
        setStep(2); // Back to dashboard
        logSuccess(); // Award Points
        alert("🎉 Document Fetched Successfully! (+50 Points)");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-indigo-700 p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/services')}><ArrowLeft /></button>
          <h1 className="text-xl font-bold">DigiLocker Simulator</h1>
        </div>
        <p className="text-indigo-200 text-xs ml-9">Safe storage for your official documents</p>
      </div>

      <div className="p-6 max-w-md mx-auto">
        
        {/* STEP 1: LOGIN (OTP) */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in slide-in-from-bottom">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Secure Login</h2>
                <p className="text-gray-500 text-sm">Enter OTP sent to your mobile.</p>
            </div>

            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Mobile Number</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                    <Smartphone size={20} className="text-gray-400" />
                    <span className="font-bold text-gray-700">XXXXXX8892</span>
                </div>

                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Enter OTP</label>
                <input 
                    type="password" 
                    placeholder="Try 1234"
                    className="w-full p-3 bg-white rounded-xl border-2 border-indigo-100 outline-none focus:border-indigo-500 text-center text-xl font-bold tracking-widest"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
            </div>

            <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">
                Verify & Login
            </button>
          </div>
        )}

        {/* STEP 2: DASHBOARD */}
        {step === 2 && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 text-lg">Issued Documents</h2>
                <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-md hover:bg-indigo-700">
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="space-y-3">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{doc.title}</h3>
                                <p className="text-xs text-gray-500">{doc.issuer} • {doc.date}</p>
                            </div>
                        </div>
                        <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                            <FileText size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                    <Shield size={18} /> Did you know?
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                    Documents in DigiLocker are legally equivalent to original physical documents under the IT Act, 2000.
                </p>
            </div>
          </div>
        )}

        {/* STEP 3: FETCH SIMULATOR */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-in slide-in-from-right">
             <h2 className="text-lg font-bold text-gray-800 mb-4">Search Document</h2>
             
             <div className="relative mb-6">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="e.g. Vaccine, Marksheet" 
                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                />
             </div>

             <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Popular</p>
                <button onClick={handleFetchDoc} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs">💉</div>
                    <span className="font-medium text-gray-700">COVID-19 Vaccine Certificate</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition flex items-center gap-3 opacity-50 cursor-not-allowed">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs">⛽</div>
                    <span className="font-medium text-gray-700">LPG Subscription Voucher</span>
                </button>
             </div>

             <button onClick={() => setStep(2)} className="mt-6 w-full py-3 text-gray-500 font-bold text-sm">Cancel</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DigiLockerSim;