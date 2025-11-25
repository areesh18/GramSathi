import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Upload,
  User,
  FileText,
  AlertCircle,
  Volume2,
} from "lucide-react";
import { saveOfflineAction, speak } from "../utils/offlineSync";

const FormSim = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadhaar: "",
    landId: "",
    hasUploaded: false,
  });
  const [error, setError] = useState("");

  // Audio helper
  const playHelp = (text) => speak(text, "hi-IN");

  useEffect(() => {
    playHelp("Pradhan Mantri Kisan Yojana form mein swagat hai.");
  }, []);

  const handleNext = () => {
    setError("");

    if (step === 2 && formData.aadhaar.length < 12) {
      const msg = "Aadhaar number 12 ank ka hona chahiye.";
      setError(msg);
      playHelp(msg);
      return;
    }

    if (step === 3 && !formData.hasUploaded) {
      const msg = "Kripya pehle zameen ke kagaz ki photo upload karein.";
      setError(msg);
      playHelp(msg);
      return;
    }

    setStep(step + 1);

    // Step specific audio hints
    if (step === 1) playHelp("Apna Aadhaar number darj karein.");
    if (step === 2) playHelp("Apne khet ke kagaz ki photo khinchein.");
    if (step === 3) playHelp("Sabhi jaankari check karein aur submit karein.");
  };

  const submitForm = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const payload = {
      user_id: storedUser.id,
      module_id: "sim_pm_kisan",
      points: 50,
    };

    // Robust Submit Logic: Offline First Approach
    if (!navigator.onLine) {
      // 1. Offline
      saveOfflineAction("/api/progress", "POST", payload);
      alert(
        "📝 Form Saved Offline! It will submit automatically when internet returns."
      );
    } else {
      // 2. Online
      try {
        if (token && token !== "guest-token") {
          await fetch("http://localhost:8080/api/progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        }
        alert("🎉 Application Submitted! You earned 50 Points.");
      } catch (err) {
        console.error("Submission failed, queuing offline", err);
        saveOfflineAction("/api/progress", "POST", payload);
        alert("⚠️ Server unreachable. Saved offline for later sync.");
      }
    }
    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="bg-green-700 p-6 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </button>
            <h1 className="text-xl font-bold">PM Kisan Form</h1>
          </div>
          <button
            onClick={() => playHelp("Kripya step by step form bharein.")}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 active:scale-95"
          >
            <Volume2 size={20} />
          </button>
        </div>

        <div className="flex justify-between items-center px-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? "bg-white text-green-700 scale-110"
                  : "bg-green-800 text-green-400"
              }`}
            >
              {step > s ? <Check size={16} /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* STEP 1: ELIGIBILITY */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Step 1: Eligibility Check
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600"
                  defaultChecked
                />
                <span className="text-gray-700 text-sm">
                  I am an Indian Farmer
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600"
                  defaultChecked
                />
                <span className="text-gray-700 text-sm">
                  I own less than 2 Hectares land
                </span>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
            >
              Confirm & Proceed
            </button>
          </div>
        )}

        {/* STEP 2: AADHAAR ENTRY */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Step 2: Identity Details
            </h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">
                Aadhaar Number (12 digits)
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="0000 0000 0000"
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500"
                  maxLength={12}
                  value={formData.aadhaar}
                  onChange={(e) =>
                    setFormData({ ...formData, aadhaar: e.target.value })
                  }
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
              <p className="text-xs text-orange-500 mt-2">
                🔒 Simulation Mode: Enter any 12 digits
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
            >
              Verify Identity
            </button>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOAD */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Step 3: Land Record
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Take a photo of your land document (7/12).
            </p>

            <div
              onClick={() => setFormData({ ...formData, hasUploaded: true })}
              className={`border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition ${
                formData.hasUploaded
                  ? "bg-green-50 border-green-500"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {formData.hasUploaded ? (
                <>
                  <Check className="text-green-600 mb-2" size={32} />
                  <span className="text-green-700 font-bold">
                    Photo Uploaded!
                  </span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-gray-500 font-medium">
                    Tap to Upload Photo
                  </span>
                </>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-4 text-center flex justify-center items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
            >
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
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Review Application
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Ensure all details are correct.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Scheme:</span>
                <span className="font-bold text-gray-800">PM Kisan Nidhi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Aadhaar:</span>
                <span className="font-bold text-gray-800">
                  {formData.aadhaar}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Documents:</span>
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <Check size={14} /> Uploaded
                </span>
              </div>
            </div>

            <button
              onClick={submitForm}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition transform active:scale-95"
            >
              Submit Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormSim;
