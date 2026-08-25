import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const LgpdBanner: React.FC = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const isAccepted = localStorage.getItem('lgpd_accepted');
    if (!isAccepted) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lgpd_accepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-[#072a1a] text-white p-4 rounded-2xl shadow-2xl border border-emerald-800/80 backdrop-blur-md flex items-start gap-3 text-xs animate-in slide-in-from-bottom-5">
      <ShieldCheck className="w-5 h-5 text-[#86efac] shrink-0 mt-0.5" />
      <div className="space-y-2 flex-1">
        <p className="text-gray-200 leading-relaxed">
          Nós utilizamos cookies para otimizar sua experiência no simulador e personalizar especificações de projetos biofílicos conforme a LGPD.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 bg-[#86efac] text-[#072a1a] font-bold rounded-lg text-xs hover:bg-emerald-300 transition-colors"
          >
            Aceitar e Continuar
          </button>
          <a href="#" className="text-emerald-300 underline hover:text-white">
            Política de Privacidade
          </a>
        </div>
      </div>
      <button
        onClick={() => setAccepted(true)}
        className="text-gray-400 hover:text-white p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
