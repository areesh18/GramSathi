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

  // --- NEW: Analytics Helper ---
  const logActivity = async (action) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) return;

    const payload = {
      user_id: storedUser.id,
      module_id: "sim_pm_kisan",
      action: action,
    };

    if (!navigator.onLine) return;

    try {
      await fetch("http://localhost:8080/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Logging failed", err);
    }
  };

  useEffect(() => {
    playHelp("Pradhan Mantri Kisan Yojana form mein swagat hai.");
    logActivity("started");
  }, []);

  const handleNext = () => {
    setError("");

    if (step === 2 && formData.aadhaar.length < 12) {
      const msg = "Aadhaar number 12 ank ka hona chahiye.";
      setError(msg);
      playHelp(msg);
      logActivity("failed_aadhaar_validation");
      return;
    }

    if (step === 3 && !formData.hasUploaded) {
      const msg = "Kripya pehle zameen ke kagaz ki photo upload karein.";
      setError(msg);
      playHelp(msg);
      logActivity("failed_upload_validation");
      return;
    }

    setStep(step + 1);

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

    logActivity("completed");

    if (!navigator.onLine) {
      saveOfflineAction("/api/progress", "POST", payload);
      alert(
        "📝 Form Saved Offline! It will submit automatically when internet returns."
      );
    } else {
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
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                PM Kisan Form
              </h1>
              <p className="text-xs text-gray-500">Step {step} of 4</p>
            </div>
          </div>
          <button
            onClick={() => playHelp("Kripya step by step form bharein.")}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Volume2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= s
                    ? "bg-green-600 text-white scale-110"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? "bg-green-600" : "bg-gray-100"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto">
        {/* STEP 1: ELIGIBILITY */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 1: Eligibility Check
            </h2>
            <p className="text-sm text-gray-600 mb-6 font-light">
              Confirm you meet the basic requirements
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded"
                  defaultChecked
                />
                <span className="text-gray-700 text-sm font-light">
                  I am an Indian Farmer
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-600 rounded"
                  defaultChecked
                />
                <span className="text-gray-700 text-sm font-light">
                  I own less than 2 Hectares land
                </span>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Confirm & Proceed
            </button>
          </div>
        )}

        {/* STEP 2: AADHAAR ENTRY */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 2: Identity Details
            </h2>
            <p className="text-sm text-gray-600 mb-6 font-light">
              Enter your Aadhaar number for verification
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-50 transition-all"
                  maxLength={12}
                  value={formData.aadhaar}
                  onChange={(e) =>
                    setFormData({ ...formData, aadhaar: e.target.value })
                  }
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
              <p className="text-xs text-orange-600 mt-2 font-medium">
                🔒 Simulation Mode: Enter any 12 digits
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Verify Identity
            </button>
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOAD */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Step 3: Land Record
            </h2>
            <p className="text-gray-600 text-sm mb-6 font-light">
              Take a photo of your land document (7/12).
            </p>

            <div
              onClick={() => setFormData({ ...formData, hasUploaded: true })}
              className={`border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all ${
                formData.hasUploaded
                  ? "bg-green-50 border-green-500"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {formData.hasUploaded ? (
                <>
                  <Check className="text-green-600 mb-2" size={32} />
                  <span className="text-green-700 font-medium text-sm">
                    Photo Uploaded!
                  </span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-gray-500 font-medium text-sm">
                    Tap to Upload Photo
                  </span>
                </>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-4 text-center flex justify-center items-center gap-1 font-medium">
                <AlertCircle size={12} /> {error}
              </p>
            )}

            <button
              onClick={handleNext}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Next Step
            </button>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-100">
              <FileText className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Review Application
            </h2>
            <p className="text-gray-600 text-sm mb-6 font-light">
              Ensure all details are correct.
            </p>

            <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3 mb-6 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Scheme:</span>
                <span className="font-medium text-gray-900 text-sm">
                  PM Kisan Nidhi
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Aadhaar:</span>
                <span className="font-medium text-gray-900 text-sm">
                  {formData.aadhaar}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Documents:</span>
                <span className="text-green-600 font-medium flex items-center gap-1 text-sm">
                  <Check size={14} /> Uploaded
                </span>
              </div>
            </div>

            <button
              onClick={submitForm}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-medium shadow-sm hover:bg-green-700 transition-colors"
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
