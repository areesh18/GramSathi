import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Smartphone, BarChart3, Globe } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      {/* Minimal Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              G
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight">
              GramSathi
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a href="#impact" className="hover:text-gray-900 transition-colors">
              Impact
            </a>
            <a href="#about" className="hover:text-gray-900 transition-colors">
              About
            </a>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Live in 4 Districts
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
            Digital Empowerment for
            <br className="hidden md:block" />
            <span className="block mt-2">Rural India</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Bridging the gap between technology and the village through
            interactive simulations and vernacular learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Learning <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={18} /> For Officials
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Built for the Next Billion
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light">
              Interactive, gamified simulations that remove the fear of
              technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Smartphone className="text-blue-600" size={24} />}
              title="Interactive Simulations"
              desc="Practice UPI payments and form filling in a safe, risk-free environment."
            />
            <FeatureCard
              icon={<BarChart3 className="text-blue-600" size={24} />}
              title="Real-time Analytics"
              desc="Live dashboard tracking digital literacy rates at the village level."
            />
            <FeatureCard
              icon={<Globe className="text-blue-600" size={24} />}
              title="Vernacular First"
              desc="Voice-enabled navigation with local language support."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-12">
          <Stat number="50,000+" label="Villagers Trained" />
          <Stat number="12" label="Active Districts" />
          <Stat number="4.8/5" label="Trust Score" />
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-semibold">
              G
            </div>
            <span className="text-base font-medium text-white">GramSathi</span>
          </div>
          <p className="text-sm">© 2024 GramSathi Foundation</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed font-light">{desc}</p>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="text-center">
    <h4 className="text-4xl font-semibold text-gray-900 mb-1">{number}</h4>
    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
      {label}
    </p>
  </div>
);

export default Landing;
