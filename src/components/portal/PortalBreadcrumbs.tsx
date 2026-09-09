import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  ArrowLeftRight,
  Leaf,
  Download,
  Package,
  Calculator,
  Plus,
  Edit3,
  History,
  Layers
} from 'lucide-react';
import { Breadcrumbs, BreadcrumbItem, BreadcrumbsProps } from '../Breadcrumbs';
import { PortalTabKey } from './PortalTabs';
import { PortalProject, UserProfile } from '../../types';

export type { BreadcrumbItem };

export interface PortalBreadcrumbsProps {
  // Direct state-driven mode props
  activeTab?: PortalTabKey;
  selectedProjectForDetail?: PortalProject | null;
  selectedProjectForEdit?: PortalProject | null;
  selectedProjectForVersionHistory?: PortalProject | null;
  isNewProjectModalOpen?: boolean;
  comparisonProjectAId?: string;
  comparisonProjectBId?: string;
  projects?: PortalProject[];
  userRole?: UserProfile['role'];
  
  // Handlers for state-driven navigation
  onNavigateTab?: (tab: PortalTabKey) => void;
  onSelectProjectDetail?: (project: PortalProject | null) => void;
  onCancelEdit?: () => void;
  onCloseVersionHistory?: () => void;
  onCloseNewProjectModal?: () => void;
  onBackToLanding?: () => void;

  // Optional manual override mode
  items?: BreadcrumbItem[];
  backAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  theme?: 'light' | 'dark' | 'emerald';
}

