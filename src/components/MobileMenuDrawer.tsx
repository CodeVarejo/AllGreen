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
  Image as ImageIcon,
  UserCheck,
  Bell,
  Keyboard,
  TrendingUp,
  ChevronRight,
  Calendar,
  Download,
  FileText,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

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
  modKey: string;
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
  modKey,
}) => {
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
      id="mobile-menu-drawer"
      className="fixed inset-0 z-[100] xl:hidden flex flex-col pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de Navegação Mobile e Tablet"
    >
      {/* Dark Backdrop */}
      <div
        id="mobile-drawer-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Slide-over panel) */}
      <div
        id="mobile-drawer-panel"
        className="relative ml-auto w-full max-w-[340px] sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 p-4 sm:p-5 animate-in slide-in-from-right duration-250"
      >
        <div className="space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0d3822] text-[#86efac] flex items-center justify-center shadow-xs shrink-0">
                <Leaf className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm text-[#0d3822] leading-tight">
                  ALL GREEN
                </span>
                <span className="text-[8px] font-bold text-[#15803d] uppercase tracking-wider">
                  Menu & Navegação
                </span>
              </div>
            </div>

            <button
              type="button"
              id="mobile-drawer-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Fechar Menu Mobile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Cards Grid (Mobile) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="mobile-drawer-simulator-btn"
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              className="p-2.5 rounded-xl bg-[#0d3822] text-[#86efac] flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-xs hover:bg-[#15803d] transition-all cursor-pointer text-center active:scale-95"
            >
              <Camera className="w-4 h-4 text-[#86efac]" />
              <span>Simulador IA</span>
            </button>

            <button
              type="button"
              id="mobile-drawer-portal-btn"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="p-2.5 rounded-xl bg-emerald-50 text-[#0d3822] border border-emerald-200 flex flex-col items-center justify-center gap-1 font-bold text-xs shadow-2xs hover:bg-emerald-100 transition-all cursor-pointer text-center active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-[#15803d]" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Portal Arquiteto'}</span>
            </button>
          </div>

          {/* Mobile Fast Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#15803d]" />
            <input
              type="text"
              id="mobile-drawer-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Buscar espécies, laudos ou AG..."
              className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d3822] focus:bg-white transition-all"
            />
          </form>

          {/* Vertical Navigation Links */}
          <nav className="space-y-1 pt-1" aria-label="Navegação móvel de seções">
            {/* Global Search / Command Palette shortcut button */}
            <button
              type="button"
              id="mobile-drawer-cmd-btn"
              onClick={() => {
                onClose();
                onOpenSearch?.();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 text-[#072a1a] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#15803d]" />
                <span className="text-xs">Busca Global & Comandos</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-300 text-[9px] font-mono font-bold text-gray-700 shadow-2xs">
                {modKey}+K
              </kbd>
            </button>

            {/* Guided Tour button */}
            {onOpenTour && (
              <button
                type="button"
                id="mobile-drawer-tour-btn"
                onClick={() => {
                  onClose();
                  onOpenTour();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 text-[#072a1a] font-bold border border-emerald-300 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
                  <span className="text-xs">Tour Guiado (Onboarding)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[9px] font-extrabold">
                  3 Recursos
                </span>
              </button>
            )}

            {/* Notifications (if logged in) */}
            {currentUser && (
              <button
                type="button"
                id="mobile-drawer-notifications-btn"
                onClick={() => {
                  onClose();
                  onOpenNotifications?.();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-100/70 text-[#0d3822] font-bold hover:bg-emerald-200 border border-emerald-300 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#15803d]" />
                  <span className="text-xs">Notificações</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              id="mobile-nav-solutions"
              onClick={() => scrollToSection('solutions')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Nossas Soluções Biofílicas</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="mobile-nav-catalog"
              onClick={() => scrollToSection('botanical-catalog')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Catálogo Botânico</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="mobile-nav-quiz"
              onClick={() => scrollToSection('biophilic-quiz')}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 font-bold text-xs transition-colors text-left cursor-pointer group border border-emerald-200"
            >
              <div className="flex items-center gap-2.5">
                <Leaf className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Quiz Perfil Biofílico</span>
              </div>
              <span className="px-1.5 py-0.2 bg-[#072a1a] text-[#86efac] text-[9px] font-extrabold rounded">5 Perguntas</span>
            </button>

            <button
              type="button"
              id="mobile-nav-comparison"
              onClick={() => scrollToSection('comparison-matrix')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Comparativo Técnico</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="mobile-nav-roi"
              onClick={() => scrollToSection('biophilic-roi-calculator')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Calculadora & ROI (WELL/LEED)</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="mobile-nav-gallery"
              onClick={() => scrollToSection('before-after-gallery')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Galeria Antes & Depois</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            <button
              type="button"
              id="mobile-nav-testimonials"
              onClick={() => scrollToSection('customer-testimonials')}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Depoimentos & Casos Reais</span>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors" />
            </button>

            {onOpenConsultation && (
              <button
                type="button"
                id="mobile-nav-consultation"
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-[#072a1a] font-bold text-xs transition-colors text-left cursor-pointer border border-emerald-200 mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>Agendar Consultoria Técnica</span>
                </div>
                <span className="text-[10px] bg-[#072a1a] text-[#86efac] px-2 py-0.5 rounded font-bold">
                  Calendly
                </span>
              </button>
            )}

            {onOpenProjectPdfReport && (
              <button
                type="button"
                id="mobile-nav-pdf-report"
                onClick={() => {
                  onClose();
                  onOpenProjectPdfReport();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-gray-800 font-semibold text-xs transition-colors text-left cursor-pointer border border-gray-200 mt-1"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Gerar Laudo / PDF do Projeto</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  PDF
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-3 border-t border-gray-100 space-y-2 mt-4">
          <button
            type="button"
            id="mobile-drawer-cta-quote"
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="w-full py-2.5 bg-[#0d3822] text-[#86efac] font-bold rounded-xl text-xs text-center shadow-sm hover:bg-[#15803d] transition-colors cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#86efac]" />
            <span>Solicitar Orçamento Executivo</span>
          </button>

          <button
            type="button"
            id="mobile-drawer-lookup-link"
            onClick={() => {
              onClose();
              onOpenProjectLookup();
            }}
            className="w-full py-1.5 text-[11px] text-[#0d3822] font-semibold text-center hover:underline cursor-pointer"
          >
            Consultar Projeto por Código AG
          </button>

          {onOpenShortcutsModal && (
            <button
              type="button"
              id="mobile-drawer-shortcuts-link"
              onClick={() => {
                onClose();
                onOpenShortcutsModal();
              }}
              className="w-full py-1 text-[10px] text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Keyboard className="w-3 h-3" />
              <span>Atalhos de Teclado (?)</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
