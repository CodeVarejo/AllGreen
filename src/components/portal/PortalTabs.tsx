import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ArrowLeftRight,
  Download,
  Package,
  Calculator,
  Leaf,
  MoreHorizontal,
  X
} from 'lucide-react';

export type PortalTabKey = 'dashboard' | 'projects' | 'comparison' | 'esg' | 'bim_cad' | 'samples' | 'calculator';

interface PortalTabsProps {
  activeTab: PortalTabKey;
  onSelectTab: (tab: PortalTabKey) => void;
  projectsCount: number;
  assetsCount: number;
  userRole?: 'arquiteto' | 'cliente' | 'especificador';
}

export const PortalTabs: React.FC<PortalTabsProps> = ({
  activeTab,
  onSelectTab,
  projectsCount,
  assetsCount,
  userRole = 'arquiteto',
}) => {
  const isArchitect = userRole === 'arquiteto' || userRole === 'especificador';
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const tabs = [
    {
      key: 'dashboard' as PortalTabKey,
      label: 'Visão Geral',
      sublabel: isArchitect ? 'Métricas & Status' : 'Empreendimentos & Status',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: 'projects' as PortalTabKey,
      label: isArchitect ? 'Obras & Projetos' : 'Empreendimentos',
      sublabel: 'Antes/Depois & Cronograma',
      icon: FolderKanban,
      badge: projectsCount,
    },
    {
      key: 'comparison' as PortalTabKey,
      label: 'Comparador',
      sublabel: 'Lado a Lado',
      icon: ArrowLeftRight,
      badge: null,
    },
    {
      key: 'esg' as PortalTabKey,
      label: 'Impacto ESG',
      sublabel: 'Água, Energia & Clima',
      icon: Leaf,
      badge: 'Novo',
    },
    {
      key: 'bim_cad' as PortalTabKey,
      label: 'Biblioteca BIM/CAD',
      sublabel: 'Revit, DWG, SKP',
      icon: Download,
      badge: assetsCount,
    },
    {
      key: 'samples' as PortalTabKey,
      label: isArchitect ? 'Maleta de Amostras' : 'Amostras & Vistoria',
      sublabel: isArchitect ? 'Mostruário Físico' : 'Vistoria Presencial',
      icon: Package,
      badge: isArchitect ? 'Grátis' : null,
    },
    {
      key: 'calculator' as PortalTabKey,
      label: isArchitect ? 'LEED & ROI Biofílico' : 'Laudos & ROI Corporativo',
      sublabel: isArchitect ? 'Pontos & Payback' : 'Certificados & Payback',
      icon: Calculator,
      badge: 'Novo',
    },
  ];

  const primaryMobileTabs = tabs.slice(0, 4);
  const secondaryMobileTabs = tabs.slice(4);

  return (
    <>
      {/* Desktop & Tablet Main Tab Bar */}
      <div 
        role="tablist" 
        aria-label="Abas de navegação do portal"
        className="bg-white rounded-3xl p-2 sm:p-2.5 border border-[#072a1a]/10 shadow-xs overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                role="tab"
                id={`tab-btn-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`tab-panel-${tab.key}`}
                onClick={() => onSelectTab(tab.key)}
                className={`group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs transition-all cursor-pointer select-none whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? 'bg-[#072a1a] text-[#86efac] shadow-md font-bold'
                    : 'text-gray-700 hover:text-[#072a1a] hover:bg-emerald-50/80 font-semibold'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                  isActive ? 'bg-[#86efac] text-[#072a1a]' : 'bg-emerald-100/80 text-[#072a1a] group-hover:bg-emerald-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="text-left">
                  <span className="block leading-tight font-medium">{tab.label}</span>
                  <span className={`text-[10px] block font-normal ${isActive ? 'text-emerald-300' : 'text-gray-400'}`}>
                    {tab.sublabel}
                  </span>
                </div>

                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold leading-none ${
                      isActive
                        ? 'bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/40'
                        : 'bg-emerald-100 text-[#072a1a] border border-emerald-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Screens < 768px for Instant Thumb Navigation) */}
      <nav 
        aria-label="Navegação rápida móvel" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#072a1a]/10 px-2 py-1.5 flex md:hidden items-center justify-around shadow-lg"
      >
        {primaryMobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[56px] relative ${
                isActive ? 'text-[#072a1a] font-bold' : 'text-gray-500 hover:text-gray-800 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'bg-emerald-100 text-[#072a1a]' : 'text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 leading-tight truncate max-w-[68px]">
                {tab.label.split(' ')[0]}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#15803d] absolute bottom-0.5" />
              )}
            </button>
          );
        })}

        {/* More Tab Trigger */}
        <button
          type="button"
          onClick={() => setIsMobileMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-h-[44px] min-w-[56px] ${
            ['bim_cad', 'samples', 'calculator'].includes(activeTab)
              ? 'text-[#072a1a] font-bold'
              : 'text-gray-500 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${
            ['bim_cad', 'samples', 'calculator'].includes(activeTab) ? 'bg-emerald-100 text-[#072a1a]' : ''
          }`}>
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Mais</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer Sheet */}
      {isMobileMoreOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="fixed inset-0"
            onClick={() => setIsMobileMoreOpen(false)}
            aria-hidden="true"
          />

          <div className="bg-white rounded-t-3xl p-6 border-t border-[#072a1a]/10 shadow-2xl relative z-10 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#072a1a]">Módulos Adicionais</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                aria-label="Fechar menu adicional"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {secondaryMobileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.key);
                      setIsMobileMoreOpen(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-left min-h-[44px] ${
                      isActive
                        ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a]'
                        : 'bg-gray-50 hover:bg-emerald-50 text-gray-800 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isActive ? 'bg-[#86efac] text-[#072a1a]' : 'bg-emerald-100 text-[#15803d]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold leading-tight">{tab.label}</span>
                        <span className={`text-xs ${isActive ? 'text-emerald-200' : 'text-gray-500'}`}>{tab.sublabel}</span>
                      </div>
                    </div>

                    {tab.badge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#86efac]/20 text-[#86efac]' : 'bg-emerald-100 text-[#072a1a]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
