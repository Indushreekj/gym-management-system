'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { QrCode, LogIn, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Attendance() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'CHECKED_IN' | 'CHECKED_OUT'>('IDLE');
  const [message, setMessage] = useState('');

  const handleAttendance = async (action: 'checkin' | 'checkout') => {
    setLoading(true);
    setMessage('');
    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data } = await api.post(`/attendance/${action}`);
      setStatus(action === 'checkin' ? 'CHECKED_IN' : 'CHECKED_OUT');
      setMessage(data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
          Digital ID & Check-in
        </h2>
        <p className="text-gray-500 mt-2 text-lg">Scan or tap to enter the gym facility.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center p-12 overflow-hidden relative"
      >
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        <div className="w-64 h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center mb-10 relative">
          {/* Mock QR Code */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <QrCode size={200} />
          </div>
          
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-3xl"
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
                  <p className="font-bold text-gray-600 text-sm tracking-widest uppercase">Scanning...</p>
                </div>
              </motion.div>
            )}
            
            {status === 'CHECKED_IN' && !loading && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center rounded-3xl"
              >
                <CheckCircle2 size={80} className="text-emerald-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`px-6 py-3 rounded-full font-bold mb-8 ${status === 'CHECKED_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
          >
            {message}
          </motion.div>
        )}

        <div className="flex gap-4 w-full max-w-md">
          <button 
            onClick={() => handleAttendance('checkin')}
            disabled={loading || status === 'CHECKED_IN'}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <LogIn size={20} className="group-hover:-translate-y-1 transition-transform" />
            Check In
          </button>
          <button 
            onClick={() => handleAttendance('checkout')}
            disabled={loading || status !== 'CHECKED_IN'}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            Check Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
