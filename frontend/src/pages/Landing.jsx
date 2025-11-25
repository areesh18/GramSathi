import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Smartphone, BarChart3, Globe, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">G</div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">GramSathi</span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#impact" className="hover:text-blue-600 transition">Impact</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-full border border-gray-200 transition">
              Login
            </Link>
            <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg shadow-blue-200 transition hidden sm:block">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Live in 4 Districts
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
            Digital Empowerment for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Rural India</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between technology and the village. We provide interactive simulations, vernacular learning, and real-time governance analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Learning Now <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <Shield size={20} /> For Officials
            </Link>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60"></div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for the Next Billion Users</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">We removed the fear of technology by replacing text with interactive, gamified simulations.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Smartphone className="text-blue-600" size={32} />}
              title="Interactive Simulations"
              desc="Don't just watch videos. Practice UPI payments, filling forms, and booking tickets in a safe, risk-free sandbox."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-purple-600" size={32} />}
              title="Real-time Analytics"
              desc="Government officials get a live dashboard tracking digital literacy rates at the village level instantly."
            />
            <FeatureCard 
              icon={<Globe className="text-green-600" size={32} />}
              title="Vernacular First"
              desc="Designed for rural dialects. Voice-enabled navigation and local language support for seamless adoption."
            />
          </div>
        </div>
      </section>

      {/* --- TRUST / STATS --- */}
      <section className="py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-12">
          <Stat number="50,000+" label="Villagers Trained" />
          <Stat number="12" label="Active Districts" />
          <Stat number="4.8/5" label="User Trust Score" />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <span className="text-xl font-bold text-white">GramSathi</span>
          </div>
          <p className="text-sm">© 2024 GramSathi Foundation. Built for the Hackathon.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group">
    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="text-center">
    <h4 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{number}</h4>
    <p className="text-gray-500 font-medium uppercase tracking-wide text-sm">{label}</p>
  </div>
);

export default Landing;