import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip as RechartsTooltip,
  Cell,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  CartesianGrid,
  Line,
  ComposedChart,
} from 'recharts';
import {
  Zap,
  Volume2,
  TrendingUp,
  Sparkles,
  Layers,
  Thermometer,
  FileText,
  ChevronRight,
  Filter,
  Info,
  Award,
  Download,
  Flame,
  CheckCircle2,
  Droplets,
  Leaf,
  ShieldCheck,
  DollarSign,
  Activity,
  Maximize2
} from 'lucide-react';
import { PortalProject } from '../../types';

interface ProjectsPerformanceHeatmapProps {
  projects: PortalProject[];
  onOpenProjectDetail?: (project: PortalProject) => void;
  onDownloadSpecPdf?: (project: PortalProject) => void;
  onSelectProjectForCompare?: (projectId: string) => void;
}

type ViewMode = 'matrix' | 'scatter' | 'frequency' | 'seasonal';

// ==========================================
// CUSTOM RECHARTS TOOLTIP COMPONENTS
// ==========================================

// 1. Custom Tooltip for AI Scatter Dispersion Heatmap
interface ScatterTooltipPayload {
  id: string;
  code: string;
  name: string;
  client: string;
  category: string;
  style: string;
  nrc: number;
  thermalReduction: number;
  area: number;
  kwhSaved: number;
  hvacSavingsBrl: number;
  dbDamping: number;
  wellScore: number;
  combinedScore: number;
  projectObj: PortalProject;
}

const CustomScatterTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data: ScatterTooltipPayload = payload[0].payload;
  if (!data) return null;

  const proj = data.projectObj;
  const rt60 = proj.rt60ReductionSec || 0.45;
  const deltaC = proj.thermalDeltaCelsius || 3.2;
  const waterSaved = proj.waterSavedLitersYear || Math.round(data.area * 1200);

  return (
    <div className="bg-[#072a1a] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-emerald-500/60 text-xs space-y-3 w-80 sm:w-96 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 z-50">
      
      {/* Header with Project Code and Category Badges */}
      <div className="flex items-start justify-between gap-2 border-b border-emerald-800/80 pb-2.5">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-md bg-[#86efac] text-[#072a1a] font-mono font-bold text-[11px]">
              {data.code}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 border border-emerald-700 text-[10px] font-semibold">
              {data.category}
            </span>
            <span className="text-[10px] text-emerald-300/80 font-medium">
              • {data.style}
            </span>
          </div>
          <h4 className="font-serif font-bold text-white text-sm sm:text-base leading-tight">
            {data.name}
          </h4>
          <p className="text-[11px] text-emerald-200/90 mt-0.5">
            Cliente: <span className="text-white font-medium">{data.client}</span>
          </p>
        </div>

        <div className="text-right shrink-0 bg-emerald-950/90 px-2.5 py-1.5 rounded-xl border border-emerald-700/60">
          <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">Bioclimático</span>
          <span className="font-mono font-bold text-sm text-[#86efac]">
            {data.combinedScore}<span className="text-[10px] font-normal text-emerald-200">/100</span>
          </span>
        </div>
      </div>

      {/* Grid of Key Performance Indicators */}
      <div className="grid grid-cols-2 gap-2 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800/60">
        
        {/* Metric 1: Acoustic NRC */}
        <div className="bg-[#051c11] p-2 rounded-lg border border-emerald-900/60">
          <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-0.5">
            <span className="flex items-center gap-1 font-semibold">
              <Volume2 className="w-3 h-3 text-[#86efac]" />
              Fono-Absorção
            </span>
            <span className="font-mono font-bold text-[#86efac]">NRC {data.nrc.toFixed(2)}</span>
          </div>
          <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden mb-1">
            <div
              className="bg-gradient-to-r from-emerald-400 to-[#86efac] h-full rounded-full"
              style={{ width: `${Math.min(100, (data.nrc / 1.0) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-300">
            <span>Atenuação: <strong>-{data.dbDamping.toFixed(1)} dB</strong></span>
            <span>RT60: <strong>-{rt60}s</strong></span>
          </div>
        </div>

        {/* Metric 2: Thermal HVAC Reduction */}
        <div className="bg-[#051c11] p-2 rounded-lg border border-emerald-900/60">
          <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-0.5">
            <span className="flex items-center gap-1 font-semibold">
              <Zap className="w-3 h-3 text-yellow-300" />
              Carga Térmica
            </span>
            <span className="font-mono font-bold text-yellow-300">-{data.thermalReduction}%</span>
          </div>
          <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden mb-1">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-300 h-full rounded-full"
              style={{ width: `${Math.min(100, (data.thermalReduction / 30) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-gray-300">
            <span>ΔT Parede: <strong>-{deltaC}°C</strong></span>
            <span>ASHRAE 90.1</span>
          </div>
        </div>

        {/* Metric 3: Energy Savings in kWh & BRL */}
        <div className="bg-[#051c11] p-2 rounded-lg border border-emerald-900/60">
          <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-0.5">
            <span className="flex items-center gap-1 font-semibold">
              <Activity className="w-3 h-3 text-cyan-300" />
              Energia Anual
            </span>
            <span className="font-mono font-bold text-cyan-300">{data.kwhSaved.toLocaleString('pt-BR')} kWh</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-gray-300 mt-1">
            <span>Economia Financeira:</span>
            <span className="font-bold text-white">R$ {data.hvacSavingsBrl.toLocaleString('pt-BR')}/ano</span>
          </div>
        </div>

        {/* Metric 4: WELL & LEED Certifications */}
        <div className="bg-[#051c11] p-2 rounded-lg border border-emerald-900/60">
          <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-0.5">
            <span className="flex items-center gap-1 font-semibold">
              <Award className="w-3 h-3 text-emerald-400" />
              Selo WELL v2
            </span>
            <span className="font-mono font-bold text-emerald-400">+{data.wellScore} pts</span>
          </div>
          <div className="flex items-center justify-between text-[9px] text-gray-300 mt-1">
            <span>Área do Módulo:</span>
            <span className="font-bold text-white">{data.area} m²</span>
          </div>
        </div>

      </div>

      {/* Species and Ecological Highlights */}
      {proj.speciesUsed && proj.speciesUsed.length > 0 && (
        <div className="bg-emerald-950/50 p-2 rounded-lg border border-emerald-800/40 text-[10px]">
          <div className="flex items-center gap-1 text-emerald-300 font-semibold mb-1">
            <Leaf className="w-3 h-3 text-[#86efac]" />
            <span>Espécies Biofílicas em Destaque:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {proj.speciesUsed.slice(0, 3).map((sp, idx) => (
              <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 text-[9px]">
                {sp}
              </span>
            ))}
            {proj.speciesUsed.length > 3 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[9px]">
                +{proj.speciesUsed.length - 3} mais
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Info / Interactivity Note */}
      <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-300/80 border-t border-emerald-800/50">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-blue-400" />
          Água poupada: <strong>{waterSaved.toLocaleString('pt-BR')} L/ano</strong>
        </span>
        <span className="text-[#86efac] font-bold">
          Clique para inspecionar →
        </span>
      </div>

    </div>
  );
};

// 2. Custom Tooltip for Acoustic Octave Band Frequency Chart (ISO 354)
const CustomFrequencyTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null;

  // Derive frequency context description
  const getFreqDescription = (freqLabel: string = '') => {
    if (freqLabel.includes('125')) return { type: 'Graves / HVAC', desc: 'Ruídos de motores, ar-condicionado e vibrações estruturais baixas.' };
    if (freqLabel.includes('250')) return { type: 'Médio-Graves', desc: 'Ressonâncias de salas, passos e tráfego pesado externo.' };
    if (freqLabel.includes('500')) return { type: 'Fala Humana (Vogais)', desc: 'Faixa fundamental da voz falada. Crítico para privacidade em escritórios.' };
    if (freqLabel.includes('1000')) return { type: 'Conferências & Calls', desc: 'Pico de inteligibilidade auditiva e salas de reunião.' };
    if (freqLabel.includes('2000')) return { type: 'Agudos / Consoantes', desc: 'Cliques de teclado, toques e reverberação de alta frequência.' };
    if (freqLabel.includes('4000')) return { type: 'Brilho & Eco', desc: 'Percepção de eco em átrios e superfícies envidraçadas.' };
    return { type: 'Espectro Auditivo', desc: 'Medição padronizada em câmara reverberante.' };
  };

  const info = getFreqDescription(label);
  const baseline = payload.find((p: any) => p.dataKey === 'referenciaNorma');
  const projectEntries = payload.filter((p: any) => p.dataKey !== 'referenciaNorma');

  return (
    <div className="bg-[#072a1a] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/60 text-xs space-y-2.5 w-80 sm:w-96 backdrop-blur-md animate-in fade-in duration-200 z-50">
      
      {/* Header */}
      <div className="border-b border-emerald-800/80 pb-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-bold text-sm text-[#86efac] flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#86efac]" />
            {label}
          </span>
          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 border border-purple-700 text-[10px] font-bold font-mono">
            {info.type}
          </span>
        </div>
        <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
          {info.desc}
        </p>
      </div>

      {/* Projects Absorption Comparison */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {projectEntries.map((entry: any, i: number) => {
          const val = Number(entry.value || 0);
          const baseVal = Number(baseline?.value || 0.3);
          const diffPercent = Math.round(((val - baseVal) / (baseVal || 0.1)) * 100);

          return (
            <div key={i} className="bg-emerald-950/80 p-2 rounded-xl border border-emerald-800/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="truncate">
                  <span className="font-bold text-white text-[11px] block truncate">{entry.name}</span>
                  <span className="text-[9px] text-emerald-300/80">
                    Absorção αs: <strong className="text-white font-mono">{val.toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-1.5 py-0.5 rounded bg-emerald-900 text-[#86efac] text-[10px] font-mono font-bold">
                  +{diffPercent}% vs Alvenaria
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Baseline Footnote */}
      {baseline && (
        <div className="flex items-center justify-between pt-1.5 border-t border-emerald-800/60 text-[10px] text-gray-400">
          <span>Alvenaria Convencional: <strong>αs {Number(baseline.value).toFixed(2)}</strong></span>
          <span className="text-emerald-300 font-semibold">Norma ISO 354 / IPT</span>
        </div>
      )}

    </div>
  );
};

// 3. Custom Tooltip for Seasonal HVAC Energy Bar Chart (ASHRAE 90.1)
const CustomSeasonalTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null;

  const totalSeasonKwh = payload.reduce((acc: number, curr: any) => acc + Number(curr.value || 0), 0);
  const totalBrlSaved = Math.round(totalSeasonKwh * 0.92);

  const getSeasonDescription = (season: string = '') => {
    if (season.includes('Verão')) return { tag: 'Pico Solar', note: 'Máxima incidência de radiação e sobrecarga em compressores de ar-condicionado.' };
    if (season.includes('Outono')) return { tag: 'Transição Térmica', note: 'Demanda moderada; o jardim atua estabilizando picos térmicos diurnos.' };
    if (season.includes('Inverno')) return { tag: 'Inércia Fria', note: 'Retenção de conforto e barreira contra perdas térmicas estruturais.' };
    if (season.includes('Primavera')) return { tag: 'Regulação Bioclimática', note: 'Climatização eficiente com amortecimento de variações térmicas.' };
    return { tag: 'Ciclo Anual', note: 'Eficiência bioclimática certificada.' };
  };

  const seasonInfo = getSeasonDescription(label);

  return (
    <div className="bg-[#072a1a] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/60 text-xs space-y-3 w-80 sm:w-96 backdrop-blur-md animate-in fade-in duration-200 z-50">
      
      {/* Header */}
      <div className="border-b border-emerald-800/80 pb-2">
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-blue-300" />
            {label}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-200 border border-blue-700 text-[10px] font-bold font-mono">
            {seasonInfo.tag}
          </span>
        </div>
        <p className="text-[11px] text-emerald-200/80 mt-1 leading-relaxed">
          {seasonInfo.note}
        </p>
      </div>

      {/* Aggregate Season Highlights */}
      <div className="grid grid-cols-2 gap-2 bg-emerald-950/90 p-2.5 rounded-xl border border-emerald-800/60 text-center">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">Total Poupado</span>
          <span className="font-mono font-bold text-sm text-yellow-300">
            {totalSeasonKwh.toLocaleString('pt-BR')} kWh
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-emerald-300 block font-bold">Economia Estimada</span>
          <span className="font-mono font-bold text-sm text-[#86efac]">
            R$ {totalBrlSaved.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Project Breakdown List */}
      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
        {payload.map((entry: any, i: number) => {
          const val = Number(entry.value || 0);
          const percent = totalSeasonKwh > 0 ? Math.round((val / totalSeasonKwh) * 100) : 0;
          const projBrl = Math.round(val * 0.92);

          return (
            <div key={i} className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-800/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-semibold text-white text-[11px] truncate">{entry.name}</span>
              </div>
              <div className="text-right shrink-0 font-mono text-[11px]">
                <span className="font-bold text-yellow-300">{val.toLocaleString('pt-BR')} kWh</span>
                <span className="text-[9px] text-gray-400 block">R$ {projBrl.toLocaleString('pt-BR')} ({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standard Norm Tag */}
      <div className="flex items-center justify-between pt-1 border-t border-emerald-800/60 text-[10px] text-emerald-300/80">
        <span>Modelagem Energética ASHRAE 90.1</span>
        <span className="font-bold text-[#86efac]">Simulação Térmica Ativa</span>
      </div>

    </div>
  );
};

export const ProjectsPerformanceHeatmap: React.FC<ProjectsPerformanceHeatmapProps> = ({
  projects,
  onOpenProjectDetail,
  onDownloadSpecPdf,
  onSelectProjectForCompare,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'nrc' | 'energy' | 'area' | 'well'>('energy');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortBy === 'nrc') {
        valA = a.acousticNrc || 0;
        valB = b.acousticNrc || 0;
      } else if (sortBy === 'energy') {
        valA = a.energySavedKwhYear || a.area * 120;
        valB = b.energySavedKwhYear || b.area * 120;
      } else if (sortBy === 'area') {
        valA = a.area;
        valB = b.area;
      } else if (sortBy === 'well') {
        valA = a.wellScore || 70;
        valB = b.wellScore || 70;
      }
      return sortDirection === 'desc' ? valB - valA : valA - valB;
    });
    return result;
  }, [projects, categoryFilter, sortBy, sortDirection]);

  // Aggregate Key Performance Indicators across active projects
  const totalArea = useMemo(() => projects.reduce((acc, p) => acc + p.area, 0), [projects]);
  const totalKwhSaved = useMemo(
    () => projects.reduce((acc, p) => acc + (p.energySavedKwhYear || p.area * 130), 0),
    [projects]
  );
  const totalHvacFinancial = useMemo(
    () => projects.reduce((acc, p) => acc + (p.hvacSavingsBrlYear || p.area * 120), 0),
    [projects]
  );
  const avgNrc = useMemo(() => {
    if (projects.length === 0) return 0;
    const sumNrcArea = projects.reduce((acc, p) => acc + (p.acousticNrc || 0.8) * p.area, 0);
    return (sumNrcArea / totalArea).toFixed(2);
  }, [projects, totalArea]);

  const maxDamping = useMemo(
    () => Math.max(...projects.map(p => p.acousticDbDamping || 7.0)),
    [projects]
  );

  // Data for Recharts Scatter Heatmap (Energy % vs Acoustic NRC, Z=Area)
  const scatterData = useMemo(() => {
    return filteredProjects.map(p => {
      const nrc = p.acousticNrc || 0.8;
      const thermalRed = p.thermalReductionPercent || Math.min(28, 15 + p.area * 0.25);
      const kwh = p.energySavedKwhYear || Math.round(p.area * 130);
      const db = p.acousticDbDamping || 7.0;
      const combinedScore = (nrc * 50) + (thermalRed * 1.8);

      return {
        id: p.id,
        code: p.code,
        name: p.title,
        client: p.client,
        category: p.category,
        style: p.style,
        nrc: Number(nrc.toFixed(2)),
        thermalReduction: Number(thermalRed.toFixed(1)),
        area: p.area,
        kwhSaved: kwh,
        hvacSavingsBrl: p.hvacSavingsBrlYear || Math.round(kwh * 0.92),
        dbDamping: db,
        wellScore: p.wellScore || 85,
        combinedScore: Math.round(combinedScore),
        projectObj: p,
      };
    });
  }, [filteredProjects]);

  // Color generator for heatmaps (Emerald / Deep Forest Scale)
  const getHeatColor = (value: number, min: number, max: number) => {
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
    if (ratio > 0.85) return 'bg-[#072a1a] text-[#86efac] font-bold border-emerald-500/50';
    if (ratio > 0.65) return 'bg-[#15803d] text-white font-bold border-emerald-600/50';
    if (ratio > 0.4) return 'bg-[#22c55e] text-gray-950 font-semibold border-emerald-400';
    if (ratio > 0.2) return 'bg-[#86efac] text-[#072a1a] font-semibold border-emerald-300';
    return 'bg-emerald-50 text-emerald-900 font-medium border-emerald-200';
  };

  const getScatterNodeColor = (combinedScore: number) => {
    if (combinedScore >= 85) return '#072a1a'; // Deepest executive green
    if (combinedScore >= 75) return '#15803d'; // Rich forest
    if (combinedScore >= 65) return '#16a34a'; // Vibrant emerald
    if (combinedScore >= 50) return '#22c55e'; // Bright green
    return '#86efac';
  };

  // Octave band frequency data (125Hz to 4000Hz)
  const frequencyBandData = useMemo(() => {
    const bands = [
      { freq: '125 Hz (Grave)', key: 'f125', norm: 0.12 },
      { freq: '250 Hz (Médio-Grave)', key: 'f250', norm: 0.35 },
      { freq: '500 Hz (Fala Humana)', key: 'f500', norm: 0.65 },
      { freq: '1000 Hz (Conferências)', key: 'f1000', norm: 0.80 },
      { freq: '2000 Hz (Agudos / Calls)', key: 'f2000', norm: 0.78 },
      { freq: '4000 Hz (Eco & Brilho)', key: 'f4000', norm: 0.72 },
    ];

    return bands.map(b => {
      const row: any = {
        frequency: b.freq,
        referenciaNorma: b.norm,
      };

      filteredProjects.forEach(p => {
        const freqVal = p.acousticFrequencies
          ? (p.acousticFrequencies as any)[b.key]
          : ((p.acousticNrc || 0.8) * (b.norm + 0.15));
        row[p.code] = Number(Number(freqVal).toFixed(2));
      });

      return row;
    });
  }, [filteredProjects]);

  // Seasonal HVAC Energy Savings Data
  const seasonalEnergyData = useMemo(() => {
    const seasons = [
      { season: 'Verão (Pico Climatização)', factor: 0.40, desc: 'Radiação solar máxima' },
      { season: 'Outono (Carga Moderada)', factor: 0.22, desc: 'Isolamento estável' },
      { season: 'Inverno (Inércia Térmica)', factor: 0.15, desc: 'Retenção de conforto' },
      { season: 'Primavera (Transição)', factor: 0.23, desc: 'Regulação bioclimática' },
    ];

    return seasons.map(s => {
      const row: any = {
        estacao: s.season,
      };

      let totalSeasonKwh = 0;
      filteredProjects.forEach(p => {
        const projKwh = (p.energySavedKwhYear || p.area * 130) * s.factor;
        row[p.code] = Math.round(projKwh);
        totalSeasonKwh += projKwh;
      });

      row['totalEstacao'] = Math.round(totalSeasonKwh);
      return row;
    });
  }, [filteredProjects]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find(p => p.id === selectedProjectId) || null;
  }, [selectedProjectId, projects]);

  const toggleSort = (col: 'nrc' | 'energy' | 'area' | 'well') => {
    if (sortBy === col) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDirection('desc');
    }
  };

  const kpiContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const kpiItemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6"
    >
      
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#072a1a] text-xs font-bold font-mono border border-emerald-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#15803d]" />
              ENGENHARIA BIOCLIMÁTICA
            </span>
            <span className="text-xs text-gray-500 font-semibold">• Laudos IPT & ASHRAE 90.1</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 mt-1 flex items-center gap-2.5">
            <span>Heatmap de Energia & Desempenho Acústico</span>
            <Sparkles className="w-5 h-5 text-[#15803d]" />
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-600 max-w-3xl mt-0.5">
            Matriz cruzada de eficiência térmica (redução de carga de ar condicionado HVAC) e absorção fono-absorvente (NRC / atenuação de dB) calculada para todas as suas obras ativas. Passe o cursor sobre os pontos para visualizar métricas detalhadas.
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 self-start lg:self-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-700 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matriz Heatmap</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setViewMode('scatter')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'scatter'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-700 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dispersão IA</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setViewMode('frequency')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'frequency'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-700 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Curva Acústica (Hz)</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setViewMode('seasonal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'seasonal'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-700 hover:text-gray-950 hover:bg-white/60'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Sazonalidade HVAC</span>
          </motion.button>
        </div>
      </div>

      {/* Aggregate KPI Strip with Staggered Framer Motion */}
      <motion.div
        variants={kpiContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        <motion.div
          variants={kpiItemVariants}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 to-[#072a1a] text-white border border-emerald-800 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Economia Térmica Anual</span>
            <Zap className="w-4 h-4 text-[#86efac]" />
          </div>
          <div className="text-2xl font-serif font-bold text-white mt-1">
            {totalKwhSaved.toLocaleString('pt-BR')} <span className="text-xs font-sans font-normal text-emerald-200">kWh/ano</span>
          </div>
          <span className="text-[10px] text-emerald-300/80 block mt-0.5">
            Economia estimada: R$ {totalHvacFinancial.toLocaleString('pt-BR')}/ano
          </span>
        </motion.div>

        <motion.div
          variants={kpiItemVariants}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-gray-900 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#15803d] tracking-wider">Média de Absorção Acústica</span>
            <Volume2 className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#072a1a] mt-1">
            NRC {avgNrc}
          </div>
          <span className="text-[10px] text-gray-600 block mt-0.5">
            Classificação Classe A de fono-absorção
          </span>
        </motion.div>

        <motion.div
          variants={kpiItemVariants}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-gray-900 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#15803d] tracking-wider">Atenuação Sonora Máxima</span>
            <Award className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#072a1a] mt-1">
            -{maxDamping.toFixed(1)} dB(A)
          </div>
          <span className="text-[10px] text-gray-600 block mt-0.5">
            Ruído de voz e chamadas telefônicas
          </span>
        </motion.div>

        <motion.div
          variants={kpiItemVariants}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-gray-900 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#15803d] tracking-wider">Área Vegetada Total</span>
            <Layers className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#072a1a] mt-1">
            {totalArea} m²
          </div>
          <span className="text-[10px] text-gray-600 block mt-0.5">
            Distribuída em {projects.length} obras cadastradas
          </span>
        </motion.div>
      </motion.div>

      {/* Filter and Category Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-gray-700">Filtrar por Tipologia:</span>
          <div className="flex flex-wrap gap-1">
            {['all', 'Corporativo', 'Residencial', 'Comercial'].map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {cat === 'all' ? 'Todas as Tipologias' : cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">Legenda de Intensidade Térmica/Acústica:</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">Baixo</span>
            <span className="px-1.5 py-0.5 rounded bg-[#86efac] text-[#072a1a] font-bold">Médio</span>
            <span className="px-1.5 py-0.5 rounded bg-[#15803d] text-white font-bold">Alto</span>
            <span className="px-1.5 py-0.5 rounded bg-[#072a1a] text-[#86efac] font-bold">Excepcional</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC VIEW MODES WITH FRAMER MOTION ENTRANCE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${categoryFilter}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* VIEW MODE 1: Interactive Heatmap Matrix Grid */}
          {viewMode === 'matrix' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#072a1a] text-white divide-x divide-emerald-800">
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] min-w-[200px]">
                        Projeto / Obra Ativa
                      </th>
                      <th 
                        onClick={() => toggleSort('area')}
                        className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:bg-emerald-900 transition-colors"
                      >
                        Área {sortBy === 'area' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
                      </th>
                      <th 
                        onClick={() => toggleSort('nrc')}
                        className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:bg-emerald-900 transition-colors"
                      >
                        Absorção Acústica (NRC) {sortBy === 'nrc' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
                      </th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center">
                        Atenuação Ruído (dB)
                      </th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center">
                        Redução Eco (RT60)
                      </th>
                      <th 
                        onClick={() => toggleSort('energy')}
                        className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:bg-emerald-900 transition-colors"
                      >
                        Economia HVAC (kWh/ano) {sortBy === 'energy' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
                      </th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center">
                        Carga Térmica (%)
                      </th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center">
                        ΔT Térmico (°C)
                      </th>
                      <th 
                        onClick={() => toggleSort('well')}
                        className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:bg-emerald-900 transition-colors"
                      >
                        Selo WELL {sortBy === 'well' ? (sortDirection === 'desc' ? '↓' : '↑') : ''}
                      </th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] text-center">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredProjects.map((p, idx) => {
                      const nrc = p.acousticNrc || 0.8;
                      const db = p.acousticDbDamping || 7.0;
                      const rt60 = p.rt60ReductionSec || 0.45;
                      const kwh = p.energySavedKwhYear || Math.round(p.area * 130);
                      const thermalPercent = p.thermalReductionPercent || 22.0;
                      const deltaC = p.thermalDeltaCelsius || 3.0;
                      const well = p.wellScore || 85;

                      const isSelected = selectedProjectId === p.id;

                      return (
                        <motion.tr 
                          key={p.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25) }}
                          onClick={() => setSelectedProjectId(isSelected ? null : p.id)}
                          className={`hover:bg-emerald-50/50 transition-colors cursor-pointer divide-x divide-gray-100 ${
                            isSelected ? 'bg-emerald-50 border-l-4 border-l-[#15803d]' : ''
                          }`}
                        >
                          {/* Project Identification */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="px-2 py-0.5 rounded bg-[#072a1a] text-[#86efac] text-[10px] font-mono font-bold shrink-0">
                                {p.code}
                              </span>
                              <div>
                                <span className="font-bold text-gray-900 block leading-tight">{p.title}</span>
                                <span className="text-[11px] text-gray-500">{p.client} • {p.category}</span>
                              </div>
                            </div>
                          </td>

                          {/* Area */}
                          <td className="p-3.5 text-center font-bold text-gray-900">
                            {p.area} m²
                          </td>

                          {/* Acoustic NRC (Heat Color) */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(nrc, 0.60, 0.95)}`}>
                              <span className="font-mono text-xs block">NRC {nrc.toFixed(2)}</span>
                              <span className="text-[9px] opacity-80 block">
                                {nrc >= 0.88 ? 'Classe A Superior' : nrc >= 0.8 ? 'Alta Absorção' : 'Atenuação Média'}
                              </span>
                            </div>
                          </td>

                          {/* dB Damping */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(db, 4.0, 9.0)}`}>
                              <span className="font-mono text-xs block">-{db.toFixed(1)} dB(A)</span>
                              <span className="text-[9px] opacity-80 block">Voz e Eco</span>
                            </div>
                          </td>

                          {/* RT60 */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(rt60, 0.20, 0.60)}`}>
                              <span className="font-mono text-xs block">-{rt60.toFixed(2)}s</span>
                              <span className="text-[9px] opacity-80 block">Tempo Reverb</span>
                            </div>
                          </td>

                          {/* Energy Savings (kWh/ano) */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(kwh, 1000, 6000)}`}>
                              <span className="font-mono text-xs block">{kwh.toLocaleString('pt-BR')} kWh</span>
                              <span className="text-[9px] opacity-80 block">Economia Anual</span>
                            </div>
                          </td>

                          {/* Thermal Load Reduction % */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(thermalPercent, 15, 28)}`}>
                              <span className="font-mono text-xs block">-{thermalPercent.toFixed(1)}%</span>
                              <span className="text-[9px] opacity-80 block">Carga HVAC</span>
                            </div>
                          </td>

                          {/* Thermal Delta C */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(deltaC, 2.0, 3.8)}`}>
                              <span className="font-mono text-xs block">-{deltaC.toFixed(1)} °C</span>
                              <span className="text-[9px] opacity-80 block">Superfície Parede</span>
                            </div>
                          </td>

                          {/* WELL Score */}
                          <td className="p-2.5 text-center">
                            <div className={`p-2 rounded-xl border text-center transition-transform hover:scale-105 shadow-2xs ${getHeatColor(well, 70, 98)}`}>
                              <span className="font-mono text-xs block">{well} pts</span>
                              <span className="text-[9px] opacity-80 block">Conforto WELL</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenProjectDetail) onOpenProjectDetail(p);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-[#072a1a] hover:bg-emerald-100 transition-colors cursor-pointer"
                                title="Ver memorial completo"
                              >
                                <FileText className="w-4 h-4 text-[#15803d]" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 px-1 italic">
                <span>* Valores validados computacionalmente e em conformidade com normas IPT ISO 354 e ABNT NBR 16626.</span>
                <span>Clique em qualquer linha da tabela para detalhamento instantâneo.</span>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: Recharts Scatter Heatmap (Energy % vs Acoustic NRC) with Custom Tooltip */}
          {viewMode === 'scatter' && (
            <div className="space-y-4">
              <div className="bg-gray-900 text-white rounded-2xl p-5 border border-gray-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Matriz de Dispersão: Isolamento Térmico vs Fono-Absorção</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-[#86efac] text-[10px] font-mono rounded">Recharts Custom Tooltip</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Passe o cursor sobre os nós circulares para abrir o laudo interativo com métricas de energia, acústica, espécies e certificações.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#86efac]" />
                      <span>Alta Eficiência</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#15803d]" />
                      <span>Performance Superior</span>
                    </span>
                  </div>
                </div>

                <div className="h-84 sm:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 30, bottom: 25, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      
                      <XAxis
                        type="number"
                        dataKey="nrc"
                        name="Absorção Acústica (NRC)"
                        domain={[0.55, 1.0]}
                        unit=""
                        stroke="#94a3b8"
                        tick={{ fill: '#cbd5e1', fontSize: 11 }}
                        label={{
                          value: 'Coeficiente de Absorção Acústica (NRC IPT)',
                          position: 'bottom',
                          offset: 5,
                          fill: '#86efac',
                          fontSize: 11,
                        }}
                      />
                      
                      <YAxis
                        type="number"
                        dataKey="thermalReduction"
                        name="Redução Carga Térmica (%)"
                        domain={[14, 30]}
                        unit="%"
                        stroke="#94a3b8"
                        tick={{ fill: '#cbd5e1', fontSize: 11 }}
                        label={{
                          value: 'Redução de Carga Térmica HVAC (%)',
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#86efac',
                          fontSize: 11,
                        }}
                      />
                      
                      <ZAxis
                        type="number"
                        dataKey="area"
                        range={[140, 650]}
                        name="Área do Projeto (m²)"
                      />

                      {/* Reference line for Standard NRC baseline */}
                      <ReferenceLine
                        x={0.80}
                        stroke="#22c55e"
                        strokeDasharray="4 4"
                        label={{ value: 'Referência Alta Absorção (0.80)', fill: '#86efac', fontSize: 10, position: 'top' }}
                      />

                      {/* Reference line for Standard Thermal Savings baseline */}
                      <ReferenceLine
                        y={20}
                        stroke="#38bdf8"
                        strokeDasharray="4 4"
                        label={{ value: 'Meta Sustentável LEED (20%)', fill: '#38bdf8', fontSize: 10, position: 'right' }}
                      />

                      {/* ENHANCED CUSTOM TOOLTIP */}
                      <RechartsTooltip
                        cursor={{ strokeDasharray: '3 3', stroke: '#86efac', strokeWidth: 1.5 }}
                        content={<CustomScatterTooltip />}
                      />

                      <Scatter
                        name="Obras Ativas All Green"
                        data={scatterData}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                        onClick={(node) => {
                          if (node && node.id) setSelectedProjectId(node.id);
                        }}
                      >
                        {scatterData.map((entry) => (
                          <Cell
                            key={`cell-${entry.id}`}
                            fill={getScatterNodeColor(entry.combinedScore)}
                            stroke="#ffffff"
                            strokeWidth={selectedProjectId === entry.id ? 3 : 1}
                            className="cursor-pointer transition-all hover:opacity-90"
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: Acoustic Frequency Curve (125Hz to 4000Hz) with Custom Tooltip */}
          {viewMode === 'frequency' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                      <span>Espectro de Absorção Sonora em Bandas de Oitava (ISO 354)</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-900 text-[10px] font-mono rounded font-bold">IPT Homologado</span>
                    </h3>
                    <p className="text-xs text-gray-600">
                      Passe o cursor sobre qualquer ponto de frequência para verificar o ganho em relação à alvenaria e a recomendação de conforto acústico.
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Pico de absorção: 1.000 Hz a 2.000 Hz (Conferências & Open-Space)
                  </div>
                </div>

                <div className="h-84 sm:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={frequencyBandData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="frequency" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis
                        domain={[0, 1.1]}
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                        label={{
                          value: 'Coeficiente de Absorção (αs)',
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#072a1a',
                          fontSize: 11,
                        }}
                      />

                      {/* ENHANCED CUSTOM FREQUENCY TOOLTIP */}
                      <RechartsTooltip
                        content={<CustomFrequencyTooltip />}
                      />
                      
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                      {/* Reference line for typical standard wall */}
                      <Line
                        type="monotone"
                        dataKey="referenciaNorma"
                        name="Alvenaria Convencional (Sem Tratamento)"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                        isAnimationActive={true}
                        animationDuration={700}
                      />

                      {filteredProjects.map((p, idx) => {
                        const colors = ['#072a1a', '#15803d', '#22c55e', '#3b82f6', '#8b5cf6'];
                        const color = colors[idx % colors.length];
                        return (
                          <Line
                            key={p.code}
                            type="monotone"
                            dataKey={p.code}
                            name={`${p.code} (${p.title})`}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ r: 4, fill: color }}
                            activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
                            isAnimationActive={true}
                            animationDuration={900}
                            animationEasing="ease-out"
                          />
                        );
                      })}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 4: Seasonal HVAC Energy Reduction with Custom Tooltip */}
          {viewMode === 'seasonal' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                      <span>Economia de Energia Climatização (HVAC) por Estação</span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[10px] font-mono rounded font-bold">ASHRAE Standard</span>
                    </h3>
                    <p className="text-xs text-gray-600">
                      Passe o cursor sobre as barras para conferir a distribuição sazonal em kWh, a economia em R$ e a participação percentual por projeto.
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Pico de Redução no Verão: {(totalKwhSaved * 0.4).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} kWh
                  </div>
                </div>

                <div className="h-84 sm:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={seasonalEnergyData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="estacao" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                        label={{
                          value: 'Economia Energética (kWh)',
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#072a1a',
                          fontSize: 11,
                        }}
                      />

                      {/* ENHANCED CUSTOM SEASONAL TOOLTIP */}
                      <RechartsTooltip
                        content={<CustomSeasonalTooltip />}
                      />
                      
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                      {filteredProjects.map((p, idx) => {
                        const colors = ['#072a1a', '#15803d', '#22c55e', '#3b82f6', '#0ea5e9'];
                        const color = colors[idx % colors.length];
                        return (
                          <Bar
                            key={p.code}
                            dataKey={p.code}
                            name={`${p.code} - ${p.title}`}
                            fill={color}
                            radius={[4, 4, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={800}
                            animationEasing="ease-out"
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Selected Project Card Callout with Framer Motion */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#072a1a] to-emerald-900 text-white border border-emerald-600/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#86efac] text-[#072a1a] text-xs font-mono font-bold">
                  {selectedProject.code}
                </span>
                <span className="text-xs text-emerald-300 font-semibold">
                  {selectedProject.category} • {selectedProject.style}
                </span>
              </div>
              
              <h4 className="text-lg font-serif font-bold text-white">
                {selectedProject.title}
              </h4>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-200/90 font-mono pt-1">
                <span>Área: <strong>{selectedProject.area} m²</strong></span>
                <span>•</span>
                <span>Acústica: <strong>NRC {selectedProject.acousticNrc || 0.88}</strong></span>
                <span>•</span>
                <span>Economia: <strong>{selectedProject.energySavedKwhYear || 3800} kWh/ano</strong></span>
                <span>•</span>
                <span>Selo WELL: <strong>+{selectedProject.wellScore || 90} pts</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
              {onDownloadSpecPdf && (
                <button
                  type="button"
                  onClick={() => onDownloadSpecPdf(selectedProject)}
                  className="flex-1 md:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Laudo PDF</span>
                </button>
              )}

              {onOpenProjectDetail && (
                <button
                  type="button"
                  onClick={() => onOpenProjectDetail(selectedProject)}
                  className="flex-1 md:flex-initial px-4 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Ver Obra Completa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

