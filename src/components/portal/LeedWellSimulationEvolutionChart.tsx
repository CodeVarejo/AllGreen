import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import {
  Award,
  TrendingUp,
  Droplets,
  Volume2,
  Leaf,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  Download,
  Share2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Building,
  RotateCcw
} from 'lucide-react';
import { PortalProject, LeedWellSimulationPoint } from '../../types';
import {
  getProjectSimulationHistory,
  WHAT_IF_OPTIONS,
  computeForecastSimulationPoint,
  WhatIfSimulationOption
} from '../../utils/leedWellSimulations';

export interface LeedWellSimulationEvolutionChartProps {
  projects?: PortalProject[];
  selectedProject?: PortalProject | null;
  onSelectProject?: (project: PortalProject) => void;
  onOpenSimulator?: () => void;
  onDownloadSpecPdf?: (project: PortalProject) => void;
  className?: string;
  compact?: boolean;
}

type ChartViewMode = 'all' | 'leed' | 'well' | 'acoustic';

interface CustomTooltipPayload {
  payload: LeedWellSimulationPoint;
}

const CustomSimulationTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
}> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const point: LeedWellSimulationPoint = payload[0]?.payload;
  if (!point) return null;

  const isForecast = point.isForecast;

  return (
    <div className="bg-[#072a1a] text-white p-4 rounded-2xl border border-emerald-500/40 shadow-2xl max-w-sm w-80 text-xs space-y-3 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
          <span className="font-mono text-[11px] font-bold text-emerald-300">
            {point.shortLabel}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">
          {point.date}
        </span>
      </div>

      <div>
        <h4 className="font-serif font-bold text-sm text-white leading-tight">
          {point.simulationName}
        </h4>
        {point.keyMilestone && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-900/80 text-[#86efac] text-[10px] font-bold border border-emerald-700/60">
            {point.keyMilestone}
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-900/60">
        <div className="bg-black/30 p-2 rounded-xl border border-emerald-800/40">
          <span className="text-[10px] text-emerald-300 uppercase block font-semibold">Créditos LEED v4.1</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-serif font-bold text-[#86efac]">
              +{point.leedCredits}
            </span>
            <span className="text-[10px] text-emerald-400">pts</span>
          </div>
          <span className="text-[9px] text-gray-400 block mt-0.5">
            Selo: {point.certificationTierLeed}
          </span>
        </div>

        <div className="bg-black/30 p-2 rounded-xl border border-yellow-800/30">
          <span className="text-[10px] text-yellow-300 uppercase block font-semibold">WELL v2 Score</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-serif font-bold text-yellow-400">
              {point.wellScore}
            </span>
            <span className="text-[10px] text-yellow-200">/100</span>
          </div>
          <span className="text-[9px] text-gray-400 block mt-0.5">
            Selo: {point.certificationTierWell}
          </span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="flex items-center justify-between text-[11px] text-emerald-200/90 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-900/40">
        <span className="flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-[#86efac]" />
          <span>NRC {point.acousticNrc}</span>
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-blue-400" />
          <span>Zero Rega (WEc1)</span>
        </span>
      </div>

      {/* Technical Enhancements */}
      {point.technicalEnhancements && point.technicalEnhancements.length > 0 && (
        <div className="space-y-1 pt-1 border-t border-emerald-900/60">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            {isForecast ? 'Upgrades em Projeção:' : 'Evoluções nesta Simulação:'}
          </span>
          <ul className="space-y-0.5">
            {point.technicalEnhancements.map((enhancement, i) => (
              <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5 leading-snug">
                <CheckCircle2 className="w-3 h-3 text-[#86efac] shrink-0 mt-0.5" />
                <span>{enhancement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const LeedWellSimulationEvolutionChart: React.FC<LeedWellSimulationEvolutionChartProps> = ({
  projects = [],
  selectedProject = null,
  onSelectProject,
  onOpenSimulator,
  onDownloadSpecPdf,
  className = '',
  compact = false,
}) => {
  // Current active project selection
  const [internalActiveProjectId, setInternalActiveProjectId] = useState<string>(
    selectedProject?.id || (projects.length > 0 ? projects[0].id : 'proj_1')
  );

  const activeProject = useMemo(() => {
    if (selectedProject) return selectedProject;
    return projects.find((p) => p.id === internalActiveProjectId) || projects[0] || null;
  }, [selectedProject, projects, internalActiveProjectId]);

  // Chart view mode
  const [viewMode, setViewMode] = useState<ChartViewMode>('all');

  // Series visibility toggles
  const [showLeed, setShowLeed] = useState<boolean>(true);
  const [showWell, setShowWell] = useState<boolean>(true);
  const [showAcoustic, setShowAcoustic] = useState<boolean>(false);

  // What-If Forward Simulation Toggles
  const [isWhatIfExpanded, setIsWhatIfExpanded] = useState<boolean>(false);
  const [activeWhatIfIds, setActiveWhatIfIds] = useState<string[]>([]);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState<boolean>(false);

  // Base simulation points for active project
  const baseSimulationHistory = useMemo(() => {
    if (!activeProject) return [];
    return getProjectSimulationHistory(activeProject);
  }, [activeProject]);

  // Active What-If Options
  const activeWhatIfOptions = useMemo(() => {
    return WHAT_IF_OPTIONS.filter((opt) => activeWhatIfIds.includes(opt.id));
  }, [activeWhatIfIds]);

  // Projected point if what-if is active
  const forecastPoint = useMemo(() => {
    if (baseSimulationHistory.length === 0) return null;
    const lastPoint = baseSimulationHistory[baseSimulationHistory.length - 1];
    return computeForecastSimulationPoint(lastPoint, activeWhatIfOptions);
  }, [baseSimulationHistory, activeWhatIfOptions]);

  // Combined chart dataset
  const chartData = useMemo(() => {
    if (!forecastPoint) return baseSimulationHistory;
    return [...baseSimulationHistory, forecastPoint];
  }, [baseSimulationHistory, forecastPoint]);

  // Summary statistics
  const baselinePoint = baseSimulationHistory[0] || null;
  const latestHomologatedPoint = baseSimulationHistory[baseSimulationHistory.length - 1] || null;
  const currentFinalPoint = forecastPoint || latestHomologatedPoint;

  const leedDelta = latestHomologatedPoint && baselinePoint
    ? latestHomologatedPoint.leedCredits - baselinePoint.leedCredits
    : 0;

  const wellDelta = latestHomologatedPoint && baselinePoint
    ? latestHomologatedPoint.wellScore - baselinePoint.wellScore
    : 0;

  const leedPercentGrowth = baselinePoint && baselinePoint.leedCredits > 0
    ? Math.round((leedDelta / baselinePoint.leedCredits) * 100)
    : 0;

  const wellPercentGrowth = baselinePoint && baselinePoint.wellScore > 0
    ? Math.round((wellDelta / baselinePoint.wellScore) * 100)
    : 0;

  const handleToggleWhatIf = (optionId: string) => {
    setActiveWhatIfIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleResetWhatIf = () => {
    setActiveWhatIfIds([]);
  };

  const handleExportData = () => {
    const exportData = {
      projectCode: activeProject?.code,
      projectTitle: activeProject?.title,
      client: activeProject?.client,
      dateExported: new Date().toLocaleDateString('pt-BR'),
      simulations: chartData.map((s) => ({
        index: s.simulationIndex,
        label: s.shortLabel,
        title: s.simulationName,
        date: s.date,
        leedCredits: s.leedCredits,
        leedTier: s.certificationTierLeed,
        wellScore: s.wellScore,
        wellTier: s.certificationTierWell,
        acousticNrc: s.acousticNrc,
        enhancements: s.technicalEnhancements,
        isForecast: Boolean(s.isForecast),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AllGreen_${activeProject?.code || 'LEED_WELL'}_Evolucao_Simulacoes.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!activeProject) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden transition-all ${className}`}
    >
      {/* Component Header Bar */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#072a1a] via-[#0a3823] to-[#072a1a] text-white relative overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Top Row: Title, Selector & Badges */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/30 text-[10px] font-mono font-bold tracking-wide uppercase">
                  <Award className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Certificações Sustentáveis</span>
                </span>

                <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] font-mono">
                  {chartData.length} simulações registradas
                </span>

                {forecastPoint && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-mono font-bold animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>Cenário Projetado Ativo</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Evolução da Pontuação LEED & WELL
              </h2>

              <p className="text-xs text-emerald-200/80 max-w-2xl font-sans">
                Progressão técnica de créditos ambientais e bem-estar ocupacional ao longo das iterações e ensaios IPT do projeto.
              </p>
            </div>

            {/* Project Selector (if multi-project view) */}
            {projects.length > 1 && !selectedProject && (
              <div className="shrink-0 flex items-center gap-2">
                <div className="relative">
                  <select
                    value={activeProject.id}
                    onChange={(e) => {
                      const found = projects.find((p) => p.id === e.target.value);
                      if (found) {
                        setInternalActiveProjectId(found.id);
                        if (onSelectProject) onSelectProject(found);
                      }
                    }}
                    className="appearance-none bg-black/40 hover:bg-black/60 text-white text-xs font-semibold pl-3 pr-8 py-2.5 rounded-xl border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-[#86efac] transition-all cursor-pointer min-w-[240px]"
                    aria-label="Selecionar obra para visualizar evolução de simulações"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-gray-900 text-white">
                        {p.code} — {p.title} ({p.area} m²)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-emerald-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Quick Actions (Export / Simulate) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-700/60 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Exportar dados das simulações em JSON"
              >
                <Download className="w-3.5 h-3.5 text-[#86efac]" />
                <span className="hidden sm:inline">Exportar Dados</span>
              </button>

              {onOpenSimulator && (
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="px-3.5 py-2 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Nova Simulação</span>
                </button>
              )}
            </div>

          </div>

          {/* KPI Summary Cards Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            
            {/* Card 1: Initial Baseline */}
            <div className="bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">
                Simulação 1 (Baseline)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-serif font-bold text-white">
                  +{baselinePoint?.leedCredits || 0}
                </span>
                <span className="text-xs text-emerald-300">LEED</span>
                <span className="text-gray-400">/</span>
                <span className="text-lg font-serif font-bold text-yellow-300">
                  {baselinePoint?.wellScore || 0}
                </span>
                <span className="text-xs text-yellow-200">WELL</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5 block truncate">
                {baselinePoint?.shortLabel || 'Estudo Inicial'}
              </span>
            </div>

            {/* Card 2: Current Homologated Score */}
            <div className="bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-500/50">
              <span className="text-[10px] text-[#86efac] uppercase font-bold block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#86efac]" />
                <span>Homologação Atual</span>
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-serif font-extrabold text-[#86efac]">
                  +{latestHomologatedPoint?.leedCredits || 0}
                </span>
                <span className="text-xs text-emerald-200">LEED</span>
                <span className="text-gray-400">/</span>
                <span className="text-2xl font-serif font-extrabold text-yellow-400">
                  {latestHomologatedPoint?.wellScore || 0}
                </span>
                <span className="text-xs text-yellow-200">WELL</span>
              </div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">
                Selo: {latestHomologatedPoint?.certificationTierLeed} & WELL {latestHomologatedPoint?.certificationTierWell}
              </span>
            </div>

            {/* Card 3: Total Evolution Gain */}
            <div className="bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">
                Ganho Técnico Acumulado
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-serif font-bold text-[#86efac] flex items-center">
                  <ArrowUpRight className="w-4 h-4" />
                  +{leedDelta} cr
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">
                  (+{leedPercentGrowth}%)
                </span>
              </div>
              <span className="text-[10px] text-yellow-300 font-mono mt-0.5 block">
                WELL: +{wellDelta} pts (+{wellPercentGrowth}%)
              </span>
            </div>

            {/* Card 4: Environmental Efficiency Highlight */}
            <div className="bg-black/30 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">
                Absorção & Isenção Hídrica
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-serif font-bold text-white">
                  NRC {latestHomologatedPoint?.acousticNrc || 0.88}
                </span>
                <span className="text-[10px] text-emerald-300">Laudo IPT</span>
              </div>
              <span className="text-[10px] text-blue-300 mt-0.5 block truncate">
                {(latestHomologatedPoint?.waterSavedLiters || 32000).toLocaleString('pt-BR')} L/ano poupados (WEc1)
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Chart Controls Bar */}
      <div className="p-4 sm:p-5 bg-gray-50/90 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
        
        {/* View Mode Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => {
              setViewMode('all');
              setShowLeed(true);
              setShowWell(true);
              setShowAcoustic(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'all'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Visão Integrada (LEED + WELL)
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('leed');
              setShowLeed(true);
              setShowWell(false);
              setShowAcoustic(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'leed'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Foco LEED v4.1
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('well');
              setShowLeed(false);
              setShowWell(true);
              setShowAcoustic(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'well'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Foco WELL v2
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('acoustic');
              setShowLeed(false);
              setShowWell(false);
              setShowAcoustic(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'acoustic'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Acústica (NRC)
          </button>
        </div>

        {/* What-If Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWhatIfExpanded(!isWhatIfExpanded)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isWhatIfExpanded || activeWhatIfIds.length > 0
                ? 'bg-emerald-50 text-[#072a1a] border-emerald-300 ring-2 ring-emerald-400/20'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Simulador de Próximo Salto (What-If)</span>
            {activeWhatIfIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#15803d] text-white text-[10px] flex items-center justify-center font-bold">
                {activeWhatIfIds.length}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                isWhatIfExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {activeWhatIfIds.length > 0 && (
            <button
              type="button"
              onClick={handleResetWhatIf}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs transition-colors cursor-pointer"
              title="Limpar projeção"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* What-If Interactive Upgrade Panel (Collapsible) */}
      {isWhatIfExpanded && (
        <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#072a1a] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Parametrize a Próxima Simulação Técnica</span>
              </h3>
              <p className="text-[11px] text-gray-600">
                Selecione upgrades para projetar em tempo real o novo patamar LEED e WELL na curva histórica.
              </p>
            </div>

            {forecastPoint && (
              <div className="inline-flex items-center gap-2 bg-[#072a1a] text-white px-3.5 py-1.5 rounded-xl text-xs">
                <span className="text-emerald-300">Nova Projeção:</span>
                <span className="font-bold text-[#86efac]">+{forecastPoint.leedCredits} LEED</span>
                <span>•</span>
                <span className="font-bold text-yellow-300">{forecastPoint.wellScore} WELL</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {WHAT_IF_OPTIONS.map((option) => {
              const isSelected = activeWhatIfIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleToggleWhatIf(option.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-[#15803d] shadow-sm ring-2 ring-[#15803d]/20'
                      : 'bg-white/80 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      {option.category}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                        isSelected
                          ? 'bg-[#15803d] text-white'
                          : 'border border-gray-300 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                    {option.label}
                  </h4>

                  <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                    {option.description}
                  </p>

                  <div className="mt-2.5 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#15803d] font-bold">+{option.deltaLeed} LEED</span>
                    <span className="text-amber-700 font-bold">+{option.deltaWell} WELL</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Recharts Visual Section */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Chart Subtitle & Benchmark Guide */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-3">
            {showLeed && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#15803d]" />
                <span className="font-semibold text-gray-800">Créditos LEED v4.1 (Eixo Esquerdo)</span>
              </span>
            )}

            {showWell && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#d97706]" />
                <span className="font-semibold text-gray-800">Pontuação WELL v2 (Eixo Direito, 0-100)</span>
              </span>
            )}

            {showAcoustic && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0284c7]" />
                <span className="font-semibold text-gray-800">Coeficiente Acústico NRC (ISO 354)</span>
              </span>
            )}

            {forecastPoint && (
              <span className="flex items-center gap-1.5 text-purple-700 font-bold">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-purple-600" />
                <span>Projeção com Upgrades</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-gray-400 font-mono">
            Patamar Platina: LEED &gt;= 14 cr | WELL &gt;= 80 pts
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 sm:h-96 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="leedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0.02} />
                </linearGradient>

                <linearGradient id="wellGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>

                <linearGradient id="acousticGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

              <XAxis
                dataKey="shortLabel"
                stroke="#64748b"
                tick={{ fontSize: 11, fontWeight: 500 }}
                tickMargin={10}
              />

              {/* Left Y-Axis: LEED Credits (0 - 22) */}
              <YAxis
                yAxisId="leed"
                orientation="left"
                domain={[0, 20]}
                stroke="#15803d"
                tick={{ fontSize: 11, fill: '#15803d', fontWeight: 600 }}
                tickFormatter={(val) => `+${val} cr`}
                label={{
                  value: 'Créditos LEED v4.1',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fontSize: 11,
                  fill: '#15803d',
                  fontWeight: 700,
                }}
              />

              {/* Right Y-Axis: WELL Score (40 - 100) */}
              <YAxis
                yAxisId="well"
                orientation="right"
                domain={[40, 100]}
                stroke="#d97706"
                tick={{ fontSize: 11, fill: '#d97706', fontWeight: 600 }}
                tickFormatter={(val) => `${val} pts`}
                label={{
                  value: 'Pontuação WELL v2 (0-100)',
                  angle: 90,
                  position: 'insideRight',
                  offset: 0,
                  fontSize: 11,
                  fill: '#d97706',
                  fontWeight: 700,
                }}
              />

              <RechartsTooltip content={<CustomSimulationTooltip />} />

              {/* Benchmark Reference Lines */}
              <ReferenceLine
                yAxisId="well"
                y={80}
                stroke="#d97706"
                strokeDasharray="4 4"
                label={{
                  value: 'WELL Platina (80 pts)',
                  fill: '#b45309',
                  fontSize: 10,
                  position: 'top',
                }}
              />

              <ReferenceLine
                yAxisId="leed"
                y={14}
                stroke="#15803d"
                strokeDasharray="4 4"
                label={{
                  value: 'LEED Platina (+14 cr)',
                  fill: '#15803d',
                  fontSize: 10,
                  position: 'top',
                }}
              />

              {/* LEED Area & Line */}
              {showLeed && (
                <Area
                  yAxisId="leed"
                  type="monotone"
                  dataKey="leedCredits"
                  name="Créditos LEED v4.1"
                  stroke="#15803d"
                  strokeWidth={3}
                  fill="url(#leedGradient)"
                  activeDot={{ r: 7, stroke: '#15803d', strokeWidth: 3, fill: '#86efac' }}
                  dot={(props: any) => {
                    const isProj = props.payload.isForecast;
                    return (
                      <circle
                        key={`leed-dot-${props.index}`}
                        cx={props.cx}
                        cy={props.cy}
                        r={isProj ? 6 : 5}
                        fill={isProj ? '#a855f7' : '#15803d'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              )}

              {/* WELL Area & Line */}
              {showWell && (
                <Area
                  yAxisId="well"
                  type="monotone"
                  dataKey="wellScore"
                  name="Pontuação WELL v2"
                  stroke="#d97706"
                  strokeWidth={3}
                  fill="url(#wellGradient)"
                  activeDot={{ r: 7, stroke: '#d97706', strokeWidth: 3, fill: '#fef08a' }}
                  dot={(props: any) => {
                    const isProj = props.payload.isForecast;
                    return (
                      <circle
                        key={`well-dot-${props.index}`}
                        cx={props.cx}
                        cy={props.cy}
                        r={isProj ? 6 : 5}
                        fill={isProj ? '#f59e0b' : '#d97706'}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              )}

              {/* Acoustic NRC Line (when toggled) */}
              {showAcoustic && (
                <Line
                  yAxisId="well"
                  type="monotone"
                  dataKey={(d) => Math.round(d.acousticNrc * 100)}
                  name="Absorção Acústica (NRC x100)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Timeline Table Accordion */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-900 py-2 cursor-pointer select-none"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Memória Técnica & Auditoria de Cada Simulação ({chartData.length} Etapas)</span>
            </span>
            <span className="flex items-center gap-1 text-[#15803d]">
              <span>{isTimelineExpanded ? 'Ocultar Tabela' : 'Ver Detalhes'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  isTimelineExpanded ? 'rotate-180' : ''
                }`}
              />
            </span>
          </button>

          {isTimelineExpanded && (
            <div className="mt-3 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">Simulação / Data</th>
                    <th scope="col" className="px-4 py-3 text-left">LEED v4.1</th>
                    <th scope="col" className="px-4 py-3 text-left">WELL v2</th>
                    <th scope="col" className="px-4 py-3 text-left">Acústica</th>
                    <th scope="col" className="px-4 py-3 text-left">Água Poupada</th>
                    <th scope="col" className="px-4 py-3 text-left">Melhorias Homologadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {chartData.map((step) => (
                    <tr
                      key={step.id}
                      className={step.isForecast ? 'bg-purple-50/50' : 'hover:bg-gray-50/80'}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          {step.isForecast ? (
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>{step.shortLabel}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 block font-mono">
                          {step.date}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-serif font-bold text-[#15803d]">
                          +{step.leedCredits} cr
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Selo {step.certificationTierLeed}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-serif font-bold text-amber-700">
                          {step.wellScore} pts
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          Selo {step.certificationTierWell}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono font-semibold text-gray-800">
                          NRC {step.acousticNrc}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-blue-700 font-mono">
                        {(step.waterSavedLiters).toLocaleString('pt-BR')} L/ano
                      </td>

                      <td className="px-4 py-3">
                        <ul className="space-y-0.5 text-[11px] text-gray-600">
                          {step.technicalEnhancements.map((enh, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                              <span>{enh}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note & Memorial CTA */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0" />
            <span>
              Certificação respaldada por laudos laboratoriais IPT e Green Building Council Brasil (GBC).
            </span>
          </div>

          {onDownloadSpecPdf && (
            <button
              type="button"
              onClick={() => onDownloadSpecPdf(activeProject)}
              className="px-4 py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0"
            >
              Baixar Memorial Homologado (PDF)
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
