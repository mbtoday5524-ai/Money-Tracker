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
  appLogoUrl?: string;
  appName?: string;
}

export default function LoginPage({ language, setLanguage, adBannerUrls, appLogoUrl, appName }: LoginPageProps) {
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
        <div className="absolute top-[-10%] right-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-indigo-500/10 md:bg-indigo-500/15 rounded-full blur-[120px] md:blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-blue-500/10 md:bg-blue-500/15 rounded-full blur-[120px] md:blur-[160px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-center border-b border-white/5 backdrop-blur-md shrink-0">
        <div className="w-full max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.6),inset_0_4px_8px_rgba(255,255,255,0.3)] border-2 border-indigo-400/80 bg-white relative overflow-hidden group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-500 opacity-50 group-hover:opacity-100 pointer-events-none" />
              <img src={appLogoUrl || "/logo-round.png"} alt="Logo" className="w-full h-full object-cover relative z-10 rounded-full" />
            </div>
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_3px_3px_rgba(0,0,0,0.8)] font-sans">
              {appName || "Z Money Tracker"}
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

      <main className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-start px-4 md:px-12 pt-4 md:pt-12 lg:pt-16 pb-4 md:pb-8 overflow-y-auto select-none">
        <div className="w-full h-auto md:my-auto max-w-6xl flex flex-col md:flex-row items-center md:items-start justify-start md:justify-start gap-6 md:gap-16 lg:gap-24 shrink-0">
          {/* Mobile Unified Layout (Only visible on small screens) */}
          <div className="w-full md:hidden flex flex-col items-center gap-5 shrink-0">
             {/* Ad Banner on Top */}
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full max-w-[400px] rounded-2xl overflow-hidden"
             >
               <AdBanner customImages={adBannerUrls} />
             </motion.div>

             {/* Branding Text */}
             <div className="text-center space-y-2 max-w-[340px]">
                <p className="text-slate-400 text-[11px] font-medium leading-relaxed px-4">
                  {language === 'MM' 
                    ? 'သင်၏လုပ်ငန်းငွေစာရင်းများကို စနစ်တကျ မှတ်တမ်းတင်ပြီး အချိန်မရွေး လွယ်ကူစွာ စီမံခန့်ခွဲလိုက်ပါ။' 
                    : 'Manage your business finances professionally and securely with our intuitive tracking system.'}
                </p>
             </div>

             {/* Features & Login (Compact Vertical Stack) */}
             <div className="w-full max-w-[340px] space-y-5">
                <div className="flex flex-col gap-2.5">
                  {features.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex gap-3 items-center bg-white/[0.03] p-2.5 rounded-xl border border-white/5 shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <p className={`text-slate-200 text-[11px] font-medium leading-normal`}>
                        {language === 'MM' ? feature.mm : feature.en}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4 pt-1">
                   <div className="text-center space-y-1.5">
                      <h2 className={`text-white font-black text-[10px] uppercase opacity-70 ${language === 'MM' ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                        {language === 'MM' ? 'စတင်ရန် အကောင့်ဝင်ပါ' : 'SIGN IN TO CONTINUE'}
                      </h2>
                      <div className="h-[2px] w-8 bg-indigo-500/40 mx-auto rounded-full" />
                   </div>
                   <AuthStatus />
                </div>
             </div>

             {/* Mobile Branding Icons Footer */}
             <div className="flex flex-col items-center justify-center gap-3 mt-2 pb-2">
                <span className={`text-[8px] text-slate-500 font-bold uppercase ${language === 'MM' ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                  {language === 'MM' ? 'အသုံးပြုနိုင်သော ငွေပေးချေမှုပုံစံများ' : 'Supported Wallets & Banks'}
                </span>
                <div className="flex items-center justify-center gap-3">
                  <KBZLogo className="w-7 h-7 rounded-lg opacity-80" />
                  <WaveLogo className="w-7 h-7 rounded-lg opacity-80" />
                  <AYALogo className="w-7 h-7 rounded-lg opacity-80" />
                  <UABLogo className="w-7 h-7 rounded-lg opacity-80" />
                  <TrueLogo className="w-7 h-7 rounded-lg opacity-80" />
                </div>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                   Developed By <span className="text-indigo-400/60">Zin Ko Ko Aung</span>
                </p>
             </div>
          </div>

          {/* Desktop Layout - Floating Glass Panels Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex flex-row items-center lg:items-start justify-between w-full max-w-7xl mx-auto gap-8 lg:gap-16 xl:gap-24 order-1 pt-8 lg:pt-16"
          >
            {/* Left Column - Copy, Features & Auth */}
            <div className="flex flex-col w-[50%] shrink-0 space-y-10 lg:space-y-16">
              
              {/* Branding Header */}
              <div className="space-y-8 lg:space-y-10">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] xl:text-xs text-indigo-200 font-bold tracking-widest uppercase">
                    {language === 'MM' ? 'လုံခြုံစိတ်ချရသော စနစ်' : 'Secure Platform'}
                  </span>
                </div>

                <div className="space-y-6">
                   <p className="text-slate-400 font-medium leading-relaxed max-w-[90%] text-[13px] lg:text-base xl:text-lg border-l-4 border-indigo-500/30 pl-5 py-2">
                     {language === 'MM' 
                       ? 'သင်၏လုပ်ငန်းငွေစာရင်းများကို စနစ်တကျ မှတ်တမ်းတင်ပြီး အချိန်မရွေး လွယ်ကူစွာ စီမံခန့်ခွဲလိုက်ပါ။' 
                       : 'Manage your business finances professionally and securely with our intuitive tracking system.'}
                   </p>
                </div>
              </div>

              {/* Minimal Features List */}
              <div className="flex flex-col gap-5 xl:gap-6 py-2">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * idx }}
                    className="flex gap-4 items-center group"
                  >
                    <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 transition-colors group-hover:bg-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-500" />
                    </div>
                    <p className={`text-slate-200 ${language === 'MM' ? 'text-[13px] xl:text-[15px]' : 'text-xs xl:text-sm'} font-medium`}>
                      {language === 'MM' ? feature.mm : feature.en}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Supported Banks Row */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-start gap-4 w-full mt-4 lg:mt-8"
              >
                <span className={`text-[9px] xl:text-[10px] text-slate-500 font-bold uppercase ${language === 'MM' ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                  {language === 'MM' ? 'အသုံးပြုနိုင်သော ငွေပေးချေမှုပုံစံများ' : 'Supported Wallets & Banks'}
                </span>
                <div className="flex items-center justify-start gap-4 xl:gap-5">
                  <motion.div whileHover={{ scale: 1.1, y: -2 }} className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg cursor-pointer">
                    <KBZLogo className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }} className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg cursor-pointer">
                    <WaveLogo className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }} className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg cursor-pointer">
                    <AYALogo className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }} className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg cursor-pointer">
                    <UABLogo className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }} className="p-1 px-1.5 bg-white/5 rounded-xl border border-white/10 shadow-lg cursor-pointer">
                    <TrueLogo className="w-7 h-7 xl:w-9 xl:h-9 rounded-lg" />
                  </motion.div>
                </div>
              </motion.div>

            </div>

            {/* Right Column - Visual Showcase & Banks */}
            <div className="flex flex-col flex-1 w-full relative items-center justify-center h-auto gap-8 lg:gap-10 xl:gap-12 mt-8 xl:mt-0 shrink-0 pb-12">
              
              {/* Simple AdBanner Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} 
                className="w-full max-w-[650px] xl:max-w-[750px] relative z-10"
              >
                 <div className="rounded-[1.5rem] xl:rounded-[2rem] overflow-hidden relative z-10">
                   <AdBanner customImages={adBannerUrls} />
                 </div>
              </motion.div>

              {/* Login Area */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-[380px] bg-[#0a0f1d]/80 backdrop-blur-3xl border border-white/5 p-6 lg:p-8 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-indigo-500/20 transition-colors duration-500"
              >
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                 <div className="relative z-10 space-y-5">
                    <div className="text-center space-y-2">
                       <h2 className={`text-white font-black text-[10px] xl:text-xs uppercase bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent opacity-90 ${language === 'MM' ? 'tracking-normal' : 'tracking-[0.2em]'}`}>
                         {language === 'MM' ? 'စတင်ရန် အကောင့်ဝင်ပါ' : 'SIGN IN TO CONTINUE'}
                       </h2>
                       <div className="h-[2px] w-12 bg-indigo-500/60 mx-auto rounded-full" />
                    </div>
                    <AuthStatus />
                 </div>
              </motion.div>

              {/* Developer Attribution */}
              <div className="absolute -bottom-6 xl:-bottom-10 w-full text-center">
                 <p className="text-[9px] xl:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
                    Developed By <span className="text-indigo-400 text-opacity-80">Zin Ko Ko Aung</span>
                 </p>
              </div>

            </div>
          </motion.div>


        </div>
      </main>
    </div>
  );
}
;
