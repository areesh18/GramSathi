import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Award,
  Download,
  Share2,
  LogOut,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mapping module IDs to Certificate Data
const CERT_TYPES = {
  upi_payment: {
    title: "Digital Financial Literacy",
    subtitle: "Unified Payments Interface (UPI)",
    desc: "Has successfully demonstrated proficiency in safe digital payments.",
    color: "text-blue-800",
    border: "border-blue-600",
  },
  sim_pm_kisan: {
    title: "E-Governance Services",
    subtitle: "PM Kisan Samman Nidhi",
    desc: "Has successfully learned to navigate and apply for government schemes.",
    color: "text-green-800",
    border: "border-green-600",
  },
  quiz_literacy_101: {
    title: "Cyber Safety Awareness",
    subtitle: "Internet Safety Basics",
    desc: "Has passed the fundamental assessment on digital security and fraud prevention.",
    color: "text-purple-800",
    border: "border-purple-600",
  },
  sim_digilocker: {
    title: "Digital Documentation",
    subtitle: "DigiLocker Management",
    desc: "Is proficient in accessing and managing official digital documents.",
    color: "text-indigo-800",
    border: "border-indigo-600",
  },
  grievance_filed: {
    title: "Active Citizenship",
    subtitle: "Public Grievance Redressal",
    desc: "Has taken initiative to report village issues using digital tools.",
    color: "text-rose-800",
    border: "border-rose-600",
  },
};

const Profile = ({ onReplayTutorial }) => {
  const [user, setUser] = useState(null);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDownloadCertificate = () => {
    const certificate = document.getElementById("certificate-container");
    if (window.html2canvas) {
      window
        .html2canvas(certificate, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = `GramSathi_Cert_${user.name.replace(
            /\s+/g,
            "_"
          )}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
    } else {
      window.print();
    }
  };

  const handleShareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GramSathi Certificate",
          text: `I've completed Digital Literacy training on GramSathi! Total Points: ${user.total_score}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("✅ Profile link copied to clipboard!");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      fetch(`http://localhost:8080/api/user/${storedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error("Profile fetch error", err));
    }
  }, []);

  if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

  // Filter user badges to only those we have certificates for
  const userCertificates = (user.badges || [])
    .filter((badgeId) => CERT_TYPES[badgeId])
    .map((badgeId) => ({ id: badgeId, ...CERT_TYPES[badgeId] }));

  const currentCert = userCertificates[currentCertIndex];

  const nextCert = () => {
    setCurrentCertIndex((prev) => (prev + 1) % userCertificates.length);
  };

  const prevCert = () => {
    setCurrentCertIndex((prev) =>
      prev === 0 ? userCertificates.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Identity 🇮🇳</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: User Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin size={16} />
                <span>{user.village}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <User size={16} />
                <span>ID: #98220{user.id}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-200 font-medium mb-1">
                Digital Literacy Points
              </p>
              <h3 className="text-5xl font-bold">
                {user.total_score}{" "}
                <span className="text-2xl opacity-70">Pts</span>
              </h3>
              <p className="mt-4 text-sm opacity-90">
                {user.total_score > 0
                  ? "You are doing great! Keep learning."
                  : "Start your first lesson to earn points."}
              </p>
            </div>
            <Award className="absolute right-[-20px] bottom-[-20px] text-blue-500/30 w-48 h-48" />
          </div>
        </div>

        {/* Right: The Certificate Carousel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Award className="text-orange-500" /> Achievements
            </h3>
            {userCertificates.length > 1 && (
              <span className="text-xs text-gray-500 font-medium">
                {currentCertIndex + 1} / {userCertificates.length}
              </span>
            )}
          </div>

          {userCertificates.length > 0 ? (
            <div className="relative">
              {/* Navigation Buttons */}
              {userCertificates.length > 1 && (
                <>
                  <button
                    onClick={prevCert}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white shadow-lg rounded-full p-2 text-gray-600 hover:text-blue-600 z-10 border border-gray-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextCert}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white shadow-lg rounded-full p-2 text-gray-600 hover:text-blue-600 z-10 border border-gray-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div
                id="certificate-container"
                className={`bg-white border-8 border-double ${
                  currentCert.border.replace("text", "border") ||
                  "border-yellow-600"
                } p-8 rounded-lg shadow-2xl text-center relative flex-1 flex flex-col justify-center min-h-[400px] animate-in fade-in duration-300`}
              >
                <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="text-white" size={32} />
                </div>

                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                  Certificate of Completion
                </h2>
                <p className="text-gray-500 italic mb-6">
                  This is to certify that
                </p>
                <h1 className="text-3xl font-bold text-blue-800 mb-4 font-serif">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-2 text-sm uppercase tracking-widest">
                  Has successfully demonstrated proficiency in
                </p>
                <h3 className={`text-xl font-bold ${currentCert.color} mb-1`}>
                  {currentCert.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  {currentCert.subtitle}
                </p>

                <div className="flex justify-center gap-12 text-sm font-bold text-gray-400 mt-auto">
                  <div className="border-t border-gray-300 pt-2 w-24">Date</div>
                  <div className="border-t border-gray-300 pt-2 w-24">
                    Signature
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={handleDownloadCertificate}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition active:scale-95 shadow-md"
                >
                  <Download size={18} /> Download
                </button>
                <button
                  onClick={handleShareCertificate}
                  className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold hover:bg-green-200 transition active:scale-95"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-64 text-gray-400 p-6 text-center">
              <Award size={48} className="mb-4 opacity-50" />
              <p>Complete a lesson to unlock your first certificate!</p>
              <button
                onClick={() => navigate("/services")}
                className="mt-4 text-blue-600 font-bold text-sm hover:underline"
              >
                Go to Practice Mode
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SETTINGS & LOGOUT (Mobile) */}
      <div className="mt-10 pt-6 border-t border-gray-200 space-y-4 md:hidden">
        {onReplayTutorial && (
          <button
            onClick={onReplayTutorial}
            className="w-full flex items-center justify-center gap-2 bg-purple-50 text-purple-600 py-4 rounded-xl font-bold shadow-sm active:scale-95 transition"
          >
            <RefreshCw size={20} /> Replay Tutorial
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-xl font-bold shadow-sm active:scale-95 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Load html2canvas library dynamically */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    </div>
  );
};

export default Profile;
