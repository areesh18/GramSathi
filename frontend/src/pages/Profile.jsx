import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Award,
  Download,
  Share2,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = ({ onReplayTutorial }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Download certificate as image
  const handleDownloadCertificate = () => {
    const certificate = document.getElementById("certificate-container");

    // Use html2canvas if available, otherwise provide alternative
    if (window.html2canvas) {
      window
        .html2canvas(certificate, {
          scale: 2,
          backgroundColor: "#ffffff",
          logging: false,
        })
        .then((canvas) => {
          const link = document.createElement("a");
          link.download = `GramSathi_Certificate_${user.name.replace(
            /\s+/g,
            "_"
          )}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });
    } else {
      // Fallback: Create a printable version
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${user.name}</title>
            <style>
              body { 
                font-family: serif; 
                padding: 40px;
                margin: 0;
              }
              .cert {
                border: 8px double #d97706;
                padding: 60px;
                text-align: center;
                max-width: 800px;
                margin: 0 auto;
                position: relative;
              }
              .badge {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                background: #eab308;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
              }
              h1 { font-size: 36px; margin: 20px 0; }
              .name { font-size: 48px; color: #1e40af; margin: 30px 0; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="cert">
              <div class="badge">🏆</div>
              <h1>Certificate of Completion</h1>
              <p style="font-style: italic; color: #666;">This is to certify that</p>
              <div class="name">${user.name}</div>
              <p style="color: #666; margin: 30px auto; max-width: 500px;">
                Has successfully demonstrated proficiency in <b>Digital Financial Literacy (UPI)</b> 
                on GramSathi Platform.
              </p>
              <div style="margin-top: 60px; display: flex; justify-content: space-around; max-width: 400px; margin-left: auto; margin-right: auto;">
                <div style="border-top: 2px solid #ccc; padding-top: 10px; width: 150px;">
                  <small>Date</small>
                </div>
                <div style="border-top: 2px solid #ccc; padding-top: 10px; width: 150px;">
                  <small>Signature</small>
                </div>
              </div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Share certificate (Web Share API)
  const handleShareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GramSathi Certificate",
          text: `I've completed Digital Literacy training on GramSathi! Score: ${user.total_score}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: Copy link to clipboard
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
                <span>ID: #98220192</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-200 font-medium mb-1">
                Digital Literacy Score
              </p>
              <h3 className="text-5xl font-bold">
                {user.total_score}{" "}
                <span className="text-2xl opacity-70"></span>
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

        {/* Right: The Certificate (Only shows if score > 0) */}
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Award className="text-orange-500" /> Achievements
          </h3>

          {user.total_score > 0 ? (
            <div
              id="certificate-container"
              className="bg-white border-8 border-double border-yellow-600 p-8 rounded-lg shadow-2xl text-center relative flex-1 flex flex-col justify-center"
            >
              <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="text-white" size={32} />
              </div>

              <h2 className="font-serif text-3xl font-bold text-gray-800 mb-2">
                Certificate of Completion
              </h2>
              <p className="text-gray-500 italic mb-6">
                This is to certify that
              </p>
              <h1 className="text-4xl font-bold text-blue-800 mb-6 font-serif">
                {user.name}
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Has successfully demonstrated proficiency in{" "}
                <b>Digital Financial Literacy (UPI)</b> on GramSathi Platform.
              </p>

              <div className="flex justify-center gap-12 text-sm font-bold text-gray-400">
                <div className="border-t border-gray-300 pt-2 w-32">Date</div>
                <div className="border-t border-gray-300 pt-2 w-32">
                  Signature
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={handleDownloadCertificate}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition active:scale-95"
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
            <div className="bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-64 text-gray-400">
              <Award size={48} className="mb-4 opacity-50" />
              <p>Complete a lesson to unlock your certificate</p>
            </div>
          )}
        </div>
      </div>

      {/* SETTINGS & LOGOUT (Visible mainly on Mobile) */}
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
