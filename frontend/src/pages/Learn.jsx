import React from "react";
import { Play } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "How to use BHIM UPI",
    thumb: "https://img.youtube.com/vi/v5z2d8I5-wI/0.jpg",
    tag: "Finance",
  },
  {
    id: 2,
    title: "DigiLocker Tutorial",
    thumb: "https://img.youtube.com/vi/3Ww22k9_bYI/0.jpg",
    tag: "Gov Tools",
  },
  {
    id: 3,
    title: "Apply for PM Kisan",
    thumb: "https://img.youtube.com/vi/h22j8Q3fT8I/0.jpg",
    tag: "Agriculture",
  },
  {
    id: 4,
    title: "Cyber Safety Basics",
    thumb: "https://img.youtube.com/vi/XgW2C2Y2l0g/0.jpg",
    tag: "Security",
  },
];

const Learn = () => {
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
              <p className="text-gray-400 text-sm mt-1">10 mins • Hindi</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
