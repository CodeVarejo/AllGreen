import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { shareHighlights, SocialSharePayload, ShareResult } from '../../utils/nativeSocialShare';

interface ShareHighlightButtonProps {
  payload: SocialSharePayload | (() => SocialSharePayload);
  label?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'compact' | 'mint';
  className?: string;
  onShareComplete?: (result: ShareResult) => void;
  titleTooltip?: string;
}

export const ShareHighlightButton: React.FC<ShareHighlightButtonProps> = ({
  payload,
  label = 'Compartilhar',
  variant = 'secondary',
  className = '',
  onShareComplete,
  titleTooltip = 'Compartilhar destaques com seus contatos (WhatsApp, E-mail, etc.)',
}) => {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success_native' | 'success_clip'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const data = typeof payload === 'function' ? payload() : payload;
      const result = await shareHighlights(data);

      if (result.success) {
        if (result.method === 'native') {
          setFeedbackState('success_native');
        } else {
          setFeedbackState('success_clip');
        }

        setTimeout(() => {
          setFeedbackState('idle');
        }, 3500);
      }

      if (onShareComplete) {
        onShareComplete(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Variant styling
  let variantStyles = 'bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-300 shadow-2xs';

  if (variant === 'primary') {
    variantStyles = 'bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white shadow-sm';
  } else if (variant === 'mint') {
    variantStyles = 'bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold shadow-xs';
  } else if (variant === 'dark') {
    variantStyles = 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent hover:bg-emerald-50/80 text-[#072a1a] border border-emerald-300/80';
  } else if (variant === 'compact') {
    variantStyles = 'bg-black/30 hover:bg-black/50 text-white border border-white/20';
  }

  const isFeedbackActive = feedbackState !== 'idle';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        disabled={isLoading}
        title={titleTooltip}
        aria-label={label}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap min-h-[38px] ${variantStyles} ${className}`}
      >
        {isFeedbackActive ? (
          <Check className="w-3.5 h-3.5 text-[#86efac] shrink-0" />
        ) : (
          <Share2 className="w-3.5 h-3.5 shrink-0" />
        )}

        <span>
          {feedbackState === 'success_native'
            ? 'Compartilhado!'
            : feedbackState === 'success_clip'
            ? 'Copiado p/ Enviar!'
            : label}
        </span>
      </button>

      {/* Floating feedback toast popup */}
      {feedbackState === 'success_clip' && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 bg-[#072a1a] text-white px-3 py-1 rounded-lg text-[10px] font-mono shadow-xl border border-emerald-500/50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
          📋 Destaques copiados! Pronto para colar no WhatsApp.
        </div>
      )}
    </div>
  );
};
