import React from 'react';
import {
  Camera,
  Download,
  CheckCircle2,
  ChevronRight,
  Plus,
  Clock,
  Truck,
  Building,
  RotateCcw,
  FileDown,
  BookmarkCheck,
  Leaf,
  Droplets,
  Award,
  Sparkles
} from 'lucide-react';
import { PortalProject, UserProfile, PortalNotification } from '../../types';
import { ProjectsPerformanceHeatmap } from './ProjectsPerformanceHeatmap';
import { LeedWellSimulationEvolutionChart } from './LeedWellSimulationEvolutionChart';
import { generateBiophilicGuidePdf } from '../../utils/generateBiophilicGuidePdf';
import { ShareHighlightButton } from '../common/ShareHighlightButton';
import { formatBiophilicProfileShare } from '../../utils/nativeSocialShare';

interface DashboardViewProps {
  user: UserProfile;
  projects: PortalProject[];
  notifications: PortalNotification[];
  onOpenSimulator: () => void;
  onOpenNewProjectModal: () => void;
  onOpenNotifications: () => void;
  onSelectTab: (tab: any) => void;
  onDownloadSpecPdf: (project: PortalProject) => void;
  onOpenProjectDetail: (project: PortalProject) => void;
  onActionClick: (notification: PortalNotification) => void;
  onCompareProjects?: (projAId: string, projBId: string) => void;
  onRetakeQuiz?: () => void;
  onDownloadBiophilicGuide?: (profile: any) => void;
  onRestoreDemoProjects?: () => void;
  onOpenHabitTracker?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  projects,
  onOpenSimulator,
  onOpenNewProjectModal,
  onSelectTab,
  onDownloadSpecPdf,
  onOpenProjectDetail,
  onCompareProjects,
  onRetakeQuiz,
  onDownloadBiophilicGuide,
  onRestoreDemoProjects,
  onOpenHabitTracker,
}) => {
  const isArchitect = user.role === 'arquiteto' || user.role === 'especificador';

  const totalM2 = projects.reduce((acc, p) => acc + p.area, 0);
  const activeCount = projects.filter(p => p.status !== 'instalado').length;
  const totalWaterSaved = projects.reduce((acc, p) => acc + (p.waterSavedLitersYear || p.area * 1200), 0);
  const totalLeedPoints = projects.reduce((acc, p) => acc + (p.leedPointsTotal || 12), 0);

  const getStatusBadge = (status: PortalProject['status']) => {
    switch (status) {
      case 'em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Em Produção</span>
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Em Transporte</span>
          </span>
        );
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-300 text-xs font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
            <span>Instalado & Homologado</span>
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-xs font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Especificação</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span>Estudo Técnico</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Architectural Welcome Hero (Unified with Landing Page visual identity) */}
      <div className="bg-gradient-to-br from-[#062316] via-[#072a1a] to-[#041a10] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-900/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300/90 font-mono">
              <span>{isArchitect ? 'Arquiteto Especificador' : 'Gestão de Empreendimentos'}</span>
              <span aria-hidden="true">·</span>
              <span>{user.company || 'Studio de Arquitetura'}</span>
              {user.cau_rrt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">{user.cau_rrt}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              Painel de Obras & Especificação Biofílica
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 font-sans leading-relaxed">
              {projects.length} obras cadastradas · {activeCount} em andamento fabril · {totalM2} m² de vegetação preservada com zero irrigação e alta absorção acústica.
            </p>
          </div>

          {/* Primary Action Buttons matching Landing Page */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-extrabold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95 min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-[#072a1a]" />
              <span>Nova Obra</span>
            </button>

            <button
              type="button"
              onClick={onOpenSimulator}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 font-semibold rounded-xl text-xs sm:text-sm border border-emerald-700/60 transition-all cursor-pointer active:scale-95 min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-[#86efac]" />
              <span>Simulador</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Essential Operational KPIs (Architectural Styling) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Área Projetada</span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-gray-950 mt-1 block tracking-tight">
            {totalM2} m²
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">Total em portfólio ativo</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Obras em Andamento</span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#15803d] mt-1 block tracking-tight">
            {activeCount}
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">Fabricação e trânsito</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Economia Hídrica</span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-blue-700 mt-1 block tracking-tight">
            {(totalWaterSaved / 1000).toFixed(0)}k L
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">Por ano sem rega hidráulica</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-950/10 shadow-xs hover:border-emerald-300 transition-all">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Créditos LEED / WELL</span>
          <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#072a1a] mt-1 block tracking-tight">
            +{totalLeedPoints} Pts
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">Pontuação sustentável total</span>
        </div>
      </div>

      {/* Biophilic Profile - Compact Card */}
      {user.savedBiophilicProfile && (
        <div className="bg-[#072a1a] text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 text-[#86efac] flex items-center justify-center shrink-0 border border-emerald-700/50 shadow-xs">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-300">
                  Perfil Biofílico: {user.savedBiophilicProfile.archetypeTitle}
                </span>
                <span className="text-[10px] text-emerald-400">
                  • NRC {user.savedBiophilicProfile.acousticNRC}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-sans mt-0.5">
                {user.savedBiophilicProfile.archetypeTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <ShareHighlightButton
              payload={() => formatBiophilicProfileShare(user.savedBiophilicProfile!, user)}
              label="Compartilhar Perfil"
              variant="dark"
              titleTooltip="Compartilhar seu Perfil Biofílico com contatos via Web Share API"
            />

            <button
              type="button"
              onClick={() => {
                if (onDownloadBiophilicGuide) {
                  onDownloadBiophilicGuide(user.savedBiophilicProfile);
                } else {
                  generateBiophilicGuidePdf(user.savedBiophilicProfile!, {
                    user,
                    downloadImmediately: true,
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Baixar Guia PDF</span>
            </button>

            {onRetakeQuiz && (
              <button
                type="button"
                onClick={onRetakeQuiz}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs rounded-xl border border-emerald-700/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Refazer</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Data Visualization: Heatmap of Energy Savings and Acoustic Performance */}
      {projects.length > 0 && (
        <ProjectsPerformanceHeatmap
          projects={projects}
          onOpenProjectDetail={onOpenProjectDetail}
          onDownloadSpecPdf={onDownloadSpecPdf}
          onSelectProjectForCompare={(projId) => {
            if (onCompareProjects) {
              onCompareProjects(projId, projects.find(p => p.id !== projId)?.id || projId);
            }
          }}
        />
      )}

      {/* Recharts LEED/WELL Simulation Evolution Visualization */}
      {projects.length > 0 && (
        <LeedWellSimulationEvolutionChart
          projects={projects}
          onOpenSimulator={onOpenSimulator}
          onDownloadSpecPdf={onDownloadSpecPdf}
          onSelectProject={(proj) => onOpenProjectDetail(proj)}
        />
      )}

      {/* Habit Tracker & Wellness Card */}
      {onOpenHabitTracker && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#072a1a] to-teal-950 text-white p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-emerald-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#86efac]/20 text-[#86efac] text-[10px] font-mono font-bold uppercase tracking-wider">
                WELL Mind & Comfort
              </span>
              <span className="text-xs text-emerald-300">Rotina & Hábitos do Espaço</span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white">
              Rastreie pausas regenerativas e ergonomia no seu ambiente
            </h3>
            <p className="text-xs text-emerald-200/80 max-w-xl">
              Defina hábitos diários de biofilia, marque sua conclusão e acompanhe gráficos de consistência temporal.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenHabitTracker}
            className="px-5 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-sm hover:scale-102 active:scale-98"
          >
            Abrir Rastreador de Hábitos
          </button>
        </div>
      )}

      {/* Projects Grid Overview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-950 tracking-tight">
              Obras Cadastradas
            </h2>
            <p className="text-xs text-gray-500">
              Acompanhamento de status, especificações e laudos técnicos oficiais.
            </p>
          </div>

          {projects.length > 0 && (
            <button
              onClick={() => onSelectTab('projects')}
              className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas ({projects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-gray-200 text-center space-y-4">
            <h3 className="font-serif font-bold text-xl text-gray-900">
              Nenhuma obra cadastrada
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Cadastre seu primeiro projeto biofílico para gerar memoriais descritivos, laudos acústicos e acompanhar o cronograma fabril.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenNewProjectModal}
                className="px-5 py-2.5 bg-[#072a1a] text-[#86efac] font-bold text-xs rounded-xl hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
              >
                Cadastrar Obra
              </button>
              {onRestoreDemoProjects && (
                <button
                  type="button"
                  onClick={onRestoreDemoProjects}
                  className="px-4 py-2.5 bg-white text-gray-700 font-semibold text-xs rounded-xl border border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Carregar Exemplos
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-emerald-950/10 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#072a1a]/95 text-[#86efac] text-[10px] font-mono font-bold border border-emerald-500/30 shadow-xs">
                      {proj.code}
                    </span>

                    <span className="absolute top-3 right-3">
                      {getStatusBadge(proj.status)}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] text-emerald-300 font-semibold block uppercase tracking-wider">
                        {proj.category} · {proj.style}
                      </span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-white truncate mt-0.5">
                        {proj.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Cliente:</span>
                      <span className="font-bold text-gray-900 truncate max-w-[160px]">{proj.client}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Área Homologada:</span>
                      <span className="font-bold text-gray-900 font-mono">{proj.area} m²</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Créditos LEED v4.1:</span>
                      <span className="font-extrabold text-[#15803d]">+{proj.leedPointsTotal || 12} pts</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onDownloadSpecPdf(proj)}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Memorial</span>
                  </button>

                  <button
                    onClick={() => onOpenProjectDetail(proj)}
                    className="py-2.5 px-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
