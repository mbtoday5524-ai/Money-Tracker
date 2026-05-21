import { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Percent,
  CalendarDays
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { motion } from 'motion/react';

interface FinancialReportsProps {
  transactions: Transaction[];
  language: 'MM' | 'EN';
}

export default function FinancialReports({ transactions, language }: FinancialReportsProps) {
  const [timeframe, setTimeframe] = useState<'DAY' | 'MONTH' | 'YEAR'>('MONTH');
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const f = (n: number) => new Intl.NumberFormat().format(n);

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const d = new Date(tx.date);
      if (timeframe === 'DAY') {
        const txDate = new Date(tx.date).toISOString().split('T')[0];
        return txDate === selectedDay;
      }
      if (timeframe === 'MONTH') {
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }
      return d.getFullYear() === selectedYear;
    });
  }, [transactions, timeframe, selectedDay, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const totalFees = filteredData.reduce((acc, tx) => acc + (tx.fee || 0), 0);
    const totalAmount = filteredData.reduce((acc, tx) => acc + (tx.amount || 0), 0);
    const avgFeePercent = totalAmount > 0 ? (totalFees / totalAmount) * 100 : 0;

    const byCategory: Record<string, { fees: number; count: number; amount: number }> = {};
    filteredData.forEach(tx => {
      if (!byCategory[tx.category]) {
        byCategory[tx.category] = { fees: 0, count: 0, amount: 0 };
      }
      byCategory[tx.category].fees += tx.fee || 0;
      byCategory[tx.category].amount += tx.amount || 0;
      byCategory[tx.category].count += 1;
    });

    return { totalFees, totalAmount, avgFeePercent, byCategory };
  }, [filteredData]);

  const months = language === 'MM' ? [
    'ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်',
    'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button 
            onClick={() => setTimeframe('DAY')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
              timeframe === 'DAY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {language === 'MM' ? 'ရက်အလိုက်' : 'Daily'}
          </button>
          <button 
            onClick={() => setTimeframe('MONTH')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
              timeframe === 'MONTH' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {language === 'MM' ? 'လအလိုက်' : 'Monthly'}
          </button>
          <button 
            onClick={() => setTimeframe('YEAR')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
              timeframe === 'YEAR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            {language === 'MM' ? 'နှစ်အလိုက်' : 'Yearly'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {timeframe === 'DAY' && (
            <input 
              type="date"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          )}

          {timeframe !== 'DAY' && (
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-bold focus:outline-none"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}

          {timeframe === 'MONTH' && (
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-bold focus:outline-none"
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-indigo-600 p-4 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[8px] sm:text-[9px] font-black opacity-70 uppercase tracking-[0.2em] mb-0.5 md:mb-1">
              {language === 'MM' ? 'စုစုပေါင်း ဝန်ဆောင်ခ (ကော်မရှင်)' : 'Total Fees Collected'}
            </p>
            <h3 className="text-xl sm:text-2xl lg:text-4xl font-black">{f(stats.totalFees)}</h3>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 text-white/10 w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-lg flex items-center justify-center">
              <Percent size={12} className="lg:w-4 lg:h-4" />
            </div>
            <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {language === 'MM' ? 'ပျမ်းမျှ ဝန်ဆောင်ခနှုန်း' : 'Avg Fee %'}
            </p>
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white">{stats.avgFeePercent.toFixed(2)}%</h4>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp size={12} className="lg:w-4 lg:h-4" />
            </div>
            <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {language === 'MM' ? 'စာရင်းသွင်းမှု စုစုပေါင်း' : 'Transactions'}
            </p>
          </div>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white">{filteredData.length}</h4>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <BarChart3 size={14} className="text-indigo-600 sm:w-4 sm:h-4" />
            {language === 'MM' ? 'ငွေပေးချေမှုစနစ်အလိုက် ခွဲခြမ်းစိတ်ဖြာချက်' : 'Breakdown by Payment Method'}
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(stats.byCategory).sort((a: any, b: any) => b[1].fees - a[1].fees).map(([cat, data]: [string, any], i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={cat} 
                className="group p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl sm:rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors"
              >
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{cat}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] sm:text-sm font-black text-indigo-600 dark:text-indigo-400">{f(data.fees)}</p>
                    <p className="text-[8px] sm:text-[9px] font-bold text-slate-400">Avg: {((data.fees / data.amount) * 100 || 0).toFixed(2)}%</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 sm:h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(data.fees / stats.totalFees) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
            {Object.entries(stats.byCategory).length === 0 && (
              <div className="py-12 text-center">
                <CalendarDays className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {language === 'MM' ? 'ရွေးချယ်ထားသောကာလအတွင်း အချက်အလက် မရှိပါ' : 'No data available for this period'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
