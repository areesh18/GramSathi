import React, { useState } from "react";
import {
  ArrowLeft,
  Video,
  Phone,
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [booking, setBooking] = useState(null); // Track booking state

  const doctors = [
    {
      id: 1,
      name: "Dr. Rajesh Gupta",
      type: "General Physician",
      exp: "15 yrs",
      lang: "Hindi, English",
      status: "Available",
      isOnline: true,
    },
    {
      id: 2,
      name: "Dr. Sunita Devi",
      type: "Gynecologist",
      exp: "12 yrs",
      lang: "Hindi, Bhojpuri",
      status: "Busy",
      isOnline: true,
    },
    {
      id: 3,
      name: "Dr. Anil Kumar",
      type: "Pediatrician",
      exp: "8 yrs",
      lang: "Hindi",
      status: "Offline",
      isOnline: false,
    },
    {
      id: 4,
      name: "Govt. PHC Center",
      type: "Emergency",
      exp: "24/7",
      lang: "Hindi",
      status: "Open",
      isOnline: false,
      isHospital: true,
    },
  ];

  const handleConnect = (doc) => {
    setBooking(doc.id);
    // Simulate API delay
    setTimeout(() => {
      alert(
        `✅ Appointment Confirmed!\n\nDoctor: ${doc.name}\nTime: Today, 4:30 PM\nToken: #GR-992`
      );
      setBooking(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="bg-blue-700 p-6 rounded-2xl text-white shadow-lg mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">GramChikitsa 🩺</h1>
            <p className="text-blue-100 text-sm">
              Consult doctors from your home
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {["All", "General", "Women", "Child"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
              filter === f
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors
          .filter((d) => filter === "All" || d.type.includes(filter))
          .map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden"
            >
              {/* Status Badge */}
              <div
                className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                  doc.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    doc.status === "Available"
                      ? "bg-green-600 animate-pulse"
                      : "bg-orange-500"
                  }`}
                ></div>
                {doc.status}
              </div>

              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm ${
                    doc.isHospital
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {doc.isHospital ? "🏥" : "👨‍⚕️"}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {doc.name}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    {doc.type}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {doc.exp} • {doc.lang}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {doc.isOnline ? (
                  <button
                    onClick={() => handleConnect(doc)}
                    disabled={booking === doc.id}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                      booking === doc.id
                        ? "bg-gray-100 text-gray-500"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200"
                    }`}
                  >
                    {booking === doc.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Video size={18} />
                    )}
                    {booking === doc.id ? "Booking..." : "Consult Now"}
                  </button>
                ) : (
                  <button className="flex-1 bg-gray-100 text-gray-400 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    <Calendar size={18} /> Book Later
                  </button>
                )}
                <button className="px-4 bg-green-50 text-green-600 rounded-xl border border-green-100 hover:bg-green-100 transition">
                  <Phone size={20} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Doctors;
