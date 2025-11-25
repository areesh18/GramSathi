import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, Download, Map, Share2 } from 'lucide-react';

const LandRecords = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  
  // Dummy data for simulation
  const records = [
    { id: 101, owner: "Rajesh Kumar", area: "1.2 Hectare", crop: "Wheat", type: "Irrigated", survey: "24/A" },
    { id: 102, owner: "Suresh Patel", area: "0.8 Hectare", crop: "Rice", type: "Rainfed", survey: "24/B" },
    { id: 103, owner: "Amit Singh", area: "2.5 Hectare", crop: "Sugarcane", type: "Irrigated", survey: "25/A" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const downloadRecord = () => {
    alert("⬇️ Downloading Digitally Signed 7/12 Extract...");
  };

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="bg-teal-700 p-6 rounded-3xl text-white shadow-lg mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">e-Bhulekh 📜</h1>
            <p className="text-teal-100 text-sm">Digital Land Records Portal</p>
          </div>
        </div>
      </div>

      {/* Step 1: Search Box */}
      {step === 1 && (
        <div className="max-w-xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-teal-100">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map size={40} className="text-teal-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Search Your Land</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter your Survey / Khasra Number to view details.</p>
            
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="number" 
                placeholder="Enter Survey No (e.g. 101)" 
                className="w-full pl-4 pr-12 py-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition text-lg font-bold text-center"
                required
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-4 rounded-lg hover:bg-teal-700 transition">
                <Search size={20} />
              </button>
            </form>
            
            <div className="mt-6 flex justify-center gap-2 text-xs text-gray-400">
              <span className="bg-gray-100 px-2 py-1 rounded">Try: 101</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Try: 102</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Record View */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          {/* The "Official" Document Look */}
          <div className="bg-white border-4 border-double border-gray-300 p-6 md:p-10 shadow-2xl relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-64 h-64 rounded-full border-8 border-gray-800 flex items-center justify-center">
                <span className="font-bold text-4xl -rotate-45">GOVT RECORD</span>
              </div>
            </div>

            {/* Doc Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">RoR (Record of Rights)</h2>
              <p className="text-sm font-serif text-gray-600 uppercase tracking-widest mt-1">Form VII-XII</p>
              <div className="mt-4 flex justify-between text-xs font-bold text-gray-500">
                <span>Village: Rampur</span>
                <span>Year: 2024-2025</span>
                <span>District: Sitapur</span>
              </div>
            </div>

            {/* Doc Content */}
            <div className="space-y-6 font-serif">
              {/* Find the record or show Not Found */}
              {records.find(r => r.id == search) ? (
                (() => {
                  const rec = records.find(r => r.id == search);
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Survey No</span>
                          <span className="text-xl font-bold text-gray-800">{rec.survey}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Land Type</span>
                          <span className="text-lg font-bold text-gray-800">{rec.type}</span>
                        </div>
                        <div className="col-span-2 bg-yellow-50 p-3 border border-yellow-200">
                          <span className="block text-xs text-gray-500 uppercase">Owner Name</span>
                          <span className="text-2xl font-bold text-teal-900">{rec.owner}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Total Area</span>
                          <span className="text-lg font-bold text-gray-800">{rec.area}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Cultivable Crop</span>
                          <span className="text-lg font-bold text-gray-800">{rec.crop}</span>
                        </div>
                      </div>

                      {/* Digital Sign Stamp */}
                      <div className="mt-12 flex justify-end">
                        <div className="text-center">
                          <div className="text-green-600 font-bold border-2 border-green-600 px-4 py-2 rounded rotate-[-5deg] opacity-80">
                            DIGITALLY SIGNED
                            <br/><span className="text-xs font-normal">Talathi Ofc, Rampur</span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className="text-center py-10 text-red-500 font-bold">
                  ❌ Record Not Found. Please try Survey No 101, 102, or 103.
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition">
              Check Another
            </button>
            <button onClick={downloadRecord} className="flex-1 bg-teal-700 text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition shadow-lg flex items-center justify-center gap-2">
              <Download size={20} /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandRecords;