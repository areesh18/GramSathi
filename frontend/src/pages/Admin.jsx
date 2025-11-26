import React, { useState, useEffect } from "react";
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
  Legend,
} from "recharts";
import { Users, TrendingUp, MapPin, Activity, Download } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Admin = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    avg_score: 0,
    trend: [],
    villages: [],
    module_stats: [],
    struggles: [],
    recent_logs: [], // --- REFINEMENT 3: Added state for logs
  });

  useEffect(() => {
    const fetchStats = () => {
      const token = localStorage.getItem("token");
      fetch("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStats({
            total_users: data.total_users || 0,
            avg_score: data.avg_score || 0,
            trend: data.trend || [],
            villages: data.villages || [],
            module_stats: data.module_stats || [],
            struggles: data.struggles || [],
            recent_logs: data.recent_logs || [], // Added
          });
        })
        .catch((err) => console.error("Admin fetch error:", err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans pb-20">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">
              District Dashboard
            </h1>
            <p className="text-gray-600 font-light">
              Digital Literacy & Adoption Analytics
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Download size={16} /> Export Report
            </button>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-green-100">
              <Activity size={16} className="animate-pulse" /> Live System
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users size={24} />}
          label="Total Beneficiaries"
          value={stats.total_users}
          color="bg-blue-600"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Avg Literacy Score"
          value={`${stats.avg_score}/600`}
          color="bg-green-600"
        />
        <StatCard
          icon={<MapPin size={24} />}
          label="Active Villages"
          value={stats.villages.length}
          color="bg-purple-600"
        />
        <StatCard
          icon={<Activity size={24} />}
          label="Modules Completed"
          value={stats.module_stats.reduce((acc, curr) => acc + curr.value, 0)}
          color="bg-orange-600"
        />
      </div>

      {/* Row 1: Trend & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Adoption Trend (New Registrations)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#3b82f6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Skill Distribution
          </h3>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Village & Struggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Village Leaderboard */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Village Leaderboard
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.villages} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  horizontal={false}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip cursor={{ fill: "#f9fafb" }} />
                <Bar
                  dataKey="score"
                  name="Avg Score"
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Struggle Areas Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Top Learning Barriers
            </h3>
            <span className="bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-md border border-red-100">
              Action Needed
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4 font-light">
            Where are villagers failing the most?
          </p>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.struggles}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="module"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip cursor={{ fill: "#fef2f2" }} />
                <Bar
                  dataKey="failures"
                  name="Failed Attempts"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- REFINEMENT 3: Live Activity Feed --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          📡 Live Network Activity
        </h3>
        <div className="space-y-4">
          {stats.recent_logs.map((log, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    log.action.includes("failed")
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                ></div>
                <span className="font-medium text-gray-700">{log.user}</span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-600 capitalize">
                  {log.action.replace(/_/g, " ")}
                </span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  {log.module}
                </span>
              </div>
              <span className="text-gray-400 text-xs font-mono">
                {log.time}
              </span>
            </div>
          ))}
          {stats.recent_logs.length === 0 && (
            <p className="text-gray-400 text-sm text-center">
              Waiting for activity...
            </p>
          )}
        </div>
      </div>
      {/* ---------------------------------------- */}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
    <div
      className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
    </div>
  </div>
);

export default Admin;
