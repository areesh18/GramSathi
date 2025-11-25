import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  CreditCard,
  WifiOff,
  Wallet,
  Volume2,
} from "lucide-react";
import { saveOfflineAction, speak } from "../utils/offlineSync";

const UPISimulation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [mode, setMode] = useState("pay"); // 'pay' or 'balance'

  // Audio helper
  const playGuide = (text) => speak(text, "hi-IN");

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);

    playGuide(
      "UPI practice mein swagat hai. Shuru karne ke liye button dabayein."
    );

    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  const handlePinSubmit = (enteredPin) => {
    if (enteredPin === "1234") {
      if (mode === "pay") {
        setTimeout(() => setStep(5), 300);
      } else {
        setTimeout(() => setStep(6), 300);
      }
    } else {
      playGuide("Galat PIN. Kripya phir se koshish karein.");
      alert("Wrong PIN! Try 1234.");
      setPin("");
    }
  };

  const handleComplete = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const payload = {
      user_id: storedUser.id,
      module_id: "upi",
      points: 50,
    };

    if (!token || token === "guest-token") {
      alert("🎉 Practice Complete! (Guest Mode)");
      navigate("/");
      return;
    }

    if (isOffline) {
      saveOfflineAction("/api/progress", "POST", payload);
      alert(
        "🎉 Saved Offline! Points will add automatically when internet returns."
      );
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("🎉 Success! 50 Points Added to your Profile.");
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      console.error("Backend unreachable, queuing offline.", error);
      saveOfflineAction("/api/progress", "POST", payload);
      alert("🎉 Saved Offline! Will sync later.");
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center md:p-8">
      <div className="w-full max-w-md bg-gray-50 md:rounded-3xl md:shadow-2xl md:border-8 md:border-gray-800 overflow-hidden min-h-screen md:min-h-[800px] md:h-[800px] relative flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">
                UPI Practice Mode
              </h1>
              {isOffline && (
                <span className="text-xs text-orange-600 font-medium">
                  Offline
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => playGuide("Instruction replay...")}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Play Audio Instructions"
          >
            <Volume2 size={20} className="text-gray-600" />
          </button>
        </div>

        {/* STEP 1: HOME SCREEN */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                What do you want to learn?
              </h2>
              <p className="text-gray-600 text-sm mb-6 font-light">
                Select a task to practice safely.
              </p>

              <button
                onClick={() => {
                  setMode("pay");
                  setStep(2);
                  playGuide("Payment karne ke liye, QR code scan karein.");
                }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium shadow-sm hover:bg-blue-700 mb-3 flex items-center justify-center gap-3 transition-colors"
              >
                <Camera size={24} /> Scan & Pay
              </button>

              <button
                onClick={() => {
                  setMode("balance");
                  setStep(4);
                  playGuide("Apna PIN daalein balance check karne ke liye.");
                }}
                className="w-full bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-xl font-medium shadow-sm hover:bg-blue-50 flex items-center justify-center gap-3 transition-colors"
              >
                <Wallet size={24} /> Check Balance
              </button>
            </div>

            {isOffline && (
              <div className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                <WifiOff size={12} /> Offline Mode Active
              </div>
            )}
          </div>
        )}

        {/* STEP 2: FAKE CAMERA VIEW */}
        {step === 2 && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <div className="text-white mb-8 text-lg font-medium bg-black/50 px-4 py-2 rounded-full">
              Align QR Code
            </div>

            <div
              onClick={() => {
                setStep(3);
                playGuide("Ab amount bharein.");
              }}
              className="w-72 h-72 border-4 border-green-500 rounded-3xl bg-white/10 backdrop-blur-sm cursor-pointer relative overflow-hidden group"
            >
              <div className="w-full h-full bg-white p-6 flex items-center justify-center opacity-80">
                <div className="border-4 border-black p-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-10 h-10 bg-black"></div>
                    <div className="w-10 h-10 bg-black"></div>
                    <div className="w-10 h-10 bg-black"></div>
                    <div className="w-10 h-10 bg-gray-300"></div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-active:bg-black/20">
                <span className="bg-white text-black px-6 py-3 rounded-full font-medium shadow-lg animate-pulse">
                  Tap QR to Scan
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-12 text-white text-sm font-medium opacity-70 hover:opacity-100"
            >
              Cancel
            </button>
          </div>
        )}

        {/* STEP 3: PAYMENT AMOUNT */}
        {step === 3 && (
          <div className="p-6 flex-1 flex flex-col">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border-2 border-white shadow-sm">
                🏪
              </div>
              <h2 className="font-semibold text-xl text-gray-900">
                Raju Kirana Store
              </h2>
              <p className="text-gray-600 text-sm font-light">
                raju@upi • Verified Merchant
              </p>
            </div>

            <div className="text-center mb-8 flex-1 flex flex-col justify-center">
              <label className="text-gray-600 text-sm font-medium mb-4 block">
                Enter Amount
              </label>
              <div className="flex justify-center items-center gap-2">
                <span className="text-4xl font-semibold text-gray-900">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-5xl font-semibold w-40 border-b-2 border-gray-300 focus:border-blue-600 outline-none text-center bg-transparent pb-2 placeholder-gray-200"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <button
              disabled={!amount}
              onClick={() => {
                setStep(4);
                playGuide("Apna 4 digit ka UPI PIN enter karein.");
              }}
              className={`w-full py-4 rounded-xl font-medium text-white text-base shadow-sm transition-all ${
                amount
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Proceed to Pay
            </button>
          </div>
        )}

        {/* STEP 4: PIN ENTRY */}
        {step === 4 && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="p-6 bg-gray-50 flex-1 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6 flex items-center gap-3">
                <CreditCard className="text-blue-600" size={20} />
                <span className="font-medium text-gray-700 text-sm">
                  State Bank of India ****8892
                </span>
              </div>
              <h3 className="font-semibold text-base mb-8 text-gray-900">
                Enter 4-Digit UPI PIN
              </h3>
              <div className="flex gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                      pin.length > i
                        ? "bg-blue-600 scale-125"
                        : "border-2 border-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-4 font-light">
                Hint: Try 1234
              </p>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 bg-gray-50 border-t border-gray-100 pb-8 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    const newPin = pin + num;
                    if (newPin.length <= 4) setPin(newPin);
                    if (newPin.length === 4) {
                      setTimeout(() => handlePinSubmit(newPin), 100);
                    }
                  }}
                  className="p-6 text-2xl font-medium active:bg-gray-100 text-gray-800 transition-colors"
                >
                  {num}
                </button>
              ))}
              <div className="p-6"></div>
              <button
                onClick={() => {
                  const newPin = pin + "0";
                  if (newPin.length <= 4) setPin(newPin);
                  if (newPin.length === 4) {
                    setTimeout(() => handlePinSubmit(newPin), 100);
                  }
                }}
                className="p-6 text-2xl font-medium active:bg-gray-100 text-gray-800 transition-colors"
              >
                0
              </button>
              <button
                className="p-6 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                onClick={() => setPin(pin.slice(0, -1))}
              >
                <ArrowLeft size={24} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 5 && (
          <div className="fixed inset-0 bg-green-600 z-50 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white text-green-600 p-6 rounded-full mb-6 shadow-xl">
              <Check size={64} strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-semibold mb-2">Payment Successful!</h1>
            <p className="opacity-90 mb-12 text-green-100 text-sm">
              Transaction ID: #839201
            </p>

            <button
              onClick={handleComplete}
              className="bg-white text-green-700 w-full max-w-sm py-4 rounded-xl font-medium shadow-xl hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* STEP 6: BALANCE VIEW */}
        {step === 6 && (
          <div className="fixed inset-0 bg-blue-600 z-50 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white text-blue-600 p-6 rounded-full mb-6 shadow-xl">
              <Wallet size={64} />
            </div>
            <h1 className="text-lg font-medium mb-2 opacity-90">
              Available Balance
            </h1>
            <h2 className="text-5xl font-semibold mb-12">₹ 4,250.00</h2>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-blue-700 w-full max-w-sm py-4 rounded-xl font-medium shadow-xl hover:bg-gray-50 transition-colors"
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
