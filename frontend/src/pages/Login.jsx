import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, User, MapPin } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // New States for Registration
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    
    // Payload now uses the actual state values
    const payload = isRegister 
      ? { name, email, password, role: "user", village: village || "Unknown" } 
      : { email, password };

    try {
      const res = await fetch(`http://localhost:8080/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (isRegister) {
          alert("Registration Successful! Please Login.");
          setIsRegister(false); // Switch back to login mode
        } else {
          const data = await res.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } else {
        alert("Authentication Failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">GramSathi</h1>
            <p className="text-gray-500">{isRegister ? "Join the community" : "Welcome back"}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* --- NEW FIELDS: Only show when Registering --- */}
            {isRegister && (
              <>
                <div className="relative animate-in slide-in-from-top duration-300">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative animate-in slide-in-from-top duration-300 delay-100">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Village Name" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* --- Standard Fields --- */}
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 mt-6">
              {isRegister ? "Create Account" : "Login Securely"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                // Clear fields when switching to prevent confusion
                setName('');
                setVillage('');
                setPassword(''); 
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              {isRegister ? "Already have an account? Login" : "New here? Register"}
            </button>
          </div>
        </div>
        
        {/* Hackathon Cheat Sheet */}
        <div className="bg-gray-50 p-4 text-xs text-gray-500 text-center border-t border-gray-100">
          <p><b>Admin Demo:</b> admin@gov.in / 123456</p>
          <p><b>User Demo:</b> rajesh@village.in / 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;