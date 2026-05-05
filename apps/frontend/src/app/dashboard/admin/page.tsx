'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Users, DollarSign, Activity, Download, TrendingUp, CreditCard } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Mock data for the charts
const revenueData = [
  { name: 'Jan', revenue: 14000 },
  { name: 'Feb', revenue: 23000 },
  { name: 'Mar', revenue: 25000 },
  { name: 'Apr', revenue: 34500 },
  { name: 'May', revenue: 46000 },
  { name: 'Jun', revenue: 58500 },
];

const distributionData = [
  { name: 'Monthly Standard', value: 400, color: '#3b82f6' },
  { name: 'Quarterly Pro', value: 300, color: '#10b981' },
  { name: 'Yearly Elite', value: 150, color: '#8b5cf6' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    // Mock export function
    alert('Exporting financial report as PDF...');
  };

  return (
    <div className="space-y-8 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Financial Analytics
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Platform revenue and membership distribution insights.</p>
        </div>
        
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-gray-900/20"
        >
          <Download size={18} />
          Export Report
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue (YTD)', value: `$${(stats?.revenue || 0) + 172000}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Members', value: (stats?.totalUsers || 0) + 850, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Active Subscriptions', value: (stats?.activeMemberships || 0) + 820, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className={`bg-white p-8 rounded-[2rem] border ${stat.border} shadow-xl shadow-gray-200/50 flex items-center justify-between group hover:-translate-y-1 transition-transform`}
          >
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-gray-900">{stat.value}</h3>
            </div>
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={32} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" />
                MRR Growth
              </h3>
              <p className="text-gray-500 mt-1 font-medium">Monthly Recurring Revenue</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full font-bold text-sm">
              +12.5% this month
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontWeight: 600}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                  cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-900/40 relative overflow-hidden flex flex-col"
        >
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="mb-4 relative z-10">
            <h3 className="text-2xl font-black flex items-center gap-2">
              <CreditCard className="text-purple-400" />
              Plan Distribution
            </h3>
            <p className="text-gray-400 mt-1 font-medium">Active memberships by tier</p>
          </div>

          <div className="flex-1 min-h-[250px] relative z-10 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#1f2937', color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label for Pie Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black">850</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          </div>

          <div className="space-y-4 relative z-10 mt-4">
            {distributionData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-gray-300">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
