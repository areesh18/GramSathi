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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Users, TrendingUp, MapPin, Activity, Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Admin = () => {
  const [stats, setStats] = useState({ 
    total_users: 0, 
    avg_score: 0, 
    trend: [], 
    villages: [],
    module_stats: [],
    struggles: [] // New Data
  });

  useEffect(() => {
    const fetchStats = () => {
      const token = localStorage.getItem('token');
      fetch('http://localhost:8080/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => res.json())
      .then((data) => {
        setStats({
          total_users: data.total_users || 0,
          avg_score: data.avg_score || 0,
          trend: data.trend || [],
          villages: data.villages || [],
          module_stats: data.module_stats || [],
          struggles: data.struggles || []
        });
      })
      .catch((err) => console.error('Admin fetch error:', err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8 font-sans pb-20">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            District Dashboard 🇮🇳
          </h1>
          <p className="text-slate-500">Digital Literacy & Adoption Analytics</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
                <Download size={16} /> Export Report
            </button>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                <Activity size={16} className="animate-pulse" /> Live System
            </div>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
            icon={<Users size={24} />} 
            label="Total Beneficiaries" 
            value={stats.total_users} 
            color="bg-blue-500" 
        />
        <StatCard 
            icon={<TrendingUp size={24} />} 
            label="Avg Literacy Score" 
            value={`${stats.avg_score}/100`} 
            color="bg-green-500" 
        />
        <StatCard 
            icon={<MapPin size={24} />} 
            label="Active Villages" 
            value={stats.villages.length} 
            color="bg-purple-500" 
        />
        <StatCard 
            icon={<Activity size={24} />} 
            label="Modules Completed" 
            value={stats.module_stats.reduce((acc, curr) => acc + curr.value, 0)} 
            color="bg-orange-500" 
        />
      </div>

      {/* ROW 1: Trend & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Adoption Trend (New Registrations)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart (1/3 width) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Skill Distribution</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.module_stats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.module_stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 2: INSIGHTS (Village & Struggles) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Village Leaderboard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Village Leaderboard</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.villages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}}/>
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="score" name="Avg Score" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* NEW: Struggle Areas Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Top Learning Barriers</h3>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Action Needed</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Where are villagers failing the most?</p>
            
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.struggles}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="module" tick={{fontSize: 12}} />
                        <YAxis allowDecimals={false} />
                        <Tooltip cursor={{ fill: '#fee2e2' }} />
                        <Bar dataKey="failures" name="Failed Attempts" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for consistency
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-black text-slate-800">{value}</h3>
        </div>
    </div>
);

export default Admin;