import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Clock, 
  Users, 
  MessageCircle, 
  Phone, 
  Info,
  CheckCircle2,
  FileText,
  Lock,
  Zap
} from 'lucide-react';

interface DocumentationProps {
  language: 'MM' | 'EN';
  onClose?: () => void;
}

export default function Documentation({ language, onClose }: DocumentationProps) {
  const content = {
    EN: {
      title: "System Documentation",
      subtitle: "Learn about Z Money Tracker POS benefits & security",
      sections: [
        {
          title: "Key Advantages",
          icon: <Zap className="text-amber-500" />,
          items: [
            "Fast & Reliable: Record transactions in seconds.",
            "Visual Dashboard: Real-time balance monitoring for all banking services.",
            "Financial Reports: Detailed insights into your daily and monthly profits.",
            "Ad System: Integrated banner system for latest service updates."
          ]
        },
        {
          title: "Data Security",
          icon: <Lock className="text-emerald-500" />,
          items: [
            "Cloud Sync: All data is securely stored in Google's Firebase cloud infrastructure (AES-256 equivalent).",
            "Access Protection: Advanced role-based permissions ensure only authorized owners see sensitive data.",
            "Account Guard: Data is tied to your unique identity; phone loss doesn't mean data loss.",
            "Privacy First: Your financial records are encrypted and private to your business account."
          ]
        },
        {
          title: "Multi-Platform Support",
          icon: <div className="flex gap-1"><Smartphone size={16} /><Monitor size={16} /></div>,
          items: [
            "Cross-Device: Seamless performance on iPhone, Android, iPad, and Windows/Mac.",
            "PWA Ready: Install it from your browser as a lightweight app (No Play Store needed).",
            "Auto-Responsive: UI elements scale perfectly from 5-inch phones to 32-inch monitors.",
            "Browser Freedom: Full support for Chrome, Safari, Edge, and Samsung Internet."
          ]
        },
        {
          title: "Contact Support",
          icon: <MessageCircle className="text-indigo-500" />,
          items: [
            "Telegram Support: Reach out to us via our official channel for quick help.",
            "Phone: Direct contact available for urgent account issues.",
            "Activity Logs: Admins can review logs to help resolve transaction disputes.",
            "24/7 Availability: The cloud system is always online for your business."
          ]
        }
      ]
    },
    MM: {
      title: "စနစ်လမ်းညွှန်မှတ်တမ်း",
      subtitle: "Z Money Tracker POS ၏ အကျိုးကျေးဇူးများနှင့် လုံခြုံရေးဆိုင်ရာများ",
      sections: [
        {
          title: "အဓိက အားသာချက်များ",
          icon: <Zap className="text-amber-500" />,
          items: [
            "မြန်ဆန်စိတ်ချရခြင်း: စက္ကန့်ပိုင်းအတွင်း မှတ်တမ်းတင်နိုင်ခြင်း။",
            "Dashboard: ဘဏ်ဝန်ဆောင်မှုအားလုံး၏ လက်ကျန်ငွေကို တိုက်ရိုက်ကြည့်ရှုနိုင်ခြင်း။",
            "Financial Reports: နေ့စဉ်/လစဉ် အမြတ်ငွေ အစီရင်ခံစာများ။",
            "Ad System: ဝန်ဆောင်မှုသတင်းများကို Banner များမှတစ်ဆင့် သိရှိနိုင်ခြင်း။"
          ]
        },
        {
          title: "ဒေတာလုံခြုံရေး",
          icon: <Lock className="text-emerald-500" />,
          items: [
            "Cloud Security: ဒေတာအားလုံးကို Google ၏ Firebase Cloud ပေါ်တွင် AES-256 အဆင့်အတန်းဖြင့် စိတ်ချစွာသိမ်းဆည်းပေးခြင်း။",
            "Access Protection: ပိုင်ရှင်ကိုယ်တိုင် ခွင့်ပြုချက်ပေးထားသူများမှလွဲ၍ မည်သူမျှ ဒေတာများကို ကြည့်ရှု၍မရအောင် ကာကွယ်ထားခြင်း။",
            "Data Continuity: ဖုန်းပျောက်ဆုံး/ပျက်စီးခဲ့လျှင်ပင် အကောင့်ဝင်လိုက်ရုံဖြင့် အချက်အလက်များ ပြန်လည်ရရှိခြင်း။",
            "End-to-End Privacy: သင်၏ ငွေကြေးဆိုင်ရာမှတ်တမ်းများကို သီးသန့် Encryption စနစ်ဖြင့် လုံခြုံအောင် ပြုလုပ်ထားခြင်း။"
          ]
        },
        {
          title: "စက်ပစ္စည်းအစုံတွင် သုံးနိုင်ခြင်း",
          icon: <div className="flex gap-1"><Smartphone size={16} /><Monitor size={16} /></div>,
          items: [
            "Multi-Platform: Android, iPhone, iPad နှင့် Computer အားလုံးပေါ်တွင် တပြေးညီ အသုံးပြုနိုင်ခြင်း။",
            "App-Like Experience: Chrome/Safari မှတစ်ဆင့် ဖုန်း Homescreen ပေါ်တွင် App တစ်ခုကဲ့သို့ ထည့်သွင်းအသုံးပြုနိုင်ခြင်း။ (PWA)",
            "Auto-Sizing Design: ၅ လက်မဖုန်းမှသည် ၃၂ လက်မ Monitor များအထိ မျက်နှာပြင်အလိုက် အလိုအလျောက် အံဝင်ခွင်ကျဖြစ်ခြင်း။",
            "Browser Freedom: Chrome, Safari, Edge နှင့် Samsung Internet Browser များအားလုံးတွင် ကောင်းမွန်စွာ အ việcလုပ်ခြင်း။"
          ]
        },
        {
          title: "အကူအညီရယူရန်",
          icon: <MessageCircle className="text-indigo-500" />,
          items: [
            "Telegram Support: Telegram Channel မှတစ်ဆင့် အခက်အခဲများကို မေးမြန်းနိုင်ခြင်း။",
            "Phone: အရေးပေါ်ကိစ္စများအတွက် ဖုန်းမှတစ်ဆင့် တိုက်ရိုက်ဆက်သွယ်နိုင်ခြင်း။",
            "Activity Logs: ပြဿနာများရှိပါက မှတ်တမ်းများပြန်လည်စစ်ဆေးပေးခြင်း။",
            "24/7 Support: လုပ်ငန်းအတွက် အချိန်ပြည့် စနစ်ဖွင့်ထားပေးခြင်း။"
          ]
        }
      ]
    }
  };

  const selected = language === 'MM' ? content.MM : content.EN;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <FileText size={28} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight px-4">
          {selected.title}
        </h1>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 px-4">
          {selected.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
        {selected.sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sleek-shadow space-y-4 hover:border-indigo-500/40 transition-all group relative overflow-hidden"
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="font-black text-slate-800 dark:text-slate-100 tracking-tight text-[13px]">
                {section.title}
              </h3>
            </div>
            
            <ul className="space-y-3.5 relative z-10">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="mt-1.5 shrink-0 text-emerald-500 bg-emerald-500/10 rounded-full p-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="bg-indigo-600 dark:bg-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 mx-2 sm:mx-0">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <Info size={24} className="text-indigo-200" />
            <h2 className="text-xl font-black tracking-tight">{language === 'MM' ? 'အကျဉ်းချုပ်' : 'Quick Summary'}</h2>
          </div>
          <p className="text-[15px] font-bold text-indigo-50 leading-relaxed opacity-95">
            {language === 'MM' 
              ? 'ဤ POS စနစ်သည် သင်၏ ငွေကြေးလုပ်ငန်းမှတ်တမ်းများကို စနစ်တကျ မှတ်တမ်းတင်ပေးရန်၊ ဒေတာများ လုံခြုံစွာ သိမ်းဆည်းပေးရန်နှင့် လုပ်ငန်းတိုးတက်မှုကို အထောက်အကူပြုရန် ရည်ရွယ်ထုတ်လုပ်ထားခြင်း ဖြစ်ပါသည်။'
              : 'This POS system is designed to organize your financial records, secure your data, and professionalize your business management processes across all platforms.'}
          </p>
        </div>
        {/* Background Accent */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
