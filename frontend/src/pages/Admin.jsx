import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Users, TrendingUp, MapPin } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState({ total_users: 0, avg_score: 0 });

  useEffect(() => {
    const fetchStats = () => {
      fetch('http://localhost:8080/api/admin/stats')
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error('Admin fetch error:', err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Jan', users: 40 },
    { name: 'Feb', users: 80 },
    { name: 'Mar', users: 150 },
    { name: 'Apr', users: stats.total_users > 200 ? stats.total_users : 240 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8 font-sans">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            GramSathi <br className="sm:hidden" />
            <span className="text-blue-600">Analytics</span> 🇮🇳
          </h1>
          <p className="text-sm text-slate-500">
            Real-time Digital Literacy Dashboard
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
          Live Updating
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* CARD TEMPLATE */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex flex-col items-center gap-3 min-h-[140px]">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <p className="text-slate-500 text-sm text-center">Total Villagers</p>
          <h3 className="text-3xl font-extrabold text-slate-800">
            {stats.total_users}
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex flex-col items-center gap-3 min-h-[140px]">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <p className="text-slate-500 text-sm text-center">
            Avg Literacy Score
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800">
            {stats.avg_score} / 100
          </h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex flex-col items-center gap-3 min-h-[140px]">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <MapPin size={24} />
          </div>
          <p className="text-slate-500 text-sm text-center">Active Villages</p>
          <h3 className="text-3xl font-extrabold text-slate-800">12</h3>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Adoption Trend
          </h3>
          <div className="h-72 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Impact by Region
          </h3>
          <div className="h-72 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Rampur', score: stats.avg_score },
                  { name: 'Madhopur', score: 35 },
                  { name: 'Sonpur', score: 20 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
