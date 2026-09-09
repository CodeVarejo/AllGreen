import React, { useState } from 'react';
import {
  Award,
  Camera,
  Download,
  Layers,
  Clock,
  CheckCircle2,
  Droplets,
  Bell,
  ChevronRight,
  FileText,
  PhoneCall,
  ExternalLink,
  Plus,
  ArrowLeftRight,
  ShieldCheck,
  Zap,
  Activity,
  Truck,
  Building,
  TrendingUp,
  Package,
  Leaf,
  SlidersHorizontal,
  MapPin,
  Flame,
  Volume2,
  BookmarkCheck,
  RotateCcw,
  FileDown
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
  notifications,
  onOpenSimulator,
  onOpenNewProjectModal,
  onOpenNotifications,
  onSelectTab,
  onDownloadSpecPdf,
  onOpenProjectDetail,
  onActionClick,
  onCompareProjects,
  onRetakeQuiz,
  onDownloadBiophilicGuide,
  onRestoreDemoProjects,
}) => {
  const isArchitect = user.role === 'arquiteto' || user.role === 'especificador';

  const totalM2 = projects.reduce((acc, p) => acc + p.area, 0);
  const activeCount = projects.filter(p => p.status !== 'instalado').length;
  const completedCount = projects.filter(p => p.status === 'instalado').length;
  const totalWaterSaved = projects.reduce((acc, p) => acc + (p.waterSavedLitersYear || p.area * 1200), 0);
  const totalLeedPoints = projects.reduce((acc, p) => acc + (p.leedPointsTotal || 12), 0);

  const activeProject = projects.find(p => p.status === 'em_producao') || projects[0];

  // Interactive Before/After slider state for Spotlight project on dashboard
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchOrMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.touches[0].clientX, rect);
  };

  const getStatusBadge = (status: PortalProject['status']) => {
    switch (status) {
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" /> Instalado & Homologado
          </span>
        );
      case 'em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" /> Em Produção Plug & Play
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-blue-700" /> Em Trânsito
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-purple-700" /> Proposta Comercial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-300 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-gray-600" /> Estudo IA
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Executive Hero Banner matching Landing Page Luxury Styling */}
      <div className="bg-gradient-to-br from-[#062316] via-[#072a1a] to-[#041a10] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden border border-emerald-500/20">
        
        {/* Ambient Atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs text-emerald-200 font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span>{isArchitect ? 'Parceiro Homologado Pro' : 'Área do Empreendimento & Facilities'} • Nível {user.tier}</span>
              </div>
              <span className="text-xs text-emerald-300 font-mono font-medium">
                {user.company}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                {isArchitect ? 'Painel Biofílico de Obras' : 'Painel Corporativo de Empreendimentos'}
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans max-w-2xl">
                {isArchitect
                  ? 'Acompanhe o cronograma fabril dos seus jardins verticais, baixe famílias BIM paramétricas, consulte laudos de absorção acústica e gere memoriais descritivos LEED/WELL com um clique.'
                  : 'Acompanhe o cronograma de entrega e instalação dos jardins verticais dos seus empreendimentos, consulte laudos de garantia botânica, reduções de consumo hídrico e certificações ambientais corporativas.'}
              </p>
            </div>

            {/* Quick Action Pill Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenSimulator}
                className="px-6 py-3.5 bg-[#86efac] text-[#072a1a] font-bold rounded-full text-xs sm:text-sm hover:bg-emerald-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 min-h-[44px]"
              >
                <Camera className="w-4 h-4 text-[#072a1a]" />
                <span>Simulador IA no Ambiente</span>
              </button>

              {isArchitect ? (
                <>
                  <button
                    onClick={() => onSelectTab('bim_cad')}
                    className="px-5 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-white font-semibold rounded-full text-xs sm:text-sm border border-emerald-600/50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
                  >
                    <Download className="w-4 h-4 text-[#86efac]" />
                    <span>Baixar Famílias BIM / DWG</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('samples')}
                    className="px-5 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white font-semibold rounded-full text-xs sm:text-sm border border-emerald-700/50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
                  >
                    <Package className="w-4 h-4 text-amber-300" />
                    <span>Pedir Maleta de Amostras</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onSelectTab('esg')}
                    className="px-5 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-white font-semibold rounded-full text-xs sm:text-sm border border-emerald-600/50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
                  >
                    <Leaf className="w-4 h-4 text-[#86efac]" />
                    <span>Balanço ESG & Sustentabilidade</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('samples')}
                    className="px-5 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white font-semibold rounded-full text-xs sm:text-sm border border-emerald-700/50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
                  >
                    <Package className="w-4 h-4 text-amber-300" />
                    <span>Solicitar Vistoria & Amostras</span>
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 bg-emerald-950/80 backdrop-blur-md rounded-2xl p-5 border border-emerald-700/60 space-y-4 shadow-lg">
            <h3 className="font-serif font-bold text-base text-white border-b border-emerald-800/80 pb-2 flex items-center justify-between">
              <span>Indicadores em Tempo Real</span>
              <Activity className="w-4 h-4 text-[#86efac]" />
            </h3>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-700/40">
                <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Área Projetada</span>
                <span className="text-xl font-serif font-bold text-white mt-0.5 block">{totalM2} m²</span>
              </div>

              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-700/40">
                <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Obras Ativas</span>
                <span className="text-xl font-serif font-bold text-[#86efac] mt-0.5 block">{activeCount} em curso</span>
              </div>

              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-700/40">
                <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Economia Hídrica</span>
                <span className="text-lg font-serif font-bold text-blue-300 mt-0.5 block">{(totalWaterSaved / 1000).toFixed(0)} mil L/ano</span>
              </div>

              <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-700/40">
                <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Créditos LEED</span>
                <span className="text-lg font-serif font-bold text-yellow-300 mt-0.5 block">+{totalLeedPoints} Pts</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => onSelectTab('calculator')}
                className="w-full py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Calcular Nova Obra no Especificador</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Biophilic Profile Diagnosis Card */}
      {user.savedBiophilicProfile ? (
        <div className="bg-gradient-to-br from-[#072a1a] via-[#093522] to-[#051c11] text-white rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-emerald-500/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#86efac] text-[#072a1a] font-mono font-extrabold text-xs flex items-center gap-1.5 shadow-2xs">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>PERFIL BIOFÍLICO SALVO NO USUÁRIO</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-600/50 text-emerald-200 text-xs font-mono">
                    {user.savedBiophilicProfile.badge}
                  </span>
                  <span className="text-xs text-emerald-300/80 font-mono">
                    Salvo em {user.savedBiophilicProfileDate || 'Recente'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  {user.savedBiophilicProfile.archetypeTitle}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
                  {user.savedBiophilicProfile.archetypeTagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                <button
                  type="button"
                  id="btn-portal-download-biophilic-guide"
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
                  className="px-4 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  title="Baixar Guia Técnico Personalizado em PDF"
                >
                  <FileDown className="w-4 h-4 text-[#072a1a]" />
                  <span>Baixar Guia Personalizado (PDF)</span>
                </button>

                {onRetakeQuiz && (
                  <button
                    type="button"
                    onClick={onRetakeQuiz}
                    className="px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white font-semibold text-xs rounded-xl border border-emerald-700/60 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Refazer o Quiz de Perfil Biofílico"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Refazer Diagnóstico</span>
                  </button>
                )}
              </div>
            </div>

            {/* 5 Key Metrics for Saved Profile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/50 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">PONTUAÇÃO WELL</span>
                <strong className="text-base font-bold text-[#86efac]">{user.savedBiophilicProfile.scoreWell} pts</strong>
                <span className="text-[9px] text-emerald-400 block">Classificação Platinum</span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/50 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">CRÉDITOS LEED</span>
                <strong className="text-base font-bold text-[#86efac]">{user.savedBiophilicProfile.scoreLeed} cr</strong>
                <span className="text-[9px] text-emerald-400 block">v4.1 BD+C / ID+C</span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/50 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">ABSORÇÃO ACÚSTICA</span>
                <strong className="text-base font-bold text-[#86efac]">NRC {user.savedBiophilicProfile.acousticNRC}</strong>
                <span className="text-[9px] text-emerald-400 block">Laudo IPT ISO 354</span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/50 text-center">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">PRODUTIVIDADE</span>
                <strong className="text-base font-bold text-emerald-200">+{user.savedBiophilicProfile.productivityBoost}%</strong>
                <span className="text-[9px] text-emerald-400 block">Harvard COGfx</span>
              </div>

              <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700/50 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-emerald-300 font-bold block">QUEDA CORTISOL</span>
                <strong className="text-base font-bold text-emerald-200">-{user.savedBiophilicProfile.stressReduction}%</strong>
                <span className="text-[9px] text-emerald-400 block">Estresse Ocupacional</span>
              </div>
            </div>

            {/* Botanical Curation Preview */}
            {user.savedBiophilicProfile.recommendedSpecies && user.savedBiophilicProfile.recommendedSpecies.length > 0 && (
              <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#86efac]" />
                  <span className="text-emerald-200 font-semibold">Espécies Curadas:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {user.savedBiophilicProfile.recommendedSpecies.slice(0, 4).map((sp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-white text-[11px] border border-emerald-700/40">
                        {sp.name}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-emerald-300 font-mono">
                  Código de Homologação: <strong>{user.savedBiophilicProfile.recommendedSolutionCode}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-[#072a1a] to-emerald-950 text-white rounded-3xl p-6 shadow-md border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-[#86efac] flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Descubra seu Perfil Biofílico & Baixe seu Guia Personalizado</h4>
              <p className="text-xs text-emerald-200/80">Faça o quiz de 2 minutos para homologar o laudo acústico, LEED/WELL e curadoria botânica da sua conta.</p>
            </div>
          </div>
          {onRetakeQuiz && (
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="px-4 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Realizar Diagnóstico Agora
            </button>
          )}
        </div>
      )}

      {/* ESG Sustainability Executive Summary Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-[#072a1a] to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#86efac]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/40 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#86efac]" />
              BALANÇO ESG CUMULATIVO
            </span>
            <span className="text-xs text-emerald-200 font-mono">
              {projects.length} Obras Auditadas
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
            Economia de {(totalWaterSaved / 1000).toFixed(1)}k m³ de Água e {projects.reduce((acc, p) => acc + (p.energySavedKwhYear || Math.round(p.area * 130)), 0).toLocaleString('pt-BR')} kWh de Energia
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Painéis All Green com isenção total de irrigação hídrica, atenuação térmica passiva até 3.6°C e laudos IPT homologados para certificações LEED v4.1 & WELL.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('esg')}
            className="px-6 py-3.5 bg-[#86efac] hover:bg-white text-[#072a1a] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Leaf className="w-4 h-4 text-[#072a1a]" />
            <span>Abrir Dashboard ESG Completo</span>
            <ChevronRight className="w-4 h-4 text-[#072a1a]" />
          </button>
        </div>
      </div>

      {/* 6 Visual Navigation Hub Cards (Identical in Intuitiveness to Landing) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <button
          type="button"
          onClick={onOpenSimulator}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#072a1a] flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-emerald-100">
            <Camera className="w-5 h-5 text-[#15803d]" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">Simulador IA</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Teste em foto</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('projects')}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#072a1a] flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-emerald-100">
            <Layers className="w-5 h-5 text-[#15803d]" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">Obras & Fotos</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">{projects.length} cadastradas</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('bim_cad')}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-blue-100">
            <Download className="w-5 h-5 text-blue-700" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">Blocos BIM 3D</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Revit, DWG, SKP</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('comparison')}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-purple-100">
            <ArrowLeftRight className="w-5 h-5 text-purple-700" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">Comparador</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Lado a lado</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('samples')}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-amber-100">
            <Package className="w-5 h-5 text-amber-700" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">
            {isArchitect ? 'Maleta Tátil' : 'Vistoria & Amostras'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            {isArchitect ? 'Amostras grátis' : 'Agendar visita'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('calculator')}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#072a1a] shadow-sm hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform border border-teal-100">
            <Award className="w-5 h-5 text-teal-700" />
          </div>
          <span className="text-xs font-bold text-gray-950 block leading-tight">
            {isArchitect ? 'Laudo LEED' : 'Laudos & ROI'}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            {isArchitect ? 'Memoriais PDF' : 'Certificados ESG'}
          </span>
        </button>

      </div>

      {/* Zero Data Onboarding State */}
      {projects.length === 0 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <Layers className="w-8 h-8 text-[#15803d]" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-serif font-bold text-2xl text-gray-950">
              Nenhuma obra cadastrada ainda
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Inicie cadastrando seu primeiro ambiente biofílico para gerar memoriais técnicos, laudos acústicos e acompanhar o cronograma fabril em tempo real.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeira Obra</span>
            </button>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs sm:text-sm rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95 flex items-center gap-2 min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-[#15803d]" />
              <span>Simular com IA</span>
            </button>
            {onRestoreDemoProjects && (
              <button
                type="button"
                onClick={onRestoreDemoProjects}
                className="px-5 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm rounded-xl border border-gray-300 transition-all cursor-pointer active:scale-95 flex items-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
                <span>Carregar Obras de Demonstração</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Spotlight: Active Project with Interactive Before/After Slider (Like Landing Page!) */}
      {projects.length > 0 && activeProject && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md hover:shadow-lg transition-all space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[10px] font-mono font-bold">
                  {activeProject.code}
                </span>
                <span className="text-xs text-gray-500 font-semibold">• Destaque da Obra em Andamento</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-950 mt-1">
                {activeProject.title}
              </h2>
              <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#15803d]" />
                <span>{activeProject.location} • Cliente: {activeProject.client}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(activeProject.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Interactive Before & After Slider */}
            <div className="lg:col-span-7">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-600 font-semibold px-1">
                  <span>Parede Construtiva Original</span>
                  <span className="text-[#15803d] font-bold">Instalação All Green Finalizada</span>
                </div>

                <div 
                  className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md select-none cursor-ew-resize border border-gray-200"
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                >
                  {/* After Image (Full background) */}
                  <img
                    src={activeProject.afterImage || activeProject.thumbnail}
                    alt="Depois - Jardim Vertical All Green"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Before Image (Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={activeProject.beforeImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'}
                      alt="Antes - Parede Nua"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%' }}
                    />
                    <div className="absolute inset-0 bg-black/25" />
                  </div>

                  {/* Divider line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#072a1a] text-[#86efac] border-2 border-white shadow-xl flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Tags */}
                  <span className="absolute bottom-3 left-3 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-md z-30 backdrop-blur-xs">
                    Antes (Obra Crua)
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#072a1a]/90 text-[#86efac] text-[10px] font-bold px-2.5 py-1 rounded-md z-30 border border-emerald-500/50 backdrop-blur-xs">
                    Depois (All Green 100% Instalado)
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 text-center italic">
                  Arraste o divisor para comparar a transformação física do espaço.
                </p>
              </div>
            </div>

            {/* Technical Specifications & Actions */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center font-semibold text-gray-700">
                  <span>Tipologia Biofílica:</span>
                  <span className="font-bold text-[#072a1a] bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {activeProject.style}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <span>Área Total Projetada:</span>
                  <span className="font-bold text-gray-900">{activeProject.area} m²</span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <span>Desempenho Acústico (IPT):</span>
                  <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    NRC {activeProject.acousticNrc || 0.88}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <span>Créditos LEED Homologados:</span>
                  <span className="font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    +{activeProject.leedPointsTotal || 14} Créditos
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-700">
                  <span>Carga Estrutural:</span>
                  <span className="font-bold text-gray-900">{activeProject.weightPerM2 || 12} kg/m²</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => onDownloadSpecPdf(activeProject)}
                  className="py-3 px-4 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                >
                  <FileText className="w-4 h-4" />
                  <span>Baixar Laudo PDF</span>
                </button>

                <button
                  onClick={() => onOpenProjectDetail(activeProject)}
                  className="py-3 px-4 bg-white hover:bg-emerald-50 text-[#072a1a] font-bold text-xs rounded-xl border border-gray-200 hover:border-[#15803d] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                >
                  <span>Ver Detalhes da Obra</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <a
                href={`https://wa.me/5511912720799?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20da%20obra%20${activeProject.code}%20(${activeProject.title})`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Falar com Engenheiro da Obra (WhatsApp)</span>
              </a>

            </div>

          </div>

        </div>
      )}

      {/* Data Visualization Feature: Heatmap of Energy Savings and Acoustic Performance across all Active Projects */}
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-950">
              Todas as Obras Cadastradas
            </h3>
            <p className="text-xs text-gray-600">
              Acompanhamento de status, especificações e compatibilização em tempo real.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('projects')}
            className="text-xs font-bold text-[#15803d] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas as obras ({projects.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-gray-500 text-xs">
            Nenhuma obra cadastrada até o momento. Utilize o botão acima para adicionar seu primeiro projeto biofílico.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-gray-950">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-md bg-[#072a1a] text-[#86efac] text-[10px] font-mono font-bold shadow-md border border-emerald-500/50">
                      {proj.code}
                    </span>

                    <span className="absolute top-3.5 right-3.5">
                      {getStatusBadge(proj.status)}
                    </span>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                        {proj.category} • {proj.style}
                      </span>
                      <h4 className="font-serif font-bold text-base text-white truncate">
                        {proj.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Cliente / Local:</span>
                      <span className="font-semibold text-gray-900 truncate max-w-[160px]">{proj.client}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Área Projetada:</span>
                      <span className="font-bold text-gray-900">{proj.area} m²</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Créditos LEED:</span>
                      <span className="font-bold text-[#15803d]">+{proj.leedPointsTotal || 12} créditos</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onDownloadSpecPdf(proj)}
                    className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 min-h-[44px]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Memorial PDF</span>
                  </button>

                  <button
                    onClick={() => onOpenProjectDetail(proj)}
                    className="py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
                  >
                    <span>Ver Obra</span>
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
