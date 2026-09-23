import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Search, Menu as MenuIcon, X, Camera, PhoneCall, Layers, BookOpen, Calculator, Image as ImageIcon, UserCheck, Bell, Keyboard, TrendingUp, Sparkles, HelpCircle, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';
import { isMacUser } from '../hooks/useKeyboardShortcuts';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { botanicalAudio } from '../utils/botanicalAudio';
import { useAccessibility } from '../context/AccessibilityContext';

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
  const { theme, toggleTheme } = useAccessibility();
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
      className="navbar sticky top-0 z-40 bg-[#f3f7f4]/95 backdrop-blur-md border-b border-[#0d3822]/10 transition-all w-full overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
        
        {/* Brand Logo */}
        <a
          href="#"
          id="header-brand-logo"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none min-w-0"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#072a1a] border border-[#86efac]/30 text-[#86efac] flex items-center justify-center shadow-sm group-hover:border-[#86efac]/70 transition-all shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-[#86efac]/20 stroke-[#86efac]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#072a1a] leading-tight group-hover:text-emerald-900 transition-colors whitespace-nowrap">
              ALL GREEN
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-sans font-medium tracking-wider text-emerald-800/80 uppercase truncate">
              Biofilia Arquitetônica
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          id="desktop-navigation-links"
          className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs lg:text-sm font-semibold text-[#0d3822]"
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
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Quiz Biofílico
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
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            Calculadora & ROI
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          
          {/* Ambient Soundscape Toggle */}
          <button
            type="button"
            id="header-ambient-audio-btn"
            onClick={handleToggleAudio}
            className={`hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border text-xs transition-all cursor-pointer shrink-0 ${
              isAudioActive
                ? 'bg-emerald-900 text-emerald-200 border-emerald-600 shadow-sm'
                : 'bg-white hover:bg-emerald-50 text-emerald-950 border-gray-300/80 shadow-2xs'
            }`}
            title={isAudioActive ? 'Silenciar som ambiente' : 'Ativar som ambiente: brisa e folhagem'}
            aria-label={isAudioActive ? 'Desativar som do ateliê' : 'Ativar som ambiente do ateliê'}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            type="button"
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300/80 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
            title={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro botânico'}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro botânico'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#15803d] transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Quick Search Button (All screens < 1536px) */}
          <button
            type="button"
            id="header-quick-search-btn"
            onClick={onOpenSearch}
            className="flex 2xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300/80 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer active:scale-95 items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
            title={`Buscar (${modKey}+K)`}
            aria-label="Abrir busca e comandos"
          >
            <Search className="w-4 h-4 text-[#15803d]" />
          </button>

          {/* Notification Bell (Only visible when user is logged in) */}
          {currentUser && (
            <button
              type="button"
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group active:scale-95 flex items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
              title="Notificações"
              aria-label="Abrir notificações"
            >
              <Bell className="w-4 h-4 text-[#15803d] group-hover:rotate-12 transition-transform" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
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
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0d3822] border border-emerald-300/80 px-3.5 h-9 sm:h-10 rounded-full font-semibold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={`Área do Arquiteto (${modKey}+P)`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Área do Arquiteto'}</span>
          </button>

          {/* IA Simulator CTA (Clear Primary Action) */}
          <button
            type="button"
            id="header-simulator-cta-btn"
            onClick={onOpenSimulator}
            className="flex items-center gap-2 bg-[#0d3822] text-[#86efac] hover:bg-[#15803d] h-9 sm:h-10 px-3.5 sm:px-4 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            title={`Simulador IA (${modKey}+M)`}
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86efac] shrink-0" />
            <span>Simulador IA</span>
          </button>

          {/* Hamburger Menu Toggle - Always pinned, accessible 44px touch target, perfectly aligned */}
          <button
            type="button"
            id="header-mobile-hamburger-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label={isDrawerOpen ? "Fechar Menu de Navegação" : "Abrir Menu de Navegação"}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-menu-drawer"
            className={`flex xl:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822] ${
              isDrawerOpen
                ? 'bg-[#0d3822] text-[#86efac] border border-[#0d3822] shadow-sm'
                : 'bg-white text-[#0d3822] border border-gray-300/80 hover:bg-emerald-50 hover:border-emerald-400 shadow-2xs'
            }`}
          >
            {isDrawerOpen ? (
              <X className="w-5 h-5 text-[#86efac] transition-transform rotate-90 duration-200" />
            ) : (
              <MenuIcon className="w-5 h-5 text-[#0d3822] transition-transform duration-200" />
            )}
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
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
      />
    </header>
  );
};

