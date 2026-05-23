import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  UserCircle, 
  Mail, 
  Calendar,
  ChevronRight,
  Database,
  BarChart4,
  ImageIcon,
  Save,
  PlusCircle,
  X
} from 'lucide-react';
import { getAllUsers, updateUserActivation, getAllGlobalTransactions, getGlobalSettings, saveGlobalSettings } from '../services/transactionService';
import { compressImage } from '../utils/imageCompressor';
import { motion, AnimatePresence } from 'motion/react';
import FinancialReports from './FinancialReports';
import LogoUploadField from './LogoUploadField';
import { Transaction, GlobalSettings } from '../types';

interface AdminPanelProps {
  language: 'MM' | 'EN';
  globalSettings: GlobalSettings;
  onUpdateGlobalSettings: (settings: GlobalSettings) => void;
}

export default function AdminPanel({ language, globalSettings: initialGlobalSettings, onUpdateGlobalSettings }: AdminPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [globalSettings, setLocalGlobalSettings] = useState<GlobalSettings>(initialGlobalSettings || {});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  useEffect(() => {
    setLocalGlobalSettings(initialGlobalSettings || {});
  }, [initialGlobalSettings]);

  const fetchUsersAndSettings = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData);
      
      // We already have global settings correctly passed, but can refresh if needed.
      // Const settings = await getGlobalSettings();
      // setLocalGlobalSettings(settings || {});
    } catch (error) {
      console.error("Failed to fetch users and settings:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsersAndSettings();
  }, []);

  const handleToggleActive = async (uid: string, currentActive: boolean) => {
    try {
      await updateUserActivation(uid, !currentActive);
      setUsers(users.map(u => u.uid === uid ? { ...u, active: !currentActive } : u));
    } catch (error) {
      console.error("Failed to update user activation:", error);
      alert("Failed to update user status. Please check your quota/permissions.");
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      
      // Remove undefined values
      const cleanSettings = { ...globalSettings };
      Object.keys(cleanSettings).forEach(key => {
        if ((cleanSettings as any)[key] === undefined) {
          delete (cleanSettings as any)[key];
        }
      });

      await saveGlobalSettings(cleanSettings);
      onUpdateGlobalSettings(cleanSettings);
      setSaveStatus('success');
    } catch (err: any) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">စုစုပေါင်း User</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</h4>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ခွင့်ပြုပြီး User</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {users.filter(u => u.active).length}
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">မခွင့်ပြုရသေးသူ</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              {users.filter(u => !u.active).length}
            </h4>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm flex items-center gap-2">
            <Database size={16} className="text-indigo-500" />
            User Access Control
          </h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Activity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={u.uid} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {u.photoURL ? <img src={u.photoURL} alt="" /> : <UserCircle size={20} className="text-slate-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded-md w-fit mt-0.5">
                          <Mail size={10} /> {u.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">UID:</span>
                          <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 select-all border-b border-dashed border-slate-200 dark:border-slate-800 pb-0.5">
                            {u.uid}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                      u.active 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {u.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Calendar size={12} />
                      <span className="text-xs font-medium">
                        {u.lastLogin?.toDate ? u.lastLogin.toDate().toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleActive(u.uid, !!u.active)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        u.active 
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {u.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Database className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Global Settings */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm flex items-center gap-2">
            <ImageIcon size={16} className="text-indigo-500" />
            Global App Settings
          </h3>
          <button
            onClick={handleSaveSettings}
            disabled={settingsLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save size={14} />
            {settingsLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <AnimatePresence>
          {saveStatus !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl z-[100] border backdrop-blur-md ${
                saveStatus === 'success' 
                  ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                  : 'bg-rose-500/90 border-rose-400 text-white'
              }`}
            >
              {saveStatus === 'success' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
              <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                {saveStatus === 'success' ? 'Saved Successfully!' : 'Save Failed!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoUploadField 
            provider="kbz" 
            currentUrl={globalSettings.kbzLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, kbzLogoUrl: url }))} 
          />
          <LogoUploadField 
            provider="wave" 
            currentUrl={globalSettings.waveLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, waveLogoUrl: url }))} 
          />
          <LogoUploadField 
            provider="aya" 
            currentUrl={globalSettings.ayaLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, ayaLogoUrl: url }))} 
          />
          <LogoUploadField 
            provider="uab" 
            currentUrl={globalSettings.uabLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, uabLogoUrl: url }))} 
          />
          <LogoUploadField 
            provider="true" 
            currentUrl={globalSettings.trueLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, trueLogoUrl: url }))} 
          />
          <LogoUploadField 
            provider="cash" 
            currentUrl={globalSettings.cashLogoUrl || ''} 
            setUrl={(url) => setLocalGlobalSettings(prev => ({ ...prev, cashLogoUrl: url }))} 
          />
        </div>

        {/* Admin Contact Information for Purchase/Activation */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-4">
          <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#1e293b] dark:text-slate-300 flex items-center gap-2">
            <Mail size={14} className="text-indigo-500" />
            Admin Contact & Purchase Option Configuration
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
            Configure contact details and instructions displayed on the "Access Denied" screen for users without premium access.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Facebook Messenger ID / URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. user123"
                  value={globalSettings.adminMessenger || ''}
                  onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminMessenger: e.target.value }))}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <label className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors flex-shrink-0 relative overflow-hidden">
                  {globalSettings.messengerIconUrl ? (
                    <img src={globalSettings.messengerIconUrl} className="w-6 h-6 object-contain" alt="" />
                  ) : (
                    <ImageIcon size={18} className="text-slate-400" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await compressImage(file, 200, 200, 0.7);
                        setLocalGlobalSettings(prev => ({ ...prev, messengerIconUrl: base64 }));
                      } catch (err) {
                        console.error('Error compressing image', err);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Telegram Username / Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. admin_username"
                  value={globalSettings.adminTelegram || ''}
                  onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminTelegram: e.target.value }))}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <label className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors flex-shrink-0 relative overflow-hidden">
                  {globalSettings.telegramIconUrl ? (
                    <img src={globalSettings.telegramIconUrl} className="w-6 h-6 object-contain" alt="" />
                  ) : (
                    <ImageIcon size={18} className="text-slate-400" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await compressImage(file, 200, 200, 0.7);
                        setLocalGlobalSettings(prev => ({ ...prev, telegramIconUrl: base64 }));
                      } catch (err) {
                        console.error('Error compressing image', err);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Viber Number / Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 09789789789"
                  value={globalSettings.adminViber || ''}
                  onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminViber: e.target.value }))}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
                <label className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors flex-shrink-0 relative overflow-hidden">
                  {globalSettings.viberIconUrl ? (
                    <img src={globalSettings.viberIconUrl} className="w-6 h-6 object-contain" alt="" />
                  ) : (
                    <ImageIcon size={18} className="text-slate-400" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const base64 = await compressImage(file, 200, 200, 0.7);
                        setLocalGlobalSettings(prev => ({ ...prev, viberIconUrl: base64 }));
                      } catch (err) {
                        console.error('Error compressing image', err);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Contact Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 09789789789"
                value={globalSettings.adminPhone || ''}
                onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminPhone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Purchase Instructions (Myanmar text)</label>
              <textarea
                placeholder="ဥပမာ- ဤစနစ်ကို တရားဝင်အပြည့်အစုံဝယ်ယူလိုပါက အောက်ပါ Admin ထံသို့ တိုက်ရိုက်ဆက်သွယ် မေးမြန်းဝယ်ယူနိုင်ပါသည်။"
                value={globalSettings.adminContactNoteMM || ''}
                rows={3}
                onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminContactNoteMM: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Purchase Instructions (English Alternate)</label>
              <textarea
                placeholder="e.g. Please contact the administrator below to subscribe or buy full access to this ledger tool."
                value={globalSettings.adminContactNote || ''}
                rows={2}
                onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, adminContactNote: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block mb-4">Advertisement Banners (Slideshow)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(globalSettings.adBannerUrls || []).map((url, index) => (
                  <div key={index} className="group relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm">
                    <img src={url} alt={`Ad ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const newUrls = [...(globalSettings.adBannerUrls || [])];
                        newUrls.splice(index, 1);
                        setLocalGlobalSettings(prev => ({ ...prev, adBannerUrls: newUrls }));
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <label className="aspect-[16/9] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 hover:text-indigo-500">
                  <PlusCircle size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Add New Ad</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const base64 = await compressImage(file, 1200, 800, 0.6);
                        const newUrls = [...(globalSettings.adBannerUrls || []), base64];
                        setLocalGlobalSettings(prev => ({ ...prev, adBannerUrls: newUrls }));
                      } catch (err) {
                        console.error('Error compressing image', err);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-3">These images will be displayed in the carousel on the login screen. Recommended aspect ratio: 21:9 or 16:9.</p>
            </div>

            <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">App Branding (Name)</label>
              <input
                type="text"
                placeholder="e.g. Z MONEY TRACKER"
                value={globalSettings.appName || ''}
                onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, appName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <p className="text-[10px] text-slate-500 font-medium mt-1 mb-4">This name replaces "Z MONEY TRACKER" across the app.</p>

              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">Startup Splash Screen Logo</label>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center relative shadow-sm">
                  {globalSettings.splashLogoUrl ? (
                    <img src={globalSettings.splashLogoUrl} alt="Splash Logo" className="w-full h-full object-cover" />
                  ) : globalSettings.appLogoUrl ? (
                    <img src={globalSettings.appLogoUrl} alt="Splash Logo" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/logo-round.png" alt="Splash Logo Default" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1 h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-[10px] uppercase font-black tracking-widest">
                      <PlusCircle size={14} />
                      Upload Splash Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const compressedBase64 = await compressImage(file, 800, 800, 0.9); // higher quality for splash
                            setLocalGlobalSettings(prev => ({ ...prev, splashLogoUrl: compressedBase64 }));
                          } catch (err) {
                            console.error('Error compressing image', err);
                          }
                        }}
                      />
                    </label>
                    {globalSettings.splashLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setLocalGlobalSettings(prev => ({ ...prev, splashLogoUrl: '' }))}
                        className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">This logo is displayed in the center of the loading screen on startup. Recommended: large square, transparent.</p>
                </div>
              </div>

              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">App Logo (Top Left & Login)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border border-slate-200 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center relative shadow-sm">
                  {globalSettings.appLogoUrl ? (
                    <img src={globalSettings.appLogoUrl} alt="App Logo" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/logo-round.png" alt="App Logo Default" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1 h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-[10px] uppercase font-black tracking-widest">
                      <PlusCircle size={14} />
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          try {
                            const base64 = await compressImage(file, 800, 800, 0.9);
                            setLocalGlobalSettings(prev => ({ ...prev, appLogoUrl: base64 }));
                          } catch (err) {
                            console.error('Error compressing image', err);
                          }
                        }}
                      />
                    </label>
                    {globalSettings.appLogoUrl && (
                      <button
                        onClick={() => setLocalGlobalSettings(prev => ({ ...prev, appLogoUrl: undefined }))}
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">This logo is displayed at the top left of the main app and on the login screen. Recommended: Square image, transparent background.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">Restricted Access Logo (App Branding)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border border-slate-200 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center relative shadow-sm">
                  {globalSettings.restrictedLogoUrl ? (
                    <img src={globalSettings.restrictedLogoUrl} alt="Restricted Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-20">
                      <ImageIcon size={24} className="text-slate-400" />
                      <span className="text-[8px] font-bold uppercase">No Logo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <label className="flex-1 h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-[10px] uppercase font-black tracking-widest">
                      Upload Branding Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          try {
                            const base64 = await compressImage(file, 800, 800, 0.9);
                            setLocalGlobalSettings(prev => ({ ...prev, restrictedLogoUrl: base64 }));
                          } catch (err) {
                            console.error('Error compressing image', err);
                          }
                        }}
                      />
                    </label>
                    {globalSettings.restrictedLogoUrl && (
                      <button 
                        onClick={() => setLocalGlobalSettings(prev => ({ ...prev, restrictedLogoUrl: '' }))}
                        className="px-4 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors text-[10px] font-black uppercase"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">This logo will appear at the top of the Access Denied and Activation screens.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <label className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">Master Activation Code (Self-Service)</label>
              <input
                type="text"
                placeholder="Set a code users can enter to activate themselves"
                value={globalSettings.masterActivationCode || ''}
                onChange={(e) => setLocalGlobalSettings(prev => ({ ...prev, masterActivationCode: e.target.value }))}
                className="w-full px-4 py-2.5 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <p className="text-[10px] text-slate-500 font-medium">Leave empty to disable self-service activation via code.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
