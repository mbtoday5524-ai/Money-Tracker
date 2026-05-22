import React from 'react';
import { motion } from 'motion/react';
import { Wallet, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AuthStatus from './AuthStatus';
import { KBZLogo, WaveLogo, AYALogo, UABLogo, TrueLogo } from './Logos';
import AdBanner from './AdBanner';

interface LoginPageProps {
  language: 'MM' | 'EN';
  setLanguage: (lang: 'MM' | 'EN') => void;
  adBannerUrls?: string[];
}

export default function LoginPage({ language, setLanguage, adBannerUrls }: LoginPageProps) {
  const features = [
    {
      mm: 'နေ့စဉ် ငွေအဝင်/အထွက် စာရင်းများကို စနစ်တကျ မှတ်တမ်းတင်နိုင်ခြင်း',
      en: 'Systematically record daily cash-in and cash-out transactions'
    },
    {
      mm: 'KPay, Wave, AYA Pay စသည့် Mobile Banking များအတွက် သီးသန့်စာရင်းကိုင်ပေးခြင်း',
      en: 'Specialized ledger for KPay, Wave, and AYA Pay transfers'
    },
    {
      mm: 'မိမိလုပ်ငန်းစာရင်းများကို ဖုန်းတစ်လုံးရှိရုံဖြင့် အချိန်မရွေး လွယ်ကူစွာ စီမံခန့်ခွဲနိုင်ခြင်း',
      en: 'Easily manage business records anytime with just your smartphone'
    }
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-[#030712] relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-indigo-500/10 md:bg-indigo-500/15 rounded-full blur-[120px] md:blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-blue-500/10 md:bg-blue-500/15 rounded-full blur-[120px] md:blur-[160px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-center border-b border-white/5 backdrop-blur-md shrink-0">
        <div className="w-full max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-indigo-500/80 bg-[#090d16] p-[2px]">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Z Money Tracker
            </span>
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'MM' ? 'EN' : 'MM')}
            className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-white/5 shrink-0 border border-white/5"
          >
            <Globe size={13} className="text-indigo-400" />
            {language === 'MM' ? 'English' : 'မြန်မာ'}
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-12 pt-5 md:pt-12 pb-6 md:pb-12 overflow-y-auto lg:overflow-hidden select-none">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-20">
          {/* Mobile Ad Banner & Branding Header */}
          <div className="w-full md:hidden flex flex-col gap-5">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full shadow-2xl shadow-indigo-505/5"
             >
               <AdBanner customImages={adBannerUrls} />
             </motion.div>
             <div className="text-center space-y-2">
                <h1 className="text-white font-extrabold tracking-tight text-lg bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent drop-shadow-sm">
                  {language === 'MM' ? 'စာရင်းများကိုစနစ်တကျစီမံခန့်ခွဲလိုက်ပါ။' : 'Manage Business Professionally'}
                </h1>
                {language === 'EN' && (
                  <p className="text-slate-400 text-[11px] font-medium tracking-wide">
                    Manage your finances professionally and securely.
                  </p>
                )}
             </div>
          </div>

          {/* Login Card (Appears second on mobile, Right on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[340px] md:w-[420px] flex flex-col gap-6 md:gap-10 justify-center order-2 md:order-2"
          >
            <div className="bg-white/[0.03] backdrop-blur-3xl p-5 md:p-12 rounded-[2.25rem] md:rounded-[2.5rem] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative space-y-5 md:space-y-8 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-[2.25rem] opacity-30 pointer-events-none" />
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent" />
              
              {/* Trust/Secure Badge to satisfy visual design */}
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit mx-auto relative z-10">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] md:text-[10px] text-indigo-200 font-bold tracking-wider uppercase">
                  {language === 'MM' ? 'လုံခြုံစိတ်ချရသော စနစ်' : 'Secure Platform'}
                </span>
              </div>

              {/* Quick Info / Features */}
              <div className="flex flex-col gap-3 md:gap-4 relative z-10">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * idx }}
                    className="flex gap-3 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05] shadow-sm hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <p className={`text-slate-200 text-[11px] md:text-[13px] font-medium leading-relaxed`}>
                      {language === 'MM' ? feature.mm : feature.en}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center space-y-2 relative z-10 pt-2">
                <h2 className="text-white font-black tracking-wider text-xs md:text-sm bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">
                  {language === 'MM' ? 'စတင်ရန် အကောင့်ဝင်ပါ' : 'SIGN IN TO CONTINUE'}
                </h2>
                <div className="h-[2px] w-10 bg-indigo-500/60 mx-auto rounded-full" />
              </div>

              <div className="relative z-10 pt-1">
                <AuthStatus />
              </div>
            </div>

            <div className="hidden md:block text-center space-y-4 pt-2 md:pt-4">
              <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.25em]">
                Developed By <span className="text-indigo-400 font-extrabold shadow-indigo-500/10">Zin Ko Ko Aung</span>
              </p>
            </div>
          </motion.div>

          {/* Branding & Features (Appears third on mobile, Left on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[340px] md:max-w-none md:flex-1 flex flex-col gap-6 md:gap-10 justify-center order-3 md:order-1"
          >
            {/* Desktop Advertisement Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden md:block"
            >
              <AdBanner customImages={adBannerUrls} />
            </motion.div>

            <div className="hidden md:block text-center md:text-left space-y-4 md:space-y-6">
              {/* Payment Systems Icons */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <motion.div whileHover={{ scale: 1.08 }} className="p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                  <KBZLogo className="w-12 h-12 md:w-16 md:h-16 rounded-xl" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.08 }} className="p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                  <WaveLogo className="w-12 h-12 md:w-16 md:h-16 rounded-xl" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.08 }} className="p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                  <AYALogo className="w-12 h-12 md:w-16 md:h-16 rounded-xl" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.08 }} className="p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                  <UABLogo className="w-12 h-12 md:w-16 md:h-16 rounded-xl" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.08 }} className="p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                  <TrueLogo className="w-12 h-12 md:w-16 md:h-16 rounded-xl" />
                </motion.div>
              </div>

              <div className="space-y-2 md:space-y-4">
                <h1 className="text-white font-extrabold tracking-tight text-xl md:text-3xl bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                  {language === 'MM' ? 'စာရင်းများကိုစနစ်တကျစီမံခန့်ခွဲလိုက်ပါ။' : 'Manage Business Professionally'}
                </h1>
                {language === 'EN' && (
                  <p className="text-slate-400 text-xs md:text-sm font-medium px-4 md:px-0 pt-1 leading-tight">
                    Manage your business finances professionally and securely.
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Branding Icons (Compact with UAB Pay and True Money added!) */}
            <div className="flex md:hidden flex-col items-center justify-center gap-3 mt-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">
                {language === 'MM' ? 'အသုံးပြုနိုင်သော ငွေပေးချေမှုပုံစံများ' : 'Supported Wallets & Banks'}
              </span>
              <div className="flex items-center justify-center gap-3">
                <motion.div whileTap={{ scale: 0.9 }} className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-md">
                  <KBZLogo className="w-8 h-8 rounded-lg" />
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }} className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-md">
                  <WaveLogo className="w-8 h-8 rounded-lg" />
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }} className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-md">
                  <AYALogo className="w-8 h-8 rounded-lg" />
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }} className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-md">
                  <UABLogo className="w-8 h-8 rounded-lg" />
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }} className="p-1 bg-white/5 rounded-xl border border-white/10 shadow-md">
                  <TrueLogo className="w-8 h-8 rounded-lg" />
                </motion.div>
              </div>
            </div>

            <div className="md:hidden text-center pt-6 pb-2">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em]">
                Developed By <span className="text-indigo-400 font-extrabold">Zin Ko Ko Aung</span>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
;
