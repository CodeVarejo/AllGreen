import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Search, Menu as MenuIcon, X, Camera, UserCheck, Bell } from 'lucide-react';
import { UserProfile } from '../types';
import { isMacUser } from '../hooks/useKeyboardShortcuts';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSwitcher } from './LanguageSwitcher';
import { botanicalAudio } from '../utils/botanicalAudio';
import { useLanguage } from '../context/LanguageContext';

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
  onOpenHabitTracker?: () => void;
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
  onOpenHabitTracker,
}) => {
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const isMac = useMemo(() => isMacUser(), []);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const handleToggleAudio = () => {
    const active = botanicalAudio.toggle();
    setIsAudioActive(active);
  };

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
      className="navbar sticky top-0 z-40 bg-[#f3f7f4]/95 dark:bg-[#06180f]/95 backdrop-blur-md border-b border-[#0d3822]/10 dark:border-emerald-800/30 transition-all w-full overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
        
        {/* Brand Logo */}
        <a
          href="#"
          id="header-brand-logo"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none min-w-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#072a1a] border border-[#86efac]/30 text-[#86efac] flex items-center justify-center shadow-sm group-hover:border-[#86efac]/70 transition-all shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-[#86efac]/20 stroke-[#86efac]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-[#072a1a] dark:text-[#86efac] leading-none group-hover:text-emerald-900 transition-colors whitespace-nowrap">
              ALL GREEN
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-sans font-medium tracking-wider text-emerald-800/80 dark:text-emerald-400 uppercase truncate mt-0.5">
              {t('common.tagline', 'Biofilia Arquitetônica')}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          id="desktop-navigation-links"
          className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs lg:text-sm font-semibold text-[#0d3822] dark:text-emerald-200"
        >
          <button 
            type="button"
            id="nav-link-solutions"
            onClick={() => scrollToSection('solutions')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.solutions', 'Soluções')}
          </button>
          <button 
            type="button"
            id="nav-link-catalog"
            onClick={() => scrollToSection('botanical-catalog')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.catalog', 'Catálogo')}
          </button>
          <button 
            type="button"
            id="nav-link-quiz"
            onClick={() => scrollToSection('biophilic-quiz')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.quiz', 'Quiz Biofílico')}
          </button>
          <button 
            type="button"
            id="nav-link-comparison"
            onClick={() => scrollToSection('comparison-matrix')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.comparison', 'Comparativo')}
          </button>
          <button 
            type="button"
            id="nav-link-roi"
            onClick={() => scrollToSection('biophilic-roi-calculator')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.roi', 'Calculadora & ROI')}
          </button>
          <button 
            type="button"
            id="nav-link-gallery"
            onClick={() => scrollToSection('before-after-gallery')}
            className="hover:text-[#15803d] dark:hover:text-[#86efac] transition-colors py-1 cursor-pointer whitespace-nowrap"
          >
            {t('nav.projects', 'Projetos')}
          </button>
        </nav>

        {/* Clean, Responsive Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          
          {/* Quick Search Button (Visible on tablet & desktop) */}
          <button
            type="button"
            id="header-quick-search-btn"
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 h-8.5 sm:h-10 rounded-full bg-white dark:bg-emerald-950/60 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-[#0d3822] dark:text-emerald-200 border border-gray-300/80 dark:border-emerald-800/80 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
            title={`Buscar produtos, laudos e comandos (${modKey}+K)`}
            aria-label="Abrir busca e comandos"
          >
            <Search className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
            <span className="hidden xl:inline text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('nav.search', 'Buscar')}
            </span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-emerald-900 border border-gray-200 dark:border-emerald-800 text-gray-500 dark:text-emerald-300 font-bold ml-0.5">
              {modKey}K
            </kbd>
          </button>

          {/* Circadian Solar Schedule & Theme Selector (Sistema / Claro / Escuro) */}
          <ThemeSelector variant="compact" className="hidden sm:inline-flex" />

          {/* Platform Language Switcher (PT / EN / ES) */}
          <LanguageSwitcher variant="navbar" className="hidden sm:inline-flex" />

          {/* Notification Bell (Only visible when user is logged in, >= sm) */}
          {currentUser && (
            <button
              type="button"
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="hidden sm:flex relative w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-emerald-950/60 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-[#0d3822] dark:text-emerald-200 border border-gray-300 dark:border-emerald-800 shadow-2xs transition-all cursor-pointer group active:scale-95 items-center justify-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
              title="Notificações"
              aria-label="Abrir notificações"
            >
              <Bell className="w-4 h-4 text-[#15803d] dark:text-[#86efac] group-hover:rotate-12 transition-transform" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Portal do Arquiteto CTA (Screens >= 768px) */}
          <button
            type="button"
            id="header-portal-cta-btn"
            onClick={onOpenLogin}
            className="hidden md:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-[#0d3822] dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-800 px-3.5 h-9 sm:h-10 rounded-full font-semibold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            title={`Área do Arquiteto (${modKey}+P)`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#15803d] dark:text-[#86efac]" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : t('nav.architectArea', 'Área do Arquiteto')}</span>
          </button>

          {/* Simulator CTA (Flagship Action - Always clean and fits on mobile!) */}
          <button
            type="button"
            id="header-simulator-cta-btn"
            onClick={onOpenSimulator}
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#0d3822] text-[#86efac] hover:bg-[#15803d] hover:text-white h-8.5 sm:h-10 px-2.5 sm:px-4 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
            title={`Simulador de Ambientes (${modKey}+M)`}
            aria-label="Abrir Simulador de Ambientes"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86efac] shrink-0" />
            <span className="text-[11px] sm:text-sm">{t('nav.simulator', 'Simulador de Ambientes')}</span>
          </button>

          {/* Hamburger Menu Toggle (Universal: Available on desktop and mobile) */}
          <button
            type="button"
            id="header-mobile-hamburger-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label={isDrawerOpen ? t('nav.closeNavigation', 'Fechar menu') : t('nav.openNavigation', 'Abrir menu de ferramentas')}
            aria-expanded={isDrawerOpen}
            aria-controls="menu-drawer"
            title="Menu & Ferramentas"
            className={`relative flex items-center justify-center gap-1.5 h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-full transition-all cursor-pointer shrink-0 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822] ${
              isDrawerOpen
                ? 'bg-[#0d3822] text-[#86efac] border border-[#0d3822] shadow-sm'
                : 'bg-white dark:bg-emerald-950/60 text-[#0d3822] dark:text-emerald-200 border border-gray-300/80 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-900 shadow-2xs'
            }`}
          >
            {isDrawerOpen ? (
              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#86efac] transition-transform rotate-90 duration-200" />
            ) : (
              <MenuIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0d3822] dark:text-emerald-200 transition-transform duration-200" />
            )}
            <span className="hidden xl:inline text-xs font-bold text-[#0d3822] dark:text-emerald-200">
              Menu
            </span>

            {/* Notification badge on mobile if user has unread notifications */}
            {currentUser && unreadNotificationsCount > 0 && (
              <span className="sm:hidden absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 bg-red-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}

            {/* Subtle green indicator if audio soundscape is playing */}
            {isAudioActive && (
              <span
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"
                title="Som ambiente ativo"
              />
            )}
          </button>
        </div>

      </div>

      {/* Slide-over Drawer (Desktop & Mobile) */}
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
        onOpenHabitTracker={onOpenHabitTracker}
        modKey={modKey}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
      />
    </header>
  );
};
