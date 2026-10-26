import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Home, Camera, Leaf, PhoneCall, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  onOpenSimulator: () => void;
  onOpenQuote: () => void;
  onOpenDrawer: () => void;
  isDrawerOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSimulator,
  onOpenQuote,
  onOpenDrawer,
  isDrawerOpen = false,
}) => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const elem = document.getElementById('botanical-catalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navContent = (
    <nav
      id="mobile-bottom-tab-bar"
      aria-label="Navegação rápida mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061c11]/98 dark:bg-[#030d08]/98 backdrop-blur-xl border-t border-emerald-900/60 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] px-1 sm:px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-between max-w-md mx-auto w-full">
        
        {/* Início / Home */}
        <button
          type="button"
          id="mobile-tab-home"
          onClick={scrollToTop}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-emerald-300 hover:text-white active:scale-95 transition-all cursor-pointer min-h-[48px]"
          aria-label={t('nav.home', 'Início')}
        >
          <Home className="w-5 h-5 text-emerald-300" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-emerald-200">
            {t('nav.home', 'Início')}
          </span>
        </button>

        {/* Catálogo Botânico */}
        <button
          type="button"
          id="mobile-tab-catalog"
          onClick={scrollToCatalog}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-emerald-300 hover:text-white active:scale-95 transition-all cursor-pointer min-h-[48px]"
          aria-label={t('nav.catalog', 'Catálogo')}
        >
          <Leaf className="w-5 h-5 text-emerald-300" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-emerald-200">
            {t('nav.catalog', 'Catálogo')}
          </span>
        </button>

        {/* Flagship: Simulador (Fully contained, never clipped) */}
        <button
          type="button"
          id="mobile-tab-simulator"
          onClick={onOpenSimulator}
          className="flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl cursor-pointer group active:scale-95 transition-transform min-h-[48px]"
          aria-label={t('nav.simulator', 'Simulador de Ambientes')}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#15803d] to-[#86efac] text-[#051c11] flex items-center justify-center shadow-md shadow-emerald-950/80 group-hover:scale-105 transition-transform">
            <Camera className="w-4.5 h-4.5 stroke-[2.4]" />
          </div>
          <span className="text-[10px] font-bold text-[#86efac] tracking-tight mt-0.5">
            Simulador
          </span>
        </button>

        {/* Orçamento / Proposta */}
        <button
          type="button"
          id="mobile-tab-quote"
          onClick={onOpenQuote}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-emerald-300 hover:text-white active:scale-95 transition-all cursor-pointer min-h-[48px]"
          aria-label={isPt ? 'Orçamento' : 'Quote'}
        >
          <PhoneCall className="w-5 h-5 text-emerald-300" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-emerald-200">
            {isPt ? 'Orçamento' : 'Quote'}
          </span>
        </button>

        {/* Menu Completo (Abre Drawer Lateral) */}
        <button
          type="button"
          id="mobile-tab-menu"
          onClick={onOpenDrawer}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl active:scale-95 transition-all cursor-pointer min-h-[48px] ${
            isDrawerOpen
              ? 'text-[#86efac] bg-emerald-900/40'
              : 'text-emerald-300 hover:text-white'
          }`}
          aria-label={t('nav.openNavigation', 'Menu de ferramentas')}
        >
          <Menu className="w-5 h-5 text-emerald-300" />
          <span className="text-[10px] font-medium tracking-tight mt-0.5 text-emerald-200">
            Menu
          </span>
        </button>

      </div>
    </nav>
  );

  return createPortal(navContent, document.body);
};
