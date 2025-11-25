import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  Download,
  Map as MapIcon,
  ShieldCheck,
  Grid,
  XCircle,
} from "lucide-react";

const LandRecords = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [search, setSearch] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // Mock Data
  const records = [
    {
      id: 101,
      owner: "Rajesh Kumar",
      area: "1.2 Hectare",
      crop: "Wheat",
      type: "Irrigated",
      survey: "24/A",
    },
    {
      id: 102,
      owner: "Suresh Patel",
      area: "0.8 Hectare",
      crop: "Rice",
      type: "Rainfed",
      survey: "24/B",
    },
    {
      id: 103,
      owner: "Amit Singh",
      area: "2.5 Hectare",
      crop: "Sugarcane",
      type: "Irrigated",
      survey: "25/A",
    },
    {
      id: 104,
      owner: "Govt Land",
      area: "5.0 Hectare",
      crop: "None",
      type: "Barren",
      survey: "26/X",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-teal-50 p-4 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="bg-teal-700 p-6 rounded-3xl text-white shadow-lg mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">e-Bhulekh 📜</h1>
            <p className="text-teal-100 text-sm">
              Official Land Records Portal
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: SEARCH & MAP */}
      {step === 1 && (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          {/* Toggle View */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
                viewMode === "list"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-500"
              }`}
            >
              <FileText size={16} /> Search by Number
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${
                viewMode === "map"
                  ? "bg-teal-100 text-teal-800"
                  : "text-gray-500"
              }`}
            >
              <MapIcon size={16} /> Village Map
            </button>
          </div>

          {viewMode === "list" ? (
            <div className="bg-white p-8 rounded-3xl shadow-md border border-teal-100 text-center">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid size={40} className="text-teal-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Find Land Record
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Enter Survey / Khasra Number to view ownership.
              </p>

              <form onSubmit={handleSearch} className="relative">
                <input
                  type="number"
                  placeholder="e.g. 101"
                  className="w-full pl-4 pr-12 py-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition text-lg font-bold text-center"
                  required
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-4 rounded-lg hover:bg-teal-700 transition"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
          ) : (
            // REAL GOOGLE MAP EMBED
            <div className="bg-white p-4 rounded-3xl shadow-md border border-teal-100 overflow-hidden">
              <h3 className="font-bold text-gray-700 mb-4 text-center flex items-center justify-center gap-2">
                <MapIcon size={16} /> Satellite View: Rampur Village
              </h3>

              <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-teal-100 group">
                {/* 1. The Map */}
                <iframe
                  title="Village Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  // Points to a generic village location in India (change coords if needed)
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.076883583662!2d80.9462!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUwJzQ4LjEiTiA4MMKwNTYnNDYuMyJF!5e1!3m2!1sen!2sin!4v1632839282934!5m2!1sen!2sin&maptype=satellite"
                ></iframe>

                {/* 2. Interactive Overlays (The "Hack") */}
                {/* We overlay transparent buttons so clicking the map still triggers your app logic */}
                <div className="absolute inset-0 grid grid-cols-2 gap-4 p-8 opacity-50">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setSearch(rec.id);
                        setStep(2);
                      }}
                      className="border-2 border-white/50 bg-green-500/20 hover:bg-green-500/40 cursor-pointer rounded-lg flex items-center justify-center text-white font-bold shadow-lg backdrop-blur-sm transition transform hover:scale-105"
                    >
                      <span>Survey {rec.survey}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500/50 border border-green-600 rounded"></div>
                  Select a Green Plot to View
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: OFFICIAL DOCUMENT VIEW */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
          <div className="bg-white border-4 border-double border-gray-300 p-6 md:p-10 shadow-2xl relative">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-64 h-64 rounded-full border-8 border-gray-800 flex items-center justify-center">
                <span className="font-bold text-4xl -rotate-45">
                  GOVT RECORD
                </span>
              </div>
            </div>

            {/* Content */}
            {records.find((r) => r.id == search) ? (
              (() => {
                const rec = records.find((r) => r.id == search);
                return (
                  <>
                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-900">
                        RoR (Record of Rights)
                      </h2>
                      <p className="text-xs font-serif text-gray-600 uppercase tracking-widest mt-1">
                        Form VII-XII • District Sitapur
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 font-serif mb-8">
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">
                          Survey No
                        </span>
                        <span className="text-xl font-bold text-gray-800">
                          {rec.survey}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">
                          Land Type
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          {rec.type}
                        </span>
                      </div>
                      <div className="col-span-2 bg-yellow-50 p-3 border border-yellow-200">
                        <span className="block text-xs text-gray-500 uppercase">
                          Owner Name
                        </span>
                        <span className="text-2xl font-bold text-teal-900">
                          {rec.owner}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">
                          Area
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          {rec.area}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">
                          Crop
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          {rec.crop}
                        </span>
                      </div>
                    </div>

                    {/* Digital Signature Block */}
                    <div className="border-t border-gray-200 pt-4">
                      {verified ? (
                        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200 animate-in slide-in-from-bottom">
                          <ShieldCheck className="text-green-600" size={32} />
                          <div>
                            <p className="text-green-800 font-bold text-sm">
                              Digitally Signed & Verified
                            </p>
                            <p className="text-green-600 text-xs">
                              Talathi Office, 25 Nov 2024
                            </p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleVerify}
                          disabled={verifying}
                          className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                        >
                          {verifying ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <ShieldCheck size={18} />
                          )}
                          {verifying
                            ? "Verifying with Govt Server..."
                            : "Click to Verify Authenticity"}
                        </button>
                      )}
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="text-center py-10">
                <XCircle className="text-red-500 mx-auto mb-2" size={48} />
                <p className="text-red-500 font-bold">Record Not Found</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-blue-600 underline"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full mt-6 bg-teal-700 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-teal-800 transition"
          >
            Check Another Record
          </button>
        </div>
      )}
    </div>
  );
};

export default LandRecords;
