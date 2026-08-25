import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, FileText, Sparkles, X } from 'lucide-react';

interface DownloadToastProps {
  fileName: string;
  fileFormat: string;
  onClose: () => void;
}

export const DownloadToast: React.FC<DownloadToastProps> = ({
  fileName,
  fileFormat,
  onClose,
}) => {
  const [progress, setProgress] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(65), 350);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setIsCompleted(true);
    }, 850);
    const timer3 = setTimeout(() => {
      onClose();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#072a1a] text-white p-4 rounded-2xl border border-[#86efac]/40 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-md">
        
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
              isCompleted ? 'bg-[#86efac] text-[#072a1a]' : 'bg-emerald-900 text-[#86efac]'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5 animate-bounce" />}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#86efac]">
                {isCompleted ? 'Download Concluído' : 'Processando Arquivo Técnico'}
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">
                {fileName}
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer rounded-lg hover:bg-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 relative z-10">
          <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden border border-emerald-800">
            <div
              className="bg-linear-to-r from-emerald-400 to-[#86efac] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-300 font-mono">
            <span>Formato: {fileFormat}</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
