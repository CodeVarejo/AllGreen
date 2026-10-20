import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CheckCircle2, ShieldCheck, Leaf, Calculator } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Notice when connection was just restored
  if (showRestoredNotice) {
    return (
      <aside
        aria-live="polite"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-[#072a1a] text-white border border-[#86efac]/50 px-4 py-2.5 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="w-6 h-6 rounded-lg bg-[#86efac] text-[#072a1a] flex items-center justify-center font-bold">
          <Wifi className="w-3.5 h-3.5 text-[#072a1a]" />
        </div>
        <div>
          <span className="font-bold text-white block">Conexão Restabelecida</span>
          <span className="text-[10px] text-emerald-300">
            Sincronização em tempo real reativada.
          </span>
        </div>
      </aside>
    );
  }

  // Active Offline Banner
  if (!isOnline) {
    return (
      <aside
        aria-live="assertive"
        className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 rounded-2xl bg-[#072a1a] text-white border border-amber-500/50 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4 text-black" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase tracking-wider text-[10px] text-amber-400">
                Modo Offline Ativo (PWA)
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>

            <p className="text-gray-200 text-xs leading-relaxed">
              Você está sem conexão com a internet. O <strong className="text-[#86efac]">Catálogo Botânico</strong> e as <strong className="text-[#86efac]">Ferramentas de Cálculo LEED/WELL e ROI</strong> estão totalmente operacionais com cache local.
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-emerald-300">
              <span className="flex items-center gap-1">
                <Leaf className="w-3 h-3 text-[#86efac]" />
                <span>Espécies & Laudos</span>
              </span>
              <span className="flex items-center gap-1">
                <Calculator className="w-3 h-3 text-[#86efac]" />
                <span>Cálculos & Métricas</span>
              </span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
