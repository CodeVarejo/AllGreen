import React, { useState, useEffect } from 'react';
import { Leaf, X, ChevronRight } from 'lucide-react';
import { BIOPHILIC_TIPS } from '../data/mockData';

export const BioTipWidget: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % BIOPHILIC_TIPS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md p-3 pr-4 rounded-full shadow-xl border border-emerald-200 text-xs text-gray-800 animate-in fade-in max-w-lg">
      <div className="w-7 h-7 rounded-full bg-[#072a1a] text-[#86efac] flex items-center justify-center shrink-0">
        <Leaf className="w-3.5 h-3.5" />
      </div>
      <p className="flex-1 truncate font-medium text-gray-700">
        {BIOPHILIC_TIPS[tipIndex]}
      </p>
      <button
        onClick={() => setTipIndex((prev) => (prev + 1) % BIOPHILIC_TIPS.length)}
        className="p-1 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-[#072a1a]"
        title="Próxima Dica"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
