import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CreditCard, MessageSquare, ExternalLink, Copy, Check, Phone, Send, Info, Loader2, Key } from 'lucide-react';
import { GlobalSettings } from '../types';

interface AccessDeniedProps {
  userId: string;
  globalSettings?: GlobalSettings;
  language: 'MM' | 'EN';
  onRefresh: () => void;
  onSignOut: () => void;
  refreshing: boolean;
  onGoToActivation: () => void;
}

export default function AccessDenied({ 
  userId, 
  globalSettings = {}, 
  language, 
  onRefresh, 
  onSignOut,
  refreshing,
  onGoToActivation
}: AccessDeniedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  const getMessengerUrl = () => {
    const value = globalSettings.adminMessenger;
    if (!value) return 'https://m.me/zinkokoaung';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://m.me/${value}`;
  };

  const getTelegramUrl = () => {
    const value = globalSettings.adminTelegram;
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://t.me/${value}`;
  };

  const getViberUrl = () => {
    const value = globalSettings.adminViber;
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    
    // Clean the number and format for international protocol
    let cleanNum = value.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('09')) {
      cleanNum = '959' + cleanNum.substring(2);
    }
    
    return `viber://chat?number=%2B${cleanNum}`;
  };

  const getPhoneUrl = () => {
    const value = globalSettings.adminPhone;
    if (!value) return null;
    return `tel:${value}`;
  };

  // Instructions text
  const currentInstruction = language === 'MM'
    ? globalSettings.adminContactNoteMM || 'အကောင့်ကို အသက်သွင်းပေးရန်အတွက် အောက်ပါ Admin ထံသို့ တိုက်ရိုက် ဆက်သွယ်စုံစမ်းနိုင်ပါသည်။'
    : globalSettings.adminContactNote || 'To continue using this financial system, purchase or lease access. Please send your unique User ID to the administrator below to activate your account.';

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#030712] relative overflow-y-auto scroll-smooth">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-indigo-500/10 md:bg-indigo-500/15 rounded-full blur-[120px] md:blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-blue-500/10 md:bg-blue-500/15 rounded-full blur-[120px] md:blur-[160px]" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pt-10 pb-20 md:p-12 md:pt-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-[400px] w-full bg-white/[0.04] backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col gap-6 md:gap-8 relative overflow-hidden group"
        >
          {/* Top highlight gradient */}
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
          
          <div className="text-center space-y-4">
            {globalSettings.restrictedLogoUrl ? (
              <div className="mx-auto w-24 h-24 p-2 bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center">
                <img src={globalSettings.restrictedLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain rounded-[1.5rem]" />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-500/20">
                 <ShieldAlert size={32} />
              </div>
            )}
            
            <div className="space-y-2">
              <h2 className={`text-white font-bold tracking-tight ${language === 'MM' ? 'text-2xl' : 'text-xl'}`}>
                {language === 'MM' ? 'အသုံးပြုခွင့်မရှိသေးပါ' : 'Access Restricted'}
              </h2>
              <div className="h-0.5 w-10 bg-rose-500/40 mx-auto rounded-full" />
              <p className={`font-medium text-xs md:text-sm leading-relaxed px-2 ${
                language === 'MM' ? 'text-emerald-500 leading-normal' : 'text-slate-400'
              }`}>
                {currentInstruction}
              </p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {language === 'MM' ? 'သင်၏ သီးသန့် ID' : 'Your Unique System ID'}
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center gap-2 group/id">
              <div className="flex-1 truncate font-mono text-[11px] md:text-xs font-bold text-indigo-400/90 pl-3">
                {userId}
              </div>
              <button 
                onClick={handleCopy}
                className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center gap-3 opacity-50">
              <div className="h-px w-6 bg-amber-500/50" />
              <p className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.3em]">
                {language === 'MM' ? 'ADMIN ထံ ဆက်သွယ်ရန်' : 'Contact Support'}
              </p>
              <div className="h-px w-6 bg-amber-500/50" />
            </div>

            <div className="space-y-3">
              {getPhoneUrl() && (
                <motion.a 
                  whileTap={{ scale: 0.98 }}
                  href={getPhoneUrl()!}
                  className="w-full h-12 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 text-[13px]"
                >
                  <Phone size={18} fill="currentColor" />
                  <span>{globalSettings.adminPhone} သို့ ဖုန်းခေါ်ဆိုရန်</span>
                </motion.a>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <motion.a 
                  whileTap={{ scale: 0.97 }}
                  href={getMessengerUrl()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300"
                >
                  {globalSettings.messengerIconUrl ? (
                    <img src={globalSettings.messengerIconUrl} className="w-5 h-5 object-cover rounded-full bg-white" alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0084FF]"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.9 1.15 5.51 3.32 7.39V22l2.74-1.51c1.24.34 2.56.53 3.94.53 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.18 12.82l-2.41-2.57-4.7 2.57 5.17-5.48 2.41 2.57 4.7-2.57-5.17 5.48z"/></svg>
                  )}
                  <span>Messenger</span>
                </motion.a>

                <motion.a 
                  whileTap={{ scale: 0.97 }}
                  href={getTelegramUrl()!} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300"
                >
                  {globalSettings.telegramIconUrl ? (
                    <img src={globalSettings.telegramIconUrl} className="w-5 h-5 object-cover rounded-full bg-white" alt="" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#229ED9]"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.18l-1.92 9.06c-.14.64-.52.8-.1.45l-2.92-2.15-1.41 1.36c-.15.15-.28.28-.58.28l.21-3.01 5.48-4.95c.24-.21-.05-.33-.37-.12l-6.77 4.26-2.92-.91c-.64-.2-.65-.64.13-.94l11.41-4.4c.53-.19 1 .13.8.91z"/></svg>
                  )}
                  <span>Telegram</span>
                </motion.a>

                {getViberUrl() && (
                  <motion.a 
                    whileTap={{ scale: 0.97 }}
                    href={getViberUrl()!} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-slate-300"
                  >
                    {globalSettings.viberIconUrl ? (
                      <img src={globalSettings.viberIconUrl} className="w-5 h-5 object-cover rounded-full bg-white" alt="" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 md:w-4 md:h-4 text-[#7360F2]"><path d="M18.11 17.1c-.56-.28-1.5-.66-1.92-.54-.42.12-.72.64-1.03 1-.95-.3-1.83-.8-2.57-1.54-.74-.74-1.24-1.62-1.54-2.57.36-.31.88-.61 1-1.03.12-.42-.26-1.36-.54-1.92-.22-.44-.94-1.92-1.28-1.96-.34-.04-.73.44-.94.66-.98.96-1.47 2.13-1.47 3.52 0 3.8 3.52 7.32 7.32 7.32 1.39 0 2.56-.49 3.52-1.47.22-.21.7-.6.66-.94-.04-.34-1.52-1.06-1.96-1.28l.23-.23zM22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10h6a4 4 0 0 0 4-4v-6z"/></svg>
                    )}
                    <span>Viber</span>
                  </motion.a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={onGoToActivation}
              className="w-full h-11 bg-white/5 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs"
            >
              <Key size={14} className="text-indigo-500" />
              <span>{language === 'MM' ? 'အသက်သွင်းကုဒ် ထည့်သွင်းရန်' : 'Enter Activation Code'}</span>
            </motion.button>

            <div className="flex justify-between items-center">
              <button onClick={onSignOut} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{language === 'MM' ? 'အကောင့်ထွက်ရန်' : 'Sign Out'}</button>
              <button onClick={onRefresh} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 peer-hover:rotate-180 transition-transform">
                <motion.span animate={{ rotate: refreshing ? 360 : 0 }} transition={{ repeat: refreshing ? Infinity : 0, duration: 1 }}>↻</motion.span>
                <span>{language === 'MM' ? 'စစ်ဆေးရန်' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[8px] md:text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            Developed By <span className="text-indigo-500/70">Zin Ko Ko Aung</span>
          </p>
        </div>
      </main>
    </div>
  );
}
