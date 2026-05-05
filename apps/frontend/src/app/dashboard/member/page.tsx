'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Activity, Flame, Droplets, Dumbbell, Target, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const progressData = [
  { day: 'Mon', calories: 2400, activeMinutes: 45 },
  { day: 'Tue', calories: 2100, activeMinutes: 30 },
  { day: 'Wed', calories: 2600, activeMinutes: 60 },
  { day: 'Thu', calories: 2300, activeMinutes: 40 },
  { day: 'Fri', calories: 2800, activeMinutes: 75 },
  { day: 'Sat', calories: 3100, activeMinutes: 90 },
  { day: 'Sun', calories: 2200, activeMinutes: 20 },
];

export default function MemberDashboard() {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/ai/recommendations');
        setRecommendation(data);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Performance Hub
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Your AI-driven fitness analytics and daily goals.</p>
        </div>
      </motion.div>

      {/* AI Recommendation Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative bg-gray-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-gray-900/30 text-white"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold tracking-widest border border-emerald-500/30">
              <Sparkles size={16} />
              AI FITNESS COACH
            </div>
            
            {loading ? (
              <div className="h-24 flex items-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : recommendation ? (
              <>
                <h3 className="text-3xl md:text-4xl font-black leading-tight">
                  "Based on your BMI of <span className="text-emerald-400">{recommendation.bmi}</span>, {recommendation.recommendation.toLowerCase()}"
                </h3>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2">
                  Start Today's Routine <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <div>
                <h3 className="text-3xl font-black mb-4">Complete your profile to unlock AI</h3>
                <p className="text-gray-400 mb-6 text-lg">We need your height, weight, and goals to generate a hyper-personalized plan.</p>
                <a href="/dashboard/settings" className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all">
                  Go to Settings
                </a>
              </div>
            )}
          </div>
          
          {recommendation && (
            <div className="w-full md:w-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center min-w-[200px]">
              <p className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-sm">Current BMI</p>
              <p className="text-6xl font-black text-emerald-400">{recommendation.bmi}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Calories Burned', value: '2,840', unit: 'kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Active Time', value: '1h 45', unit: 'min', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Water Intake', value: '2.4', unit: 'L', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Workouts', value: '4', unit: '/wk', icon: Dumbbell, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.05) }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:-translate-y-1 transition-transform"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-gray-500 font-medium text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 flex items-baseline gap-1">
              {stat.value} <span className="text-sm font-bold text-gray-400">{stat.unit}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" />
              Activity Trends
            </h3>
            <p className="text-gray-500 mt-1">Your caloric burn over the last 7 days</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 14 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 14 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCalories)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
