import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function InstallPrompt({ language }: { language: 'MM' | 'EN' }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS doesn't support beforeinstallprompt, so we might want to manually show instructions
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasSeenPrompt) {
        // Delay a bit before showing to not overwhelm the user
        setTimeout(() => setShowPrompt(true), 3000);
      }
    } else {
      // Also show on non-iOS manually after 3s if prompt hasn't fired yet
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        // Just show instructions
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <X size={16} />
          </button>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <Download size={24} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {language === 'MM' ? 'App ကို သိမ်းဆည်းရန်' : 'Install Application'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'MM' 
                  ? (isIOS 
                      ? 'အသုံးပြုရလွယ်ကူစေရန် Share (မျှဝေရန်) ခလုတ်ကိုနှိပ်ပြီး "Add to Home Screen" ကိုရွေးပါ။' 
                      : (!deferredPrompt 
                          ? 'Browser ၏ Menu (အစက်သုံးစက်) မှ "Add to Home Screen" သို့မဟုတ် "Install App" ကိုရွေးချယ်ပါ။' 
                          : 'အမြဲတမ်းအသုံးပြုရလွယ်ကူစေရန် သင့်ဖုန်းတွင် Install ပြုလုပ်ပါ။')) 
                  : (isIOS 
                      ? 'Tap the share button and select "Add to Home Screen" for quick access.' 
                      : (!deferredPrompt 
                          ? 'Tap the browser menu (three dots) and select "Add to Home screen" or "Install App".' 
                          : 'Install this app on your device for quick and easy access.'))}
              </p>
            </div>
          </div>
          
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              {language === 'MM' ? 'Install ပြုလုပ်မည်' : 'Install Now'}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
