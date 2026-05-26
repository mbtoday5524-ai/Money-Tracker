import React, { useState, useMemo } from 'react';
import { Trash2, Download, Tag, Calendar, User, ArrowRightLeft, History, Wallet, FileText, Search, Filter, X, ChevronDown, Banknote } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { KBZLogo, WaveLogo, AYALogo, CashLogo, UABLogo, TrueLogo } from './Logos';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Highlight = ({ text, highlight }: { text: string | number; highlight: string }) => {
  if (!highlight || !highlight.trim()) {
    return <>{text}</>;
  }

  const str = text.toString();
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = str.split(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-cyan-200/40 dark:bg-cyan-500/30 text-cyan-900 dark:text-cyan-100 px-0.5 rounded-sm font-black mx-[0.5px] border-b-2 border-cyan-400 dark:border-cyan-500">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

const formatTime = (createdAt: any) => {
  if (!createdAt) return '';
  let date: Date;
  if (typeof createdAt.toDate === 'function') {
    date = createdAt.toDate();
  } else if (createdAt instanceof Date) {
    date = createdAt;
  } else if (typeof createdAt === 'number') {
    date = new Date(createdAt);
  } else if (typeof createdAt === 'string') {
    date = new Date(createdAt);
  } else if (createdAt.seconds !== undefined) {
    date = new Date(createdAt.seconds * 1000);
  } else {
    return '';
  }

  if (isNaN(date.getTime())) return '';

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
};

interface TransactionListProps {
  transactions: Transaction[];
  onBulkDelete: (ids: string[]) => void;
  language: 'MM' | 'EN';
  kbzLogoUrl?: string;
  waveLogoUrl?: string;
  ayaLogoUrl?: string;
  cashLogoUrl?: string;
  uabLogoUrl?: string;
  trueLogoUrl?: string;
  onExport?: () => void;
}

export default function TransactionList({ 
  transactions, 
  onBulkDelete, 
  language,
  kbzLogoUrl,
  waveLogoUrl,
  ayaLogoUrl,
  cashLogoUrl,
  uabLogoUrl,
  trueLogoUrl,
  onExport
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBankId, setFilterBankId] = useState<string | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterFeeMethod, setFilterFeeMethod] = useState<'ALL' | 'Cash' | 'Wallet'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTx, setSelectedTx] = useState<(Transaction & { _seqId: string }) | null>(null);

  const f = (n: number) => n.toLocaleString();

  const getBankName = (categoryId: string) => {
    switch(categoryId) {
        case 'KBZ': return 'KPay';
        case 'Wave': return 'Wave';
        case 'AYAPay': return 'AYAPay';
        default: return categoryId;
    }
  };

  const banks = [
    { id: 'KBZ', name: 'KPay', logoUrl: kbzLogoUrl },
    { id: 'Wave', name: 'Wave', logoUrl: waveLogoUrl },
    { id: 'AYAPay', name: 'AYAPay', logoUrl: ayaLogoUrl },
    { id: 'UABPay', name: 'UAB Pay', logoUrl: uabLogoUrl },
    { id: 'TrueMoney', name: 'True Money', logoUrl: trueLogoUrl },
    { id: 'Cash', name: 'Cash', logoUrl: cashLogoUrl },
  ];

  const enrichedTransactions = useMemo(() => {
    return transactions.map((tx, index) => ({
      ...tx,
      _seqId: (transactions.length - index).toString().padStart(5, '0')
    }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return enrichedTransactions.filter(tx => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        tx.amount.toString().includes(searchStr) || 
        f(tx.amount).includes(searchStr) ||
        tx.fee.toString().includes(searchStr) ||
        f(tx.fee).includes(searchStr) ||
        tx._seqId.includes(searchStr) ||
        (tx.phoneNumber && tx.phoneNumber.toLowerCase().includes(searchStr)) ||
        (tx.accountName && tx.accountName.toLowerCase().includes(searchStr)) ||
        (getBankName(tx.category).toLowerCase()).includes(searchStr);
      
      const matchesCategory = filterBankId === 'ALL' || tx.category === filterBankId;
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      
      const matchesFeeMethod = filterFeeMethod === 'ALL' ||
        (filterFeeMethod === 'Wallet' && tx.feePaymentMethod === 'Wallet') ||
        (filterFeeMethod === 'Cash' && tx.feePaymentMethod !== 'Wallet');

      let matchesDate = true;
      if (startDate && endDate) {
        matchesDate = tx.date >= startDate && tx.date <= endDate;
      } else if (startDate) {
        matchesDate = tx.date >= startDate;
      } else if (endDate) {
        matchesDate = tx.date <= endDate;
      }

      return matchesSearch && matchesCategory && matchesType && matchesFeeMethod && matchesDate;
    });
  }, [transactions, searchTerm, filterBankId, filterType, filterFeeMethod, startDate, endDate]);

  const filteredTotals = useMemo(() => {
    let deposits = 0;
    let withdrawals = 0;
    let totalFees = 0;
    
    filteredTransactions.forEach(tx => {
      if (tx.type === TransactionType.IN) {
        deposits += tx.amount;
      } else {
        withdrawals += tx.amount;
      }
      totalFees += tx.fee;
    });

    return {
      deposits,
      withdrawals,
      totalFees,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const clearFilters = () => {
    setFilterBankId('ALL');
    setFilterType('ALL');
    setFilterFeeMethod('ALL');
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
  };

  const getLogo = (bankId: string) => {
    switch(bankId) {
        case 'KBZ': return kbzLogoUrl;
        case 'Wave': return waveLogoUrl;
        case 'AYAPay': return ayaLogoUrl;
        case 'UABPay': return uabLogoUrl;
        case 'TrueMoney': return trueLogoUrl;
        default: return cashLogoUrl;
    }
  };

  const getDefaultLogo = (bankId: string) => {
    const name = bankId.toLowerCase();
    if (name.includes('kbz')) return KBZLogo;
    if (name.includes('wave')) return WaveLogo;
    if (name.includes('aya')) return AYALogo;
    if (name.includes('uab')) return UABLogo;
    if (name.includes('true')) return TrueLogo;
    return CashLogo;
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Date', 'Time', 'Account', 'Type', 'Phone', 'Account Name', 'Amount', 'Fee', 'Raw Timestamp'];
    const rows = filteredTransactions.map(tx => {
      let tsStr = '';
      if (tx.createdAt) {
        try {
          if (typeof tx.createdAt.toDate === 'function') {
            tsStr = tx.createdAt.toDate().toISOString();
          } else {
            tsStr = new Date(tx.createdAt).toISOString();
          }
        } catch (e) {
          tsStr = String(tx.createdAt);
        }
      }
      return [
        tx.date,
        tx.createdAt ? formatTime(tx.createdAt) : '',
        tx.category,
        tx.type === TransactionType.IN ? 'Deposit' : 'Withdraw',
        tx.phoneNumber || '',
        tx.accountName || '',
        tx.amount,
        tx.fee,
        tsStr
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `money_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onExport?.();
  };

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) return;

    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text('Z Money Tracker Report', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Enterprise Ledger POS Service Edition`, 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 34);
    
    // Horizontal line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 38, 196, 38);

    const tableColumn = ["ID", "Date & Time", "Account", "Type", "Phone", "Account Name", "Amount", "Fee"];
    const tableRows = filteredTransactions.map(tx => [
      tx._seqId,
      tx.createdAt ? `${tx.date} ${formatTime(tx.createdAt)}` : tx.date,
      tx.category,
      tx.type === TransactionType.IN ? 'Deposit' : 'Withdraw',
      tx.phoneNumber || '-',
      tx.accountName || '-',
      f(tx.amount),
      f(tx.fee)
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'striped',
      headStyles: { 
        fillColor: [79, 70, 229], 
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        5: { halign: 'center' },
        6: { halign: 'right' },
        7: { halign: 'right' }
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 4,
        font: 'helvetica'
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        const str = `Page ${data.pageNumber}`;
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`money_tracker_ledger_${new Date().toISOString().split('T')[0]}.pdf`);
    onExport?.();
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 sleek-shadow flex flex-col overflow-hidden h-full transition-colors">
      <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white dark:bg-[#0f172a] transition-colors">
        <div className="space-y-0.5 shrink-0">
          <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-sm lg:text-base font-display">{language === 'MM' ? 'နောက်ဆုံးမှတ်တမ်းများ' : 'Recent Transactions'}</h3>
          <p className={`text-[9px] lg:text-[10px] uppercase font-display ${language === 'MM' ? 'tracking-normal text-slate-500 dark:text-slate-400 font-extrabold text-[11.5px]' : 'tracking-widest text-slate-400 dark:text-slate-500 font-bold'}`}>{language === 'MM' ? 'နောက်ဆုံးပြုလုပ်ခဲ့သောစာရင်းများ' : 'Latest wallet activity'}</p>
        </div>

        {/* Prominent Search Bar Component */}
        <div className="relative flex-1 max-w-full md:max-w-xs xl:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder={language === 'MM' ? 'ဖုန်းနံပါတ်၊ အကောင့်အမည် သို့မဟုတ် ပမာဏဖြင့် ရှာရန်...' : 'Search by phone, name, or amount...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 font-medium transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg transition-colors"
              title="Clear Search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto shrink-0">

          <button 
            onClick={() => {
              if (showFilters) {
                clearFilters();
              } else {
                setShowFilters(true);
              }
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 border ${language === 'MM' ? 'tracking-normal text-[11.5px] font-extrabold' : 'tracking-wider'} ${
              showFilters 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Filter size={14} />
            <span>{language === 'MM' ? 'စစ်ထုတ်ရန်' : 'Filters'}</span>
            {(filterBankId !== 'ALL' || filterType !== 'ALL' || filterFeeMethod !== 'ALL' || startDate || endDate) && (
              <span className="w-2 h-2 bg-rose-500 rounded-full ml-1"></span>
            )}
          </button>

          <button 
            onClick={handleExportPDF}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95 ${language === 'MM' ? 'tracking-normal text-[11.5px] font-extrabold' : 'tracking-wider'}`}
            disabled={filteredTransactions.length === 0}
          >
            <FileText size={14} />
            <span>{language === 'MM' ? 'PDF' : 'PDF'}</span>
          </button>
          
          <button 
            onClick={handleExportCSV}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 ${language === 'MM' ? 'tracking-normal text-[11.5px] font-extrabold' : 'tracking-wider'}`}
            disabled={filteredTransactions.length === 0}
          >
            <Download size={14} />
            <span>{language === 'MM' ? 'CSV' : 'CSV'}</span>
          </button>
          
          <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800 ml-1"></div>
          <span className={`text-[10px] font-black uppercase hidden sm:inline ml-1 ${language === 'MM' ? 'tracking-normal text-slate-505 dark:text-slate-350 font-extrabold text-[11.5px]' : 'tracking-widest text-slate-400 dark:text-slate-500'}`}>
            {language === 'MM' ? `စုစုပေါင်း ${filteredTransactions.length} ခု` : `${filteredTransactions.length} Entries`}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      {showFilters && (
        <div className="px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-4 bg-slate-50/90 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-all animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* Category Filter */}
            <div className="relative col-span-1">
              <Wallet className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select 
                value={filterBankId}
                onChange={(e) => setFilterBankId(e.target.value)}
                className="w-full pl-7.5 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs appearance-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">{language === 'MM' ? 'အကောင့်အားလုံး' : 'All Accounts'}</option>
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            {/* Type Filter */}
            <div className="relative col-span-1">
              <ArrowRightLeft className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-7.5 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs appearance-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">{language === 'MM' ? 'အမျိုးအစားအားလုံး' : 'All Types'}</option>
                <option value={TransactionType.IN}>{language === 'MM' ? 'ငွေသွင်း' : 'Deposit'}</option>
                <option value={TransactionType.OUT}>{language === 'MM' ? 'ငွေထုတ်' : 'Withdraw'}</option>
              </select>
              <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            {/* Fee Payment Method Filter */}
            <div className="relative col-span-2 sm:col-span-1">
              <Banknote className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <select 
                value={filterFeeMethod}
                onChange={(e) => setFilterFeeMethod(e.target.value as any)}
                className="w-full pl-7.5 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs appearance-none focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">{language === 'MM' ? 'ဝန်ဆောင်ခပေးစနစ်အားလုံး' : 'All Fee Methods'}</option>
                <option value="Cash">{language === 'MM' ? 'လက်ငင်း (Cash)' : 'Cash'}</option>
                <option value="Wallet">{language === 'MM' ? 'ဝေါလတ်ထဲမှ (Wallet)' : 'Wallet'}</option>
              </select>
              <ChevronDown className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            {/* Date Range */}
            <div className="flex gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
              <div className="relative flex-1">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-6 pr-1 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all font-medium text-slate-600 dark:text-slate-400"
                />
              </div>
              <div className="relative flex-1">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-6 pr-1 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-[10px] sm:text-xs focus:outline-none focus:ring-1.5 focus:ring-indigo-500 transition-all font-medium text-slate-600 dark:text-slate-400"
                />
              </div>
              <button 
                onClick={clearFilters}
                className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-lg sm:rounded-xl transition-colors shrink-0"
                title="Clear Filters"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Real-time Filtered Summary Counters */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/85">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 animate-in fade-in duration-300">
              {/* Total Transactions Count */}
              <div className="bg-white/85 dark:bg-slate-900/50 border border-slate-200/55 dark:border-slate-800/80 rounded-lg sm:rounded-xl p-2 sm:p-3 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-705">
                <span className="text-[8.5px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none">
                  {language === 'MM' ? 'ရှာဖွေတွေ့ရှိမှု' : 'Filtered Count'}
                </span>
                <span className="text-[11.5px] sm:text-base font-extrabold text-indigo-650 dark:text-indigo-400 mt-1 sm:mt-2 font-mono leading-none">
                  {f(filteredTotals.count)} <span className="text-[8.5px] sm:text-xs font-sans font-bold text-slate-500 dark:text-slate-400">{language === 'MM' ? 'ခု' : 'items'}</span>
                </span>
              </div>

              {/* Total Deposits */}
              <div className="bg-white/85 dark:bg-slate-900/50 border border-slate-200/55 dark:border-slate-800/80 rounded-lg sm:rounded-xl p-2 sm:p-3 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-705">
                <span className="text-[8.5px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none">
                  {language === 'MM' ? 'သွင်းငွေစုစုပေါင်း' : 'Total Deposits'}
                </span>
                <span className="text-[11.5px] sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2 font-mono leading-none">
                  {f(filteredTotals.deposits)} <span className="text-[8.5px] sm:text-xs font-sans font-bold text-slate-500 dark:text-slate-400">Ks</span>
                </span>
              </div>

              {/* Total Withdrawals */}
              <div className="bg-white/85 dark:bg-slate-900/50 border border-slate-200/55 dark:border-slate-800/80 rounded-lg sm:rounded-xl p-2 sm:p-3 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-705">
                <span className="text-[8.5px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none">
                  {language === 'MM' ? 'ထုတ်ငွေစုစုပေါင်း' : 'Total Withdrawals'}
                </span>
                <span className="text-[11.5px] sm:text-base font-extrabold text-rose-600 dark:text-rose-400 mt-1 sm:mt-2 font-mono leading-none">
                  {f(filteredTotals.withdrawals)} <span className="text-[8.5px] sm:text-xs font-sans font-bold text-slate-500 dark:text-slate-400">Ks</span>
                </span>
              </div>

              {/* Total Fees */}
              <div className="bg-white/85 dark:bg-slate-900/50 border border-slate-200/55 dark:border-slate-800/80 rounded-lg sm:rounded-xl p-2 sm:p-3 flex flex-col justify-between shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-705">
                <span className="text-[8.5px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block leading-none">
                  {language === 'MM' ? 'ဝန်ဆောင်ခစုစုပေါင်း' : 'Total Fees'}
                </span>
                <span className="text-[11.5px] sm:text-base font-extrabold text-amber-600 dark:text-amber-400 mt-1 sm:mt-2 font-mono leading-none">
                  {f(filteredTotals.totalFees)} <span className="text-[8.5px] sm:text-xs font-sans font-bold text-slate-500 dark:text-slate-400">Ks</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto scrollbar-hide flex-1">
        {/* Desktop Table */}
        <table className="w-full text-left hidden lg:table">
          <thead className={`bg-[#4f46e5] text-white text-[10px] lg:text-[11.5px] uppercase font-black sticky top-0 z-10 transition-colors font-display ${language === 'MM' ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
            <tr>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'အမှတ်' : 'ID'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'ရက်စွဲ / အချိန်' : 'Date / Time'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'အကောင့်' : 'Account'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'အမျိုးအစား' : 'Type'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'ဖုန်းနံပါတ်' : 'Phone'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'အကောင့်အမည်' : 'Owner Name'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'ပမာဏ' : 'Amount'}</th>
              <th className={`px-4 py-2.5 text-center ${language === 'MM' ? 'tracking-normal font-black text-[13px] py-3' : 'tracking-wider py-2'}`}>{language === 'MM' ? 'ဝန်ဆောင်ခ' : 'Fee'}</th>
              <th className="px-4 py-2 w-12 text-center text-indigo-200">
                <Trash2 size={14} className="mx-auto opacity-50" />
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800/50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200 dark:text-slate-700 rounded-full">
                      <History size={24} />
                    </div>
                    <p className="text-slate-400 dark:text-slate-600 font-bold text-xs uppercase tracking-widest">
                      {searchTerm || filterBankId !== 'ALL' || filterType !== 'ALL' || startDate || endDate
                        ? (language === 'MM' ? 'ရှာဖွေမှုရလဒ် မရှိပါ' : 'No matching results found')
                        : (language === 'MM' ? 'မှတ်တမ်း မရှိသေးပါ' : 'No transactions recorded yet')
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, idx) => (
                <tr key={tx.id} className={`transition-colors group ${
                  idx % 2 === 0 
                    ? 'bg-white dark:bg-[#0f172a]' 
                    : 'bg-slate-100/70 dark:bg-slate-800/30'
                } hover:bg-slate-100/40 dark:hover:bg-slate-900/50`}>
                  <td className="px-4 py-2 text-center">
                    <span className="font-bold text-[12.5px] text-slate-600 dark:text-slate-300">
                      #<Highlight text={tx._seqId} highlight={searchTerm} />
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-[11.5px]">{tx.date}</span>
                      {tx.createdAt && (
                        <span className="font-semibold text-slate-450 dark:text-slate-400 text-[9.5px] font-mono mt-0.5">
                          {formatTime(tx.createdAt)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="inline-flex items-center gap-2 w-20 text-left">
                       <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded-sm bg-slate-50 dark:bg-slate-800 shrink-0">
                         {getLogo(tx.category) ? (
                           <img src={getLogo(tx.category)} alt={tx.category} className="w-full h-full object-contain" />
                         ) : (
                           getDefaultLogo(tx.category)({ className: "w-full h-full" })
                         )}
                       </div>
                       <span className="font-bold text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs uppercase tracking-tight leading-none">
                         <Highlight text={tx.category} highlight={searchTerm} />
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                      tx.type === TransactionType.IN 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-500' 
                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-500'
                    }`}>
                      {tx.type === TransactionType.IN ? (language === 'MM' ? 'ငွေသွင်း' : 'Deposit') : (language === 'MM' ? 'ငွေထုတ်' : 'Withdraw')}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="font-extrabold font-display text-indigo-600 dark:text-sky-400 text-[13px] tracking-tight">
                      {tx.phoneNumber ? <Highlight text={tx.phoneNumber} highlight={searchTerm} /> : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {tx.accountName ? (
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-xs tracking-wider uppercase">
                        <Highlight text={tx.accountName} highlight={searchTerm} />
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="font-black font-display text-slate-900 dark:text-white text-sm">
                      <Highlight text={f(tx.amount)} highlight={searchTerm} />
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="font-extrabold font-display text-emerald-600 dark:text-emerald-400 text-[13.5px]">
                        <Highlight text={f(tx.fee)} highlight={searchTerm} />
                      </span>
                      {tx.feePaymentMethod === 'Wallet' && (
                        <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-normal bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                          {language === 'MM' ? 'ပေါင်းလွှဲ' : 'Wallet'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        if (tx.id) {
                          onBulkDelete([tx.id]);
                        }
                      }}
                      className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredTransactions.length === 0 ? (
            <div className="px-8 py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 transition-colors">
                  <History size={20} />
                </div>
                <p className="text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                  {searchTerm || filterBankId !== 'ALL' || filterType !== 'ALL' || startDate || endDate
                    ? (language === 'MM' ? 'ရှာဖွေမှုရလဒ် မရှိပါ' : 'No matching results found')
                    : (language === 'MM' ? 'မှတ်တမ်း မရှိသေးပါ' : 'No transactions yet')
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTx(tx)}
                className={`p-4 sm:p-5 grid grid-cols-12 items-center gap-2 sm:gap-3 transition-all cursor-pointer ${
                  idx % 2 === 0 
                    ? 'bg-white dark:bg-[#0f172a]' 
                    : 'bg-slate-100/70 dark:bg-slate-800/30'
                } hover:bg-slate-50 dark:hover:bg-slate-900/40 active:bg-indigo-50/45 dark:active:bg-indigo-950/20`}
              >
                <div className="col-span-4 sm:col-span-5 flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center p-1 overflow-hidden bg-slate-50 dark:bg-slate-850 transition-colors shrink-0 shadow-sm border border-slate-100 dark:border-slate-800">
                    {getLogo(tx.category) ? (
                      <img src={getLogo(tx.category)} alt={tx.category} className="w-full h-full object-contain" />
                    ) : (
                      getDefaultLogo(tx.category)({ className: "w-full h-full" })
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                       <span className="font-extrabold text-slate-900 dark:text-white text-[14px] sm:text-base font-display whitespace-nowrap leading-none"><Highlight text={f(tx.amount)} highlight={searchTerm} /></span>
                       <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider font-display shrink-0 px-1 py-0.5 rounded ${
                         tx.type === TransactionType.IN 
                           ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' 
                           : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                       }`}>
                         {tx.type === TransactionType.IN ? (language === 'MM' ? 'သွင်း' : 'In') : (language === 'MM' ? 'ထုတ်' : 'Out')}
                       </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold font-display truncate">
                      <span className="shrink-0 text-slate-700 dark:text-slate-200 font-extrabold">{tx.date}</span>
                      {tx.createdAt && (
                        <>
                          <span className="opacity-45 shrink-0">•</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300 text-[9.5px]/none shrink-0">{formatTime(tx.createdAt)}</span>
                        </>
                      )}
                      <span className="opacity-50 shrink-0">•</span>
                      <span className="uppercase truncate text-slate-600 dark:text-slate-400 font-black"><Highlight text={tx.category} highlight={searchTerm} /></span>
                      <span className="opacity-50 shrink-0">•</span>
                      <span className="shrink-0 font-extrabold text-slate-600 dark:text-slate-300 text-[10px]">
                        #<Highlight text={tx._seqId} highlight={searchTerm} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center min-w-0 space-y-1 text-center">
                  {tx.phoneNumber ? (
                    <span className="text-[12.5px] sm:text-[14px] text-indigo-650 dark:text-sky-400 font-extrabold font-mono tracking-tight whitespace-nowrap leading-none block">
                      <Highlight text={tx.phoneNumber} highlight={searchTerm} />
                    </span>
                  ) : null}
                  {tx.accountName ? (
                    <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-black tracking-normal uppercase bg-amber-50/75 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-100/50 dark:border-amber-900/20 leading-tight block max-w-full truncate">
                      <Highlight text={tx.accountName} highlight={searchTerm} />
                    </span>
                  ) : null}
                </div>
                
                <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1 sm:gap-2 min-w-0">
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 mb-1 leading-snug">
                      <p className="text-[9.5px] sm:text-[10px] text-slate-800 dark:text-slate-200 font-black uppercase tracking-wider font-sans">{language === 'MM' ? 'ဝန်ဆောင်ခ' : 'fee'}</p>
                      {tx.feePaymentMethod === 'Wallet' && (
                        <span className="text-[7.5px] sm:text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-normal bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                          {language === 'MM' ? 'ပေါင်းလွှဲ' : 'Wallet'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-sans tracking-tight leading-none mt-0.5"><Highlight text={f(tx.fee)} highlight={searchTerm}/></p>
                  </div>
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (tx.id) {
                          onBulkDelete([tx.id]);
                        }
                    }}
                    className="p-1 sm:p-1.5 text-slate-300 dark:text-slate-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Detail Modal for Mobile */}
      {selectedTx && (
        <div 
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setSelectedTx(null)}
        >
          <div 
            className="bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-[20px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/85 flex items-center justify-between">
              <span className="font-extrabold text-slate-950 dark:text-white text-[13.5px] font-display uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <FileText size={15} className="text-indigo-500" />
                {language === 'MM' ? 'လုပ်ငန်းအသေးစိတ်' : 'Transaction Info'}
              </span>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-4">
              {/* Giant Amount display & Type */}
              <div className="text-center py-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden p-1.5 bg-white dark:bg-slate-800 shadow-xs mb-2 border border-slate-150 dark:border-slate-700">
                  {getLogo(selectedTx.category) ? (
                    <img src={getLogo(selectedTx.category)} alt={selectedTx.category} className="w-full h-full object-contain" />
                  ) : (
                    getDefaultLogo(selectedTx.category)({ className: "w-full h-full" })
                  )}
                </div>
                
                <span className="text-[10px] font-black uppercase text-slate-455 dark:text-slate-500 tracking-widest block font-display leading-none">
                  {getBankName(selectedTx.category)} • {selectedTx.type === TransactionType.IN ? (language === 'MM' ? 'ငွေသွင်း' : 'Deposit') : (language === 'MM' ? 'ငွေထုတ်' : 'Withdraw')}
                </span>

                <span className="text-2xl font-black font-display text-slate-900 dark:text-white mt-2 block leading-none">
                  {f(selectedTx.amount)} <span className="text-xs font-sans font-black text-slate-400 dark:text-slate-500">Ks</span>
                </span>
              </div>

              {/* Grid Details */}
              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-800 dark:text-slate-300">
                {/* ID/SEQ */}
                <div className="flex items-center justify-between py-2 first:pt-0 border-none">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9.5px] tracking-wider">{language === 'MM' ? 'အမှတ်စဉ်' : 'ID Number'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-[13px] tracking-wide">
                    #{selectedTx._seqId}
                  </span>
                </div>

                {/* Date / Time */}
                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9.5px] tracking-wider">{language === 'MM' ? 'ရက်စွဲနှင့်အချိန်' : 'Date & Time'}</span>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{selectedTx.date}</span>
                    {selectedTx.createdAt && (
                      <span className="font-medium text-slate-400 dark:text-slate-500 text-[10px] font-mono block mt-0.5">
                        {formatTime(selectedTx.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                {selectedTx.phoneNumber && (
                  <div className="flex items-center justify-between py-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9.5px] tracking-wider">{language === 'MM' ? 'ဖုန်းနံပါတ်' : 'Phone Number'}</span>
                    <span className="font-black font-mono text-indigo-600 dark:text-sky-400 text-[13px] tracking-tight">
                      {selectedTx.phoneNumber}
                    </span>
                  </div>
                )}

                {/* Account Name */}
                {selectedTx.accountName && (
                  <div className="flex items-center justify-between py-2">
                    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9.5px] tracking-wider">{language === 'MM' ? 'အကောင့်ပိုင်ရှင်' : 'Owner Name'}</span>
                    <span className="font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] font-display">
                      {selectedTx.accountName}
                    </span>
                  </div>
                )}

                {/* Service Fee */}
                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[9.5px] tracking-wider">{language === 'MM' ? 'ဝန်ဆောင်ခ' : 'Service Fee'}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {f(selectedTx.fee)} <span className="text-[10px] font-sans font-bold text-slate-400">Ks</span>
                    </span>
                    {selectedTx.feePaymentMethod === 'Wallet' && (
                      <span className="text-[8px] font-black text-amber-605 dark:text-amber-400 uppercase tracking-normal bg-amber-50 dark:bg-amber-950/40 px-1 py-0.5 rounded border border-amber-100 dark:border-amber-900/30 mt-0.5 font-display">
                        {language === 'MM' ? 'ပေါင်းလွှဲ' : 'Wallet'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-850 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-250 rounded-xl text-xs font-black uppercase tracking-wider transition-colors active:scale-95 font-display"
              >
                {language === 'MM' ? 'ပိတ်မည်' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
