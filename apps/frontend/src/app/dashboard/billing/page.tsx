'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CreditCard, CheckCircle2, Zap, Shield, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Billing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/memberships/plans');
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async (planId: string) => {
    try {
      setPurchasingId(planId);
      setError('');
      setSuccess('');
      
      // Simulate network delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data } = await api.post('/memberships/purchase', { planId });
      setSuccess(data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process transaction');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-10 text-gray-800 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Membership Plans
          </h2>
          <p className="text-gray-500 mt-2 text-lg">Select the perfect tier for your fitness journey.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Shield className="text-emerald-500" size={20} />
          <span className="text-sm font-semibold">Bank-grade Security</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center gap-3"
          >
            <Sparkles className="text-emerald-500" />
            <span className="font-medium">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <CreditCard className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-xl">No premium plans are currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isPopular = plan.price > 50 && plan.price < 100;
            return (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
                  isPopular 
                    ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/40 ring-4 ring-emerald-500/30' 
                    : 'bg-white text-gray-900 shadow-xl shadow-gray-200/50 border border-gray-100 hover:border-emerald-200'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/40 flex items-center gap-1">
                    <Zap size={14} /> MOST POPULAR
                  </div>
                )}
                
                <h4 className={`text-2xl font-black mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h4>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black tracking-tighter">
                    ${plan.price}
                  </span>
                  <span className={`font-medium ${isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                    /{plan.durationDays}d
                  </span>
                </div>
                
                <div className={`h-px w-full mb-6 ${isPopular ? 'bg-gray-800' : 'bg-gray-100'}`} />
                
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    '24/7 Access to all facilities',
                    'Free Group Classes (Yoga, HIIT)',
                    'Access to Locker & Sauna',
                    isPopular ? '1 Free PT Session/mo' : null,
                    plan.price > 100 ? 'Unlimited PT Sessions' : null,
                    plan.price > 100 ? 'Custom Diet Plan' : null,
                  ].filter(Boolean).map((feature: any, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className={`shrink-0 ${isPopular ? 'text-emerald-400' : 'text-emerald-500'}`} size={20} />
                      <span className={`font-medium ${isPopular ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePurchase(plan.id)}
                  disabled={purchasingId !== null}
                  className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPopular 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/25' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } ${purchasingId === plan.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {purchasingId === plan.id ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    'Get Started Now'
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
