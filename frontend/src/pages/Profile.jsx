import React, { useEffect, useState, useRef } from "react";
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
import * as htmlToImage from 'html-to-image';

const CERT_TYPES = {
  upi_payment: {
    title: "Digital Financial Literacy",
    subtitle: "Unified Payments Interface (UPI)",
    desc: "Has successfully demonstrated proficiency in safe digital payments.",
    color: "text-blue-700",
    borderColor: "border-blue-500",
  },
  sim_pm_kisan: {
    title: "E-Governance Services",
    subtitle: "PM Kisan Samman Nidhi",
    desc: "Has successfully learned to navigate and apply for government schemes.",
    color: "text-green-700",
    borderColor: "border-green-500",
  },
  quiz_literacy_101: {
    title: "Cyber Safety Awareness",
    subtitle: "Internet Safety Basics",
    desc: "Has passed the fundamental assessment on digital security.",
    color: "text-purple-700",
    borderColor: "border-purple-500",
  },
  sim_digilocker: {
    title: "Digital Documentation",
    subtitle: "DigiLocker",
    desc: "Is proficient in accessing and managing official documents.",
    color: "text-indigo-700",
    borderColor: "border-indigo-500",
  },
  grievance_filed: {
    title: "Active Citizenship",
    subtitle: "Grievance Redressal",
    desc: "Has reported civic issues using digital tools.",
    color: "text-rose-700",
    borderColor: "border-rose-500",
  },
};

const Profile = ({ onReplayTutorial }) => {
  const [user, setUser] = useState(null);
  const [currentCertIndex, setCurrentCertIndex] = useState(0);
  const certificateRef = useRef();
  const navigate = useNavigate();

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- DOWNLOAD CERTIFICATE ---
  const handleDownloadCertificate = async () => {
  const dataUrl = await htmlToImage.toPng(certificateRef.current, {
    quality: 1,
  });
  const link = document.createElement('a');
  link.download = "certificate.png";
  link.href = dataUrl;
  link.click();
};

  const handleShareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: "GramSathi Certificate",
        text: "I earned a digital literacy certificate!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard");
    }
  };

  // --- FETCH USER ---
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!u || !token) return;

    fetch(`http://localhost:8080/api/user/${u.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

  // --- FILTER USER BADGES ---
  const userCertificates = (user.badges || [])
    .filter((c) => CERT_TYPES[c])
    .map((c) => ({ id: c, ...CERT_TYPES[c] }));

  const currentCert = userCertificates[currentCertIndex];

  const nextCert = () =>
    setCurrentCertIndex((prev) => (prev + 1) % userCertificates.length);

  const prevCert = () =>
    setCurrentCertIndex((prev) =>
      prev === 0 ? userCertificates.length - 1 : prev - 1
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans pb-24">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        My Identity 🇮🇳
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          {/* USER CARD */}
          <div className="bg-white p-5 rounded-xl border flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 text-3xl flex items-center justify-center font-bold">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="flex gap-2 items-center text-gray-600 text-sm mt-1">
                <MapPin size={14} /> {user.village}
              </p>
              <p className="flex gap-2 items-center text-gray-600 text-sm mt-1">
                <User size={14} /> ID: #98220{user.id}
              </p>
            </div>
          </div>

          {/* SCORE BOX */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 rounded-xl">
            <p className="text-sm opacity-90">Digital Literacy Points</p>
            <h3 className="text-4xl font-bold mt-2">
              {user.total_score}
              <span className="text-lg opacity-80 ml-1">pts</span>
            </h3>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold flex gap-2 items-center text-gray-700">
              <Award className="text-orange-500" /> Achievements
            </h3>

            {userCertificates.length > 1 && (
              <span className="text-xs text-gray-500">
                {currentCertIndex + 1}/{userCertificates.length}
              </span>
            )}
          </div>

          {/* ---- CERT ---- */}
          {userCertificates.length > 0 ? (
            <>
              <div className="relative">
                {/* NAV BUTTONS */}
                {userCertificates.length > 1 && (
                  <>
                    <button
                      onClick={prevCert}
                      className="absolute left-[-6px] top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextCert}
                      className="absolute right-[-6px] top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* CERTIFICATE FRAME */}
                <div
                  ref={certificateRef}
                  className={`bg-white border-4 ${currentCert.borderColor} p-6 rounded-lg shadow-sm flex flex-col items-center text-center min-h-[350px] md:min-h-[420px]`}
                >
                  <h2 className="text-xl font-bold font-serif">
                    Certificate of Completion
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    This is to certify that
                  </p>

                  <h1 className="text-2xl mt-2 font-bold text-gray-900 font-serif">
                    {user.name}
                  </h1>

                  <p className="text-gray-600 text-xs uppercase tracking-widest mt-2">
                    has demonstrated proficiency in
                  </p>

                  <h3 className={`${currentCert.color} text-lg font-bold mt-3`}>
                    {currentCert.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {currentCert.subtitle}
                  </p>

                  <p className="text-gray-600 text-sm mt-5 px-3 leading-relaxed">
                    {currentCert.desc}
                  </p>

                  <div className="flex justify-center gap-10 mt-auto pt-4 w-full text-sm">
                    <div className="border-t w-24 pt-1 text-gray-500">Date</div>
                    <div className="border-t w-24 pt-1 text-gray-500">
                      Signature
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 flex-wrap justify-center mt-3">
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg flex gap-2 items-center text-sm hover:bg-blue-700"
                >
                  <Download size={18} /> Download
                </button>

                <button
                  onClick={handleShareCertificate}
                  className="bg-green-100 text-green-700 px-5 py-2 rounded-lg flex gap-2 items-center text-sm hover:bg-green-200"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </>
          ) : (
            <div className="border border-dashed rounded-xl p-8 text-center text-gray-500">
              <Award size={48} className="mx-auto mb-3" />
              Complete a lesson to unlock your first certificate!
            </div>
          )}
        </div>
      </div>

      {/* ===== Logout Always Visible ===== */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-5 py-2 rounded-lg hover:bg-red-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
