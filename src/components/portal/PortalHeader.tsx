import React from 'react';
import {
  Leaf,
  ArrowLeft,
  Bell,
  Camera,
  Plus,
  LogOut,
  UserCheck,
  Building,
  Search,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../../types';
import { isMacUser } from '../../hooks/useKeyboardShortcuts';
import { CloudSyncButton } from '../CloudSyncButton';
import { useAccessibility } from '../../context/AccessibilityContext';

interface PortalHeaderProps {
  user: UserProfile;
  unreadNotificationsCount: number;
  onBackToLanding: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenSimulator: () => void;
  onOpenNewProjectModal: () => void;
  onToggleUserRole?: () => void;
  onOpenSearch?: () => void;
  onTriggerSimulation?: (type: 'botanical' | 'leed') => void;
  onOpenCloudStorage?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  user,
  unreadNotificationsCount,
  onBackToLanding,
  onLogout,
  onOpenNotifications,
  onOpenSimulator,
  onOpenNewProjectModal,
  onToggleUserRole,
  onOpenSearch,
  onTriggerSimulation,
  onOpenCloudStorage,
}) => {
  const { theme, toggleTheme } = useAccessibility();
  const isArchitect = user.role === 'arquiteto' || user.role === 'especificador';
  const isMac = isMacUser();
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <header className="sticky top-0 z-40 bg-[#f3f7f4]/95 backdrop-blur-md border-b border-[#072a1a]/10 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Return to Landing & Brand Logo Identical to Landing */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-emerald-50 text-[#072a1a] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-bold border border-[#072a1a]/15 shadow-2xs hover:border-[#15803d] transition-all cursor-pointer group active:scale-95 min-h-[38px] sm:min-h-[44px]"
            title="Retornar à Landing Page Principal"
            aria-label="Voltar à página inicial do site"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#15803d] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Voltar ao Site</span>
            <span className="inline sm:hidden">Site</span>
          </button>

          <div className="h-6 w-[1px] bg-[#072a1a]/10 hidden md:block" />

          {/* Brand Identity - Exact Landing Page Pairing */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#072a1a] text-[#86efac] flex items-center justify-center shadow-xs shrink-0">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-sm sm:text-base md:text-xl font-bold tracking-tight text-[#072a1a] leading-none whitespace-nowrap">
                  ALL GREEN
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase bg-emerald-100 text-[#072a1a] border border-emerald-300 shrink-0">
                  <UserCheck className="w-2.5 h-2.5 text-[#15803d]" />
                  <span className="hidden sm:inline">{isArchitect ? 'Portal do Arquiteto' : 'Área do Cliente'}</span>
                  <span className="inline sm:hidden">Portal</span>
                </span>
              </div>
              <span className="text-[8px] sm:text-[10px] font-semibold text-[#15803d] uppercase tracking-wider sm:tracking-widest mt-0.5 truncate max-w-[80px] xs:max-w-[130px] sm:max-w-xs">
                {user.company || 'Decor & Biophilia'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions, AI Simulator, Notifications, User */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Quick Search Shortcut */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#072a1a] text-xs font-semibold border border-gray-300/80 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer min-h-[38px]"
              title={`Buscar Obras, Arquivos BIM e Espécies (${modKey}+K)`}
              aria-label="Abrir busca global"
            >
              <Search className="w-3.5 h-3.5 text-[#15803d]" />
              <span className="text-gray-500">Buscar...</span>
              <kbd className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px] font-mono font-bold border border-gray-200">
                {modKey}K
              </kbd>
            </button>
          )}

          {/* Quick Role Toggle (Demo / Prototype) */}
          {onToggleUserRole && (
            <button
              type="button"
              onClick={onToggleUserRole}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-[#072a1a] font-bold text-xs border border-emerald-300 transition-all cursor-pointer min-h-[38px]"
              title="Alternar entre perfil de Arquiteto e Cliente"
            >
              {isArchitect ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>Modo: Arquiteto</span>
                </>
              ) : (
                <>
                  <Building className="w-3.5 h-3.5 text-teal-700" />
                  <span>Modo: Cliente</span>
                </>
              )}
              <span className="text-[10px] text-gray-500 font-normal ml-0.5">(Trocar)</span>
            </button>
          )}

          {/* Cloud Storage & Sync CTA */}
          {onOpenCloudStorage && (
            <CloudSyncButton onClick={onOpenCloudStorage} variant="portal" />
          )}

          {/* New Project CTA (Desktop) */}
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-[#072a1a] px-3.5 py-2 rounded-full text-xs font-bold border border-[#072a1a]/15 shadow-2xs hover:border-[#15803d] transition-all cursor-pointer active:scale-95 min-h-[44px]"
            title="Cadastrar nova obra ou ambiente"
            aria-label="Cadastrar Nova Obra"
          >
            <Plus className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Nova Obra</span>
          </button>

          {/* AI Simulator CTA (Matching Landing Page Style) */}
          <button
            type="button"
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 bg-[#072a1a] text-[#86efac] hover:bg-[#15803d] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 min-h-[38px] sm:min-h-[44px]"
            title={`Simulador IA de Ambientes (${modKey}+M)`}
            aria-label="Abrir Simulador IA"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86efac]" />
            <span className="hidden sm:inline">Simulador IA</span>
            <span className="inline sm:hidden">Simulador</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="portal-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-200 hover:border-[#15803d] transition-all cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center shadow-2xs active:scale-95"
            title={theme === 'dark' ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            aria-label="Alternar tema de cor"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#15803d] transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className={`relative p-2 sm:p-2.5 rounded-full transition-all cursor-pointer border min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center ${
              unreadNotificationsCount > 0
                ? 'bg-emerald-100 text-[#072a1a] hover:bg-emerald-200 border-emerald-300 shadow-2xs'
                : 'bg-white text-gray-600 hover:text-gray-950 hover:bg-gray-100 border-gray-200'
            }`}
            title="Notificações e Laudos Técnicos"
            aria-label="Abrir Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[10px] font-extrabold shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-gray-200">
            <div className="relative group cursor-pointer" title={`${user.name} - ${user.cau_rrt || user.role}`}>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-xs"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-full bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              title="Sair do Portal"
              aria-label="Sair da conta"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
