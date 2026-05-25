import { TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react';
import { KBZLogo, WaveLogo, AYALogo, CashLogo, UABLogo, TrueLogo } from './Logos';
import { ComponentType } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SummaryProps {
  kbzIn: number;
  kbzOut: number;
  waveIn: number;
  waveOut: number;
  ayaIn: number;
  ayaOut: number;
  uabIn: number;
  uabOut: number;
  trueIn: number;
  trueOut: number;
  kbzEnabled: boolean;
  waveEnabled: boolean;
  ayaEnabled: boolean;
  uabEnabled: boolean;
  trueEnabled: boolean;
  cashEnabled: boolean;
  totalFee: number;
  language: 'MM' | 'EN';
  kbzLogoUrl?: string;
  waveLogoUrl?: string;
  ayaLogoUrl?: string;
  cashLogoUrl?: string;
  uabLogoUrl?: string;
  trueLogoUrl?: string;
  initialBalances?: {
    kbz: number;
    wave: number;
    aya: number;
    uab: number;
    trueMoney: number;
    cash: number;
  };
  currentBalances?: {
    kbz: number;
    wave: number;
    aya: number;
    uab: number;
    trueMoney: number;
    cash: number;
  };
}

export default function Summary({ 
  kbzIn, 
  kbzOut, 
  waveIn, 
  waveOut, 
  ayaIn, 
  ayaOut, 
  uabIn, 
  uabOut, 
  trueIn, 
  trueOut, 
  kbzEnabled,
  waveEnabled,
  ayaEnabled,
  uabEnabled,
  trueEnabled,
  cashEnabled,
  totalFee, 
  language,
  kbzLogoUrl,
  waveLogoUrl,
  ayaLogoUrl,
  cashLogoUrl,
  uabLogoUrl,
  trueLogoUrl,
  initialBalances,
  currentBalances
}: SummaryProps) {
  const f = (n: number) => n.toLocaleString();

  const totalIn = (kbzEnabled ? kbzIn : 0) + (waveEnabled ? waveIn : 0) + (ayaEnabled ? ayaIn : 0) + (uabEnabled ? uabIn : 0) + (trueEnabled ? trueIn : 0);
  const totalOut = (kbzEnabled ? kbzOut : 0) + (waveEnabled ? waveOut : 0) + (ayaEnabled ? ayaOut : 0) + (uabEnabled ? uabOut : 0) + (trueEnabled ? trueOut : 0);

  // Cash In = Wallet Out (we received cash)
  // Cash Out = Wallet In (we gave cash)
  const cashIn = totalOut;
  const cashOut = totalIn;

  const initialCapital = (kbzEnabled ? (initialBalances?.kbz || 0) : 0) +
                         (waveEnabled ? (initialBalances?.wave || 0) : 0) +
                         (ayaEnabled ? (initialBalances?.aya || 0) : 0) +
                         (uabEnabled ? (initialBalances?.uab || 0) : 0) +
                         (trueEnabled ? (initialBalances?.trueMoney || 0) : 0) +
                         (cashEnabled ? (initialBalances?.cash || 0) : 0);

  const currentTotal = (kbzEnabled ? (currentBalances?.kbz || 0) : 0) +
                       (waveEnabled ? (currentBalances?.wave || 0) : 0) +
                       (ayaEnabled ? (currentBalances?.aya || 0) : 0) +
                       (uabEnabled ? (currentBalances?.uab || 0) : 0) +
                       (trueEnabled ? (currentBalances?.trueMoney || 0) : 0) +
                       (cashEnabled ? (currentBalances?.cash || 0) : 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text('ZMT - Ledger Summary', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
    
    // Totals Section
    doc.setFontSize(14);
    doc.text('Overall Dashboard', 14, 40);
    
    autoTable(doc, {
      startY: 45,
      head: [['Category', 'Amount']],
      body: [
        ['Total Inflow', f(totalIn)],
        ['Total Outflow', f(totalOut)],
        ['Initial Capital', f(initialCapital)],
        ['Remaining Balance', f(currentTotal)],
        ['Total Profit (Fee)', f(totalFee)],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    // Wallet Breakdown
    const finalY = (doc as any).lastAutoTable.finalY || 45;
    doc.text('Wallet Breakdown', 14, finalY + 15);
    
    const walletData = [];
    if (kbzEnabled) walletData.push(['KPay Wallet', f(kbzIn), f(kbzOut)]);
    if (waveEnabled) walletData.push(['Wave Wallet', f(waveIn), f(waveOut)]);
    if (ayaEnabled) walletData.push(['AYAPay Wallet', f(ayaIn), f(ayaOut)]);
    if (uabEnabled) walletData.push(['UAB Wallet', f(uabIn), f(uabOut)]);
    if (trueEnabled) walletData.push(['True Money Wallet', f(trueIn), f(trueOut)]);
    if (cashEnabled) walletData.push(['Cash on Hand', f(cashIn), f(cashOut)]);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Wallet', 'Total In', 'Total Out']],
      body: walletData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    doc.save(`zmt-ledger-summary-${new Date().getTime()}.pdf`);
  };

  const AccountStat = ({ label, inc, dec, current, logoUrl, DefaultLogo }: { 
    label: string, 
    inc: number, 
    dec: number, 
    current?: number,
    logoUrl?: string, 
    DefaultLogo: ComponentType<{ className?: string }> 
  }) => (
    <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/70 dark:border-slate-800/70 rounded-2xl p-4 hover:border-indigo-100 dark:hover:border-indigo-900/30 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/5 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between gap-2">
        {/* Brand Details */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-slate-850 shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
             {logoUrl ? (
               <img src={logoUrl} alt={label} className="w-full h-full object-contain" />
             ) : (
               <DefaultLogo className="w-4 h-4 opacity-80" />
             )}
          </div>
          <div>
            <span className={`font-black text-slate-800 dark:text-slate-200 tracking-wide block ${language === 'MM' ? 'text-xs font-extrabold' : 'text-[13px]'}`}>{label}</span>
            <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">
              {language === 'MM' ? 'အကောင့်လက်ကျန်' : 'Account Balance'}
            </span>
          </div>
        </div>
        
        {/* Live Remaining Balance */}
        {current !== undefined && (
          <div className="text-right">
            <span className="font-extrabold text-slate-900 dark:text-white text-base font-display">
              {f(current)}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-0.5 uppercase">MMK</span>
          </div>
        )}
      </div>

      {/* Transaction flow indicator */}
      <div className="grid grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-slate-150/50 dark:border-slate-150/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
            <TrendingUp size={12} className="text-emerald-500" />
            {language === 'MM' ? 'အဝင်' : 'In'}
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{f(inc)}</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5">
            <TrendingDown size={12} className="text-rose-500" />
            {language === 'MM' ? 'အထွက်' : 'Out'}
          </span>
          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{f(dec)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 sleek-shadow transition-colors">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {language === 'MM' ? 'စာရင်းချုပ် ဘဏ္ဍာရေးအခြေအနေ' : 'Ledger & Accounts Overview'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {language === 'MM' ? 'အကောင့်များအားလုံး၏ စုစုပေါင်းလက်ကျန်ငွေ၊ အဝင်/အထွက်နှင့် ကော်မရှင် အစီရင်ခံစာ' : 'Summary of system-wide wallets, financial flows, and commissions'}
          </p>
        </div>
        
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-900/40 dark:text-indigo-350 dark:hover:bg-indigo-900/60 rounded-xl text-xs font-bold uppercase transition-all duration-300 active:scale-95 shadow-md shadow-indigo-600/15 dark:shadow-none shrink-0"
        >
          <Download size={14} className="w-4 h-4" />
          <span>{language === 'MM' ? 'ထုတ်ယူရန် (PDF)' : 'Export PDF'}</span>
        </button>
      </div>

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (Total indicators) - Col Span 7 on large screen */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Profit Card */}
          <div className="bg-indigo-600 rounded-2xl p-5 lg:p-7 relative overflow-hidden group shadow-lg shadow-indigo-500/10 dark:shadow-none">
            <div className="absolute right-0 top-0 w-24 lg:w-36 h-24 lg:h-36 bg-white/10 rounded-full -mr-8 lg:-mr-12 -mt-8 lg:-mt-12 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-4 lg:gap-5">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0">
                <DollarSign size={24} className="lg:w-8 lg:h-8" />
              </div>
              <div>
                <p className={`text-[9px] lg:text-[11px] uppercase mb-1 leading-none font-bold ${language === 'MM' ? 'tracking-normal text-white/95 font-extrabold text-[12.5px]' : 'tracking-widest text-white/70'}`}>{language === 'MM' ? 'ရရှိသော ကော်မရှင်စုစုပေါင်း' : 'Total Revenue (Fee)'}</p>
                <p className="font-black text-white tracking-tight text-2xl sm:text-3xl lg:text-4xl font-display">{f(totalFee)} <span className="text-xs sm:text-sm font-normal text-indigo-200">MMK</span></p>
              </div>
            </div>
          </div>

          {/* Capital & Current Net Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 lg:p-6 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-900/40 transition-colors">
              <div>
                <p className={`text-[9.5px] lg:text-[11px] font-black uppercase mb-1.5 leading-none tracking-wider text-slate-400 dark:text-slate-500`}>{language === 'MM' ? 'မူလအရင်းအနှီး' : 'Initial Investment'}</p>
                <p className="font-black text-blue-800 dark:text-blue-400 text-base sm:text-xl lg:text-2xl tracking-tight font-display">{f(initialCapital)} <span className="text-[10px] sm:text-xs font-normal text-slate-400 dark:text-slate-500">MMK</span></p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 lg:p-6 flex flex-col justify-between hover:border-purple-400 dark:hover:border-purple-900/40 transition-colors">
              <div>
                <p className={`text-[9.5px] lg:text-[11px] font-black uppercase mb-1.5 leading-none tracking-wider text-slate-400 dark:text-slate-500`}>{language === 'MM' ? 'လက်ရှိစုစုပေါင်းငွေ' : 'Current Net Money'}</p>
                <p className="font-black text-purple-700 dark:text-purple-400 text-base sm:text-xl lg:text-2xl tracking-tight font-display">{f(currentTotal)} <span className="text-[10px] sm:text-xs font-normal text-slate-400 dark:text-slate-500">MMK</span></p>
              </div>
            </div>
          </div>

          {/* Inflow & Outflow visualizers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 flex items-center gap-3 hover:border-emerald-400 dark:hover:border-emerald-900/40 transition-colors">
              <div className="w-11 h-11 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className={`text-[9px] lg:text-[10.5px] uppercase mb-1 leading-none font-bold text-slate-400 dark:text-slate-500 tracking-wider`}>{language === 'MM' ? 'စုစုပေါင်း အဝင်' : 'Total Inflow'}</p>
                <p className="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg lg:text-xl font-display">{f(totalIn)} <span className="text-[9px] font-normal text-slate-400">MMK</span></p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 flex items-center gap-3 hover:border-rose-400 dark:hover:border-rose-900/40 transition-colors">
              <div className="w-11 h-11 bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-450 rounded-xl flex items-center justify-center shrink-0">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className={`text-[9px] lg:text-[10.5px] uppercase mb-1 leading-none font-bold text-slate-400 dark:text-slate-500 tracking-wider`}>{language === 'MM' ? 'စုစုပေါင်း အထွက်' : 'Total Outflow'}</p>
                <p className="font-black text-rose-600 dark:text-rose-400 text-base sm:text-lg lg:text-xl font-display">{f(totalOut)} <span className="text-[9px] font-normal text-slate-400">MMK</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Wallet list breakdowns) - Col Span 5 on large screen */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 sleek-shadow p-5 flex flex-col transition-colors">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-0.5">
              {language === 'MM' ? 'အကောင့်တစ်ခုချင်းစီ အသေးစိတ်' : 'Accounts Balance & Flow'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {language === 'MM' ? 'လက်ကျန်အခြေအနေနှင့် ငွေကြေးစီးဆင်းမှု ပြကွက်' : 'Live balance breakdown and transaction activity for each vendor'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {kbzEnabled && (
              <AccountStat 
                label="KPay Wallet" 
                inc={kbzIn} 
                dec={kbzOut} 
                current={currentBalances?.kbz} 
                logoUrl={kbzLogoUrl} 
                DefaultLogo={KBZLogo} 
              />
            )}
            {waveEnabled && (
              <AccountStat 
                label="Wave Wallet" 
                inc={waveIn} 
                dec={waveOut} 
                current={currentBalances?.wave} 
                logoUrl={waveLogoUrl} 
                DefaultLogo={WaveLogo} 
              />
            )}
            {ayaEnabled && (
              <AccountStat 
                label="AYAPay Wallet" 
                inc={ayaIn} 
                dec={ayaOut} 
                current={currentBalances?.aya} 
                logoUrl={ayaLogoUrl} 
                DefaultLogo={AYALogo} 
              />
            )}
            {uabEnabled && (
              <AccountStat 
                label="UAB Wallet" 
                inc={uabIn} 
                dec={uabOut} 
                current={currentBalances?.uab} 
                logoUrl={uabLogoUrl} 
                DefaultLogo={UABLogo} 
              />
            )}
            {trueEnabled && (
              <AccountStat 
                label="True Money Wallet" 
                inc={trueIn} 
                dec={trueOut} 
                current={currentBalances?.trueMoney} 
                logoUrl={trueLogoUrl} 
                DefaultLogo={TrueLogo} 
              />
            )}
            {cashEnabled && (
              <AccountStat 
                label={language === 'MM' ? 'လက်ဝယ်ရှိငွေ' : 'Cash on Hand'} 
                inc={cashIn} 
                dec={cashOut} 
                current={currentBalances?.cash} 
                logoUrl={cashLogoUrl} 
                DefaultLogo={CashLogo} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
