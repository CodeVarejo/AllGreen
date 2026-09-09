import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Droplets,
  Zap,
  ShieldCheck,
  TrendingUp,
  Award,
  Download,
  Calendar,
  Building,
  Camera,
  SlidersHorizontal,
  CheckCircle2,
  TreePine,
  Layers,
  FileSpreadsheet,
  Flame,
  Volume2,
  Info,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { PortalProject, UserProfile } from '../../types';
import { generateEsgReportPdf } from '../../utils/generateEsgReportPdf';

interface EsgSustainabilityDashboardProps {
  user: UserProfile;
  projects: PortalProject[];
  onOpenProjectDetail?: (project: PortalProject) => void;
  onDownloadSpecPdf?: (project: PortalProject) => void;
  onOpenSimulator?: () => void;
  onOpenNewProjectModal?: () => void;
  onBackToDashboard?: () => void;
}

export const EsgSustainabilityDashboard: React.FC<EsgSustainabilityDashboardProps> = ({
  user,
  projects,
  onOpenProjectDetail,
  onDownloadSpecPdf,
  onOpenSimulator,
  onOpenNewProjectModal,
  onBackToDashboard,
}) => {
  // Horizon in years: 1, 3, 5, 10
  const [horizonYears, setHorizonYears] = useState<number>(5);
  // Category Filter
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  // Bar Chart Metric: 'water' | 'energy' | 'financial' | 'carbon'
  const [barMetric, setBarMetric] = useState<'water' | 'energy' | 'financial' | 'carbon'>('water');
  // Simulation extra m2 slider
  const [extraSimulatedArea, setExtraSimulatedArea] = useState<number>(0);
  // Active Tab for ESG Pillars
  const [activeEsgPillar, setActiveEsgPillar] = useState<'all' | 'E' | 'S' | 'G'>('all');
  // Audit table search
  const [tableSearch, setTableSearch] = useState<string>('');
  // Export toast status
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = categoryFilter === 'todos' || p.category === categoryFilter;
      const matchStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'installed_production' && (p.status === 'instalado' || p.status === 'em_producao')) ||
        (statusFilter === 'simulation_proposal' && (p.status === 'estudo_ia' || p.status === 'orcamento_enviado'));
      return matchCat && matchStatus;
    });
  }, [projects, categoryFilter, statusFilter]);

  // Aggregate Core Metrics
  const baseArea = useMemo(() => filteredProjects.reduce((acc, p) => acc + p.area, 0), [filteredProjects]);
  const totalAreaM2 = baseArea + extraSimulatedArea;

  // Annual Rates (per year)
  const annualWaterLiters = useMemo(() => {
    const base = filteredProjects.reduce((acc, p) => acc + (p.waterSavedLitersYear || p.area * 1200), 0);
    const extra = extraSimulatedArea * 1200; // 1,200 L/m2/year saved vs natural living wall
    return base + extra;
  }, [filteredProjects, extraSimulatedArea]);

  const annualEnergyKwh = useMemo(() => {
    const base = filteredProjects.reduce((acc, p) => acc + (p.energySavedKwhYear || Math.round(p.area * 130)), 0);
    const extra = extraSimulatedArea * 130; // 130 kWh/m2/year thermal HVAC insulation
    return base + extra;
  }, [filteredProjects, extraSimulatedArea]);

  const annualHvacSavingsBrl = useMemo(() => {
    const base = filteredProjects.reduce((acc, p) => acc + (p.hvacSavingsBrlYear || Math.round(p.area * 120)), 0);
    const extra = extraSimulatedArea * 120; // R$ 120/m2/year average electricity bill reduction
    return base + extra;
  }, [filteredProjects, extraSimulatedArea]);

  const annualCo2OffsetKg = useMemo(() => {
    const base = filteredProjects.reduce((acc, p) => acc + (p.co2OffsetKgYear || Math.round(p.area * 5.7)), 0);
    const extra = extraSimulatedArea * 5.7; // ~5.7 kg CO2e/m2/year avoided
    return base + extra;
  }, [filteredProjects, extraSimulatedArea]);

  const avgLeedPoints = useMemo(() => {
    if (filteredProjects.length === 0) return 14;
    return filteredProjects.reduce((acc, p) => acc + (p.leedPointsTotal || 12), 0) / filteredProjects.length;
  }, [filteredProjects]);

  const avgWellScore = useMemo(() => {
    if (filteredProjects.length === 0) return 88;
    return filteredProjects.reduce((acc, p) => acc + (p.wellScore || 85), 0) / filteredProjects.length;
  }, [filteredProjects]);

  // Multi-Year Cumulative Time-Series Data (for Recharts Area / Composed Chart)
  const cumulativeTimeSeriesData = useMemo(() => {
    const yearsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, Math.max(horizonYears, 3));
    return yearsList.map((yr) => {
      const waterCumulativeKiloLiters = Math.round((annualWaterLiters * yr) / 1000); // in m3 / thousand liters
      const waterCumulativeLiters = annualWaterLiters * yr;
      const energyCumulativeKwh = Math.round(annualEnergyKwh * yr);
      const financialCumulativeBrl = Math.round(annualHvacSavingsBrl * yr);
      const co2CumulativeKg = Math.round(annualCo2OffsetKg * yr);

      // Baseline comparison: traditional living wall water consumption in m3
      const traditionalLivingWallWaterKiloLiters = Math.round((annualWaterLiters * yr * 1.05) / 1000);

      return {
        yearLabel: `Ano ${yr}`,
        yearNum: yr,
        waterKiloLiters: waterCumulativeKiloLiters,
        waterLiters: waterCumulativeLiters,
        energyKwh: energyCumulativeKwh,
        financialBrl: financialCumulativeBrl,
        co2Kg: co2CumulativeKg,
        traditionalWater: traditionalLivingWallWaterKiloLiters,
      };
    });
  }, [annualWaterLiters, annualEnergyKwh, annualHvacSavingsBrl, annualCo2OffsetKg, horizonYears]);

  // Per-Project Bar Chart Data
  const projectComparisonData = useMemo(() => {
    return filteredProjects.map((p) => {
      const pWater = (p.waterSavedLitersYear || p.area * 1200) * horizonYears;
      const pEnergy = (p.energySavedKwhYear || Math.round(p.area * 130)) * horizonYears;
      const pFin = (p.hvacSavingsBrlYear || Math.round(p.area * 120)) * horizonYears;
      const pCo2 = (p.co2OffsetKgYear || Math.round(p.area * 5.7)) * horizonYears;

      return {
        id: p.id,
        code: p.code,
        name: p.title.length > 20 ? p.title.substring(0, 18) + '...' : p.title,
        fullName: p.title,
        area: p.area,
        category: p.category,
        waterLiters: pWater,
        waterKiloLiters: Math.round(pWater / 1000),
        energyKwh: pEnergy,
        financialBrl: pFin,
        co2Kg: pCo2,
        leed: p.leedPointsTotal || 12,
        well: p.wellScore || 85,
        originalProject: p,
      };
    });
  }, [filteredProjects, horizonYears]);

  // Category Distribution (Donut Chart)
  const categoryDistributionData = useMemo(() => {
    const groups: Record<string, { count: number; area: number; water: number; energy: number }> = {};

    filteredProjects.forEach((p) => {
      const cat = p.category || 'Outros';
      if (!groups[cat]) {
        groups[cat] = { count: 0, area: 0, water: 0, energy: 0 };
      }
      groups[cat].count += 1;
      groups[cat].area += p.area;
      groups[cat].water += (p.waterSavedLitersYear || p.area * 1200) * horizonYears;
      groups[cat].energy += (p.energySavedKwhYear || Math.round(p.area * 130)) * horizonYears;
    });

    const colors: Record<string, string> = {
      Corporativo: '#072a1a',
      Residencial: '#15803d',
      Comercial: '#059669',
      Eventos: '#10b981',
      Outros: '#6ee7b7',
    };

    return Object.entries(groups).map(([cat, val]) => ({
      name: cat,
      value: Math.round(val.water),
      area: Math.round(val.area * 10) / 10,
      count: val.count,
      energy: Math.round(val.energy),
      color: colors[cat] || '#15803d',
    }));
  }, [filteredProjects, horizonYears]);

  // ESG Pillars Radar Data
  const esgRadarData = [
    { subject: 'Isenção Hídrica (WEc1)', score: 100, fullMark: 100, pilar: 'E' },
    { subject: 'Eficiência Térmica (HVAC)', score: 88, fullMark: 100, pilar: 'E' },
    { subject: 'Conforto Acústico (NRC)', score: 94, fullMark: 100, pilar: 'S' },
    { subject: 'Biofilia & Bem-Estar WELL', score: 92, fullMark: 100, pilar: 'S' },
    { subject: 'Zero COV & Agrotóxicos', score: 100, fullMark: 100, pilar: 'E' },
    { subject: 'Laudos IPT / NBR 16626', score: 98, fullMark: 100, pilar: 'G' },
    { subject: 'Garantia 5 Anos & Rastreabilidade', score: 95, fullMark: 100, pilar: 'G' },
  ];

  // Thermal Reduction Curve Data (Ambient Outdoor vs. With All Green Wall)
  const thermalAnalysisData = [
    { hour: '08:00', semJardim: 22.5, comAllGreen: 21.0, delta: 1.5 },
    { hour: '10:00', semJardim: 26.8, comAllGreen: 23.6, delta: 3.2 },
    { hour: '12:00', semJardim: 31.4, comAllGreen: 27.8, delta: 3.6 },
    { hour: '14:00', semJardim: 33.2, comAllGreen: 29.5, delta: 3.7 },
    { hour: '16:00', semJardim: 30.5, comAllGreen: 27.4, delta: 3.1 },
    { hour: '18:00', semJardim: 26.0, comAllGreen: 24.2, delta: 1.8 },
  ];

  // Handle Export PDF
  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      generateEsgReportPdf({
        user,
        projects: filteredProjects,
        timeHorizonYears: horizonYears,
        totalAreaM2,
        cumulativeWaterLiters: annualWaterLiters,
        cumulativeEnergyKwh: annualEnergyKwh,
        cumulativeHvacSavingsBrl: annualHvacSavingsBrl,
        cumulativeCo2OffsetKg: annualCo2OffsetKg,
        avgLeedPoints,
        avgWellScore,
      });
      setIsExporting(false);
    }, 500);
  };

  // Table search filtering
  const searchedProjects = useMemo(() => {
    if (!tableSearch.trim()) return filteredProjects;
    const q = tableSearch.toLowerCase();
    return filteredProjects.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [filteredProjects, tableSearch]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Executive ESG Banner */}
      <div className="bg-gradient-to-br from-[#062316] via-[#072a1a] to-[#03150d] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden border border-emerald-500/25">
        
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/40 text-xs font-mono font-extrabold flex items-center gap-1.5 backdrop-blur-xs">
                <Leaf className="w-3.5 h-3.5 text-[#86efac]" />
                ESG & SUSTAINABILITY INTELLIGENCE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 text-xs font-mono">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Projeto Analisado' : 'Projetos Analisados'} ({totalAreaM2.toFixed(1)} m²)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-[#86efac] border border-emerald-600/50 text-xs font-mono font-bold">
                Horizonte: {horizonYears} {horizonYears === 1 ? 'Ano' : 'Anos'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Dashboard de Sustentabilidade & Impacto ESG
            </h1>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-3xl">
              Mensuração técnica auditável da economia cumulativa de <strong className="text-[#86efac] font-bold">água potável</strong>, <strong className="text-[#86efac] font-bold">eficiência energética HVAC</strong> e créditos <strong className="text-[#86efac] font-bold">LEED v4.1 & WELL</strong> dos seus projetos com a All Green.
            </p>

            {/* Quick Badges of Normative Compliance */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>100% Isento de Irrigação & Efluentes</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Isolamento Térmico Passivo até 3.6°C</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86efac]" />
                <span>Laudo IPT NBR 16626 Auto-Extinguível</span>
              </div>
            </div>

          </div>

          {/* Right Action Box */}
          <div className="lg:col-span-4 bg-emerald-950/80 p-5 sm:p-6 rounded-2xl border border-emerald-600/40 backdrop-blur-md space-y-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">
                Ações Executivas de Sustentabilidade
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Relatório de Conformidade ESG
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                Gere o laudo técnico com dados auditáveis para anexar a comitês ESG e certificadoras Green Building.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="w-full py-3 px-4 bg-[#86efac] hover:bg-white text-[#072a1a] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#072a1a]" />
                    <span>Gerando Laudo Técnico ESG...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#072a1a]" />
                    <span>Exportar Laudo ESG (PDF)</span>
                  </>
                )}
              </button>

              {onOpenSimulator && (
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="w-full py-2.5 px-4 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Camera className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Simular Novo Jardim Sustentável</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Controls & Interactive Horizon Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Horizon Years Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mr-2">
            <Calendar className="w-4 h-4 text-[#15803d]" />
            <span>Horizonte de Impacto:</span>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200">
            {[1, 3, 5, 10].map((yr) => (
              <button
                key={yr}
                onClick={() => setHorizonYears(yr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  horizonYears === yr
                    ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
                }`}
              >
                {yr} {yr === 1 ? 'Ano' : 'Anos'} {yr === 5 && '(Garantia)'}
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right: Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#15803d] focus:bg-white"
            >
              <option value="todos">Todas as Tipologias</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Residencial">Residencial</option>
              <option value="Comercial">Comercial</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#15803d] focus:bg-white"
            >
              <option value="todos">Todos os Projetos</option>
              <option value="installed_production">Executados & Em Produção</option>
              <option value="simulation_proposal">Simulações & Propostas</option>
            </select>
          </div>

          {(categoryFilter !== 'todos' || statusFilter !== 'todos' || extraSimulatedArea > 0) && (
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('todos');
                setStatusFilter('todos');
                setExtraSimulatedArea(0);
              }}
              className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
              title="Redefinir Filtros"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

        </div>

      </div>

      {/* 3. Four Core Cumulative ESG Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Water */}
        <div className="bg-white p-5 rounded-2xl border border-sky-200/80 shadow-sm relative overflow-hidden group hover:border-sky-400 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
              100% Isento
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-500 block">
              Água Potável Economizada ({horizonYears}a)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-gray-900 font-mono">
                {((annualWaterLiters * horizonYears) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs font-bold text-sky-700">mil Litros (m³)</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              ~{(annualWaterLiters * horizonYears).toLocaleString('pt-BR')} L poupados vs parede viva com rega contínua.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
            <span>Economia anual: {(annualWaterLiters).toLocaleString('pt-BR')} L/ano</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Energy & HVAC */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
              -24.5% Carga HVAC
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-500 block">
              Energia HVAC Economizada ({horizonYears}a)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-gray-900 font-mono">
                {Math.round(annualEnergyKwh * horizonYears).toLocaleString('pt-BR')}
              </span>
              <span className="text-xs font-bold text-amber-700">kWh</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Equivalente a <strong className="text-amber-800 font-bold">R$ {Math.round(annualHvacSavingsBrl * horizonYears).toLocaleString('pt-BR')}</strong> economizados na conta de luz.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-amber-800 font-semibold">
            <span>Isolamento térmico passivo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Carbon Offset */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803d]">
              <TreePine className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803d] font-mono text-[10px] font-bold">
              Escopo 2 Evitado
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-500 block">
              CO₂e Evitado Acumulado ({horizonYears}a)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-gray-900 font-mono">
                {Math.round(annualCo2OffsetKg * horizonYears).toLocaleString('pt-BR')}
              </span>
              <span className="text-xs font-bold text-[#15803d]">kg CO₂e</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Equivalente a <strong className="text-[#15803d] font-bold">{Math.round((annualCo2OffsetKg * horizonYears) / 20)} árvores adultas</strong> preservadas.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#15803d] font-semibold">
            <span>Compensação passiva</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Green Certifications */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm relative overflow-hidden group hover:border-purple-400 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
              LEED v4.1 & WELL
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-semibold text-gray-500 block">
              Média de Pontos & Score Biofílico
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-gray-900 font-mono">
                {avgLeedPoints.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-purple-700">Créditos LEED</span>
              <span className="text-xs text-gray-400">|</span>
              <span className="text-base font-bold text-purple-900 font-mono">{Math.round(avgWellScore)}</span>
              <span className="text-[10px] font-bold text-purple-700">WELL</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Categorias: <strong className="text-purple-900 font-bold">WEc1 (Água), EQc9 (Acústica) e INc1</strong>.
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
            <span>Certificação homologada</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* 4. Interactive Simulation Slider ("Simulador de Metas & Expansão ESG") */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse" />
              <h4 className="text-sm font-bold text-[#072a1a] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#15803d]" />
                Simulador Dinâmico de Expansão de Área Verde (What-If Scenario)
              </h4>
            </div>
            <p className="text-xs text-gray-600">
              Arraste o cursor para simular a adição de mais m² de jardim preservado e veja o impacto instantâneo nos gráficos e metas ESG:
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-emerald-200 shrink-0 shadow-2xs">
            <span className="text-xs text-gray-500 font-semibold">Área Adicional:</span>
            <span className="text-base font-extrabold text-[#072a1a] font-mono">
              +{extraSimulatedArea} m²
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              (Total: {totalAreaM2.toFixed(1)} m²)
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-gray-500">0 m²</span>
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={extraSimulatedArea}
            onChange={(e) => setExtraSimulatedArea(Number(e.target.value))}
            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
          />
          <span className="text-xs font-mono font-bold text-gray-500">+150 m²</span>
          {extraSimulatedArea > 0 && (
            <button
              onClick={() => setExtraSimulatedArea(0)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer shrink-0"
            >
              Resetar
            </button>
          )}
        </div>
      </div>

      {/* 5. Main Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHART 1: Multi-Year Cumulative Evolution (Area / Composed Chart) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#15803d]" />
                <h3 className="text-base font-bold text-gray-900">
                  Curva de Economia Cumulativa Multianual
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Projeção cumulativa de economia hídrica (m³ / mil L) e energia elétrica HVAC (kWh) em {horizonYears} anos.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Água (m³)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Energia (kWh)
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cumulativeTimeSeriesData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="yearLabel"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                {/* Left Y Axis: Water in m3 */}
                <YAxis
                  yAxisId="left"
                  stroke="#0284c7"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} m³`}
                />
                {/* Right Y Axis: Energy in kWh */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#d97706"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k kWh`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#072a1a] text-white p-4 rounded-2xl shadow-xl border border-emerald-600/40 text-xs space-y-2 min-w-[220px]">
                          <span className="font-extrabold text-[#86efac] font-mono text-sm block border-b border-emerald-800 pb-1.5">
                            {label} (Impacto Consolidado)
                          </span>
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between items-center text-sky-200">
                              <span>💧 Água Poupada:</span>
                              <strong className="font-mono text-white">
                                {data.waterLiters.toLocaleString('pt-BR')} L ({data.waterKiloLiters} m³)
                              </strong>
                            </div>
                            <div className="flex justify-between items-center text-amber-200">
                              <span>⚡ Energia HVAC:</span>
                              <strong className="font-mono text-white">
                                {data.energyKwh.toLocaleString('pt-BR')} kWh
                              </strong>
                            </div>
                            <div className="flex justify-between items-center text-emerald-200">
                              <span>💰 Economia Predial:</span>
                              <strong className="font-mono text-white">
                                R$ {data.financialBrl.toLocaleString('pt-BR')}
                              </strong>
                            </div>
                            <div className="flex justify-between items-center text-emerald-300">
                              <span>🌿 CO₂e Evitado:</span>
                              <strong className="font-mono text-white">
                                {data.co2Kg.toLocaleString('pt-BR')} kg
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="waterKiloLiters"
                  name="Água Economizada (m³)"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#waterGradient)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="energyKwh"
                  name="Energia HVAC (kWh)"
                  stroke="#d97706"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#energyGradient)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Footnote of Chart */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 flex items-center justify-between text-[11px] text-gray-600">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#15803d]" />
              Base de cálculo: 1.200 Litros/m²/ano em irrigação e 130 kWh/m²/ano em resistência térmica passiva.
            </span>
            <span className="font-mono font-bold text-gray-800">
              Economia Total ({horizonYears}a): R$ {(annualHvacSavingsBrl * horizonYears).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* CHART 2: Typology & Category Donut Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#15803d]" />
                <h3 className="text-base font-bold text-gray-900">
                  Distribuição por Tipologia
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Volume hídrico e térmico por categoria de projeto.
            </p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#072a1a] text-white p-3 rounded-xl shadow-lg border border-emerald-600/40 text-xs space-y-1">
                          <span className="font-bold text-[#86efac] block">{data.name}</span>
                          <p className="text-gray-200">Área: {data.area} m² ({data.count} projetos)</p>
                          <p className="text-sky-200">Água Economizada: {(data.value).toLocaleString('pt-BR')} L</p>
                          <p className="text-amber-200">Energia Poupada: {(data.energy).toLocaleString('pt-BR')} kWh</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total Area Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-gray-900 font-mono">
                {totalAreaM2.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">m² Total</span>
            </div>
          </div>

          {/* Custom Category Legend List */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {categoryDistributionData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: cat.color }} />
                  <span className="font-semibold text-gray-700">{cat.name}</span>
                  <span className="text-gray-400 text-[10px]">({cat.area} m²)</span>
                </div>
                <span className="font-mono font-bold text-gray-900">
                  {Math.round(cat.value / 1000)}k L
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Per-Project Performance Comparison (Recharts BarChart) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#15803d]" />
              <h3 className="text-base font-bold text-gray-900">
                Comparativo de Eficiência por Projeto Especificado
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Selecione a métrica para comparar a contribuição individual de cada projeto simulado/instalado:
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setBarMetric('water')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                barMetric === 'water'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Água (Litros)</span>
            </button>

            <button
              type="button"
              onClick={() => setBarMetric('energy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                barMetric === 'energy'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Energia (kWh)</span>
            </button>

            <button
              type="button"
              onClick={() => setBarMetric('financial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                barMetric === 'financial'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Financeiro (R$)</span>
            </button>

            <button
              type="button"
              onClick={() => setBarMetric('carbon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                barMetric === 'carbon'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>CO₂e (kg)</span>
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="code"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (barMetric === 'water') return `${(val / 1000).toFixed(0)}k L`;
                  if (barMetric === 'energy') return `${val} kWh`;
                  if (barMetric === 'financial') return `R$ ${(val / 1000).toFixed(0)}k`;
                  return `${val} kg`;
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#072a1a] text-white p-4 rounded-2xl shadow-xl border border-emerald-600/40 text-xs space-y-2 min-w-[240px]">
                        <div className="flex items-center justify-between border-b border-emerald-800 pb-1.5">
                          <span className="font-extrabold text-[#86efac] font-mono">{data.code}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[10px]">
                            {data.category} ({data.area} m²)
                          </span>
                        </div>
                        <span className="font-bold text-white block text-sm">{data.fullName}</span>
                        <div className="space-y-1 pt-1 text-gray-200">
                          <div className="flex justify-between">
                            <span className="text-sky-300">Água ({horizonYears}a):</span>
                            <strong className="font-mono text-white">{data.waterLiters.toLocaleString('pt-BR')} L</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Energia HVAC:</span>
                            <strong className="font-mono text-white">{data.energyKwh.toLocaleString('pt-BR')} kWh</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-emerald-300">Poupança R$:</span>
                            <strong className="font-mono text-white">R$ {data.financialBrl.toLocaleString('pt-BR')}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-300">LEED / WELL:</span>
                            <strong className="font-mono text-white">{data.leed} cr / {data.well} pts</strong>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={
                  barMetric === 'water'
                    ? 'waterLiters'
                    : barMetric === 'energy'
                    ? 'energyKwh'
                    : barMetric === 'financial'
                    ? 'financialBrl'
                    : 'co2Kg'
                }
                radius={[8, 8, 0, 0]}
                onClick={(entry: any) => {
                  if (onOpenProjectDetail && entry?.originalProject) {
                    onOpenProjectDetail(entry.originalProject);
                  } else if (onOpenProjectDetail && entry?.payload?.originalProject) {
                    onOpenProjectDetail(entry.payload.originalProject);
                  }
                }}
                className="cursor-pointer"
              >
                {projectComparisonData.map((entry, index) => {
                  const colors = {
                    water: '#0284c7',
                    energy: '#d97706',
                    financial: '#15803d',
                    carbon: '#0f766e',
                  };
                  return <Cell key={`cell-${index}`} fill={colors[barMetric]} className="hover:opacity-80 transition-opacity" />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. ESG Pillars Radar & Thermal Attenuation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Chart: ESG Multidimensional Pillars */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803d]" />
              <h3 className="text-base font-bold text-gray-900">
                Matriz dos 3 Pilares ESG (E, S, G)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#15803d] text-[10px] font-bold">
              Score Global: 95/100
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Mapeamento da conformidade ambiental, conforto acústico social e governança técnica com laudos IPT.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={esgRadarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Score ESG All Green"
                  dataKey="score"
                  stroke="#15803d"
                  fill="#86efac"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 3 Pillars Breakdown badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="block text-[10px] font-bold uppercase text-emerald-800">E (Ambiental)</span>
              <span className="text-xs font-extrabold text-emerald-950">100% Zero Água</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <span className="block text-[10px] font-bold uppercase text-blue-800">S (Social)</span>
              <span className="text-xs font-extrabold text-blue-950">NRC 0.88 Acústico</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200">
              <span className="block text-[10px] font-bold uppercase text-purple-800">G (Governança)</span>
              <span className="text-xs font-extrabold text-purple-950">Laudo IPT / NBR</span>
            </div>
          </div>
        </div>

        {/* Thermal Attenuation & Temperature Reduction Curve */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <h3 className="text-base font-bold text-gray-900">
                Atenuação Térmica da Envolvente (°C)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
              Delta até -3.7°C
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Comportamento térmico da parede ao longo do dia comercial: Alvenaria crua vs. Parede com Painel All Green.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={thermalAnalysisData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wallHot" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="wallCool" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[18, 36]} stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}°C`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#072a1a] text-white p-3 rounded-xl shadow-lg border border-emerald-600/40 text-xs space-y-1">
                          <span className="font-bold text-[#86efac] block">{label} - Temperatura Superficial</span>
                          <p className="text-red-300">Sem Jardim: {d.semJardim}°C</p>
                          <p className="text-emerald-300">Com All Green: {d.comAllGreen}°C</p>
                          <p className="font-bold text-white pt-0.5 border-t border-emerald-800">
                            Redução Térmica: -{d.delta}°C (Alívio Ar-Condicionado)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="semJardim" stroke="#ef4444" strokeWidth={2} fill="url(#wallHot)" name="Sem Jardim (°C)" />
                <Area type="monotone" dataKey="comAllGreen" stroke="#10b981" strokeWidth={3} fill="url(#wallCool)" name="Com Painel All Green (°C)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <span>Redução direta no consumo de compressores de ar-condicionado</span>
            <span className="font-bold font-mono text-[#15803d]">Payback Térmico ~7.2 meses</span>
          </div>
        </div>

      </div>

      {/* 8. Detailed Technical Audit Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#15803d]" />
              <h3 className="text-base font-bold text-gray-900">
                Tabela Auditável de Projetos & Balanço Sustentável
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Relação completa de obras com dados desagregados de água, energia, carbono e certificações ambientais.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por código ou obra..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-xl px-3.5 py-2 w-56 focus:outline-none focus:border-[#15803d] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#072a1a] text-white font-mono text-[11px]">
                <th className="py-3 px-3.5 rounded-l-xl">CÓDIGO</th>
                <th className="py-3 px-3.5">OBRA / CLIENTE</th>
                <th className="py-3 px-3.5">TIPOLOGIA</th>
                <th className="py-3 px-3.5 text-right">ÁREA</th>
                <th className="py-3 px-3.5 text-right">ÁGUA ({horizonYears}a)</th>
                <th className="py-3 px-3.5 text-right">ENERGIA HVAC</th>
                <th className="py-3 px-3.5 text-right">CO₂e EVITADO</th>
                <th className="py-3 px-3.5 text-center">LEED / WELL</th>
                <th className="py-3 px-3.5 text-center rounded-r-xl">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {searchedProjects.map((proj) => {
                const pWater = (proj.waterSavedLitersYear || proj.area * 1200) * horizonYears;
                const pEnergy = (proj.energySavedKwhYear || Math.round(proj.area * 130)) * horizonYears;
                const pCo2 = (proj.co2OffsetKgYear || Math.round(proj.area * 5.7)) * horizonYears;

                return (
                  <tr key={proj.id} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-[#072a1a]">
                      {proj.code}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-bold text-gray-900 block">{proj.title}</span>
                      <span className="text-[11px] text-gray-500">{proj.client}</span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-semibold text-gray-800">
                      {proj.area.toFixed(1)} m²
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-sky-800">
                      {pWater.toLocaleString('pt-BR')} L
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-amber-800">
                      {pEnergy.toLocaleString('pt-BR')} kWh
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-800">
                      {pCo2.toLocaleString('pt-BR')} kg
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-mono text-[10px] font-bold border border-purple-200">
                        {proj.leedPointsTotal || 12} cr / {proj.wellScore || 85} pts
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {onOpenProjectDetail && (
                          <button
                            type="button"
                            onClick={() => onOpenProjectDetail(proj)}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-[#072a1a] border border-gray-200 hover:border-[#15803d] rounded-lg font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                          >
                            Ver Obra
                          </button>
                        )}
                        {onDownloadSpecPdf && (
                          <button
                            type="button"
                            onClick={() => onDownloadSpecPdf(proj)}
                            className="p-1 text-gray-500 hover:text-[#15803d] rounded-lg hover:bg-emerald-50 transition-all cursor-pointer"
                            title="Baixar Memorial Descritivo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
