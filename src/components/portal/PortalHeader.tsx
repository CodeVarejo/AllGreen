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
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

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
  onOpenSettings?: () => void;
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
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useAccessibility();
  const { t, language } = useLanguage();
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
            title={language === 'pt' ? 'Retornar à Landing Page Principal' : 'Back to Main Landing Page'}
            aria-label={t('portal.backToSite', 'Voltar ao Site')}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#15803d] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">{t('portal.backToSite', 'Voltar ao Site')}</span>
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
                  <span className="hidden sm:inline">
                    {isArchitect 
                      ? (language === 'pt' ? 'Portal do Arquiteto' : 'Architect Portal') 
                      : (language === 'pt' ? 'Área do Cliente' : 'Client Portal')}
                  </span>
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
              <span className="text-gray-500">{t('common.search', 'Buscar')}...</span>
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
                  <span>{language === 'pt' ? 'Modo: Arquiteto' : 'Mode: Architect'}</span>
                </>
              ) : (
                <>
                  <Building className="w-3.5 h-3.5 text-teal-700" />
                  <span>{language === 'pt' ? 'Modo: Cliente' : 'Mode: Client'}</span>
                </>
              )}
              <span className="text-[10px] text-gray-500 font-normal ml-0.5">
                ({language === 'pt' ? 'Trocar' : 'Switch'})
              </span>
            </button>
          )}

          {/* Cloud Storage & Sync CTA (Hidden on smallest mobile to prevent header overflow) */}
          {onOpenCloudStorage && (
            <div className="hidden sm:block">
              <CloudSyncButton onClick={onOpenCloudStorage} variant="portal" />
            </div>
          )}

          {/* Language Switcher in Portal */}
          <div className="hidden md:block">
            <LanguageSwitcher variant="navbar" />
          </div>

          {/* New Project CTA (Desktop) */}
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-[#072a1a] px-3.5 py-2 rounded-full text-xs font-bold border border-[#072a1a]/15 shadow-2xs hover:border-[#15803d] transition-all cursor-pointer active:scale-95 min-h-[44px]"
            title={language === 'pt' ? 'Cadastrar nova obra ou ambiente' : 'Register new project or room'}
            aria-label={t('portal.newProject', 'Nova Obra')}
          >
            <Plus className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{t('portal.newProject', 'Nova Obra')}</span>
          </button>

          {/* Simulator CTA (Matching Landing Page Style) */}
          <button
            type="button"
            onClick={onOpenSimulator}
            className="inline-flex items-center justify-center gap-1.5 bg-[#072a1a] text-[#86efac] hover:bg-[#15803d] hover:text-white h-9 sm:h-10 w-9 sm:w-auto px-0 sm:px-4 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
            title={`Simulador de Ambientes (${modKey}+M)`}
            aria-label="Abrir Simulador de Ambientes"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#86efac]" />
            <span className="hidden sm:inline">{t('nav.simulator', 'Simulador de Ambientes')}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="portal-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-200 hover:border-[#15803d] transition-all cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center shadow-2xs active:scale-95"
            title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
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
            <button
              type="button"
              onClick={onOpenSettings}
              className="relative group cursor-pointer focus:outline-none rounded-full"
              title={`${user.name} - ${user.cau_rrt || user.role} (Configurações)`}
              aria-label="Abrir Perfil e Configurações"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:ring-[#072a1a] transition-all shadow-xs"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-full bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
              title={t('portal.logout', 'Sair da Conta')}
              aria-label={t('portal.logout', 'Sair da Conta')}
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
