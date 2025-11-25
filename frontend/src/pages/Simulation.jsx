import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Check, Smartphone, CreditCard } from "lucide-react";

const UPISimulation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const handleComplete = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8080/api/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- THE KEY CHANGE
        },
        body: JSON.stringify({
          user_id: storedUser.id, // Use real ID
          module_id: 'upi',
          points: 50
        })
      });

      if (response.ok) {
        alert("🎉 Success! 50 Points Added to your Profile.");
        navigate("/");
      } else {
        alert("Error saving progress");
      }
    } catch (error) {
      console.error("Backend offline?", error);
      alert("Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center md:p-8">
      <div className="w-full max-w-md bg-gray-50 md:rounded-3xl md:shadow-2xl md:border-8 md:border-gray-800 overflow-hidden min-h-screen md:min-h-[800px] md:h-[800px] relative flex flex-col">
        {/* Top Bar */}
        <div className="bg-blue-700 p-4 text-white flex items-center gap-3 shadow-md z-10">
          <button onClick={() => navigate("/")}>
            <ArrowLeft />
          </button>
          <h1 className="font-bold">Practice Mode</h1>
        </div>

        {/* --- STEP 1: SCANNER INSTRUCTION --- */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="mb-8 p-4 bg-yellow-100 text-yellow-800 rounded-xl border border-yellow-300 shadow-sm">
              👇 <span className="font-bold">Task:</span> Tap the button below
              to open the camera.
            </div>

            <div className="w-64 h-64 bg-gray-200 rounded-3xl border-4 border-dashed border-gray-400 flex items-center justify-center mb-8 relative">
              <Smartphone size={48} className="text-gray-400" />

              {/* The "Guide" Button */}
              <button
                onClick={() => setStep(2)}
                className="absolute -bottom-6 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-transform flex items-center gap-2"
              >
                <Camera size={20} />
                Tap to Scan
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: FAKE CAMERA VIEW --- */}
        {step === 2 && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div className="text-white mb-8 text-xl font-bold bg-black/50 px-4 py-1 rounded-full">
              Align QR Code
            </div>

            <div
              onClick={() => setStep(3)}
              className="w-72 h-72 border-4 border-green-500 rounded-3xl bg-white/10 backdrop-blur-sm cursor-pointer relative overflow-hidden group"
            >
              {/* Fake QR */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=GramSathiDemo"
                alt="Scan Me"
                className="opacity-80 w-full h-full p-6"
              />

              {/* Click Hint Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-active:bg-black/20">
                <span className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg scale-110 animate-pulse">
                  Tap QR to Scan
                </span>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-12 text-white opacity-70"
            >
              Cancel
            </button>
          </div>
        )}

        {/* --- STEP 3: PAYMENT AMOUNT --- */}
        {step === 3 && (
          <div className="p-6 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border-2 border-white shadow-sm">
                🏪
              </div>
              <h2 className="font-bold text-xl text-gray-800">
                Raju Kirana Store
              </h2>
              <p className="text-gray-500 text-sm">
                raju@upi • Verified Merchant
              </p>
            </div>

            <div className="text-center mb-8">
              <label className="text-gray-500 text-sm font-medium">
                Enter Amount
              </label>
              <div className="flex justify-center items-center gap-2 mt-4">
                <span className="text-4xl font-bold text-gray-800">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-5xl font-bold w-40 border-b-2 border-gray-300 focus:border-blue-600 outline-none text-center bg-transparent pb-2 placeholder-gray-200"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <button
              disabled={!amount}
              onClick={() => setStep(4)}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all active:scale-95 ${
                amount ? "bg-blue-600" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Proceed to Pay
            </button>
          </div>
        )}

        {/* --- STEP 4: PIN ENTRY (Fake Keypad) --- */}
        {step === 4 && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-6 bg-gray-50 flex-1 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3">
                <CreditCard className="text-blue-600" />
                <span className="font-bold text-gray-700">
                  State Bank of India ****8892
                </span>
              </div>
              <h3 className="font-bold text-lg mb-8 text-gray-800">
                Enter 4-Digit UPI PIN
              </h3>

              <div className="flex gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                      pin.length > i
                        ? "bg-black scale-125"
                        : "border-2 border-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Custom Number Pad */}
            <div className="grid grid-cols-3 bg-gray-100 pb-8 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    const newPin = pin + num;
                    if (newPin.length <= 4) setPin(newPin);
                    if (newPin.length === 4) setTimeout(() => setStep(5), 300);
                  }}
                  className="p-6 text-2xl font-semibold active:bg-gray-200 text-gray-800"
                >
                  {num}
                </button>
              ))}
              <div className="p-6"></div>
              <button
                onClick={() => {
                  const newPin = pin + "0";
                  if (newPin.length <= 4) setPin(newPin);
                  if (newPin.length === 4) setTimeout(() => setStep(5), 300);
                }}
                className="p-6 text-2xl font-semibold active:bg-gray-200 text-gray-800"
              >
                0
              </button>
              <button
                className="p-6 flex items-center justify-center text-gray-600 active:bg-gray-200"
                onClick={() => setPin(pin.slice(0, -1))}
              >
                <ArrowLeft size={24} />
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 5: SUCCESS --- */}
        {step === 5 && (
          <div className="fixed inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white p-6 animate-in zoom-in duration-300">
            <div className="bg-white text-green-600 p-6 rounded-full mb-6 shadow-2xl scale-110">
              <Check size={64} strokeWidth={4} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="opacity-90 mb-12 text-green-100">
              Transaction ID: #839201
            </p>

            <div className="bg-green-700/50 p-4 rounded-xl w-full max-w-sm mb-8 border border-green-500/30 backdrop-blur-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-90 font-medium">
                  Reward Earned
                </span>
                <span className="font-bold text-yellow-300 text-lg">
                  ★ 50 pts
                </span>
              </div>
              <div className="h-3 bg-green-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-3/4 animate-pulse"></div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="bg-white text-green-700 w-full max-w-sm py-4 rounded-xl font-bold shadow-xl hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UPISimulation;
