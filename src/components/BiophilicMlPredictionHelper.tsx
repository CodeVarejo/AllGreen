import React, { useState, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Maximize2,
  Sliders,
  Layers,
  Volume2,
  Zap,
  ShieldCheck,
  TrendingUp,
  Download,
  RotateCcw,
  CheckCircle2,
  Info,
  DollarSign,
  Users,
  Award,
  ArrowRight,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { jsPDF } from 'jspdf';
import {
  predictOptimalBiophilicBudget,
  BIOPHILIC_FEATURES,
  ROOM_PRESETS,
  RoomPresetType,
  OptimizationGoal,
  BiophilicFeatureId,
  MlPredictionResult
} from '../utils/biophilicMlEngine';

export interface BiophilicMlPredictionHelperProps {
  onApplyToCalculator?: (suggestedArea: number, suggestedEmployees: number, suggestedLevel: 'accent' | 'core' | 'immersive') => void;
  onOpenQuote?: (context?: string) => void;
  className?: string;
}

export const BiophilicMlPredictionHelper: React.FC<BiophilicMlPredictionHelperProps> = ({
  onApplyToCalculator,
  onOpenQuote,
  className = '',
}) => {
  // Dimension States
  const [selectedPreset, setSelectedPreset] = useState<RoomPresetType>('open_space');
  const [width, setWidth] = useState<number>(12); // meters
  const [length, setLength] = useState<number>(8); // meters
  const [height, setHeight] = useState<number>(3.2); // meters
  const [headcount, setHeadcount] = useState<number>(35); // people

  // Feature Selection
  const [selectedFeatures, setSelectedFeatures] = useState<BiophilicFeatureId[]>([
    'vertical_wall',
    'moss_acoustic',
    'ceiling_baffles',
    'understory_planters',
  ]);

  // Optimization Target
  const [optimizationGoal, setOptimizationGoal] = useState<OptimizationGoal>('balanced');
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  // Apply Preset
  const handleSelectPreset = (presetId: RoomPresetType) => {
    setSelectedPreset(presetId);
    const p = ROOM_PRESETS[presetId];
    setWidth(p.width);
    setLength(p.length);
    setHeight(p.height);
    setHeadcount(p.typicalHeadcount);
    setSelectedFeatures(p.recommendedFeatures);
  };

  // Toggle Feature
  const handleToggleFeature = (featureId: BiophilicFeatureId) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(featureId)) {
        if (prev.length <= 1) return prev; // keep at least one
        return prev.filter((id) => id !== featureId);
      } else {
        return [...prev, featureId];
      }
    });
  };

  // ML Prediction calculation
  const prediction: MlPredictionResult = useMemo(() => {
    return predictOptimalBiophilicBudget(
      width,
      length,
      height,
      headcount,
      selectedFeatures,
      optimizationGoal
    );
  }, [width, length, height, headcount, selectedFeatures, optimizationGoal]);

  // Handle Apply to Calculator
  const handleApply = () => {
    if (!onApplyToCalculator) return;

    // Calculate suggested preserved wall area from prediction allocations
    const wallItem = prediction.allocations.find((a) => a.featureId === 'vertical_wall');
    const mossItem = prediction.allocations.find((a) => a.featureId === 'moss_acoustic');
    const combinedArea = Math.round(
      (wallItem?.recommendedQuantity || 0) + (mossItem?.recommendedQuantity || 0)
    );
    const finalArea = Math.max(6, Math.min(120, combinedArea || Math.round(prediction.floorArea * 0.15)));

    // Choose level based on coverage and features
    let level: 'accent' | 'core' | 'immersive' = 'core';
    if (prediction.allocations.length >= 4 || prediction.budgetPerFloorM2 > 650) {
      level = 'immersive';
    } else if (prediction.allocations.length <= 2 && prediction.budgetPerFloorM2 < 450) {
      level = 'accent';
    }

    onApplyToCalculator(finalArea, headcount, level);
    setAppliedNotification(true);
    setTimeout(() => {
      setAppliedNotification(false);
    }, 4000);
  };

  // Generate & Download ML Allocation Report (PDF)
  const handleDownloadMlReport = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryColor = [7, 42, 26]; // #072a1a
      const accentColor = [21, 128, 61]; // #15803d
      const grayColor = [100, 116, 139];

      // Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ALL GREEN • PREDIÇÃO DE ALOCAÇÃO BIÓFILA ML', 14, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Relatório Técnico de Otimização Paramétrica & Alocação de Verba', 14, 23);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')} • Algoritmo: ${prediction.algorithmName}`, 14, 28);

      // Section: Dimensões do Ambiente
      let y = 42;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. Geometria & Parâmetros do Ambiente', 14, y);

      y += 6;
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, y, 182, 26, 3, 3, 'FD');

      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Dimensões: ${width}m (largura) × ${length}m (comprimento) × ${height}m (pé-direito)`, 18, y + 7);
      doc.text(`Área de Piso: ${prediction.floorArea} m² • Área Total de Paredes: ${prediction.wallArea} m² • Volume: ${prediction.roomVolume} m³`, 18, y + 13);
      doc.text(`Lotação Planejada: ${headcount} colaboradores (${(prediction.floorArea / headcount).toFixed(1)} m²/pessoa)`, 18, y + 19);
      doc.text(`Acústica RT60: Inicial ${prediction.baselineRt60}s → Projetado ${prediction.predictedRt60}s (Redução de ${prediction.rt60ReductionPct}%)`, 18, y + 25);

      // Section: Resumo da Recomendação ML
      y += 34;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. Recomendação de Investimento Otimizado (Machine Learning)', 14, y);

      y += 6;
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(14, y, 182, 22, 3, 3, 'FD');

      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`Investimento Total Sugerido: R$ ${prediction.totalRecommendedBudget.toLocaleString('pt-BR')}`, 18, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Faixa Ótima: R$ ${prediction.budgetRangeMin.toLocaleString('pt-BR')} a R$ ${prediction.budgetRangeMax.toLocaleString('pt-BR')} (R$ ${prediction.budgetPerFloorM2}/m² de piso)`, 18, y + 14);
      doc.text(`ROI Estimado em 3 Anos: +${prediction.predicted3YearRoiPct}% • Payback: ${prediction.predictedPaybackMonths} meses • Confiança: ${prediction.modelConfidencePct}%`, 18, y + 19);

      // Section: Detalhamento da Alocação
      y += 30;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('3. Alocação Ótima por Feature Biofílica', 14, y);

      y += 6;
      prediction.allocations.forEach((item) => {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, 182, 16, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`${item.name} (${item.allocatedPercentage}%)`, 18, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text(`R$ ${item.allocatedBudget.toLocaleString('pt-BR')}`, 155, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(`Dimensão: ${item.recommendedQuantity} ${item.unitLabel} • ${item.keyBenefit}`, 18, y + 11);

        y += 19;
      });

      // Section: Diagnóstico e Justificativa
      y += 4;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('4. Racional da Otimização Algorítmica', 14, y);

      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitText = doc.splitTextToSize(prediction.optimizationRationale, 182);
      doc.text(splitText, 14, y);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('All Green Biofilia Corporativa • contato@allgreen.com.br • www.allgreen.com.br', 14, 287);

      doc.save(`AllGreen_Previsao_ML_Alocacao_${width}x${length}m.pdf`);
    } catch (err) {
      console.error('Erro ao gerar relatório ML PDF:', err);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Top Banner: Explaining the ML Helper */}
      <div className="bg-gradient-to-r from-[#072a1a] via-[#0d3822] to-[#15803d] rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
              <Brain className="w-3.5 h-3.5 text-emerald-300" />
              <span>ALGORITMO PREDITIVO DE BIOFILIA & ESPAÇO</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Preditor de Alocação de Verba por Machine Learning
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              O modelo <strong>GBBA v3.2</strong> correlaciona as dimensões volumétricas da sua sala com 
              as soluções biofílicas selecionadas para prever a distribuição de investimento com maior retorno acústico, 
              bem-estar WELL v2 e payback financeiro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadMlReport}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Exportar Laudo ML (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2.5 rounded-xl bg-[#86efac] hover:bg-[#4ade80] text-[#072a1a] text-xs font-extrabold transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#072a1a]" />
              <span>Aplicar à Calculadora de ROI</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {appliedNotification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/90 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>
              Parâmetros sincronizados com sucesso! A área recomendada de vegetação vertical e o headcount foram aplicados na calculadora geral.
            </span>
          </div>
        )}
      </div>

      {/* Main ML Layout: Left Controls & Right Predictive Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Dimensions & Features Input (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
          
          {/* Preset Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#15803d]" /> Tipologia do Espaço:
              </label>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Preset Ativo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(ROOM_PRESETS) as RoomPresetType[]).map((key) => {
                const p = ROOM_PRESETS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectPreset(key)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer truncate ${
                      selectedPreset === key
                        ? 'bg-[#072a1a] text-white border-[#072a1a] shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400'
                    }`}
                    title={p.desc}
                  >
                    <div className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}</div>
                    <div className="text-[9px] opacity-75 font-mono">
                      {p.width}x{p.length}m • {p.typicalHeadcount}p
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            
            {/* Width */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Largura da Sala:</span>
                <span className="font-mono text-[#15803d] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                  {width} metros
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={25}
                step={0.5}
                value={width}
                onChange={(e) => {
                  setWidth(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
              />
            </div>

            {/* Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Comprimento da Sala:</span>
                <span className="font-mono text-[#15803d] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                  {length} metros
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={30}
                step={0.5}
                value={length}
                onChange={(e) => {
                  setLength(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
              />
            </div>

            {/* Ceiling Height */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1">
                  Pé-direito (Altura):
                  {height >= 3.2 && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                      Eco Elevado
                    </span>
                  )}
                </span>
                <span className="font-mono text-[#15803d] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                  {height} metros
                </span>
              </div>
              <input
                type="range"
                min={2.4}
                max={5.5}
                step={0.1}
                value={height}
                onChange={(e) => {
                  setHeight(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
              />
            </div>

            {/* Headcount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Lotação de Pessoas:</span>
                <span className="font-mono text-[#15803d] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">
                  {headcount} colaboradores
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={100}
                step={1}
                value={headcount}
                onChange={(e) => {
                  setHeadcount(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
              />
            </div>
          </div>

          {/* Real-time Geometry Telemetry Box */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-semibold">Área Piso</span>
              <span className="font-mono text-sm font-bold text-gray-900">{prediction.floorArea} m²</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-semibold">Paredes Totais</span>
              <span className="font-mono text-sm font-bold text-gray-900">{prediction.wallArea} m²</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-semibold">Volume</span>
              <span className="font-mono text-sm font-bold text-gray-900">{prediction.roomVolume} m³</span>
            </div>
          </div>

          {/* Biophilic Features Multi-Select */}
          <div className="space-y-2.5 pt-1 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center justify-between">
              <span>Recursos Biofílicos Desejados:</span>
              <span className="text-[10px] font-normal text-gray-500 lowercase">
                {selectedFeatures.length} de {Object.keys(BIOPHILIC_FEATURES).length} ativos
              </span>
            </label>

            <div className="space-y-1.5">
              {(Object.keys(BIOPHILIC_FEATURES) as BiophilicFeatureId[]).map((featId) => {
                const feat = BIOPHILIC_FEATURES[featId];
                const isSelected = selectedFeatures.includes(featId);

                return (
                  <button
                    key={featId}
                    type="button"
                    onClick={() => handleToggleFeature(featId)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-400 text-gray-900 shadow-2xs'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#072a1a] text-[#86efac]' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {featId === 'vertical_wall' && <Layers className="w-3.5 h-3.5" />}
                        {featId === 'moss_acoustic' && <Volume2 className="w-3.5 h-3.5" />}
                        {featId === 'ceiling_baffles' && <Maximize2 className="w-3.5 h-3.5" />}
                        {featId === 'understory_planters' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {featId === 'circadian_lighting' && <Zap className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-gray-900">{feat.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{feat.tagline}</div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-bold">
                        NRC {feat.nrcCoeff}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#15803d] border-[#15803d] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Priority Selector */}
          <div className="space-y-1.5 pt-1 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Diretriz de Otimização da Verba:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'balanced', label: 'Equilibrado (Ótimo Geral)' },
                { id: 'acoustic', label: 'Conforto Acústico (NRC)' },
                { id: 'well_leed', label: 'Selos WELL & LEED' },
                { id: 'fast_payback', label: 'Retorno Rápido (Payback)' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setOptimizationGoal(g.id as OptimizationGoal)}
                  className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all cursor-pointer ${
                    optimizationGoal === g.id
                      ? 'bg-[#072a1a] text-white border-[#072a1a] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Machine Learning Optimal Allocations & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Top Prediction Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-[#15803d]" />
                  Orçamento Total Sugerido pelo Modelo ML
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-[#072a1a] tracking-tight mt-0.5">
                  R$ {prediction.totalRecommendedBudget.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Faixa de viabilidade: <strong>R$ {prediction.budgetRangeMin.toLocaleString('pt-BR')}</strong> a{' '}
                  <strong>R$ {prediction.budgetRangeMax.toLocaleString('pt-BR')}</strong> (R$ {prediction.budgetPerFloorM2}/m² de piso)
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 shrink-0 text-right">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Índice de Confiança ML
                </div>
                <div className="text-2xl font-mono font-extrabold text-[#15803d]">
                  {prediction.modelConfidencePct}%
                </div>
                <div className="text-[10px] text-gray-600">R² = 0.942 em 240+ retrofits</div>
              </div>
            </div>

            {/* AI Optimization Rationale Quote */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5 leading-relaxed">
              <Sparkles className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block mb-0.5">Racional de Otimização Algorítmica:</strong>
                {prediction.optimizationRationale}
              </div>
            </div>

            {/* Visual Budget Allocation Chart (Horizontal Bar) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Distribuição Percentual da Verba:</span>
                <span className="text-gray-500 font-normal">Soma = 100%</span>
              </div>

              {/* Segmented bar */}
              <div className="h-5 w-full bg-gray-100 rounded-xl overflow-hidden flex shadow-inner">
                {prediction.allocations.map((item) => (
                  <div
                    key={item.featureId}
                    style={{
                      width: `${item.allocatedPercentage}%`,
                      backgroundColor: item.color,
                    }}
                    className="h-full transition-all duration-500 relative group cursor-pointer hover:opacity-90"
                    title={`${item.name}: R$ ${item.allocatedBudget.toLocaleString('pt-BR')} (${item.allocatedPercentage}%)`}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {prediction.allocations.map((item) => (
                  <div key={item.featureId} className="flex items-center gap-1.5 text-[11px] text-gray-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span>{item.shortName}</span>
                    <span className="font-mono font-bold text-gray-900">({item.allocatedPercentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Allocations Detailed Cards */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Especificação Recomendada por Feature:
              </div>

              <div className="space-y-2">
                {prediction.allocations.map((item) => (
                  <div
                    key={item.featureId}
                    className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-bold text-gray-900 truncate">{item.name}</span>
                        <span className="font-mono text-[10px] text-gray-600 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                          {item.recommendedQuantity} {item.unitLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug">
                        {item.keyBenefit}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-base font-extrabold text-[#072a1a]">
                        R$ {item.allocatedBudget.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Margem ROI {item.marginalRoiScore}/100
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 4 Predicted Impact Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* 1. Acoustic RT60 Reduction */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Reverberação
              </span>
              <div className="font-mono text-lg font-extrabold text-[#0284c7]">
                -{prediction.rt60ReductionPct}%
              </div>
              <p className="text-[10px] text-gray-600">
                De {prediction.baselineRt60}s para <strong>{prediction.predictedRt60}s</strong>
              </p>
            </div>

            {/* 2. Predicted 3-Year ROI */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> ROI 3 Anos
              </span>
              <div className="font-mono text-lg font-extrabold text-[#15803d]">
                +{prediction.predicted3YearRoiPct}%
              </div>
              <p className="text-[10px] text-gray-600">
                Payback em <strong>{prediction.predictedPaybackMonths} meses</strong>
              </p>
            </div>

            {/* 3. Productivity */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3" /> Foco Cognitivo
              </span>
              <div className="font-mono text-lg font-extrabold text-[#d97706]">
                +{prediction.predictedProductivityGainPct}%
              </div>
              <p className="text-[10px] text-gray-600">
                Harvard COGfx model
              </p>
            </div>

            {/* 4. WELL v2 Compliance */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> WELL v2 M02
              </span>
              <div className="font-mono text-lg font-extrabold text-[#0f766e]">
                {prediction.wellCompliancePct}%
              </div>
              <p className="text-[10px] text-gray-600">
                +{prediction.leedCreditsEstimate} créditos LEED v4
              </p>
            </div>

          </div>

          {/* Action Footer Callouts */}
          <div className="p-4 rounded-3xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-600 text-center sm:text-left">
              Deseja que nossa equipe de engenharia biofílica audite as dimensões in loco?
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenQuote?.(`Consultoria Paramétrica ML: ${prediction.floorArea}m² (${width}x${length}m) - Orçamento Recomendado R$ ${prediction.totalRecommendedBudget.toLocaleString('pt-BR')}`)}
                className="px-3.5 py-2 rounded-xl bg-[#072a1a] text-[#86efac] text-xs font-bold hover:bg-[#15803d] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Solicitar Validação Técnica</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default BiophilicMlPredictionHelper;
