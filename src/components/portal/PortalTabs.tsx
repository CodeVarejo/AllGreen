import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ArrowLeftRight,
  Download,
  Package,
  Calculator,
  Layers,
  Sparkles
} from 'lucide-react';

export type PortalTabKey = 'dashboard' | 'projects' | 'comparison' | 'bim_cad' | 'samples' | 'calculator';

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

  const tabs = [
    {
      key: 'dashboard' as PortalTabKey,
      label: 'Visão Geral',
      sublabel: 'Métricas & Status',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: 'projects' as PortalTabKey,
      label: 'Obras & Projetos',
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
      key: 'bim_cad' as PortalTabKey,
      label: 'Biblioteca BIM/CAD',
      sublabel: 'Revit, DWG, SKP',
      icon: Download,
      badge: assetsCount,
    },
    {
      key: 'samples' as PortalTabKey,
      label: 'Maleta de Amostras',
      sublabel: 'Mostruário Físico',
      icon: Package,
      badge: isArchitect ? 'Grátis' : null,
    },
    {
      key: 'calculator' as PortalTabKey,
      label: 'LEED & ROI Biofílico',
      sublabel: 'Pontos & Payback',
      icon: Calculator,
      badge: 'Novo',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'bg-[#072a1a] text-[#86efac] shadow-md font-bold'
                  : 'text-gray-700 hover:text-[#072a1a] hover:bg-emerald-50 font-semibold'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#86efac] text-[#072a1a]' : 'bg-emerald-100/80 text-[#072a1a] group-hover:bg-emerald-200'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="text-left">
                <span className="block leading-tight">{tab.label}</span>
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
  );
};
