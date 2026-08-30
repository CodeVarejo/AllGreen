import React from 'react';
import {
  Leaf,
  ArrowLeft,
  Bell,
  Camera,
  Plus,
  LogOut,
  Sparkles,
  UserCheck,
  Building,
  Download,
  Package,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PortalHeaderProps {
  user: UserProfile;
  unreadNotificationsCount: number;
  onBackToLanding: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenSimulator: () => void;
  onOpenNewProjectModal: () => void;
  onToggleUserRole?: () => void;
  onTriggerSimulation?: (type: 'leed' | 'botanical') => void;
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
}) => {
  const isArchitect = user.role === 'arquiteto' || user.role === 'especificador';

  return (
    <header className="sticky top-0 z-40 bg-[#f3f7f4]/95 backdrop-blur-md border-b border-[#072a1a]/10 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Brand & Return */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#072a1a] px-3.5 py-2 rounded-full text-xs font-bold border border-[#072a1a]/15 shadow-2xs hover:border-[#15803d] transition-all cursor-pointer group active:scale-95"
            title="Retornar à página inicial"
          >
            <ArrowLeft className="w-4 h-4 text-[#15803d] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Voltar ao Site</span>
          </button>

          <div className="h-6 w-[1px] bg-[#072a1a]/10 hidden md:block" />

          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#072a1a] text-[#86efac] flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#072a1a]">
                  ALL GREEN
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-[#072a1a] border border-emerald-300">
                  <Sparkles className="w-2.5 h-2.5 text-[#15803d]" />
                  {isArchitect ? 'Portal Arquiteto' : 'Área do Cliente'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#15803d] uppercase tracking-wider -mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                {user.company || 'Decor & Biophilia'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Demo Switcher, Actions, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Toggle (Demo / Test Mode) */}
          {onToggleUserRole && (
            <button
              type="button"
              onClick={onToggleUserRole}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-[#072a1a] font-bold text-xs border border-emerald-300 transition-all cursor-pointer"
              title="Alternar entre visão de Arquiteto e Cliente"
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

          {/* New Project CTA */}
          <button
            onClick={onOpenNewProjectModal}
            className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-[#072a1a] px-3.5 py-2 rounded-full text-xs font-bold border border-[#072a1a]/15 shadow-2xs hover:border-[#15803d] transition-all cursor-pointer active:scale-95"
            title="Cadastrar nova obra ou espaço"
          >
            <Plus className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Nova Obra</span>
          </button>

          {/* AI Simulator CTA (Matching Landing Page) */}
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 bg-[#072a1a] text-[#86efac] hover:bg-[#15803d] px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            title="Simular visualmente um jardim com Inteligência Artificial"
          >
            <Camera className="w-4 h-4 text-[#86efac]" />
            <span className="hidden sm:inline">Simulador IA</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className={`relative p-2.5 rounded-full transition-all cursor-pointer border ${
              unreadNotificationsCount > 0
                ? 'bg-emerald-100 text-[#072a1a] hover:bg-emerald-200 border-emerald-300'
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
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-xs"
            />

            <button
              onClick={onLogout}
              className="p-2 rounded-full bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors cursor-pointer"
              title="Sair do Portal"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
