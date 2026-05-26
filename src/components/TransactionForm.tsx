import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Minus, Calendar, Sparkles, Coins, Wallet, History } from 'lucide-react';
import { TransactionType, Transaction } from '../types';
import { KBZLogo, WaveLogo, AYALogo, CashLogo, UABLogo, TrueLogo } from './Logos';

interface TransactionFormProps {
  onAdd: (tx: {
    date: string;
    category: string;
    type: TransactionType;
    amount: number;
    fee: number;
    phoneNumber?: string;
    accountName?: string;
    feePaymentMethod?: 'Cash' | 'Wallet';
  }) => void;
  transactions?: Transaction[];
  percentIn: number;
  percentOut: number;
  language: 'MM' | 'EN';
  kbzLogoUrl?: string;
  waveLogoUrl?: string;
  ayaLogoUrl?: string;
  cashLogoUrl?: string;
  uabLogoUrl?: string;
  trueLogoUrl?: string;
  kbzEnabled: boolean;
  waveEnabled: boolean;
  ayaEnabled: boolean;
  cashEnabled: boolean;
  uabEnabled: boolean;
  trueEnabled: boolean;
}

export default function TransactionForm({ 
  onAdd, 
  transactions = [],
  percentIn, 
  percentOut, 
  language,
  kbzLogoUrl,
  waveLogoUrl,
  ayaLogoUrl,
  cashLogoUrl,
  uabLogoUrl,
  trueLogoUrl,
  kbzEnabled,
  waveEnabled,
  ayaEnabled,
  cashEnabled,
  uabEnabled,
  trueEnabled
}: TransactionFormProps) {
  const banks = [
    { id: 'KBZ', name: 'KBZ Pay', logo: kbzLogoUrl, CustomLogo: KBZLogo, enabled: kbzEnabled },
    { id: 'Wave', name: 'Wave', logo: waveLogoUrl, CustomLogo: WaveLogo, enabled: waveEnabled },
    { id: 'AYAPay', name: 'AYAPay', logo: ayaLogoUrl, CustomLogo: AYALogo, enabled: ayaEnabled },
    { id: 'UABPay', name: 'UAB Pay', logo: uabLogoUrl, CustomLogo: UABLogo, enabled: uabEnabled },
    { id: 'TrueMoney', name: 'True Money', logo: trueLogoUrl, CustomLogo: TrueLogo, enabled: trueEnabled },
    { id: 'Cash', name: 'Cash', logo: cashLogoUrl, CustomLogo: CashLogo, enabled: cashEnabled },
  ].filter(b => b.enabled);

  const firstEnabled = banks[0]?.id || '';
  const [categoryId, setCategoryId] = useState<string>(firstEnabled);

  useEffect(() => {
    if (banks.length > 0 && !banks.some(b => b.id === categoryId)) {
      setCategoryId(banks[0].id);
    }
  }, [kbzEnabled, waveEnabled, ayaEnabled, cashEnabled, uabEnabled, trueEnabled, categoryId]);
  
  const [type, setType] = useState<TransactionType>(TransactionType.IN);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [hasManuallyEditedName, setHasManuallyEditedName] = useState(false);
  const [fee, setFee] = useState('');
  const [isManualFee, setIsManualFee] = useState(false);
  const [feePaymentMethod, setFeePaymentMethod] = useState<'Cash' | 'Wallet'>('Cash');
  const [showNumberSuggestions, setShowNumberSuggestions] = useState(false);

  const getCleanAmount = (val: string) => {
    return Number(val.replace(/,/g, '')) || 0;
  };

  // Keep fee aligned with amount/rate if not manually overridden
  useEffect(() => {
    if (!isManualFee) {
      const parsedAmount = getCleanAmount(amount);
      const rate = type === TransactionType.IN ? percentIn : percentOut;
      const calculated = parsedAmount * rate / 100;
      setFee(calculated > 0 ? calculated.toFixed(0) : '');
    }
  }, [amount, type, percentIn, percentOut, isManualFee]);

  // Build unique contact list from history
  const contacts = useMemo(() => {
    const map = new Map<string, string>(); // standardized phone -> uppercase name
    [...transactions].forEach(t => {
      if (t.phoneNumber && t.accountName) {
        const cleanPhone = t.phoneNumber.replace(/\D/g, '');
        if (cleanPhone.length >= 5) {
          map.set(cleanPhone, t.accountName.trim().toUpperCase());
        }
      }
    });
    return Array.from(map.entries()).map(([phone, name]) => ({ phone, name }));
  }, [transactions]);

  // Find name registered to phone number from previous transactions (exact match)
  const matchedHistoryName = useMemo(() => {
    if (!phoneNumber) return null;
    const cleanInput = phoneNumber.replace(/\D/g, '');
    if (cleanInput.length < 5) return null;
    
    // Search from most recent to oldest
    const found = [...transactions].reverse().find(t => {
      if (!t.phoneNumber || !t.accountName) return false;
      const cleanTxPhone = t.phoneNumber.replace(/\D/g, '');
      return cleanTxPhone === cleanInput;
    });
    return found ? found.accountName : null;
  }, [phoneNumber, transactions]);

  // Build suggestions list for partial match of phone numbers
  const suggestedContacts = useMemo(() => {
    const cleanInput = phoneNumber.replace(/\D/g, '');
    if (!cleanInput) {
      // Find the 3 most recent unique contacts with both name and phone
      const recent: { phone: string; name: string }[] = [];
      const seen = new Set<string>();
      
      for (let i = transactions.length - 1; i >= 0; i--) {
        const tx = transactions[i];
        if (tx.phoneNumber && tx.accountName) {
          const cleanPhone = tx.phoneNumber.replace(/\D/g, '');
          if (cleanPhone.length >= 5 && !seen.has(cleanPhone)) {
            seen.add(cleanPhone);
            recent.push({
              phone: cleanPhone,
              name: tx.accountName.trim().toUpperCase()
            });
            if (recent.length >= 3) break;
          }
        }
      }
      return recent;
    }
    // Filter matching contacts
    return contacts
      .filter(c => c.phone.includes(cleanInput))
      .slice(0, 5);
  }, [phoneNumber, contacts, transactions]);

  // Auto-lookup account name from phone number
  useEffect(() => {
    if (!phoneNumber) {
      setHasManuallyEditedName(false);
      return;
    }
    
    if (!hasManuallyEditedName && matchedHistoryName) {
      setAccountName(matchedHistoryName);
    } else if (!hasManuallyEditedName && !matchedHistoryName) {
      setAccountName('');
    }
  }, [phoneNumber, matchedHistoryName, hasManuallyEditedName]);

  const handleAutoFill = () => {
    // Find the most recent transaction matching the currently selected category (wallet)
    const lastMatchingTx = transactions.find(t => t.category === categoryId);
    if (lastMatchingTx) {
      setAmount(lastMatchingTx.amount.toString());
      setPhoneNumber(lastMatchingTx.phoneNumber || '');
      setAccountName(lastMatchingTx.accountName || '');
      setHasManuallyEditedName(false);
      if (lastMatchingTx.feePaymentMethod && categoryId !== 'Cash') {
        setFeePaymentMethod(lastMatchingTx.feePaymentMethod);
      }
      // Re-trigger auto-calc on autofill
      setIsManualFee(false);
    }
  };

  const handleSubmit = (e: React.FormEvent, selectedType?: TransactionType) => {
    e.preventDefault();
    const finalType = selectedType || type;
    const parsedAmount = getCleanAmount(amount);
    if (!amount || parsedAmount <= 0 || !categoryId) return;
    
    const finalFee = isManualFee ? getCleanAmount(fee) : (parsedAmount * (finalType === TransactionType.IN ? percentIn : percentOut) / 100);

    // Automatically compute correct local date (YYYY-MM-DD)
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    const currentDate = localDate.toISOString().split('T')[0];

    onAdd({
      date: currentDate,
      category: categoryId,
      type: finalType,
      amount: parsedAmount,
      fee: finalFee,
      phoneNumber: phoneNumber || undefined,
      accountName: accountName ? accountName.trim().toUpperCase() : undefined,
      feePaymentMethod: categoryId === 'Cash' ? 'Cash' : feePaymentMethod
    });
    setAmount('');
    setPhoneNumber('');
    setAccountName('');
    setFee('');
    setIsManualFee(false);
    setHasManuallyEditedName(false);
    // Keep or reset fee payment mode
  };

  const f = (n: number) => n.toLocaleString();

  const currentCleanAmount = getCleanAmount(amount);
  const calculatedFeeIn = currentCleanAmount * percentIn / 100;
  const calculatedFeeOut = currentCleanAmount * percentOut / 100;

  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="space-y-4">
        {/* Wallet Selection at Full Width */}
        <div className="space-y-2">
          <label className={`text-[10.5px] font-black uppercase px-1 flex items-center gap-2 transition-colors font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {language === 'MM' ? 'အကောင့်အမျိုးအစား' : 'Select Wallet'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {banks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                disabled={!bank.enabled}
                onClick={() => setCategoryId(bank.id)}
                className={`flex items-center gap-2.5 p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 ${
                  !bank.enabled
                    ? 'opacity-40 grayscale bg-slate-100/30 dark:bg-slate-900/10 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed select-none'
                    : categoryId === bank.id 
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold scale-[1.01]' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center overflow-hidden rounded-lg shrink-0">
                  {bank.logo ? (
                    <img src={bank.logo} alt={bank.name} className={`w-full h-full object-contain ${categoryId === bank.id ? '' : 'opacity-60 grayscale'}`} />
                  ) : bank.CustomLogo ? (
                    <bank.CustomLogo className={`w-full h-full ${categoryId === bank.id ? '' : 'opacity-60 grayscale'}`} />
                  ) : (
                    <div className={`w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black ${categoryId === bank.id ? '' : 'opacity-60'}`}>{bank.name.slice(0, 3)}</div>
                  )}
                </div>
                <div className="text-left">
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider block leading-none ${categoryId === bank.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>{bank.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Amount, Phone Number Inputs */}
        <div className="space-y-3 pt-2">
          {/* Action Row */}
          <div className="flex justify-between items-center px-1">
            <span className={`text-[10.5px] sm:text-xs font-black uppercase font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-widest text-slate-450 dark:text-slate-500'}`}>
               {language === 'MM' ? 'အသေးစိတ်အချက်အလက်' : 'Details'}
            </span>
            <button
               type="button"
               onClick={handleAutoFill}
               disabled={!transactions.some(t => t.category === categoryId)}
               className="text-[10px] sm:text-[11px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-all bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 px-2.5 py-1 sm:py-1.5 rounded-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
               <History size={13} />
               {language === 'MM' ? 'နောက်ဆုံးစာရင်း ဖြည့်ရန်' : 'Auto-fill from last'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className={`text-[10.5px] font-black uppercase px-1 flex items-center gap-2 font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {language === 'MM' ? 'ငွေပမာဏ (ကျပ်)' : 'Transfer Amount'}
              </label>
              <div className="relative group h-12">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pr-16 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800/85 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-650"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-indigo-50/80 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100/60 dark:border-indigo-800/50 pointer-events-none">
                  <Sparkles size={10} className="text-indigo-500" />
                  <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Net</span>
                </div>
              </div>
            </div>

            {/* Custom Profit/Fee Input */}
            <div className="space-y-1.5">
              <label className={`text-[10.5px] font-black uppercase px-1 flex items-center justify-between font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {language === 'MM' ? 'ကော်မရှင် / ဝန်ဆောင်ခ (ကျပ်)' : 'Service Fee (MMK)'}
                </span>
                {isManualFee && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualFee(false);
                      const parsedAmount = getCleanAmount(amount);
                      const rate = type === TransactionType.IN ? percentIn : percentOut;
                      const calculated = parsedAmount * rate / 100;
                      setFee(calculated > 0 ? calculated.toFixed(0) : '');
                    }}
                    className="text-[9px] font-bold text-indigo-500 hover:underline hover:text-indigo-600 dark:text-indigo-400"
                  >
                    {language === 'MM' ? 'အော်တိုပြန်တွက်ရန်' : 'Reset to auto-calc'}
                  </button>
                )}
              </label>
              <div className="relative group h-12">
                <input
                  type="text"
                  inputMode="decimal"
                  value={fee}
                  onChange={e => {
                    setFee(e.target.value);
                    setIsManualFee(true);
                  }}
                  placeholder="0"
                  className="w-full h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pr-16 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800/85 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-650"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-50/80 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg border border-emerald-100/60 dark:border-emerald-800/50 pointer-events-none">
                  <Coins size={10} className="text-emerald-500" />
                  <span className={`text-[8px] font-black text-emerald-650 dark:text-emerald-400 uppercase ${language === 'MM' ? 'tracking-normal text-[9.5px] font-extrabold pr-0.5' : 'tracking-tight'}`}>
                    {isManualFee ? (language === 'MM' ? 'ကိုယ်တိုင်' : 'Manual') : (language === 'MM' ? 'အလိုအလျောက်' : 'Auto')}
                  </span>
                </div>
              </div>
            </div>
            
             {/* Phone Number Input */}
             <div className="space-y-1.5 relative">
               <label className={`text-[10.5px] font-black uppercase px-1 flex items-center gap-2 font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 {language === 'MM' ? 'ဖုန်းနံပါတ်' : 'Phone Number'}
               </label>
               <div className="relative group h-12">
                 <input
                   type="tel"
                   value={phoneNumber}
                   onChange={e => setPhoneNumber(e.target.value)}
                   onFocus={() => setShowNumberSuggestions(true)}
                   onBlur={() => setTimeout(() => setShowNumberSuggestions(false), 250)}
                   placeholder="09..."
                   className="w-full h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800/85 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-650"
                 />
               </div>

               {/* Suggestions Dropdown */}
               {showNumberSuggestions && suggestedContacts.length > 0 && (
                 <div className="absolute left-0 right-0 top-[102%] mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-150">
                   <div className="px-3 py-1 bg-slate-50/50 dark:bg-slate-950/40 text-[9px] font-black uppercase text-slate-400 dark:text-slate-550 sticky top-0 tracking-widest backdrop-blur-sm z-10 border-b border-slate-105/10">
                     {phoneNumber ? (language === 'MM' ? 'အနီးစပ်ဆုံး တိုက်ဆိုင်မှုများ' : 'Suggested Contacts') : (language === 'MM' ? 'မကြာသေးမီက ဆက်သွယ်သူများ' : 'Recent Contacts')}
                   </div>
                   {suggestedContacts.map((contact, idx) => (
                     <button
                       key={idx}
                       type="button"
                       onMouseDown={(e) => {
                         e.preventDefault(); // Prevents triggers of onBlur and loses selection
                         setPhoneNumber(contact.phone);
                         setAccountName(contact.name);
                         setHasManuallyEditedName(false);
                         setShowNumberSuggestions(false);
                       }}
                       className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 flex items-center justify-between transition-colors group/item"
                     >
                       <div className="flex flex-col">
                         <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400">
                           {contact.phone}
                         </span>
                         <span className="text-[11px] font-semibold text-slate-550 dark:text-slate-450 mt-0.5">
                           {contact.name}
                         </span>
                       </div>
                       <div className="flex items-center gap-1.5 opacity-60 group-hover/item:opacity-100 transition-opacity">
                         <span className="text-[8.5px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">
                           {language === 'MM' ? 'ရွေးရန်' : 'Select'}
                         </span>
                         <Sparkles size={11} className="text-emerald-500" />
                       </div>
                     </button>
                   ))}
                 </div>
               )}
             </div>

            {/* Account Name Input */}
            <div className="space-y-1.5">
              <label className={`text-[10.5px] font-black uppercase px-1 flex items-center justify-between w-full font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {language === 'MM' ? 'အကောင့်အမည်' : 'Account Name'}
                </span>
                {matchedHistoryName && (
                  <span className="text-[8.5px] sm:text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-55/70 dark:bg-emerald-950/25 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse tracking-wide select-none capitalize">
                    <Sparkles size={8.5} className="shrink-0 text-emerald-500" />
                    {language === 'MM' ? 'ယခင်မှတ်တမ်းတွေ့ရှိသည်' : 'From History'}
                  </span>
                )}
              </label>
              <div className="relative group h-12">
                <input
                  type="text"
                  value={accountName}
                  onChange={e => {
                    setAccountName(e.target.value.toUpperCase());
                    setHasManuallyEditedName(true);
                  }}
                  placeholder={language === 'MM' ? 'အကောင့်ပိုင်ရှင်အမည်...' : 'Account holder name...'}
                  className="w-full h-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800/85 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-700 placeholder:text-slate-300 dark:placeholder:text-slate-650"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fee Payment Method Selection */}
        {categoryId !== 'Cash' && (
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
            <label className={`text-[10.5px] font-black uppercase px-1 flex items-center gap-2 transition-colors font-display ${language === 'MM' ? 'tracking-normal text-slate-600 dark:text-slate-300 font-extrabold text-[12px]' : 'tracking-[0.20em] text-slate-450 dark:text-slate-500'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {language === 'MM' ? 'ကော်မရှင် / ဝန်ဆောင်ခ ရရှိပုံ' : 'Fee Payment Method'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFeePaymentMethod('Cash')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                  feePaymentMethod === 'Cash'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold scale-[1.01]'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Coins size={15} className={feePaymentMethod === 'Cash' ? 'text-emerald-500' : 'text-slate-400'} />
                <div className="text-left leading-none">
                  <span className={`text-[11.5px] font-black uppercase block ${language === 'MM' ? 'tracking-normal font-extrabold text-[12.5px]' : 'tracking-wider'}`}>
                    {language === 'MM' ? 'Cash နဲ့ပေးချေ' : 'Cash Payment'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFeePaymentMethod('Wallet')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-300 ${
                  feePaymentMethod === 'Wallet'
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold scale-[1.01]'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Wallet size={15} className={feePaymentMethod === 'Wallet' ? 'text-amber-500' : 'text-slate-400'} />
                <div className="text-left leading-none">
                  <span className={`text-[11.5px] font-black uppercase block ${language === 'MM' ? 'tracking-normal font-extrabold text-[12.5px]' : 'tracking-wider'}`}>
                    {language === 'MM' ? 'Transfer ထဲပေါင်းလွှဲ' : 'Include in Transfer'}
                  </span>
                </div>
              </button>
            </div>
            <p className="text-[9px] text-slate-450 dark:text-slate-500 italic px-1 leading-normal">
              {feePaymentMethod === 'Cash'
                ? (language === 'MM' ? '* ဝန်ဆောင်ခကို ကတ်စတမ်မာက Cash (လက်ငင်း) ပေးချေသည်။ (လက်ကျန် Cash ထဲပေါင်းထည့်မည်)' : '* Service fee is paid in Cash. (Will be added to Cash balance)')
                : (language === 'MM' ? `* ဝန်ဆောင်ခကို Transfer ထဲပေါင်းပြီး ${categoryId} wallet စာရင်းထဲသို့ ထည့်သွင်းတွက်ချက်မည်` : `* Service fee is included in transfer and credited to your ${categoryId} digital wallet.`)}
            </p>
          </div>
        )}
      </div>
      
      {/* Action Area */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 transition-colors">
        <button
          onClick={(e) => handleSubmit(e as any, TransactionType.IN)}
          className="group relative h-14 lg:h-16 flex items-center justify-between px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md shrink-0">
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            </div>
            <div className="text-left font-display">
              <h4 className="font-extrabold text-xs sm:text-sm tracking-tight leading-none">{language === 'MM' ? 'ငွေသွင်းရန်' : 'Deposit'}</h4>
            </div>
          </div>

          <div className="text-right relative z-10">
            <p className={`text-[8px] font-black text-white/90 uppercase leading-none mb-1 ${language === 'MM' ? 'tracking-normal text-[10px]' : 'tracking-widest'}`}>{language === 'MM' ? 'ကော်မရှင်' : 'Fee'} ({percentIn}%)</p>
            <p className="font-black text-xs sm:text-sm tracking-tighter leading-none">+{f(calculatedFeeIn)}</p>
          </div>
        </button>

        <button
          onClick={(e) => handleSubmit(e as any, TransactionType.OUT)}
          className="group relative h-14 lg:h-16 flex items-center justify-between px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md shrink-0">
              <Minus size={16} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left font-display">
              <h4 className="font-extrabold text-xs sm:text-sm tracking-tight leading-none">{language === 'MM' ? 'ငွေထုတ်ရန်' : 'Withdraw'}</h4>
            </div>
          </div>

          <div className="text-right relative z-10">
            <p className={`text-[8px] font-black text-white/90 uppercase leading-none mb-1 ${language === 'MM' ? 'tracking-normal text-[10px]' : 'tracking-widest'}`}>{language === 'MM' ? 'ကော်မရှင်' : 'Fee'} ({percentOut}%)</p>
            <p className="font-black text-xs sm:text-sm tracking-tighter leading-none">+{f(calculatedFeeOut)}</p>
          </div>
        </button>
      </div>
    </div>
  );
}
