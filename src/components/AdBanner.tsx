import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdBannerProps {
  customImages?: string[];
}

const defaultImages = [
  '/src/assets/images/ad_banner_1_1779421245691.png',
  '/src/assets/images/ad_banner_2_1779421264881.png',
  '/src/assets/images/ad_banner_3_1779421280771.png'
];

export default function AdBanner({ customImages }: AdBannerProps) {
  const images = customImages && customImages.length > 0 ? customImages : defaultImages;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  // Reset index if images change and current index is out of bounds
  useEffect(() => {
    if (index >= images.length) {
      setIndex(0);
    }
  }, [images, index]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[21/9] max-h-[130px] md:max-h-none rounded-lg md:rounded-[2rem] overflow-hidden border border-white/10 shadow-lg bg-black/20 mx-auto max-w-[300px] md:max-w-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[index]}
          src={images[index]}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                idx === index ? 'w-4 bg-indigo-500' : 'w-1 bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
