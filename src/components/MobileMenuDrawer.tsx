import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Leaf,
  Search,
  X,
  Camera,
  PhoneCall,
  Layers,
  BookOpen,
  Calculator,
  UserCheck,
  Bell,
  Keyboard,
  TrendingUp,
  ChevronRight,
  Calendar,
  Download,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Activity,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSelector } from './ThemeSelector';
import { PWAInstallButton } from './pwa/PWAInstallButton';

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  modKey: string;
  isAudioActive?: boolean;
  onToggleAudio?: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
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
  modKey,
  isAudioActive = false,
  onToggleAudio,
}) => {
  const { theme, toggleTheme } = useAccessibility();
  const { t, language } = useLanguage();
  const [searchVal, setSearchVal] = useState('');

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    if (/^AG-\d+/i.test(searchVal.trim())) {
      onClose();
      onOpenProjectLookup();
      return;
    }

    if (onOpenSearch) {
      onClose();
      onOpenSearch();
    } else if (onSearchQueryChange) {
      onSearchQueryChange(searchVal);
      onClose();
      const elem = document.getElementById('solutions');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (id: string) => {
    onClose();
    setTimeout(() => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return createPortal(
    <div
      id="menu-drawer"
      className="fixed inset-0 z-[100] flex flex-col pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de Ferramentas e Navegação"
    >
      {/* Dark Backdrop */}
      <div
        id="menu-drawer-backdrop"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Slide-over panel on both mobile and desktop) */}
      <div
        id="menu-drawer-panel"
        className="relative ml-auto w-full max-w-[360px] sm:max-w-md bg-white dark:bg-[#06180f] h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 p-4 sm:p-6 animate-in slide-in-from-right duration-250 border-l border-emerald-950/10 dark:border-emerald-800/40"
      >
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0d3822] text-[#86efac] flex items-center justify-center shadow-xs shrink-0">
                <Leaf className="w-4 h-4 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm text-[#0d3822] dark:text-[#86efac] leading-tight">
                  ALL GREEN
                </span>
                <span className="text-[9px] font-bold text-[#15803d] dark:text-emerald-400 uppercase tracking-wider">
                  Menu & Ferramentas
                </span>
              </div>
            </div>

            <button
              type="button"
              id="menu-drawer-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-emerald-900/50 cursor-pointer transition-colors"
              aria-label="Fechar Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Grid (4 Key Features) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="drawer-simulator-btn"
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              className="p-3 rounded-2xl bg-[#0d3822] text-[#86efac] hover:bg-[#15803d] hover:text-white flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-xs transition-all cursor-pointer text-center active:scale-95 group border border-emerald-700/40"
            >
              <Camera className="w-4 h-4 text-[#86efac] group-hover:scale-110 transition-transform" />
              <span>{t('nav.simulator', 'Simulador de Ambientes')}</span>
            </button>

            <button
              type="button"
              id="drawer-portal-btn"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-[#0d3822] dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-all cursor-pointer text-center active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
              <span className="truncate max-w-[120px]">
                {currentUser ? currentUser.name.split(' ')[0] : t('nav.architectArea', 'Área Arquiteto')}
              </span>
            </button>

            {onOpenHabitTracker && (
              <button
                type="button"
                id="drawer-habit-tracker-btn"
                onClick={() => {
                  onClose();
                  onOpenHabitTracker();
                }}
                className="p-3 rounded-2xl bg-white dark:bg-emerald-950/40 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-emerald-800/80 flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-2xs hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all cursor-pointer text-center active:scale-95"
              >
                <Activity className="w-4 h-4 text-[#15803d] dark:text-emerald-400" />
                <span>
                  {language === 'pt' ? 'Hábitos Biofílicos' : language === 'es' ? 'Hábitos Biofílicos' : 'Biophilic Habits'}
                </span>
              </button>
            )}

            {onOpenConsultation && (
              <button
                type="button"
                id="drawer-consultation-btn"
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="p-3 rounded-2xl bg-white dark:bg-emerald-950/40 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-emerald-800/80 flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-2xs hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all cursor-pointer text-center active:scale-95"
              >
                <Calendar className="w-4 h-4 text-[#15803d] dark:text-emerald-400" />
                <span>
                  {language === 'pt' ? 'Consultoria' : language === 'es' ? 'Consultoría' : 'Consultation'}
                </span>
              </button>
            )}
          </div>

          {/* Ambient Soundscape Controller (Brisa Botânica do Ateliê) */}
          {onToggleAudio && (
            <div className="p-3.5 rounded-2xl bg-[#072a1a] text-white border border-emerald-800/80 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                  isAudioActive ? 'bg-emerald-500/20 text-[#86efac]' : 'bg-white/10 text-gray-400'
                }`}>
                  {isAudioActive ? (
                    <Volume2 className="w-4 h-4 animate-pulse text-[#86efac]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-serif font-bold text-white block leading-tight">
                      {language === 'pt' ? 'Brisa do Ateliê' : language === 'es' ? 'Brisa del Taller' : 'Atelier Breeze'}
                    </span>
                    {isAudioActive && (
                      <span className="w-2 h-2 rounded-full bg-[#86efac] animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-300/80 font-sans block">
                    {isAudioActive
                      ? language === 'pt'
                        ? 'Áudio ambiente imersivo ativo'
                        : language === 'es'
                        ? 'Audio ambiental inmersivo activo'
                        : 'Immersive ambient sound active'
                      : language === 'pt'
                      ? 'Toque para ouvir a atmosfera biofílica'
                      : language === 'es'
                      ? 'Toca para escuchar la atmósfera biofílica'
                      : 'Tap to listen to biophilic soundscape'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="drawer-audio-toggle-btn"
                onClick={onToggleAudio}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isAudioActive
                    ? 'bg-[#86efac] text-[#072a1a] hover:bg-emerald-300 shadow-xs'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {isAudioActive
                  ? language === 'pt' ? 'Desativar' : language === 'es' ? 'Desactivar' : 'Mute'
                  : language === 'pt' ? 'Ouvir' : language === 'es' ? 'Escuchar' : 'Listen'}
              </button>
            </div>
          )}

          {/* Preferences Section: Theme and Language */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
              {language === 'pt'
                ? 'Preferências Visuais & Sistema'
                : language === 'es'
                ? 'Preferencias Visuales & Sistema'
                : 'Visual Preferences & System'}
            </span>

            {/* Circadian Solar Schedule & Manual Theme Selector */}
            <ThemeSelector variant="drawer" />

            {/* Language Switcher */}
            <LanguageSwitcher variant="drawer" />
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#15803d]" />
            <input
              type="text"
              id="drawer-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t('nav.searchPlaceholder', 'Buscar espécies, laudos ou AG...')}
              className="w-full pl-8 pr-12 py-2 bg-gray-50 dark:bg-emerald-950/40 rounded-xl border border-gray-200 dark:border-emerald-800 text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d3822] focus:bg-white dark:focus:bg-emerald-950 transition-all"
            />
            {onOpenSearch && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-emerald-800 text-[10px] font-mono font-bold text-gray-700 dark:text-emerald-200 cursor-pointer"
                title={`Abrir comando (${modKey}+K)`}
              >
                {modKey}K
              </button>
            )}
          </form>

          {/* Tools & Resources */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
              {language === 'pt' ? 'Recursos & Atalhos' : language === 'es' ? 'Recursos y Atajos' : 'Tools & Shortcuts'}
            </span>

            {onOpenTour && (
              <button
                type="button"
                id="drawer-tour-btn"
                onClick={() => {
                  onClose();
                  onOpenTour();
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/40 text-[#072a1a] dark:text-emerald-200 font-bold border border-emerald-300/60 dark:border-emerald-800 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                  <span className="text-xs">
                    {language === 'pt' ? 'Tour Guiado Interativo' : language === 'es' ? 'Tour Guiado Interactivo' : 'Interactive Guided Tour'}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[9px] font-extrabold">
                  {language === 'pt' ? '3 Recursos' : language === 'es' ? '3 Recursos' : '3 Features'}
                </span>
              </button>
            )}

            {onOpenProjectPdfReport && (
              <button
                type="button"
                id="drawer-pdf-report"
                onClick={() => {
                  onClose();
                  onOpenProjectPdfReport();
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-emerald-800"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>
                    {language === 'pt' ? 'Gerar Laudo / PDF do Projeto' : language === 'es' ? 'Generar Memoria / PDF del Proyecto' : 'Download Project Spec (PDF)'}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  PDF
                </span>
              </button>
            )}

            {currentUser && onOpenNotifications && (
              <button
                type="button"
                id="drawer-notifications-btn"
                onClick={() => {
                  onClose();
                  onOpenNotifications();
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-[#0d3822] dark:text-emerald-200 font-bold hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-800 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                  <span className="text-xs">
                    {language === 'pt' ? 'Central de Notificações' : language === 'es' ? 'Centro de Notificaciones' : 'Notification Center'}
                  </span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                    {unreadNotificationsCount} {language === 'pt' ? 'novas' : language === 'es' ? 'nuevas' : 'new'}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Section Navigation Links */}
          <nav className="space-y-0.5 pt-1 border-t border-gray-100 dark:border-emerald-900/60" aria-label="Navegação de seções">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 block mb-1">
              {language === 'pt' ? 'Seções Principais' : language === 'es' ? 'Secciones Principales' : 'Main Sections'}
            </span>

            <button
              type="button"
              id="drawer-nav-solutions"
              onClick={() => scrollToSection('solutions')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.solutions', 'Soluções Técnicas')}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="drawer-nav-catalog"
              onClick={() => scrollToSection('botanical-catalog')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.catalog', 'Catálogo Botânico')}</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                Offline
              </span>
            </button>

            <button
              type="button"
              id="drawer-nav-quiz"
              onClick={() => scrollToSection('biophilic-quiz')}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold text-xs transition-colors text-left cursor-pointer group border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center gap-2.5">
                <Leaf className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.quiz', 'Quiz Biofílico')}</span>
              </div>
              <span className="px-1.5 py-0.2 bg-[#072a1a] text-[#86efac] text-[9px] font-extrabold rounded">
                {language === 'pt' ? '5 Perguntas' : language === 'es' ? '5 Preguntas' : '5 Questions'}
              </span>
            </button>

            <button
              type="button"
              id="drawer-nav-comparison"
              onClick={() => scrollToSection('comparison-matrix')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.comparison', 'Comparativo de Tecnologias')}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="drawer-nav-roi"
              onClick={() => scrollToSection('biophilic-roi-calculator')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.roi', 'Calculadora & ROI')}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="drawer-nav-gallery"
              onClick={() => scrollToSection('before-after-gallery')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-emerald-950/50 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Camera className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400" />
                <span>{t('nav.projects', 'Galeria Antes & Depois')}</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>
          </nav>
        </div>

        {/* PWA Offline Install Button + Bottom Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-emerald-900/60 space-y-2 mt-4">
          <PWAInstallButton variant="drawer" />

          <button
            type="button"
            id="drawer-cta-quote"
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="w-full py-2.5 bg-[#0d3822] text-[#86efac] font-bold rounded-xl text-xs text-center shadow-sm hover:bg-[#15803d] transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#86efac]" />
            <span>
              {language === 'pt'
                ? 'Solicitar Orçamento Executivo'
                : language === 'es'
                ? 'Solicitar Presupuesto Ejecutivo'
                : 'Request Executive Quote'}
            </span>
          </button>

          <button
            type="button"
            id="drawer-lookup-link"
            onClick={() => {
              onClose();
              onOpenProjectLookup();
            }}
            className="w-full py-1 text-[11px] text-[#0d3822] dark:text-emerald-300 font-semibold text-center hover:underline cursor-pointer"
          >
            {language === 'pt'
              ? 'Consultar Projeto por Código AG'
              : language === 'es'
              ? 'Consultar Proyecto por Código AG'
              : 'Look Up Project by AG Code'}
          </button>

          {onOpenShortcutsModal && (
            <button
              type="button"
              id="drawer-shortcuts-link"
              onClick={() => {
                onClose();
                onOpenShortcutsModal();
              }}
              className="w-full py-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Keyboard className="w-3 h-3" />
              <span>
                {language === 'pt' ? 'Atalhos de Teclado (?)' : language === 'es' ? 'Atajos de Teclado (?)' : 'Keyboard Shortcuts (?)'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
