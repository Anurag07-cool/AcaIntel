import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Building, Target, TrendingUp, Sparkles, Calendar } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setMetrics(res.data.metrics);
        setInsights(res.data.insights);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Use dynamic data from backend or fallback to flat line
  const growthData = metrics?.growth_data || [
    { name: 'Jan', leads: 0, won: 0 },
    { name: 'Feb', leads: 0, won: 0 },
    { name: 'Mar', leads: 0, won: 0 },
    { name: 'Apr', leads: 0, won: 0 },
    { name: 'May', leads: 0, won: 0 },
    { name: 'Jun', leads: 0, won: 0 },
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Dashboard...</div>;

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
          <Icon size={24} className={`text-${color}-400`} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp size={16} className="text-emerald-400 mr-1" />
        <span className="text-emerald-400 font-medium">{trend}%</span>
        <span className="text-slate-500 ml-2">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Partnership Command Center</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your outreach today.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20 flex items-center">
          <Calendar size={18} className="mr-2" />
          View Schedule
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Institutions" value={metrics?.total_institutions} icon={Building} trend="+12" color="blue" />
        <StatCard title="Active Leads" value={metrics?.active_leads} icon={Users} trend="+8" color="cyan" />
        <StatCard title="High Priority" value={metrics?.high_priority} icon={Target} trend="+24" color="purple" />
        <StatCard title="Conversion Rate" value={`${metrics?.conversion_rate}%`} icon={TrendingUp} trend="+2.5" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Pipeline Growth Over Time</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                  <Area type="monotone" dataKey="won" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 h-full border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
              <Sparkles size={120} className="text-primary" />
            </div>
            
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">AI Copilot Insights</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              {insights.map((insight, index) => (
                <div key={index} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 flex items-start space-x-4 hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.8)] group-hover:scale-150 transition-transform"></div>
                  <p className="text-slate-300 leading-relaxed text-sm">{insight}</p>
                </div>
              ))}
              
              <div className="bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30 rounded-xl p-4 mt-6">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Revenue Potential</p>
                <p className="text-2xl font-bold text-white flex items-center">
                  ₹ {(metrics?.potential_revenue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-2">Estimated value of active pipeline based on student strength factors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
