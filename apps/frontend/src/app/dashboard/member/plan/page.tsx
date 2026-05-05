'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Activity, Calendar, ShieldCheck, Flame, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MyPlan() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeMembership = profile?.membership && profile.membership.status === 'ACTIVE' 
    ? profile.membership 
    : null;

  return (
    <div className="space-y-10 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
          My Active Plan
        </h2>
        <p className="text-gray-500 mt-2 text-lg">Your current subscription and access details.</p>
      </motion.div>

      {activeMembership ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden ring-1 ring-white/10"
        >
          {/* Decorative Background Elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <ShieldCheck size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold tracking-widest mb-6 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE MEMBERSHIP
              </div>
              <h3 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">{activeMembership.plan.name}</h3>
              <p className="text-gray-400 text-xl max-w-lg leading-relaxed">
                You have unrestricted access to all premium gym facilities, group classes, and locker rooms.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl min-w-[280px]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Started On</p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Calendar size={20} className="text-emerald-400" /></div>
                    <p className="text-xl font-bold">{new Date(activeMembership.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div>
                  <p className="text-sm text-gray-400 font-medium mb-1">Valid Until</p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Activity size={20} className="text-emerald-400" /></div>
                    <p className="text-xl font-bold">{new Date(activeMembership.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
            {[
              { icon: Flame, text: 'Unlimited Classes' },
              { icon: Zap, text: '24/7 Access' },
              { icon: ShieldCheck, text: 'Premium Locker' },
              { icon: CheckCircle2, text: 'Free Wi-Fi' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <feature.icon size={20} className="text-emerald-400" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-50 mb-8 border border-gray-100 shadow-sm">
            <ShieldCheck size={40} className="text-gray-400" />
          </div>
          <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">No Active Plan</h3>
          <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            You currently don't have an active membership. Head over to the billing section to choose a premium plan and start your fitness journey!
          </p>
          <Link 
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl shadow-gray-900/20 hover:shadow-emerald-500/30 group"
          >
            Explore Plans
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
