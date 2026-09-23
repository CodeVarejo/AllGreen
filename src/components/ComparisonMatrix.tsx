import React, { useState } from 'react';
import { COMPARISON_MATRIX } from '../data/mockData';
import { 
  VERTICAL_TECHNOLOGIES, 
  TECHNOLOGY_DUEL_PRESETS, 
  VerticalTechnology 
} from '../data/technologyData';
import { 
  ShieldCheck, 
  Droplets, 
  Sun, 
  Wrench, 
  Volume2, 
  Scale, 
  CheckCircle2,
  ArrowLeftRight,
  Camera,
  TrendingDown,
  Layers,
  Award,
  Clock,
  Flame,
  ChevronRight,
  Info,
  Sliders,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ComparisonMatrixProps {
  onOpenSimulator?: () => void;
  onOpenQuote?: (context?: string) => void;
  onOpenPdfReport?: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  onOpenSimulator,
  onOpenQuote,
  onOpenPdfReport,
}) => {
  // Mode: 'side-by-side' (default interactive comparison) or 'full-table' (all-in-one matrix)
  const [viewMode, setViewMode] = useState<'side-by-side' | 'full-table'>('side-by-side');
  
  // Side-by-Side State
  const [techAId, setTechAId] = useState<string>('preservado_tropical');
  const [techBId, setTechBId] = useState<string>('natural_hidroponico');
  const [projectArea, setProjectArea] = useState<number>(15); // Area in m² for real-time Capex/Opex calculation
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'all' | 'financial' | 'engineering' | 'sustainability'>('all');

  // Full Table Filter State
  const [techFilter, setTechFilter] = useState<'all' | 'preservado' | 'permanente' | 'natural'>('all');

  const techA = VERTICAL_TECHNOLOGIES.find(t => t.id === techAId) || VERTICAL_TECHNOLOGIES[0];
  const techB = VERTICAL_TECHNOLOGIES.find(t => t.id === techBId) || VERTICAL_TECHNOLOGIES[2] || VERTICAL_TECHNOLOGIES[1];

  // Helper calculation for financial comparison (5-Year TCO)
  const calculateTCO = (tech: VerticalTechnology, area: number) => {
    const initialCapex = (tech.capexPerM2 * area) + tech.infrastructureBaseCost;
    const annualOpex = (tech.opexPerM2Year * area) + (tech.waterCostPerM2Year * area);
    const fiveYearOpex = annualOpex * 5;
    const fiveYearTCO = initialCapex + fiveYearOpex;
    const annualWaterLiters = tech.waterLitersPerM2Year * area;
    const fiveYearWaterLiters = annualWaterLiters * 5;

    return {
      initialCapex,
      annualOpex,
      fiveYearOpex,
      fiveYearTCO,
      annualWaterLiters,
      fiveYearWaterLiters,
      weightTotalKg: tech.structuralWeightKgM2 * area,
    };
  };

  const metricsA = calculateTCO(techA, projectArea);
  const metricsB = calculateTCO(techB, projectArea);

  const tcoDifference = Math.abs(metricsA.fiveYearTCO - metricsB.fiveYearTCO);
  const moreEconomical = metricsA.fiveYearTCO < metricsB.fiveYearTCO ? techA : techB;
  const moreExpensive = metricsA.fiveYearTCO >= metricsB.fiveYearTCO ? techA : techB;

  const handleSwap = () => {
    const temp = techAId;
    setTechAId(techBId);
    setTechBId(temp);
  };

  const handleApplyPreset = (presetAId: string, presetBId: string) => {
    setTechAId(presetAId);
    setTechBId(presetBId);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-4 h-4 text-[#15803d]" />;
      case 'Sun': return <Sun className="w-4 h-4 text-[#15803d]" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-[#15803d]" />;
      case 'Volume2': return <Volume2 className="w-4 h-4 text-[#15803d]" />;
      case 'ShieldAlert': return <ShieldCheck className="w-4 h-4 text-[#15803d]" />;
      case 'Scale': return <Scale className="w-4 h-4 text-[#15803d]" />;
      default: return <CheckCircle2 className="w-4 h-4 text-[#15803d]" />;
    }
  };

  const handleRequestQuote = () => {
    const context = `Comparativo Técnico: ${techA.name} vs ${techB.name} (${projectArea} m²). Economia estimada de R$ ${tcoDifference.toLocaleString('pt-BR')} em 5 anos.`;
    if (onOpenQuote) {
      onOpenQuote(context);
    } else {
      const quoteSection = document.getElementById('budget-calculator') || document.getElementById('consulting-booking');
      if (quoteSection) quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="comparison-matrix" className="bg-[#f9fbf9] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              Matriz Comparativa das <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">Tecnologias Verticais</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Diferenças de investimento inicial (Capex), despesas anuais (Opex), atenuação acústica e créditos LEED/WELL entre os sistemas.
            </p>
          </div>
        </ScrollReveal>

        {/* Mode Switcher Buttons */}
        <ScrollReveal animation="fade-up" delay={0.08} distance={15}>
          <div className="flex justify-center mt-6">
            <div className="bg-white p-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
              <button
                type="button"
                id="btn-view-side-by-side"
                onClick={() => setViewMode('side-by-side')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'side-by-side'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-md'
                    : 'text-gray-700 hover:text-gray-950 hover:bg-emerald-50'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4 text-[#15803d]" />
                <span>Comparador Lado a Lado (1x1)</span>
                <span className="px-1.5 py-0.5 bg-emerald-700/60 text-emerald-200 rounded text-[10px] font-extrabold">
                  Interativo
                </span>
              </button>

              <button
                type="button"
                id="btn-view-full-table"
                onClick={() => setViewMode('full-table')}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === 'full-table'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-md'
                    : 'text-gray-700 hover:text-gray-950 hover:bg-emerald-50'
                }`}
              >
                <Layers className="w-4 h-4 text-[#15803d]" />
                <span>Tabela Geral Completa</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* MODE 1: SIDE-BY-SIDE INTERACTIVE VIEW */}
        {viewMode === 'side-by-side' && (
          <div className="mt-8 space-y-6">
            
            {/* Quick Duels Bar */}
            <ScrollReveal animation="fade-up" delay={0.1} distance={15}>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Duelos Mais Solicitados por Especificadores:</span>
                  </span>
                  <span className="text-[11px] text-gray-500 hidden sm:inline">Clique para carregar o comparativo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {TECHNOLOGY_DUEL_PRESETS.map((preset) => {
                    const isSelected = (techAId === preset.techAId && techBId === preset.techBId) ||
                                       (techAId === preset.techBId && techBId === preset.techAId);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.techAId, preset.techBId)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-[#15803d] shadow-xs ring-1 ring-[#15803d]'
                            : 'bg-gray-50/70 border-gray-200 hover:bg-emerald-50/40 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xs font-bold text-gray-900 line-clamp-1">{preset.title}</span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">
                          {preset.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Selectors and Project Area Slider Panel */}
            <ScrollReveal animation="fade-up" delay={0.12} distance={20}>
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-6">
                
                {/* Dual Selector Bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* System A Selector */}
                  <div className="md:col-span-5 bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#072a1a] text-[#86efac]">
                        SISTEMA A (Referência)
                      </span>
                      <span className="text-xs font-bold text-emerald-950">{techA.badge}</span>
                    </div>

                    <select
                      id="select-tech-a"
                      value={techAId}
                      onChange={(e) => setTechAId(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a] cursor-pointer shadow-2xs"
                    >
                      {VERTICAL_TECHNOLOGIES.map((tech) => (
                        <option key={tech.id} value={tech.id} disabled={tech.id === techBId}>
                          {tech.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-3 pt-1">
                      <img 
                        src={techA.image} 
                        alt={techA.name}
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0" 
                      />
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {techA.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Swap Button (Middle) */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      id="btn-swap-systems"
                      onClick={handleSwap}
                      className="p-3 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#072a1a] border border-gray-200 hover:border-emerald-300 rounded-full shadow-sm transition-all cursor-pointer group active:scale-95 flex items-center gap-1.5"
                      title="Inverter os lados para comparação"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-[#15803d] group-hover:rotate-180 transition-transform duration-300" />
                      <span className="text-[11px] font-bold sm:hidden">Inverter Lados</span>
                    </button>
                    <span className="text-[10px] text-gray-500 font-semibold mt-1 hidden sm:block">Inverter</span>
                  </div>

                  {/* System B Selector */}
                  <div className="md:col-span-5 bg-teal-50/70 p-4 rounded-2xl border-2 border-teal-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-900 text-teal-200">
                        SISTEMA B (Comparado)
                      </span>
                      <span className="text-xs font-bold text-teal-950">{techB.badge}</span>
                    </div>

                    <select
                      id="select-tech-b"
                      value={techBId}
                      onChange={(e) => setTechBId(e.target.value)}
                      className="w-full bg-white border border-teal-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a] cursor-pointer shadow-2xs"
                    >
                      {VERTICAL_TECHNOLOGIES.map((tech) => (
                        <option key={tech.id} value={tech.id} disabled={tech.id === techAId}>
                          {tech.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-3 pt-1">
                      <img 
                        src={techB.image} 
                        alt={techB.name}
                        className="w-12 h-12 rounded-xl object-cover border border-teal-200 shrink-0" 
                      />
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {techB.tagline}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Interactive Area Slider Bar */}
                <div className="bg-gray-50/90 p-4 sm:p-5 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#15803d]" />
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Área de Parede Projetada:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] font-bold text-xs">
                        {projectArea} m²
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ajuste para recalcular Capex, Opex e economia hídrica em tempo real.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <span className="text-xs text-gray-500 font-semibold">4 m²</span>
                    <input 
                      type="range"
                      min={4}
                      max={60}
                      step={1}
                      value={projectArea}
                      onChange={(e) => setProjectArea(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#15803d]"
                    />
                    <span className="text-xs text-gray-500 font-semibold">60 m²</span>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[8, 15, 25, 40].map((areaVal) => (
                      <button
                        key={areaVal}
                        type="button"
                        onClick={() => setProjectArea(areaVal)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          projectArea === areaVal
                            ? 'bg-[#15803d] text-white'
                            : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                        }`}
                      >
                        {areaVal}m²
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* KEY FINANCIAL IMPACT CARD (5-YEAR TCO HIGHLIGHT) */}
            <ScrollReveal animation="fade-up" delay={0.14} distance={20}>
              <div className="bg-[#072a1a] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold uppercase tracking-wider">
                        Análise de TCO (Custo Total de Posse em 5 Anos)
                      </span>
                      <span className="text-xs text-emerald-200 font-semibold">Área: {projectArea} m²</span>
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                      Comparativo Financeiro Direto: {techA.shortName} vs. {techB.shortName}
                    </h3>
                  </div>

                  <div className="bg-emerald-950/90 px-4 py-2.5 rounded-2xl border border-emerald-700/80 text-right">
                    <span className="text-[10px] text-emerald-300 font-extrabold uppercase block">
                      Diferença Líquida em 5 Anos:
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-[#86efac]">
                      R$ {tcoDifference.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-emerald-200 block">
                      {moreEconomical.shortName} é mais econômico
                    </span>
                  </div>
                </div>

                {/* Progress Comparison Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* System A Financial Card */}
                  <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/60 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-emerald-300">{techA.shortName}</span>
                        <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
                          R$ {metricsA.fiveYearTCO.toLocaleString('pt-BR')}
                        </div>
                        <span className="text-[11px] text-emerald-300 font-medium">
                          Capex + 5 anos de Opex / Água / Energia
                        </span>
                      </div>

                      {metricsA.fiveYearTCO <= metricsB.fiveYearTCO && (
                        <span className="px-2.5 py-1 rounded-full bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Menor Custo
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-emerald-800 text-xs">
                      <div className="flex justify-between text-emerald-200">
                        <span>Investimento Inicial (Capex):</span>
                        <span className="font-bold text-white">R$ {metricsA.initialCapex.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-200">
                        <span>Manutenção Anual (Opex):</span>
                        <span className="font-bold text-white">
                          {metricsA.annualOpex === 0 ? 'R$ 0 / ano (Zero Manutenção)' : `R$ ${metricsA.annualOpex.toLocaleString('pt-BR')} / ano`}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-200">
                        <span>Consumo de Água Potável:</span>
                        <span className="font-bold text-[#86efac]">
                          {metricsA.annualWaterLiters === 0 ? '0 Litros (Isenção Total)' : `${metricsA.annualWaterLiters.toLocaleString('pt-BR')} L / ano`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* System B Financial Card */}
                  <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-700/60 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-teal-300">{techB.shortName}</span>
                        <div className="text-2xl sm:text-3xl font-serif font-bold text-white mt-0.5">
                          R$ {metricsB.fiveYearTCO.toLocaleString('pt-BR')}
                        </div>
                        <span className="text-[11px] text-teal-300 font-medium">
                          Capex + 5 anos de Opex / Água / Energia
                        </span>
                      </div>

                      {metricsB.fiveYearTCO < metricsA.fiveYearTCO && (
                        <span className="px-2.5 py-1 rounded-full bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                          <TrendingDown className="w-3.5 h-3.5" />
                          Menor Custo
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-emerald-800 text-xs">
                      <div className="flex justify-between text-emerald-200">
                        <span>Investimento Inicial (Capex):</span>
                        <span className="font-bold text-white">R$ {metricsB.initialCapex.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-200">
                        <span>Manutenção Anual (Opex):</span>
                        <span className="font-bold text-white">
                          {metricsB.annualOpex === 0 ? 'R$ 0 / ano (Zero Manutenção)' : `R$ ${metricsB.annualOpex.toLocaleString('pt-BR')} / ano`}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-200">
                        <span>Consumo de Água Potável:</span>
                        <span className="font-bold text-[#86efac]">
                          {metricsB.annualWaterLiters === 0 ? '0 Litros (Isenção Total)' : `${metricsB.annualWaterLiters.toLocaleString('pt-BR')} L / ano`}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Call to action within financial box */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-emerald-800/80">
                  <p className="text-xs text-emerald-200">
                    💡 <strong>Insight Técnico:</strong> Em 5 anos para {projectArea} m², a escolha de <strong>{moreEconomical.shortName}</strong> economiza <strong>R$ {tcoDifference.toLocaleString('pt-BR')}</strong> e elimina {(Math.abs(metricsA.fiveYearWaterLiters - metricsB.fiveYearWaterLiters)).toLocaleString('pt-BR')} Litros de água tratada.
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      id="btn-quote-duel"
                      onClick={handleRequestQuote}
                      className="px-5 py-2.5 bg-[#86efac] hover:bg-white text-[#072a1a] font-bold rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Solicitar Proposta Comparativa</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Analysis Filter Tabs (All / Financial / Engineering / Sustainability) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAnalysisTab === 'all'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                Todas as Especificações Lado a Lado
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('financial')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAnalysisTab === 'financial'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                Custo & Manutenção (Capex vs Opex)
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('engineering')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAnalysisTab === 'engineering'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                Engenharia, Acústica & Fogo
              </button>
              <button
                type="button"
                onClick={() => setActiveAnalysisTab('sustainability')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeAnalysisTab === 'sustainability'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                Sustentabilidade (LEED/WELL & Água)
              </button>
            </div>

            {/* DETAILED HEAD-TO-HEAD CRITERIA TABLE */}
            <ScrollReveal animation="fade-up" delay={0.16} distance={20}>
              <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
                <div className="p-5 sm:p-6 bg-emerald-50/60 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-5 h-5 text-[#15803d]" />
                    <h3 className="font-serif font-bold text-lg text-gray-950">
                      Matriz de Confronto Direto por Critério Técnico
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    {techA.shortName} vs. {techB.shortName}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                        <th className="py-3.5 px-6 w-1/3">Critério Técnico & Operacional</th>
                        <th className="py-3.5 px-6 w-1/3 text-[#072a1a] bg-emerald-50/40">
                          {techA.name}
                        </th>
                        <th className="py-3.5 px-6 w-1/3 text-teal-950 bg-teal-50/40">
                          {techB.name}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      
                      {/* SECTION: FINANCIAL & WATER */}
                      {(activeAnalysisTab === 'all' || activeAnalysisTab === 'financial') && (
                        <>
                          <tr className="bg-gray-100/70 font-bold text-[11px] uppercase tracking-wider text-gray-700">
                            <td colSpan={3} className="py-2.5 px-6">
                              1. Métricas Financeiras & Custo de Operação
                            </td>
                          </tr>

                          {/* Capex / m² */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-[#15803d]" />
                              <span>Custo Estimado por m² (Capex)</span>
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-900 bg-emerald-50/20">
                              R$ {techA.capexPerM2.toLocaleString('pt-BR')} / m²
                              {techA.capexPerM2 < techB.capexPerM2 && (
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-900 font-extrabold">
                                  ✓ Mais Acessível
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-900 bg-teal-50/20">
                              R$ {techB.capexPerM2.toLocaleString('pt-BR')} / m²
                              {techB.capexPerM2 < techA.capexPerM2 && (
                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-teal-100 text-teal-900 font-extrabold">
                                  ✓ Mais Acessível
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* Opex / ano */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-amber-600" />
                              <span>Manutenção Mensal / Anual (Opex)</span>
                            </td>
                            <td className="py-4 px-6 font-medium text-gray-900 bg-emerald-50/20">
                              {techA.opexPerM2Year === 0 ? (
                                <span className="font-bold text-[#15803d] bg-emerald-100 px-2 py-0.5 rounded">
                                  R$ 0 / mês (Zero Manutenção)
                                </span>
                              ) : (
                                `R$ ${(techA.opexPerM2Year / 12).toFixed(0)} / m² / mês (~R$ ${techA.opexPerM2Year} / m² / ano)`
                              )}
                            </td>
                            <td className="py-4 px-6 font-medium text-gray-900 bg-teal-50/20">
                              {techB.opexPerM2Year === 0 ? (
                                <span className="font-bold text-[#15803d] bg-emerald-100 px-2 py-0.5 rounded">
                                  R$ 0 / mês (Zero Manutenção)
                                </span>
                              ) : (
                                <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded">
                                  R$ ${(techB.opexPerM2Year / 12).toFixed(0)} / m² / mês (~R$ ${techB.opexPerM2Year} / m² / ano)
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* Ponto Hidráulico / Ralo */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-blue-600" />
                              <span>Necessidade de Ponto de Água & Dreno</span>
                            </td>
                            <td className="py-4 px-6 text-gray-900 bg-emerald-50/20">
                              {techA.plumbingRequired ? (
                                <span className="text-amber-900 font-bold">Obrigatório ponto pressurizado + ralo</span>
                              ) : (
                                <span className="font-bold text-[#15803d]">✓ Totalmente a seco (Dispensa tubulações)</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-gray-900 bg-teal-50/20">
                              {techB.plumbingRequired ? (
                                <span className="text-amber-900 font-bold">Obrigatório ponto pressurizado + ralo</span>
                              ) : (
                                <span className="font-bold text-[#15803d]">✓ Totalmente a seco (Dispensa tubulações)</span>
                              )}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* SECTION: ENGINEERING & ACOUSTICS */}
                      {(activeAnalysisTab === 'all' || activeAnalysisTab === 'engineering') && (
                        <>
                          <tr className="bg-gray-100/70 font-bold text-[11px] uppercase tracking-wider text-gray-700">
                            <td colSpan={3} className="py-2.5 px-6">
                              2. Engenharia Construtiva, Acústica & Segurança
                            </td>
                          </tr>

                          {/* Absorção Acústica NRC */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Volume2 className="w-4 h-4 text-purple-600" />
                              <span>Absorção Acústica (NRC)</span>
                            </td>
                            <td className="py-4 px-6 bg-emerald-50/20">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#072a1a] text-sm">NRC {techA.acousticNRC}</span>
                                {techA.acousticNRC >= techB.acousticNRC && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                                    + Alto Desempenho
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-600 block mt-0.5">{techA.acousticLabel}</span>
                            </td>
                            <td className="py-4 px-6 bg-teal-50/20">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-teal-950 text-sm">NRC {techB.acousticNRC}</span>
                                {techB.acousticNRC > techA.acousticNRC && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-900">
                                    + Alto Desempenho
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-gray-600 block mt-0.5">{techB.acousticLabel}</span>
                            </td>
                          </tr>

                          {/* Peso Estrutural */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Scale className="w-4 h-4 text-gray-600" />
                              <span>Carga na Parede (Peso por m²)</span>
                            </td>
                            <td className="py-4 px-6 bg-emerald-50/20">
                              <span className="font-bold text-gray-950">~{techA.structuralWeightKgM2} kg/m²</span>
                              <span className="text-[11px] text-gray-500 block mt-0.5">{techA.structuralNote}</span>
                            </td>
                            <td className="py-4 px-6 bg-teal-50/20">
                              <span className="font-bold text-gray-950">~{techB.structuralWeightKgM2} kg/m²</span>
                              <span className="text-[11px] text-gray-500 block mt-0.5">{techB.structuralNote}</span>
                            </td>
                          </tr>

                          {/* Exposição Solar & UV */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Sun className="w-4 h-4 text-amber-500" />
                              <span>Comportamento com Luz Solar & UV</span>
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-emerald-50/20">
                              <span className="font-semibold block">{techA.solarTolerance}</span>
                              <span className="text-[11px] text-gray-500">{techA.lightingRequirement}</span>
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-teal-50/20">
                              <span className="font-semibold block">{techB.solarTolerance}</span>
                              <span className="text-[11px] text-gray-500">{techB.lightingRequirement}</span>
                            </td>
                          </tr>

                          {/* Fogo & Laudos IPT */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Flame className="w-4 h-4 text-red-500" />
                              <span>Classificação ao Fogo & Laudos IPT</span>
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-emerald-50/20 font-medium">
                              {techA.fireRating}
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-teal-50/20 font-medium">
                              {techB.fireRating}
                            </td>
                          </tr>

                          {/* Velocidade de Instalação */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-emerald-700" />
                              <span>Tempo de Obra & Instalação</span>
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-emerald-50/20 font-medium">
                              {techA.installationSpeed}
                            </td>
                            <td className="py-4 px-6 text-gray-800 bg-teal-50/20 font-medium">
                              {techB.installationSpeed}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* SECTION: SUSTAINABILITY & CERTIFICATIONS */}
                      {(activeAnalysisTab === 'all' || activeAnalysisTab === 'sustainability') && (
                        <>
                          <tr className="bg-gray-100/70 font-bold text-[11px] uppercase tracking-wider text-gray-700">
                            <td colSpan={3} className="py-2.5 px-6">
                              3. Certificações Ambientais & Sustentabilidade
                            </td>
                          </tr>

                          {/* WELL Score */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-600" />
                              <span>Score WELL v2 (Mind, Light, Sound)</span>
                            </td>
                            <td className="py-4 px-6 bg-emerald-50/20">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#072a1a] text-base">{techA.wellScore} pts</span>
                                <span className="text-[10px] font-bold text-gray-500">/ 100</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 bg-teal-50/20">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-teal-950 text-base">{techB.wellScore} pts</span>
                                <span className="text-[10px] font-bold text-gray-500">/ 100</span>
                              </div>
                            </td>
                          </tr>

                          {/* LEED Credits */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <Award className="w-4 h-4 text-[#15803d]" />
                              <span>Créditos LEED v4.1 Homologados</span>
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-900 bg-emerald-50/20">
                              Até {techA.leedCredits} Créditos Elegíveis
                            </td>
                            <td className="py-4 px-6 font-bold text-gray-900 bg-teal-50/20">
                              Até {techB.leedCredits} Créditos Elegíveis
                            </td>
                          </tr>

                          {/* Garantia de Fábrica */}
                          <tr className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                              <span>Garantia de Fábrica All Green</span>
                            </td>
                            <td className="py-4 px-6 font-bold text-[#15803d] bg-emerald-50/20">
                              {techA.warrantyYears} Anos Certificados
                            </td>
                            <td className="py-4 px-6 font-bold text-[#15803d] bg-teal-50/20">
                              {techB.warrantyYears} {techB.warrantyYears === 1 ? 'Ano' : 'Anos Certificados'}
                            </td>
                          </tr>
                        </>
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>

            {/* CONSULTATIVE VERDICT & APPLICATION GUIDE */}
            <ScrollReveal animation="fade-up" delay={0.18} distance={20}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* When to pick Tech A */}
                <div className="bg-white p-6 rounded-3xl border-2 border-emerald-600/40 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#072a1a] flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-950">
                        Quando Especificar {techA.shortName}?
                      </h4>
                      <span className="text-[11px] text-gray-500 font-semibold">{techA.badge}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                    {techA.verdictRecommendation}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">
                      Principais Aplicações Ideais:
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {techA.bestFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* When to pick Tech B */}
                <div className="bg-white p-6 rounded-3xl border-2 border-teal-600/40 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-950 flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-gray-950">
                        Quando Especificar {techB.shortName}?
                      </h4>
                      <span className="text-[11px] text-gray-500 font-semibold">{techB.badge}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium bg-teal-50/60 p-3.5 rounded-2xl border border-teal-200">
                    {techB.verdictRecommendation}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">
                      Principais Aplicações Ideais:
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {techB.bestFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Bottom Actions Bar */}
            <ScrollReveal animation="fade-up" delay={0.2} distance={15}>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  id="btn-quote-bottom"
                  onClick={handleRequestQuote}
                  className="px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Solicitar Cotação Comparativa Customizada</span>
                </button>

                {onOpenSimulator && (
                  <button
                    type="button"
                    id="btn-sim-bottom"
                    onClick={onOpenSimulator}
                    className="px-6 py-3 bg-white hover:bg-emerald-50 text-gray-900 hover:text-[#072a1a] border border-gray-300 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-[#15803d]" />
                    <span>Testar no Simulador 3D</span>
                  </button>
                )}

                {onOpenPdfReport && (
                  <button
                    type="button"
                    id="btn-pdf-bottom"
                    onClick={onOpenPdfReport}
                    className="px-6 py-3 bg-white hover:bg-emerald-50 text-gray-900 hover:text-[#072a1a] border border-gray-300 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Award className="w-4 h-4 text-[#15803d]" />
                    <span>Emitir Laudo Executivo em PDF</span>
                  </button>
                )}
              </div>
            </ScrollReveal>

          </div>
        )}

        {/* MODE 2: CLASSIC FULL COMPARISON TABLE */}
        {viewMode === 'full-table' && (
          <div className="mt-8 space-y-6">
            
            {/* Filter Pills */}
            <ScrollReveal animation="fade-up" delay={0.1} distance={15}>
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
                <button
                  type="button"
                  onClick={() => setTechFilter('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    techFilter === 'all' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
                  }`}
                >
                  Todas as Tecnologias
                </button>
                <button
                  type="button"
                  onClick={() => setTechFilter('preservado')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    techFilter === 'preservado' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
                  }`}
                >
                  Preservado Natural
                </button>
                <button
                  type="button"
                  onClick={() => setTechFilter('permanente')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    techFilter === 'permanente' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
                  }`}
                >
                  Permanente UV Premium
                </button>
                <button
                  type="button"
                  onClick={() => setTechFilter('natural')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    techFilter === 'natural' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
                  }`}
                >
                  Natural Vivo
                </button>
              </div>
            </ScrollReveal>

            {/* Comparison Table Box */}
            <ScrollReveal animation="fade-up" delay={0.15} distance={25}>
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-x-auto">
                <table 
                  className="w-full text-left border-collapse min-w-[750px]"
                  role="table"
                  aria-label="Matriz Comparativa das Tecnologias Verticais All Green"
                >
                  <caption className="sr-only font-serif text-[#072a1a] font-bold py-2">
                    Matriz Comparativa Técnica entre Jardim Preservado 100% Natural, Permanente Anti-UV e Natural Vivo Hidropônico
                  </caption>
                  <thead>
                    <tr className="border-b border-gray-200 bg-emerald-50/60">
                      <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                        Critério de Especificação
                      </th>

                      {(techFilter === 'all' || techFilter === 'preservado') && (
                        <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 text-[#072a1a]">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-800" aria-hidden="true" />
                              Jardim Preservado
                            </span>
                            <span className="text-[10px] font-sans font-normal text-gray-600">
                              100% Botânico Natural Estabilizado
                            </span>
                          </div>
                        </th>
                      )}

                      {(techFilter === 'all' || techFilter === 'permanente') && (
                        <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 text-[#072a1a]">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-800" aria-hidden="true" />
                              Permanente Premium
                            </span>
                            <span className="text-[10px] font-sans font-normal text-gray-600">
                              Articulado Hiper-realista + Anti-UV
                            </span>
                          </div>
                        </th>
                      )}

                      {(techFilter === 'all' || techFilter === 'natural') && (
                        <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 text-gray-900">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-blue-800" aria-hidden="true" />
                              Natural Vivo
                            </span>
                            <span className="text-[10px] font-sans font-normal text-gray-600">
                              Hidropônico com Autoirrigação
                            </span>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                    {COMPARISON_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/40 transition-colors focus-within:bg-emerald-100/50">
                        
                        {/* Criterion */}
                        <th scope="row" className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2.5 text-left">
                          <span aria-hidden="true">{getIcon(row.iconName)}</span>
                          <span>{row.criterion}</span>
                        </th>

                        {/* Preservado */}
                        {(techFilter === 'all' || techFilter === 'preservado') && (
                          <td className="py-4 px-6 text-gray-900 font-medium">
                            {row.preservadoHighlight ? (
                              <span className="font-bold text-[#15803d]">
                                ✓ {row.preservadoHighlight}
                              </span>
                            ) : (
                              row.preservadoText
                            )}
                          </td>
                        )}

                        {/* Permanente */}
                        {(techFilter === 'all' || techFilter === 'permanente') && (
                          <td className="py-4 px-6 text-gray-900 font-medium">
                            {row.permanenteHighlight ? (
                              <span className="font-bold text-[#15803d]">
                                ✓ {row.permanenteHighlight}
                              </span>
                            ) : (
                              row.permanenteText
                            )}
                          </td>
                        )}

                        {/* Natural Vivo */}
                        {(techFilter === 'all' || techFilter === 'natural') && (
                          <td className="py-4 px-6 text-gray-800">
                            {row.naturalVivoText.includes('R$') ? (
                              <span className="text-amber-900 font-bold bg-amber-100/90 px-2.5 py-1 rounded border border-amber-300 inline-block">
                                {row.naturalVivoText}
                              </span>
                            ) : (
                              row.naturalVivoText
                            )}
                          </td>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>

          </div>
        )}

      </div>
    </section>
  );
};
