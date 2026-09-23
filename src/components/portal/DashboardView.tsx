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
  BookmarkCheck
} from 'lucide-react';
import { PortalProject, UserProfile, PortalNotification } from '../../types';
import { ProjectsPerformanceHeatmap } from './ProjectsPerformanceHeatmap';
import { generateBiophilicGuidePdf } from '../../utils/generateBiophilicGuidePdf';

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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Em Produção</span>
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Em Trânsito</span>
          </span>
        );
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instalado</span>
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
            <Building className="w-3.5 h-3.5 text-purple-600" />
            <span>Especificação</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold">
            <span>Estudo IA</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Clean Executive Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {isArchitect ? 'Arquiteto Especificador' : 'Gestão de Empreendimentos'} • {user.company}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 tracking-tight">
            Painel de Obras & Especificação
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans">
            {projects.length} obras cadastradas • {activeCount} em andamento • {totalM2} m² totais
          </p>
        </div>

        {/* Primary & Secondary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95 min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Obra</span>
          </button>

          <button
            type="button"
            onClick={onOpenSimulator}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-semibold rounded-xl text-xs sm:text-sm border border-emerald-200 transition-all cursor-pointer active:scale-95 min-h-[42px]"
          >
            <Camera className="w-4 h-4 text-[#15803d]" />
            <span>Simulador IA</span>
          </button>
        </div>
      </div>

      {/* 4 Essential Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Área Projetada</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1 block">
            {totalM2} m²
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Total em portfólio</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Obras em Andamento</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#15803d] mt-1 block">
            {activeCount}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Fabricação e trânsito</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Economia Hídrica</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-blue-700 mt-1 block">
            {(totalWaterSaved / 1000).toFixed(0)}k L
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Por ano sem rega</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium block">Créditos LEED / WELL</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-1 block">
            +{totalLeedPoints} Pts
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Pontuação acumulada</span>
        </div>
      </div>

      {/* Biophilic Profile - Compact Card */}
      {user.savedBiophilicProfile && (
        <div className="bg-[#072a1a] text-white rounded-2xl p-5 border border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-[#86efac] flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-5 h-5" />
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
              <p className="text-xs text-emerald-200/80 font-sans mt-0.5">
                {user.savedBiophilicProfile.archetypeTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Baixar Guia PDF</span>
            </button>

            {onRetakeQuiz && (
              <button
                type="button"
                onClick={onRetakeQuiz}
                className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-xs rounded-lg border border-emerald-700/60 transition-colors cursor-pointer"
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

      {/* Projects Grid Overview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-950">
              Obras Cadastradas
            </h2>
            <p className="text-xs text-gray-500">
              Acompanhamento de status, especificações e laudos técnicos.
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
          <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center space-y-4">
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
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-gray-900">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#072a1a]/90 text-[#86efac] text-[10px] font-mono font-bold">
                      {proj.code}
                    </span>

                    <span className="absolute top-3 right-3">
                      {getStatusBadge(proj.status)}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] text-emerald-300 font-medium block">
                        {proj.category}
                      </span>
                      <h4 className="font-serif font-bold text-base text-white truncate">
                        {proj.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Cliente:</span>
                      <span className="font-semibold text-gray-900 truncate max-w-[160px]">{proj.client}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Área:</span>
                      <span className="font-bold text-gray-900">{proj.area} m²</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Créditos LEED:</span>
                      <span className="font-bold text-[#15803d]">+{proj.leedPointsTotal || 12} pts</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onDownloadSpecPdf(proj)}
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-semibold text-xs rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Memorial</span>
                  </button>

                  <button
                    onClick={() => onOpenProjectDetail(proj)}
                    className="py-2 px-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
