import React, { useState, useEffect } from "react";
import { Play, Award, X, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// --- CONFIGURATION ---
// ⚠️ REPLACE THIS WITH YOUR ACTUAL YOUTUBE API KEY
const API_KEY = "AIzaSyCr-0u1FNWVVytFxva7--nFwrBhL1NT0g8"; 

const courses = [
  {
    id: 1,
    title: "How to use BHIM UPI",
    thumb: "https://img.youtube.com/vi/rLgBVCxHTN4/0.jpg",
    videoId: "rLgBVCxHTN4", // Extracted Video ID
    tag: "Finance",
  },
  {
    id: 2,
    title: "DigiLocker Tutorial",
    thumb: "https://img.youtube.com/vi/McPUIdY8Zjs/0.jpg",
    videoId: "McPUIdY8Zjs",
    tag: "Gov Tools",
  },
  {
    id: 3,
    title: "Apply for PM Kisan",
    thumb: "https://img.youtube.com/vi/eaD5iRiTh94/0.jpg",
    videoId: "eaD5iRiTh94",
    tag: "Agriculture",
  },
  {
    id: 4,
    title: "Cyber Safety Basics",
    thumb: "https://img.youtube.com/vi/iGqQahWV-xA/0.jpg",
    videoId: "iGqQahWV-xA",
    tag: "Security",
  },
];

// --- HELPER: ISO 8601 Duration Parser (PT5M30S -> 5:30) ---
const parseDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] || "").replace("H", "");
  const minutes = (match[2] || "").replace("M", "");
  const seconds = (match[3] || "").replace("S", "");

  let result = "";
  if (hours) result += `${hours}:`;
  result += `${minutes || "0"}:`;
  result += seconds.length === 1 ? `0${seconds}` : (seconds || "00");

  return result;
};

const Learn = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [durations, setDurations] = useState({}); // Store fetched durations

  // --- FETCH DURATIONS ON LOAD ---
  useEffect(() => {
    const fetchDurations = async () => {
      // 1. Collect all Video IDs
      const videoIds = courses.map((c) => c.videoId).join(",");

      // 2. Call YouTube API (Batch Request)
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items) {
          const newDurations = {};
          data.items.forEach((item) => {
            newDurations[item.id] = parseDuration(item.contentDetails.duration);
          });
          setDurations(newDurations);
        }
      } catch (error) {
        console.error("Failed to fetch video durations:", error);
      }
    };

    if (API_KEY !== "YOUR_YOUTUBE_API_KEY") {
      fetchDurations();
    }
  }, []);

  // Close modal on 'Escape' key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans pb-24">
      <div className="bg-purple-700 p-8 rounded-3xl text-white shadow-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">GramPathshala 📚</h1>
        <p className="text-purple-200">Watch, Learn, and Earn Certificates.</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Featured Courses</h2>
        <Link
          to="/learn/quiz"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-green-700 transition flex items-center gap-2"
        >
          <Award size={18} /> Take Literacy Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveVideo(c.videoId)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer"
          >
            <div className="relative aspect-video bg-gray-200">
              <img
                src={c.thumb}
                alt={c.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition">
                <div className="bg-white/90 p-3 rounded-full shadow-lg scale-100 group-hover:scale-110 transition">
                  <Play className="text-red-600 fill-current" size={24} />
                </div>
              </div>
            </div>
            <div className="p-5">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                {c.tag}
              </span>
              <h3 className="font-bold text-gray-800 text-lg mt-2 group-hover:text-blue-700">
                {c.title}
              </h3>
              
              {/* DYNAMIC DURATION DISPLAY */}
              <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                <Clock size={14} />
                <span>
                  {durations[c.videoId] ? `${durations[c.videoId]} mins` : "Loading..."}
                </span>
                <span>•</span>
                <span>Hindi</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- VIDEO MODAL --- */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full text-whiteZS transition z-[60] border border-white/20"
            >
              <X size={24} />
            </button>

            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;