import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'drawer') {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/80 hover:bg-[#072a1a] text-white border border-emerald-500/40 shadow-sm transition-all cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#86efac] text-[#072a1a] flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-white block">Instalar App Offline</span>
              <span className="text-[10px] text-emerald-300 block">Acesse catálogo e calculadoras sem internet</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#86efac] bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            Instalar
          </span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstallClick}
        disabled={isInstalling}
        title="Instalar All Green no seu dispositivo para uso offline"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
          variant === 'compact'
            ? 'bg-[#86efac] text-[#072a1a] hover:bg-emerald-300'
            : 'bg-[#072a1a] text-[#86efac] hover:bg-[#15803d] hover:text-white border border-emerald-500/40'
        } ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-[#86efac] group-hover:text-white" />
        <span className="hidden sm:inline">Instalar App (Offline)</span>
        <span className="inline sm:hidden">Instalar</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 bg-emerald-950/80 text-emerald-200 hover:text-white border border-emerald-700/60 ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#86efac]" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-3xl bg-[#072a1a] border border-emerald-500/40 p-6 shadow-2xl text-white space-y-4 relative">
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 cursor-pointer"
                aria-label="Fechar guia de instalação iOS"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-900 border border-emerald-700/80 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#86efac]" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">
                    Instalar All Green no iOS
                  </h3>
                  <span className="text-[11px] text-emerald-300">
                    Acesso offline rápido e tela cheia
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-black/30 p-4 rounded-2xl border border-emerald-800/60 text-xs text-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-[#86efac] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-white block">Toque em Compartilhar</span>
                    <span className="text-[11px] text-emerald-300">
                      Na barra inferior do Safari, toque no ícone de compartilhamento (<Share2 className="w-3 h-3 inline mx-0.5" />).
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-[#86efac] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-white block">Adicionar à Tela de Início</span>
                    <span className="text-[11px] text-emerald-300">
                      Role a lista de ações para baixo e toque em <strong className="text-white">"Adicionar à Tela de Início"</strong> (<PlusSquare className="w-3 h-3 inline mx-0.5" />).
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-[#86efac] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-white block">Confirmar Instalação</span>
                    <span className="text-[11px] text-emerald-300">
                      Toque em "Adicionar" no canto superior direito para finalizar.
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#86efac] text-[#072a1a] font-bold text-xs hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
