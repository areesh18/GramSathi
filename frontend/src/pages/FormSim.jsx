import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Upload, User, FileText, CreditCard } from 'lucide-react';

const FormSim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ aadhaar: '', landId: '' });

  const handleNext = () => setStep(step + 1);

  const submitForm = async () => {
    // Add 50 points for learning how to apply
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    try {
      await fetch('http://localhost:8080/api/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          user_id: storedUser.id,
          module_id: 'sim_pm_kisan',
          points: 50
        })
      });
      navigate('/services');
      alert("🎉 Practice Application Submitted! You earned 50 Points.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-green-700 p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}><ArrowLeft /></button>
          <h1 className="text-xl font-bold">PM Kisan Practice Form</h1>
        </div>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s ? 'bg-white text-green-700 scale-110' : 'bg-green-800 text-green-400'
            }`}>
              {step > s ? <Check size={16} /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-2 mt-2 text-xs text-green-100 opacity-80">
          <span>Basic</span>
          <span>Aadhaar</span>
          <span>Land</span>
          <span>Submit</span>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        
        {/* STEP 1: ELIGIBILITY */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Step 1: Eligibility Check</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input type="checkbox" className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 text-sm">I am an Indian Farmer</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input type="checkbox" className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 text-sm">I own less than 2 Hectares land</span>
              </div>
            </div>
            <button onClick={handleNext} className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
              Confirm & Proceed
            </button>
          </div>
        )}

        {/* STEP 2: AADHAAR ENTRY */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Step 2: Identity Details</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">Aadhaar Number (12 digits)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="0000 0000 0000"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500"
                  maxLength={12}
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                />
              </div>
              <p className="text-xs text-orange-500 mt-2">🔒 Simulation Mode: Enter any fake number</p>
            </div>
            <button 
              onClick={handleNext} 
              disabled={formData.aadhaar.length < 12}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-green-700"
            >
              Verify Identity
            </button>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOAD */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Step 3: Land Record (7/12)</h2>
            <p className="text-gray-500 text-sm mb-6">Take a photo of your land document.</p>
            
            <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition">
              <Upload className="text-green-600 mb-2" size={32} />
              <span className="text-green-700 font-medium">Tap to Upload Photo</span>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-gray-500 mb-1">Survey / Khasra Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="e.g. 104/A"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500"
                />
              </div>
            </div>

            <button onClick={handleNext} className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
              Next Step
            </button>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Review Application</h2>
            <p className="text-gray-500 text-sm mb-6">Ensure all details are correct before final submission.</p>

            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Scheme:</span>
                <span className="font-bold text-gray-800">PM Kisan Nidhi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Aadhaar:</span>
                <span className="font-bold text-gray-800">{formData.aadhaar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Documents:</span>
                <span className="text-green-600 font-bold flex items-center gap-1"><Check size={14}/> Uploaded</span>
              </div>
            </div>

            <button onClick={submitForm} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition transform active:scale-95">
              Submit Application
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormSim;