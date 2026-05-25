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

  const AccountStat = ({ label, inc, dec, logoUrl, DefaultLogo }: { 
    label: string, 
    inc: number, 
    dec: number, 
    logoUrl?: string, 
    DefaultLogo: ComponentType<{ className?: string }> 
  }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="w-4 h-4 sm:w-5 h-5 flex items-center justify-center overflow-hidden rounded-sm bg-slate-50 dark:bg-slate-800">
           {logoUrl ? (
             <img src={logoUrl} alt={label} className="w-full h-full object-contain" />
           ) : (
             <DefaultLogo className="w-3 h-3 sm:w-4 h-4 opacity-70" />
           )}
        </div>
        <p className="text-[7.5px] sm:text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1.5 pt-0.5 pl-5.5 sm:pl-7">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <TrendingUp size={7} className="text-emerald-500 sm:w-2.5 sm:h-2.5" />
                        <span className="text-[7.2px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{language === 'MM' ? 'အဝင်' : 'In'}</span>
                      </div>
                      <span className="text-[9px] sm:text-xs font-black text-slate-700 dark:text-slate-300 font-mono">{f(inc)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 opacity-60">
                        <TrendingDown size={7} className="text-rose-500 sm:w-2.5 sm:h-2.5" />
                        <span className="text-[7.2px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">{language === 'MM' ? 'အထွက်' : 'Out'}</span>
                      </div>
                      <span className="text-[9px] sm:text-xs font-black text-slate-700 dark:text-slate-300 font-mono">{f(dec)}</span>
                    </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 sleek-shadow overflow-hidden flex flex-col h-full transition-colors">
      <div className="p-3 sm:p-4 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 transition-colors">
        <div className="flex justify-between items-center mb-3 lg:mb-6">
          <h3 className={`text-[10px] sm:text-xs lg:text-sm font-black text-slate-900 dark:text-white uppercase ${language === 'MM' ? 'tracking-normal text-[12.5px] font-extrabold' : 'tracking-widest'}`}>{language === 'MM' ? 'စာရင်းချုပ်' : 'Current Ledger'}</h3>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl text-[10px] sm:text-xs font-bold uppercase transition-all duration-300 active:scale-95"
          >
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span>{language === 'MM' ? 'ထုတ်ယူရန် (PDF)' : 'Export PDF'}</span>
          </button>
        </div>
        
        <div className="space-y-2 lg:space-y-4">
          {/* Main Profit Card */}
          <div className="bg-indigo-600 rounded-xl lg:rounded-2xl p-3 lg:p-5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-16 lg:w-24 h-16 lg:h-24 bg-white/10 rounded-full -mr-6 lg:-mr-8 -mt-6 lg:-mt-8 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center gap-3 lg:gap-4">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-white/20 text-white rounded-lg lg:rounded-xl flex items-center justify-center backdrop-blur-md shrink-0">
                <DollarSign size={16} className="lg:w-6 lg:h-6" />
              </div>
              <div>
                <p className={`text-[8.5px] lg:text-[10.5px] uppercase mb-1 ${language === 'MM' ? 'tracking-normal text-white/95 font-extrabold text-[11.5px]' : 'tracking-widest font-bold text-white/60'}`}>{language === 'MM' ? 'ရရှိသော ကော်မရှင်စုစုပေါင်း' : 'Total Revenue (Fee)'}</p>
                <p className={`font-black text-white tracking-tighter ${language === 'MM' ? 'text-sm lg:text-lg' : 'text-base lg:text-xl'}`}>{f(totalFee)}</p>
              </div>
            </div>
          </div>

          {/* Capital & Current Net Balance Cards */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-2.5 lg:p-3.5 flex flex-col justify-between">
              <div>
                <p className={`text-[8px] lg:text-[10px] font-black uppercase mb-1 leading-none ${language === 'MM' ? 'tracking-normal text-blue-750 dark:text-blue-350 text-[11px] font-extrabold' : 'tracking-wider text-blue-600/70 dark:text-blue-450/70'}`}>{language === 'MM' ? 'မူလအရင်းအနှီး' : 'Initial Investment'}</p>
                <p className="font-extrabold text-blue-800 dark:text-blue-300 text-xs lg:text-base tracking-tight font-display">{f(initialCapital)}</p>
              </div>
            </div>
            <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl p-2.5 lg:p-3.5 flex flex-col justify-between">
              <div>
                <p className={`text-[8px] lg:text-[10px] font-black uppercase mb-1 leading-none ${language === 'MM' ? 'tracking-normal text-purple-750 dark:text-purple-350 text-[11px] font-extrabold' : 'tracking-wider text-purple-600/70 dark:text-purple-400/70'}`}>{language === 'MM' ? 'လက်ရှိစုစုပေါင်းငွေ' : 'Current Net Money'}</p>
                <p className="font-extrabold text-purple-700 dark:text-purple-300 text-xs lg:text-base tracking-tight font-display">{f(currentTotal)}</p>
              </div>
            </div>
          </div>

          {/* Inflow & Outflow visualizers */}
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/50 rounded-xl lg:rounded-2xl p-2.5 lg:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 bg-emerald-500 text-white rounded-lg lg:rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={14} className="lg:w-5 lg:h-5" />
              </div>
              <div>
                <p className={`text-[8px] lg:text-[10px] uppercase mb-1 ${language === 'MM' ? 'tracking-normal text-emerald-700 dark:text-emerald-300 font-extrabold text-[11.5px]' : 'tracking-widest font-bold text-emerald-600/60 dark:text-emerald-400/60'}`}>{language === 'MM' ? 'စုစုပေါင်း အဝင်' : 'Total Inflow'}</p>
                <p className={`font-black text-emerald-700 dark:text-emerald-400 tracking-tighter ${language === 'MM' ? 'text-xs lg:text-base' : 'text-sm lg:text-lg'}`}>{f(totalIn)}</p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100/50 dark:border-rose-800/50 rounded-xl lg:rounded-2xl p-2.5 lg:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-7 h-7 lg:w-10 lg:h-10 bg-rose-500 text-white rounded-lg lg:rounded-xl flex items-center justify-center shrink-0">
                <TrendingDown size={14} className="lg:w-5 lg:h-5" />
              </div>
              <div>
                <p className={`text-[8px] lg:text-[10px] uppercase mb-1 ${language === 'MM' ? 'tracking-normal text-rose-700 dark:text-rose-300 font-extrabold text-[11.5px]' : 'tracking-widest font-semibold text-rose-600/60 dark:text-rose-400/60'}`}>{language === 'MM' ? 'စုစုပေါင်း အထွက်' : 'Total Outflow'}</p>
                <p className={`font-black text-rose-700 dark:text-rose-400 tracking-tighter ${language === 'MM' ? 'text-xs lg:text-base' : 'text-sm lg:text-lg'}`}>{f(totalOut)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 lg:p-8 space-y-3 lg:space-y-8 flex-1 bg-white dark:bg-[#0f172a] transition-colors">
        {kbzEnabled && <>
            <AccountStat label="KPay Wallet" inc={kbzIn} dec={kbzOut} logoUrl={kbzLogoUrl} DefaultLogo={KBZLogo} />
            <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
        </>}
        {waveEnabled && <>
            <AccountStat label="Wave Wallet" inc={waveIn} dec={waveOut} logoUrl={waveLogoUrl} DefaultLogo={WaveLogo} />
            <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
        </>}
        {ayaEnabled && <>
            <AccountStat label="AYAPay Wallet" inc={ayaIn} dec={ayaOut} logoUrl={ayaLogoUrl} DefaultLogo={AYALogo} />
            <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
        </>}
        {uabEnabled && <>
            <AccountStat label="UAB Wallet" inc={uabIn} dec={uabOut} logoUrl={uabLogoUrl} DefaultLogo={UABLogo} />
            <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
        </>}
        {trueEnabled && <>
            <AccountStat label="True Money Wallet" inc={trueIn} dec={trueOut} logoUrl={trueLogoUrl} DefaultLogo={TrueLogo} />
            <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
        </>}
        {cashEnabled && <>
            <AccountStat label={language === 'MM' ? 'လက်ဝယ်ရှိငွေ' : 'Cash on Hand'} inc={cashIn} dec={cashOut} logoUrl={cashLogoUrl} DefaultLogo={CashLogo} />
        </>}
      </div>
    </div>
  );
}
