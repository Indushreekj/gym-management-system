'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Activity, Users, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrainerDashboard() {
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ activeMembers: 0, classesToday: 3, ptSessions: 2 });

  useEffect(() => {
    // Initialize Socket.io connection to backend
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to real-time feed');
      // Request to join TRAINER room
      socket.emit('join-room', 'TRAINER');
    });

    socket.on('new-attendance', (data: any) => {
      setLiveLogs(prev => [data, ...prev].slice(0, 10)); // Keep last 10 logs
      
      // Increment active members if check-in, decrement if check-out
      if (data.message.includes('checked in')) {
        setStats(s => ({ ...s, activeMembers: s.activeMembers + 1 }));
      } else if (data.message.includes('checked out')) {
        setStats(s => ({ ...s, activeMembers: Math.max(0, s.activeMembers - 1) }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-8 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
          Trainer Hub
        </h2>
        <p className="text-gray-500 mt-2 text-lg">Monitor facility activity and manage your clients.</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Live Members</p>
            <h3 className="text-4xl font-black text-emerald-500">{stats.activeMembers}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Activity size={32} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Classes Today</p>
            <h3 className="text-4xl font-black text-gray-900">{stats.classesToday}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Users size={32} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">PT Sessions</p>
            <h3 className="text-4xl font-black text-gray-900">{stats.ptSessions}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Zap size={32} />
          </div>
        </motion.div>
      </div>

      {/* Real-Time Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-2xl font-black flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            Live Activity Feed
          </h3>
        </div>

        <div className="space-y-4 relative z-10 min-h-[300px]">
          {liveLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
              <Clock size={48} className="mb-4 opacity-50" />
              <p>Waiting for members to check in...</p>
            </div>
          ) : (
            <AnimatePresence>
              {liveLogs.map((log, index) => {
                const isCheckIn = log.message.includes('checked in');
                return (
                  <motion.div
                    key={`${log.time}-${index}`}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCheckIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {isCheckIn ? <Activity size={24} /> : <LogOut size={24} />}
                      </div>
                      <p className="font-bold text-lg">{log.message}</p>
                    </div>
                    <span className="text-gray-400 font-medium">
                      {new Date(log.time).toLocaleTimeString()}
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Temporary mock for LogOut icon since it wasn't imported above
const LogOut = ({ size, className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
