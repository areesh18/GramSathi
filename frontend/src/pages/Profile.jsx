import React, { useEffect, useState } from 'react';
import { User, MapPin, Award, Download, Share2 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Profile fetch error", err));
  }, []);

  if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
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
               <p className="text-blue-200 font-medium mb-1">Digital Literacy Score</p>
               <h3 className="text-5xl font-bold">{user.total_score} <span className="text-2xl opacity-70">/ 100</span></h3>
               <p className="mt-4 text-sm opacity-90">
                 {user.total_score > 0 ? "You are doing great! Keep learning." : "Start your first lesson to earn points."}
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
            <div className="bg-white border-8 border-double border-yellow-600 p-8 rounded-lg shadow-2xl text-center relative flex-1 flex flex-col justify-center">
              <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="text-white" size={32} />
              </div>
              
              <h2 className="font-serif text-3xl font-bold text-gray-800 mb-2">Certificate of Completion</h2>
              <p className="text-gray-500 italic mb-6">This is to certify that</p>
              <h1 className="text-4xl font-bold text-blue-800 mb-6 font-serif">{user.name}</h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Has successfully demonstrated proficiency in <b>Digital Financial Literacy (UPI)</b> on GramSathi Platform.
              </p>
              
              <div className="flex justify-center gap-12 text-sm font-bold text-gray-400">
                <div className="border-t border-gray-300 pt-2 w-32">Date</div>
                <div className="border-t border-gray-300 pt-2 w-32">Signature</div>
              </div>

              <div className="mt-8 flex gap-4 justify-center">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition">
                  <Download size={18} /> Download
                </button>
                <button className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold hover:bg-green-200 transition">
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
    </div>
  );
};

export default Profile;