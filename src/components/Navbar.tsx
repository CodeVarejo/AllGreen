import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Search, Menu as MenuIcon, X, Camera, PhoneCall, Layers, BookOpen, Calculator, Image as ImageIcon, UserCheck, Bell, Keyboard, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';
import { isMacUser } from '../hooks/useKeyboardShortcuts';

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
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMac = useMemo(() => isMacUser(), []);
  const modKey = isMac ? '⌘' : 'Ctrl';

  // Close drawer on window resize to lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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

    if (onSearchQueryChange) {
      onSearchQueryChange(searchVal);
      const elem = document.getElementById('search-hub');
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
    <header className="sticky top-0 z-40 bg-[#f3f7f4]/95 backdrop-blur-md border-b border-[#0d3822]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-[#0d3822] text-[#86efac] flex items-center justify-center shadow-sm group-hover:bg-[#15803d] transition-colors">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0d3822]">
              ALL GREEN
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#15803d] uppercase -mt-1">
              Decor & Biophilia
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#0d3822]">
          <button 
            onClick={() => scrollToSection('solutions')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer"
          >
            Soluções
          </button>
          <button 
            onClick={() => scrollToSection('botanical-catalog')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer"
          >
            Catálogo
          </button>
          <button 
            onClick={() => scrollToSection('comparison-matrix')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer"
          >
            Comparativo
          </button>
          <button 
            onClick={() => scrollToSection('leed-calculator')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer"
          >
            Calculadora LEED
          </button>
          <button 
            onClick={() => scrollToSection('biophilic-roi-calculator')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer flex items-center gap-1"
          >
            <span>ROI Biofílico</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-[#15803d] rounded-md text-[10px] font-bold">Novo</span>
          </button>
          <button 
            onClick={() => scrollToSection('before-after-gallery')}
            className="hover:text-[#15803d] transition-colors py-1 cursor-pointer"
          >
            Projetos
          </button>
        </nav>

        {/* Search Bar - Desktop with Ctrl+K trigger */}
        <div className="hidden xl:flex items-center relative max-w-[260px] w-full">
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

        {/* Actions Buttons (Desktop & Mobile) */}
        <div className="flex items-center gap-2">
          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcutsModal && (
            <button
              type="button"
              onClick={onOpenShortcutsModal}
              className="hidden lg:flex items-center gap-1 p-2 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group active:scale-95"
              title="Guia de Atalhos de Teclado (Pressione ?)"
              aria-label="Ver atalhos de teclado globais"
            >
              <Keyboard className="w-4 h-4 text-gray-600 group-hover:text-[#15803d] transition-colors" />
            </button>
          )}

          {/* Notification Bell (Only visible when user is logged in) */}
          {currentUser && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer group active:scale-95"
              title="Notificações: Atualizações de Projetos & Mensagens da IA"
              aria-label="Abrir central de notificações e avisos de projetos"
            >
              <Bell className="w-5 h-5 text-[#15803d] group-hover:rotate-12 transition-transform" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Portal do Arquiteto CTA */}
          <button
            onClick={onOpenLogin}
            className="hidden md:flex items-center gap-1.5 bg-emerald-100/90 text-[#0d3822] hover:bg-emerald-200 border border-emerald-300 px-3.5 py-2 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer"
            title={`Acessar Área do Arquiteto (${modKey}+P)`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Portal Arquiteto'}</span>
          </button>

          {/* IA Simulator CTA */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 bg-[#0d3822] text-[#86efac] hover:bg-[#15803d] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer group"
            title={`Simulador IA de Ambientes (${modKey}+M)`}
          >
            <Camera className="w-4 h-4 text-[#86efac]" />
            <span>Simulador IA</span>
            <kbd className="hidden xl:inline-block ml-0.5 px-1 py-0.2 bg-[#072a1a] text-[#86efac] border border-emerald-700/50 rounded text-[9px] font-mono font-bold">
              {modKey}M
            </kbd>
          </button>

          {/* Orçamento CTA */}
          <button
            onClick={onOpenQuote}
            className="hidden sm:flex items-center gap-1.5 bg-white text-[#0d3822] hover:bg-emerald-50 border border-[#0d3822]/30 px-3.5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#15803d]" />
            <span>Orçamento</span>
          </button>

          {/* Hamburger Menu Toggle (Mobile & Tablet) */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label={isDrawerOpen ? "Fechar Menu" : "Abrir Menu"}
            aria-expanded={isDrawerOpen}
            className="lg:hidden p-2.5 rounded-full bg-white text-[#0d3822] border border-gray-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-[#0d3822] cursor-pointer"
          >
            {isDrawerOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay & Panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Content Panel */}
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#15803d]" />
                  <span className="font-serif font-bold text-lg text-[#0d3822]">Menu Navegação</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer"
                  aria-label="Fechar Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearchSubmit(e); setIsDrawerOpen(false); }} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#15803d]" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Buscar ou código (ex: AG-4891)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0d3822]"
                />
              </form>

              {/* Navigation Links */}
              <nav className="space-y-2">
                {/* Mobile Fast Commands / Search */}
                <button
                  onClick={() => { setIsDrawerOpen(false); onOpenSearch?.(); }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 text-[#072a1a] font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#15803d]" />
                    <span>Busca Global & Comandos</span>
                  </div>
                  <kbd className="px-2 py-0.5 rounded bg-white border border-gray-300 text-[10px] font-mono font-bold text-gray-700 shadow-2xs">
                    {modKey}+K
                  </kbd>
                </button>

                {currentUser && (
                  <button
                    onClick={() => { setIsDrawerOpen(false); onOpenNotifications?.(); }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-100/80 text-[#0d3822] font-bold hover:bg-emerald-200 border border-emerald-300 transition-colors text-left cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#15803d]" />
                      <span>Notificações & Avisos</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[11px] font-extrabold rounded-full animate-pulse">
                        {unreadNotificationsCount} {unreadNotificationsCount === 1 ? 'novo' : 'novos'}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={() => { setIsDrawerOpen(false); onOpenLogin(); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-emerald-900 text-[#86efac] font-bold transition-colors text-left cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-5 h-5 text-[#86efac]" />
                  <span>Portal do Arquiteto (BIM/3D)</span>
                </button>

                <button
                  onClick={() => { setIsDrawerOpen(false); onOpenSimulator(); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 text-[#0d3822] font-bold hover:bg-emerald-100 transition-colors text-left cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-[#15803d]" />
                  <span>Simulador de Parede Verde IA</span>
                </button>

                <button
                  onClick={() => scrollToSection('solutions')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <Layers className="w-5 h-5 text-[#15803d]" />
                  <span>Nossas Soluções Biofílicas</span>
                </button>

                <button
                  onClick={() => scrollToSection('botanical-catalog')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#15803d]" />
                  <span>Catálogo de Espécies</span>
                </button>

                <button
                  onClick={() => scrollToSection('comparison-matrix')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <Layers className="w-5 h-5 text-[#15803d]" />
                  <span>Comparativo Técnico</span>
                </button>

                <button
                  onClick={() => scrollToSection('leed-calculator')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <Calculator className="w-5 h-5 text-[#15803d]" />
                  <span>Calculadora WELL & LEED</span>
                </button>

                <button
                  onClick={() => scrollToSection('biophilic-roi-calculator')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#15803d]" />
                    <span>Calculadora ROI Biofílico</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803d] text-[10px] font-bold">
                    Novo
                  </span>
                </button>

                <button
                  onClick={() => scrollToSection('before-after-gallery')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-800 font-semibold transition-colors text-left cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-[#15803d]" />
                  <span>Galeria Antes & Depois</span>
                </button>
              </nav>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3.5 bg-[#0d3822] text-[#86efac] font-bold rounded-xl text-center shadow-md hover:bg-[#15803d] transition-colors cursor-pointer"
              >
                Solicitar Orçamento Executivo
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenProjectLookup();
                }}
                className="w-full py-2.5 text-xs text-[#0d3822] font-semibold text-center hover:underline cursor-pointer"
              >
                Consultar Projeto por Código AG
              </button>

              {onOpenShortcutsModal && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenShortcutsModal();
                  }}
                  className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Ver Atalhos de Teclado Globais</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

