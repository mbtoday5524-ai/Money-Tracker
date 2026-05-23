import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

let deferredPrompt: any = null;

export default function InstallPrompt({ language }: { language: 'MM' | 'EN' }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return; // Already installed
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    const alreadyDismissed = localStorage.getItem('app-install-dismissed-v4');
    
    // Show prompt after a short delay if it hasn't been dismissed
    const timer = setTimeout(() => {
      if (!alreadyDismissed) {
        setShowPrompt(true);
      }
    }, 2000);

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      if (!alreadyDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        deferredPrompt = null;
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('app-install-dismissed-v4', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Download size={24} />
            </div>
            <div className="flex-1 pt-1 pr-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'MM' ? 'App ကို ထည့်သွင်းမည်' : 'Install App'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'MM' 
                  ? (isIOS 
                      ? 'Share (မျှဝေရန်) ခလုတ်ကိုနှိပ်ပြီး "Add to Home Screen" ကိုရွေးချယ်ပါ။' 
                      : (deferredPrompt ? 'အမြဲတမ်းအသုံးပြုရလွယ်ကူစေရန် သင့်ဖုန်းတွင် App ပုံစံဖြင့် ထည့်သွင်းပါ။' : 'Browser ၏ Menu (အစက်သုံးစက်) မှ "Add to Home Screen" ကိုရွေးချယ်ပါ။')) 
                  : (isIOS 
                      ? 'Tap the share button and select "Add to Home Screen".' 
                      : (deferredPrompt ? 'Install this application on your device for quick access.' : 'Tap the browser menu and select "Add to Home screen".'))}
              </p>
            </div>
          </div>
          
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              {language === 'MM' ? 'Install ပြုလုပ်မည်' : 'Install Now'}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