export const PortalBreadcrumbs: React.FC<PortalBreadcrumbsProps> = ({
  activeTab = 'dashboard',
  selectedProjectForDetail,
  selectedProjectForEdit,
  selectedProjectForVersionHistory,
  isNewProjectModalOpen,
  comparisonProjectAId,
  comparisonProjectBId,
  projects = [],
  userRole = 'arquiteto',
  onNavigateTab,
  onSelectProjectDetail,
  onCancelEdit,
  onCloseVersionHistory,
  onCloseNewProjectModal,
  onBackToLanding,
  items: customItems,
  backAction: customBackAction,
  className = '',
  theme = 'light',
}) => {
  // If manual items are provided, render them directly
  if (customItems) {
    return (
      <Breadcrumbs
        items={customItems}
        backAction={customBackAction}
        className={className}
        theme={theme}
      />
    );
  }

  const isArchitect = userRole === 'arquiteto' || userRole === 'especificador';
  const hasActiveProjectModal = Boolean(
    selectedProjectForDetail ||
    selectedProjectForEdit ||
    selectedProjectForVersionHistory ||
    isNewProjectModalOpen
  );

  const resetAllModals = () => {
    if (selectedProjectForDetail) onSelectProjectDetail?.(null);
    if (selectedProjectForEdit) onCancelEdit?.();
    if (selectedProjectForVersionHistory) onCloseVersionHistory?.();
    if (isNewProjectModalOpen) onCloseNewProjectModal?.();
  };

  const trailItems: BreadcrumbItem[] = [];

  // Level 1: Dashboard (Root)
  trailItems.push({
    label: 'Dashboard',
    icon: LayoutDashboard,
    onClick: (activeTab !== 'dashboard' || hasActiveProjectModal) ? () => {
      resetAllModals();
      onNavigateTab?.('dashboard');
    } : undefined,
    active: activeTab === 'dashboard' && !hasActiveProjectModal,
    tooltip: 'Ir para a Visão Geral do Painel',
  });

  // Level 2: Section (Tab or Projects)
  // When a project is active, Section is always "Projetos" (or "Empreendimentos")
  if (hasActiveProjectModal || activeTab === 'projects') {
    trailItems.push({
      label: isArchitect ? 'Projetos' : 'Empreendimentos',
      icon: FolderKanban,
      onClick: (hasActiveProjectModal || activeTab !== 'projects') ? () => {
        resetAllModals();
        onNavigateTab?.('projects');
      } : undefined,
      active: activeTab === 'projects' && !hasActiveProjectModal,
      tooltip: isArchitect ? 'Ver lista de obras e ambientes' : 'Ver lista de empreendimentos',
    });
  } else if (activeTab === 'comparison') {
    trailItems.push({
      label: 'Comparativo Técnico',
      icon: ArrowLeftRight,
      onClick: () => onNavigateTab?.('comparison'),
      active: !comparisonProjectAId && !comparisonProjectBId,
      tooltip: 'Comparador de Soluções Biofílicas',
    });
  } else if (activeTab === 'esg') {
    trailItems.push({
      label: 'ESG & Sustentabilidade',
      icon: Leaf,
      onClick: () => onNavigateTab?.('esg'),
      active: true,
      tooltip: 'Balanço Hídrico, Carbono & LEED',
    });
  } else if (activeTab === 'bim_cad') {
    trailItems.push({
      label: 'Biblioteca BIM / 3D',
      icon: Download,
      onClick: () => onNavigateTab?.('bim_cad'),
      active: true,
      tooltip: 'Famílias Revit, SketchUp e DWG',
    });
  } else if (activeTab === 'samples') {
    trailItems.push({
      label: isArchitect ? 'Maleta de Amostras' : 'Amostras & Vistoria',
      icon: Package,
      onClick: () => onNavigateTab?.('samples'),
      active: true,
      tooltip: 'Solicitação de Amostras Físicas e Vistoria',
    });
  } else if (activeTab === 'calculator') {
    trailItems.push({
      label: isArchitect ? 'LEED & ROI Biofílico' : 'Laudos & ROI Corporativo',
      icon: Calculator,
      onClick: () => onNavigateTab?.('calculator'),
      active: true,
      tooltip: 'Simulador de Pontuação e Retorno de Investimento',
    });
  }

  // Level 3 & 4: Active Project Details / Modals / Comparison
  if (isNewProjectModalOpen) {
    trailItems.push({
      label: 'Cadastrar Nova Obra',
      icon: Plus,
      active: true,
      tooltip: 'Novo projeto biofílico',
    });
  } else if (selectedProjectForEdit) {
    trailItems.push({
      label: selectedProjectForEdit.code,
      code: selectedProjectForEdit.code,
      subtitle: selectedProjectForEdit.title,
      onClick: () => {
        onCancelEdit?.();
        onSelectProjectDetail?.(selectedProjectForEdit);
      },
      active: false,
      tooltip: `Voltar aos detalhes de ${selectedProjectForEdit.title}`,
    });
    trailItems.push({
      label: 'Editar Especificações',
      icon: Edit3,
      active: true,
      tooltip: 'Ajuste de medidas e espécies botânicas',
    });
  } else if (selectedProjectForVersionHistory) {
    trailItems.push({
      label: selectedProjectForVersionHistory.code,
      code: selectedProjectForVersionHistory.code,
      subtitle: selectedProjectForVersionHistory.title,
      onClick: () => {
        onCloseVersionHistory?.();
        onSelectProjectDetail?.(selectedProjectForVersionHistory);
      },
      active: false,
      tooltip: `Voltar aos detalhes de ${selectedProjectForVersionHistory.title}`,
    });
    trailItems.push({
      label: 'Histórico de Versões',
      icon: History,
      active: true,
      tooltip: 'Snapshots e revisões técnicas',
    });
  } else if (selectedProjectForDetail) {
    trailItems.push({
      label: selectedProjectForDetail.code,
      code: selectedProjectForDetail.code,
      subtitle: selectedProjectForDetail.title,
      active: true,
      tooltip: `${selectedProjectForDetail.code} • ${selectedProjectForDetail.title} (${selectedProjectForDetail.client})`,
    });
  } else if (activeTab === 'comparison' && comparisonProjectAId && comparisonProjectBId) {
    const projA = projects.find(p => p.id === comparisonProjectAId);
    const projB = projects.find(p => p.id === comparisonProjectBId);
    if (projA && projB) {
      trailItems.push({
        label: `${projA.code} vs ${projB.code}`,
        subtitle: `${projA.title} × ${projB.title}`,
        active: true,
        tooltip: `Comparando ${projA.title} com ${projB.title}`,
      });
    }
  }

  // Automatic Contextual Back Button calculation
  let computedBackAction = customBackAction;
  if (!computedBackAction) {
    if (selectedProjectForEdit) {
      computedBackAction = {
        label: 'Cancelar Edição',
        onClick: () => onCancelEdit?.(),
      };
    } else if (selectedProjectForVersionHistory) {
      computedBackAction = {
        label: 'Fechar Histórico',
        onClick: () => onCloseVersionHistory?.(),
      };
    } else if (isNewProjectModalOpen) {
      computedBackAction = {
        label: 'Cancelar',
        onClick: () => onCloseNewProjectModal?.(),
      };
    } else if (selectedProjectForDetail) {
      computedBackAction = {
        label: isArchitect ? 'Voltar para Projetos' : 'Voltar para Empreendimentos',
        onClick: () => onSelectProjectDetail?.(null),
      };
    } else if (activeTab !== 'dashboard') {
      computedBackAction = {
        label: 'Voltar ao Painel',
        onClick: () => onNavigateTab?.('dashboard'),
      };
    } else if (onBackToLanding) {
      computedBackAction = {
        label: 'Voltar ao Site Principal',
        onClick: onBackToLanding,
      };
    }
  }

  return (
    <Breadcrumbs
      items={trailItems}
      backAction={computedBackAction}
      className={className}
      theme={theme}
    />
  );
};

export default PortalBreadcrumbs;
