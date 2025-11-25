import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Smartphone,
  FileText,
  Plus,
  Search,
  CheckCircle,
  Shield,
  Volume2,
} from "lucide-react";
import { saveOfflineAction, speak } from "../utils/offlineSync";

const DigiLockerSim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [documents, setDocuments] = useState([
    { id: 1, title: "Aadhaar Card", issuer: "UIDAI", date: "12 Jan 2022" },
    {
      id: 2,
      title: "PAN Card",
      issuer: "Income Tax Dept",
      date: "15 Mar 2021",
    },
  ]);

  // Voice helper
  const playGuide = (text) => speak(text, "hi-IN");

  useEffect(() => {
    playGuide("DigiLocker practice mein swagat hai. Kripya login karein.");
    return () => window.speechSynthesis.cancel();
  }, []);

  // Analytics helper
  const logSuccess = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (token && token !== "guest-token") {
      await fetch("http://localhost:8080/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: storedUser.id,
          module_id: "sim_digilocker",
          points: 50,
        }),
      }).catch((err) => console.error(err));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (otp === "1234") {
      setStep(2);
      playGuide(
        "Safalta poorvak login hua. Ab naye document khojein ya maujooda dekhein."
      );
    } else {
      playGuide("Galat OTP! Kripya phir se koshish karein. Hint: 1234");
      alert("Wrong OTP! Try 1234 (Simulation)");
    }
  };

  const handleFetchDoc = () => {
    setTimeout(() => {
      setDocuments([
        ...documents,
        { id: 3, title: "COVID Vaccine Cert", issuer: "MoHFW", date: "Today" },
      ]);
      setStep(2);
      logSuccess();
      alert("🎉 Document Fetched Successfully! (+50 Points)");
      playGuide(
        "Document safalta poorvak mil gaya hai. Aapne 50 points kamaye hain."
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/services")}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                DigiLocker Simulator
              </h1>
              <p className="text-xs text-gray-500 font-light">
                Safe storage for documents
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (step === 1)
                playGuide(
                  "DigiLocker mein login karne ke liye, 4 ank ka OTP 1 2 3 4 daalein."
                );
              if (step === 2)
                playGuide(
                  "Documents ki list dekhein ya Add New par click karke naya document khojein."
                );
              if (step === 3)
                playGuide(
                  "Vaccine Certificate khojne ke liye pehle button par click karein."
                );
            }}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Play Audio Instructions"
          >
            <Volume2 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* STEP 1: LOGIN (OTP) */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-100">
                <Lock className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Secure Login
              </h2>
              <p className="text-gray-600 text-sm font-light">
                Enter OTP sent to your mobile.
              </p>
            </div>

            <div className="mb-6">
              <label className="text-xs font-medium text-gray-700 uppercase mb-2 block">
                Mobile Number
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                <Smartphone size={20} className="text-gray-400" />
                <span className="font-medium text-gray-700">XXXXXX8892</span>
              </div>

              <label className="text-xs font-medium text-gray-700 uppercase mb-2 block">
                Enter OTP
              </label>
              <input
                type="password"
                placeholder="Try 1234"
                className="w-full p-3 bg-white rounded-xl border-2 border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 text-center text-xl font-semibold tracking-widest transition-all"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Verify & Login
            </button>
          </div>
        )}

        {/* STEP 2: DASHBOARD */}
        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900 text-lg">
                Issued Documents
              </h2>
              <button
                onClick={() => {
                  setStep(3);
                  playGuide(
                    "Naya document khojne ke liye search bar ka upyog karein."
                  );
                }}
                className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} /> Add New
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-light">
                        {doc.issuer} • {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText size={20} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2 text-sm">
                <Shield size={18} /> Did you know?
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed font-light">
                Documents in DigiLocker are legally equivalent to original
                physical documents under the IT Act, 2000.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: FETCH SIMULATOR */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search Document
            </h2>

            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="e.g. Vaccine, Marksheet"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase mb-3">
                Popular
              </p>
              <button
                onClick={handleFetchDoc}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-xs border border-orange-100">
                  💉
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  COVID-19 Vaccine Certificate
                </span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 opacity-50 cursor-not-allowed flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-xs border border-yellow-100">
                  ⛽
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  LPG Subscription Voucher
                </span>
              </button>
            </div>

            <button
              onClick={() => {
                setStep(2);
                playGuide("Aap document ki list mein waapas aa gaye hain.");
              }}
              className="mt-6 w-full py-3 text-gray-600 font-medium text-sm hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigiLockerSim;
