import React, { useState } from 'react';
import { Target, TrendingUp, Hash, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyGoalTrackerProps {
  language: 'MM' | 'EN';
  currentRevenue: number;
  currentCount: number;
  revenueGoal: number;
  transactionGoal: number;
  onUpdateGoals: (revenue: number, transactions: number) => Promise<void>;
}

export default function DailyGoalTracker({
  language,
  currentRevenue,
  currentCount,
  revenueGoal,
  transactionGoal,
  onUpdateGoals
}: DailyGoalTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempRevenue, setTempRevenue] = useState(revenueGoal);
  const [tempTransactions, setTempTransactions] = useState(transactionGoal);
  const [isSaving, setIsSaving] = useState(false);

  const revenueProgress = Math.min((currentRevenue / (revenueGoal || 1)) * 100, 100);
  const transactionProgress = Math.min((currentCount / (transactionGoal || 1)) * 100, 100);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateGoals(tempRevenue, tempTransactions);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const f = (n: number) => n.toLocaleString();

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 sleek-shadow overflow-hidden transition-all">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
            <Target size={18} />
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
            {language === 'MM' ? 'နေ့စဉ်ပန်းတိုင်' : 'Daily Goals'}
          </h3>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => {
              setTempRevenue(revenueGoal);
              setTempTransactions(transactionGoal);
              setIsEditing(true);
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <Edit2 size={14} />
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsEditing(false)}
              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-rose-500 transition-colors"
              disabled={isSaving}
            >
              <X size={14} />
            </button>
            <button 
              onClick={handleSave}
              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg text-emerald-500 transition-colors"
              disabled={isSaving}
            >
              {isSaving ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Hash size={14} /></motion.div> : <Check size={14} />}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {language === 'MM' ? 'သတ်မှတ်ဝင်ငွေ (ကျပ်)' : 'Revenue Goal (MMK)'}
                </label>
                <input 
                  type="number"
                  value={tempRevenue}
                  onChange={(e) => setTempRevenue(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {language === 'MM' ? 'သတ်မှတ်အကြိမ်ရေ' : 'Transaction Count Goal'}
                </label>
                <input 
                  type="number"
                  value={tempTransactions}
                  onChange={(e) => setTempTransactions(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Revenue Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {language === 'MM' ? 'ယနေ့ဝင်ငွေ' : 'Daily Revenue'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{f(currentRevenue)}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">/ {f(revenueGoal)}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${revenueProgress}%` }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      revenueProgress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    }`}
                  />
                </div>
              </div>

              {/* Transactions Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {language === 'MM' ? 'ယနေ့အကြိမ်ရေ' : 'Transactions'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{currentCount}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">/ {transactionGoal}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${transactionProgress}%` }}
                    className={`h-full rounded-full transition-colors duration-500 ${
                      transactionProgress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    }`}
                  />
                </div>
              </div>

              {revenueProgress >= 100 && transactionProgress >= 100 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check size={18} />
                  </div>
                  <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider leading-relaxed">
                    {language === 'MM' ? 'အားလုံးအောင်မြင်ပါသည်! ယနေ့အတွက် ဂုဏ်ယူပါသည်။' : 'All goals reached! Great job today!'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
