import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface LogoUploadFieldProps {
  provider: string; // Changed to general string for reuse
  currentUrl: string;
  setUrl: (url: string) => void;
  label?: string;
}

export default function LogoUploadField({ provider, currentUrl, setUrl, label }: LogoUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const base64Data = await compressImage(file, 200, 200, 0.7);
      setUrl(base64Data);
    } catch (error) {
      console.error('Failed to process image', error);
      alert('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleClearLogo = () => {
    setUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4 group">
      <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 flex-shrink-0 flex items-center justify-center relative">
        {currentUrl ? (
          <img src={currentUrl} alt="Logo" className="w-full h-full object-contain" />
        ) : (
          <ImageIcon size={20} className="text-slate-300 dark:text-slate-700" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center backdrop-blur-sm">
            <Loader2 size={16} className="text-indigo-500 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center gap-2">
        <label className="flex-1 h-11 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-50 text-[10px] uppercase font-black tracking-widest relative overflow-hidden">
          {label || `${provider.toUpperCase()} Logo (Optional)`}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        {currentUrl && (
          <button 
            type="button" 
            onClick={handleClearLogo}
            className="px-4 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors text-[10px] font-black uppercase"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
