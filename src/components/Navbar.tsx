import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Search, Menu as MenuIcon, X, Camera, PhoneCall, Layers, BookOpen, Calculator, Image as ImageIcon, UserCheck, Bell, Keyboard, TrendingUp, Sparkles, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { UserProfile } from '../types';
import { isMacUser } from '../hooks/useKeyboardShortcuts';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { botanicalAudio } from '../utils/botanicalAudio';

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenProjectLookup: () => void;
  onOpenQuote: () => void;
  onOpenLogin: () => void;
  currentUser?: UserProfile | null;
  onSearchQueryChange?: (query: string) => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  onOpenSearch?: () => void;
  onOpenShortcutsModal?: () => void;
  onOpenConsultation?: () => void;
  onOpenProjectPdfReport?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  onOpenProjectLookup,
  onOpenQuote,
  onOpenLogin,
  currentUser,
  onSearchQueryChange,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onOpenSearch,
  onOpenShortcutsModal,
  onOpenConsultation,
  onOpenProjectPdfReport,
  onOpenTour,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const isMac = useMemo(() => isMacUser(), []);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const handleToggleAudio = () => {
    const active = botanicalAudio.toggle();
    setIsAudioActive(active);
  };

  // Close drawer on window resize to xl (>= 1280px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    if (/^AG-\d+/i.test(searchVal.trim())) {
      onOpenProjectLookup();
      return;
    }

    if (onOpenSearch) {
      onOpenSearch();
    } else if (onSearchQueryChange) {
      onSearchQueryChange(searchVal);
      const elem = document.getElementById('solutions');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (id: string) => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-[#f3f7f4]/95 backdrop-blur-md border-b border-[#0d3822]/10 transition-all"
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-1.5 sm:gap-3 md:gap-4">
        
        {/* Brand Logo - Dynamically scales down on mobile viewports */}
        <a
          href="#"
          id="header-brand-logo"
          className="flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 group focus:outline-none"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full bg-[#072a1a] border border-[#86efac]/30 text-[#86efac] flex items-center justify-center shadow-sm group-hover:border-[#86efac]/70 transition-all shrink-0">
            <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 fill-[#86efac]/20 stroke-[#86efac]" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-[#072a1a]" title="Ateliê Ativo" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-tight text-[#072a1a] leading-tight group-hover:text-emerald-900 transition-colors">
                ALL GREEN
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-amber-700/80 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 uppercase">
                Ateliê
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-sans font-medium tracking-widest text-emerald-800/80 uppercase">
              Biofilia Arquitetônica & Preservada
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Visible on screens >= 1280px / xl) */}
        <nav
          id="desktop-navigation-links"
          className="hidden xl:flex items-center gap-3.5 2xl:gap-6 text-xs lg:text-sm font-semibold text-[#0d3822]"
        >
          <button 
            type="button"
            id="nav-link-solutions"
            onClick={() => scrollToSection('solutions')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Soluções
          </button>
          <button 
            type="button"
            id="nav-link-catalog"
            onClick={() => scrollToSection('botanical-catalog')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Catálogo
          </button>
          <button 
            type="button"
            id="nav-link-quiz"
            onClick={() => scrollToSection('biophilic-quiz')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer flex items-center gap-1 whitespace-nowrap text-emerald-800 font-bold"
          >
            <span>Quiz Biofílico</span>
            <span className="px-1.5 py-0.2 bg-emerald-200 text-[#072a1a] rounded-md text-[10px] font-extrabold">5 Perguntas</span>
          </button>
          <button 
            type="button"
            id="nav-link-comparison"
            onClick={() => scrollToSection('comparison-matrix')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Comparativo
          </button>
          <button 
            type="button"
            id="nav-link-roi"
            onClick={() => scrollToSection('biophilic-roi-calculator')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer flex items-center gap-1 whitespace-nowrap"
          >
            <span>Calculadora & ROI</span>
          </button>
          <button 
            type="button"
            id="nav-link-gallery"
            onClick={() => scrollToSection('before-after-gallery')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Projetos
          </button>
        </nav>

        {/* Search Bar - Desktop with Ctrl+K trigger (Wide screens >= 1536px) */}
        <div className="hidden 2xl:flex items-center relative max-w-[220px] w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#15803d]" />
            <input
              type="text"
              value={searchVal}
              onClick={() => onOpenSearch?.()}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar produtos, laudos..."
              className="w-full pl-9 pr-14 py-1.5 bg-white rounded-full border border-gray-300 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d3822] cursor-pointer"
            />
            <button
              type="button"
              onClick={onOpenSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 text-[10px] font-mono font-bold shadow-2xs cursor-pointer transition-colors"
              title={`Abrir Busca Global (${modKey}+K)`}
            >
              {modKey}K
            </button>
          </form>
        </div>

        {/* Action Buttons (Desktop & Mobile) */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
          
          {/* Ambient Soundscape Toggle (Brisa Botânica) */}
          <button
            type="button"
            id="header-ambient-audio-btn"
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              isAudioActive
                ? 'bg-emerald-900 text-emerald-200 border-emerald-600 shadow-sm'
                : 'bg-white hover:bg-emerald-50/80 text-emerald-950 border-gray-300/80'
            }`}
            title={isAudioActive ? 'Silenciar som ambiente do ateliê' : 'Ativar atmosfera sonora: Brisa na folhagem'}
            aria-label={isAudioActive ? 'Desativar som do ateliê' : 'Ativar som ambiente do ateliê'}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden md:inline text-[11px] font-sans font-semibold">Brisa Ativa</span>
                <span className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-0.5 h-3 bg-emerald-300 rounded-full animate-bounce delay-75" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden md:inline text-[11px] font-sans text-gray-600">Som Ateliê</span>
              </>
            )}
          </button>

          {/* Quick Search Button (All screens < 1536px) */}
          <button
            type="button"
            id="header-quick-search-btn"
            onClick={onOpenSearch}
            className="flex 2xl:hidden p-1.5 sm:p-2 md:p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300/80 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer active:scale-95"
            title={`Buscar (${modKey}+K)`}
            aria-label="Abrir busca e comandos"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#15803d]" />
          </button>

          {/* Notification Bell (Only visible when user is logged in) */}
          {currentUser && (
            <button
              type="button"
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 md:p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group active:scale-95"
              title="Notificações: Atualizações de Projetos & Mensagens da IA"
              aria-label="Abrir central de notificações e avisos de projetos"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#15803d] group-hover:rotate-12 transition-transform" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Portal do Arquiteto CTA (Screens >= 640px) */}
          <button
            type="button"
            id="header-portal-cta-btn"
            onClick={onOpenLogin}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-100/90 text-[#0d3822] hover:bg-emerald-200 border border-emerald-300 px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={`Acessar Área do Arquiteto (${modKey}+P)`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Portal Arquiteto'}</span>
          </button>

          {/* IA Simulator CTA (Sleek, Single-line, scales gracefully on all mobile viewports) */}
          <button
            type="button"
            id="header-simulator-cta-btn"
            onClick={onOpenSimulator}
            className="flex items-center gap-1 sm:gap-1.5 bg-[#0d3822] text-[#86efac] hover:bg-[#15803d] px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full font-bold text-[11px] sm:text-xs md:text-sm shadow-xs transition-all cursor-pointer group whitespace-nowrap shrink-0 active:scale-95"
            title={`Simulador IA de Ambientes (${modKey}+M)`}
          >
            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#86efac] shrink-0" />
            <span className="hidden xs:inline sm:inline leading-none">Simulador IA</span>
            <span className="inline xs:hidden sm:hidden leading-none">Simulador</span>
            <kbd className="hidden 2xl:inline-block ml-0.5 px-1 py-0.2 bg-[#072a1a] text-[#86efac] border border-emerald-700/50 rounded text-[9px] font-mono font-bold">
              {modKey}M
            </kbd>
          </button>

          {/* Orçamento CTA (Desktop/Tablet >= 768px) */}
          <button
            type="button"
            id="header-quote-cta-btn"
            onClick={onOpenQuote}
            className="hidden md:flex items-center gap-1.5 bg-white text-[#0d3822] hover:bg-emerald-50 border border-[#0d3822]/30 px-3 lg:px-3.5 py-1.5 lg:py-2.5 rounded-full font-semibold text-xs lg:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#15803d]" />
            <span>Orçamento</span>
          </button>

          {/* Hamburger Menu Toggle - Displayed on all screens < 1280px via 'flex xl:hidden' */}
          <button
            type="button"
            id="header-mobile-hamburger-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label={isDrawerOpen ? "Fechar Menu de Navegação" : "Abrir Menu de Navegação"}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-menu-drawer"
            className="flex xl:hidden p-1.5 sm:p-2 rounded-full bg-white text-[#0d3822] border border-gray-300/80 hover:bg-emerald-50 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-[#0d3822] cursor-pointer shadow-2xs active:scale-95 transition-all items-center justify-center shrink-0"
          >
            {isDrawerOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <MenuIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>

      {/* Extracted MobileMenuDrawer component (Rendered via React Portal for flawless full-screen coverage) */}
      <MobileMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSimulator={onOpenSimulator}
        onOpenProjectLookup={onOpenProjectLookup}
        onOpenQuote={onOpenQuote}
        onOpenLogin={onOpenLogin}
        currentUser={currentUser}
        onSearchQueryChange={onSearchQueryChange}
        onOpenNotifications={onOpenNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenSearch={onOpenSearch}
        onOpenShortcutsModal={onOpenShortcutsModal}
        onOpenConsultation={onOpenConsultation}
        onOpenProjectPdfReport={onOpenProjectPdfReport}
        onOpenTour={onOpenTour}
        modKey={modKey}
      />
    </header>
  );
};

