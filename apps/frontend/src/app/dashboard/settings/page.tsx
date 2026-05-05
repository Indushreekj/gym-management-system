'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Activity, Target, Save, Loader2, Scale, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const [profile, setProfile] = useState<any>({ name: '', weight: '', height: '', goal: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile({
          name: data.name || '',
          weight: data.weight || '',
          height: data.height || '',
          goal: data.goal || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/users/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully! AI recommendations are now active.' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-10 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
          Profile Settings
        </h2>
        <p className="text-gray-500 mt-2 text-lg">Update your physical metrics to get personalized AI workout and diet plans.</p>
      </motion.div>

      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }} 
            animate={{ opacity: 1, height: 'auto', y: 0 }} 
            exit={{ opacity: 0, height: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center gap-3 font-medium ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message.type === 'success' ? <Activity size={20} className="text-emerald-500" /> : <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[100px] -z-10 opacity-70" />

        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-emerald-500" /> Full Name
              </label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Target size={16} className="text-emerald-500" /> Fitness Goal
              </label>
              <select 
                value={profile.goal}
                onChange={(e) => setProfile({...profile, goal: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your primary goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Endurance">Endurance & Stamina</option>
                <option value="Maintenance">General Fitness Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Scale size={16} className="text-emerald-500" /> Weight (kg)
              </label>
              <input 
                type="number" 
                step="0.1"
                value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="e.g. 75.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Ruler size={16} className="text-emerald-500" /> Height (cm)
              </label>
              <input 
                type="number" 
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                placeholder="e.g. 180"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit"
              disabled={saving}
              className="bg-gray-900 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-emerald-500/30 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
              {saving ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
