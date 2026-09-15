import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  Droplets,
  Calendar,
  FileSpreadsheet,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';

export type GrowthScenario = 'conservative' | 'optimistic';

export interface LongTermRoiArchitectChartProps {
  area: number; // m²
  employees: number;
  salary: number; // R$/mês
  industry: string;
  level: string;
  growthScenario: GrowthScenario;
  onScenarioChange?: (scenario: GrowthScenario) => void;
  estimatedInvestment: number; // Preserved initial CAPEX
  annualTotalGrossSavings: number;
  annualMaintenanceAvoided: number;
  paybackMonths: number;
  onOpenQuote?: (context?: string) => void;
  className?: string;
}

export interface LongTermDataPoint {
  year: number;
  label: string;
  retornoLiquidoAllGreen: number; // R$ (Cumulative net value: total savings - CAPEX)
  custoManutencaoConvencional: number; // R$ (Cumulative living wall maintenance cost)
  economiaOpexPura: number; // R$ (Cumulative pure maintenance/water savings)
  roiPercentual: number; // %
  destaque?: string;
}

export const LongTermRoiArchitectChart: React.FC<LongTermRoiArchitectChartProps> = ({
  area,
  employees,
  salary,
  industry,
  level,
  growthScenario,
  onScenarioChange,
  estimatedInvestment,
  annualTotalGrossSavings,
  annualMaintenanceAvoided,
  paybackMonths,
  onOpenQuote,
  className = '',
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<5 | 10 | 20>(10);
  const [activeSeries, setActiveSeries] = useState<{
    netRoi: boolean;
    conventionalOpex: boolean;
    avoidedOpex: boolean;
  }>({
    netRoi: true,
    conventionalOpex: true,
    avoidedOpex: true,
  });

  // Long-Term Model Parameters (5, 10 and 20 years)
  // Conventional living wall maintenance costs:
  // - Initial hydraulic infrastructure + waterproofing + pumps: ~R$ 750/m²
  // - Biweekly specialized gardener + pruning + organic fertilizer: ~R$ 200/m²/ano
  // - Water consumption & sewage charge: ~R$ 50/m²/ano
  // - Annual plant mortality replacement (15% to 20% dying plants/year): ~R$ 110/m²/ano
  // - Total conventional annual maintenance: ~R$ 360/m²/ano with 5% yearly inflation.
  const chartData = useMemo(() => {
    const years = [0, 1, 2, 3, 5, 8, 10, 15, 20];
    const inflationRate = growthScenario === 'optimistic' ? 0.055 : 0.045;
    const salaryGrowthRate = growthScenario === 'optimistic' ? 0.045 : 0.035;

    // Conventional initial extra cost for plumbing/drainage/waterproofing
    const conventionalInitialPlumbing = area * 680;
    const baseConventionalOpexPerM2 = growthScenario === 'optimistic' ? 380 : 320;

    let cumulativeGrossAllGreen = 0;
    let cumulativeConventionalCost = conventionalInitialPlumbing;
    let cumulativeAvoidedOpex = 0;

    const points: LongTermDataPoint[] = [];

    // Calculate year by year up to 20
    const yearlyMap: { [year: number]: { netAllGreen: number; convCost: number; avoidedOpex: number; roi: number } } = {};

    for (let y = 0; y <= 20; y++) {
      if (y === 0) {
        yearlyMap[0] = {
          netAllGreen: -estimatedInvestment,
          convCost: conventionalInitialPlumbing,
          avoidedOpex: 0,
          roi: -100,
        };
      } else {
        // Compounding factors
        const wageFactor = Math.pow(1 + salaryGrowthRate, y - 1);
        const inflationFactor = Math.pow(1 + inflationRate, y - 1);

        // All Green annual gross savings (grows with wage and energy rates)
        const yearGrossSavings = annualTotalGrossSavings * wageFactor;
        cumulativeGrossAllGreen += yearGrossSavings;

        // Conventional maintenance cost for this year
        const yearConventionalOpex = area * baseConventionalOpexPerM2 * inflationFactor;
        cumulativeConventionalCost += yearConventionalOpex;

        // Pure avoided maintenance
        const yearAvoidedOpex = annualMaintenanceAvoided * inflationFactor;
        cumulativeAvoidedOpex += yearAvoidedOpex;

        const netAllGreen = Math.round(cumulativeGrossAllGreen - estimatedInvestment);
        const roi = Math.round((netAllGreen / estimatedInvestment) * 100);

        yearlyMap[y] = {
          netAllGreen,
          convCost: Math.round(cumulativeConventionalCost),
          avoidedOpex: Math.round(cumulativeAvoidedOpex),
          roi,
        };
      }
    }

    years.forEach((y) => {
      const data = yearlyMap[y];
      let label = `Ano ${y}`;
      let destaque: string | undefined = undefined;

      if (y === 0) label = 'Implantação';
      else if (y === 5) {
        label = 'Ano 5';
        destaque = 'Ciclo 5 Anos';
      } else if (y === 10) {
        label = 'Ano 10';
        destaque = 'Vida Útil Preservada';
      } else if (y === 20) {
        label = 'Ano 20';
        destaque = 'Longevidade Patrimonial';
      }

      points.push({
        year: y,
        label,
        retornoLiquidoAllGreen: data.netAllGreen,
        custoManutencaoConvencional: data.convCost,
        economiaOpexPura: data.avoidedOpex,
        roiPercentual: data.roi,
        destaque,
      });
    });

    return points;
  }, [area, estimatedInvestment, annualTotalGrossSavings, annualMaintenanceAvoided, growthScenario]);

  // Key Milestone Metrics (5, 10 and 20 years)
  const milestone5 = chartData.find((p) => p.year === 5)!;
  const milestone10 = chartData.find((p) => p.year === 10)!;
  const milestone20 = chartData.find((p) => p.year === 20)!;

  const currentMilestoneData =
    selectedMilestone === 5 ? milestone5 : selectedMilestone === 10 ? milestone10 : milestone20;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: LongTermDataPoint = payload[0].payload;
      return (
        <div className="bg-[#072a1a] text-white p-3.5 rounded-2xl border border-emerald-500/50 shadow-2xl max-w-xs text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-1.5">
            <span className="font-bold text-[#86efac] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              {item.year === 0 ? 'Ano 0 (Implantação Inicial)' : `Marco de ${item.year} Anos`}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-900 text-emerald-200 border border-emerald-700">
              {growthScenario === 'optimistic' ? 'Cenário Otimista' : 'Cenário Conservador'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                Retorno Líquido All Green:
              </span>
              <span
                className={`font-mono font-extrabold ${
                  item.retornoLiquidoAllGreen >= 0 ? 'text-[#86efac]' : 'text-orange-300'
                }`}
              >
                R$ {item.retornoLiquidoAllGreen.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
                Custo Manutenção Convencional:
              </span>
              <span className="font-mono font-extrabold text-red-300">
                R$ {item.custoManutencaoConvencional.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                Economia em OPEX Evitado:
              </span>
              <span className="font-mono font-extrabold text-sky-300">
                R$ {item.economiaOpexPura.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-emerald-900/70">
              <span className="text-gray-300">ROI Histórico Acumulado:</span>
              <span className="font-mono font-extrabold text-amber-300">
                {item.roiPercentual >= 0 ? `+${item.roiPercentual}%` : `${item.roiPercentual}%`}
              </span>
            </div>
          </div>

          {item.destaque && (
            <div className="p-1.5 bg-emerald-950/80 rounded-lg text-[10px] text-emerald-300 font-medium text-center border border-emerald-800/60">
              ★ {item.destaque}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Architect Badge & Sensitivity Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#072a1a] flex items-center justify-center text-[#86efac] shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>Projeção Histórica a Longo Prazo (5, 10 e 20 Anos)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-[#15803d] border border-emerald-300">
                  Dossiê para Arquitetos
                </span>
              </h4>
              <p className="text-[11px] text-gray-500">
                Retorno acumulado do design biofílico preservado versus despesas contínuas de manutenção de jardins vivos.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Sensitivity Toggle: Conservative vs Optimistic */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-gray-600 hidden md:inline">Cenário:</span>
          <div className="flex items-center p-1 bg-white rounded-xl border border-gray-300 shadow-2xs">
            <button
              type="button"
              onClick={() => onScenarioChange?.('conservative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                growthScenario === 'conservative'
                  ? 'bg-[#072a1a] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Conservador</span>
            </button>
            <button
              type="button"
              onClick={() => onScenarioChange?.('optimistic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                growthScenario === 'optimistic'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Otimista</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Executive Milestone Cards for Architects (5, 10, 20 Years) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Milestone 5 Years */}
        <button
          type="button"
          onClick={() => setSelectedMilestone(5)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedMilestone === 5
              ? 'bg-emerald-50/90 border-[#15803d] shadow-md ring-2 ring-[#15803d]/20'
              : 'bg-white border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[#072a1a] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#15803d]" />
              Marco de 5 Anos
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white text-[#15803d] border border-emerald-200">
              Curto/Médio Prazo
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-mono font-extrabold text-[#15803d]">
              R$ {milestone5.retornoLiquidoAllGreen.toLocaleString('pt-BR')}
            </div>
            <p className="text-[11px] text-gray-500">Saldo Líquido Acumulado (ROI: +{milestone5.roiPercentual}%)</p>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Custo Convencional Evitado:</span>
            <span className="font-mono font-bold text-red-600">
              R$ {milestone5.custoManutencaoConvencional.toLocaleString('pt-BR')}
            </span>
          </div>
        </button>

        {/* Milestone 10 Years */}
        <button
          type="button"
          onClick={() => setSelectedMilestone(10)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedMilestone === 10
              ? 'bg-emerald-50/90 border-[#15803d] shadow-md ring-2 ring-[#15803d]/20'
              : 'bg-white border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[#072a1a] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
              Marco de 10 Anos
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white text-[#15803d] border border-emerald-200">
              Vida Útil Preservada
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-mono font-extrabold text-[#15803d]">
              R$ {milestone10.retornoLiquidoAllGreen.toLocaleString('pt-BR')}
            </div>
            <p className="text-[11px] text-gray-500">Saldo Líquido Acumulado (ROI: +{milestone10.roiPercentual}%)</p>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Custo Convencional Evitado:</span>
            <span className="font-mono font-bold text-red-600">
              R$ {milestone10.custoManutencaoConvencional.toLocaleString('pt-BR')}
            </span>
          </div>
        </button>

        {/* Milestone 20 Years */}
        <button
          type="button"
          onClick={() => setSelectedMilestone(20)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            selectedMilestone === 20
              ? 'bg-emerald-50/90 border-[#15803d] shadow-md ring-2 ring-[#15803d]/20'
              : 'bg-white border-gray-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[#072a1a] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#15803d]" />
              Marco de 20 Anos
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white text-[#15803d] border border-emerald-200">
              Longevidade Plena
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-mono font-extrabold text-[#15803d]">
              R$ {milestone20.retornoLiquidoAllGreen.toLocaleString('pt-BR')}
            </div>
            <p className="text-[11px] text-gray-500">Saldo Líquido Acumulado (ROI: +{milestone20.roiPercentual}%)</p>
          </div>

          <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Custo Convencional Evitado:</span>
            <span className="font-mono font-bold text-red-600">
              R$ {milestone20.custoManutencaoConvencional.toLocaleString('pt-BR')}
            </span>
          </div>
        </button>
      </div>

      {/* Main Interactive Recharts Line Chart */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              Curva Histórica de Valor Acumulado: Preservado x Custos de Jardim Vivo
            </span>
            <span className="text-[11px] text-gray-500">
              Linha contínua verde = Retorno Líquido All Green | Linha tracejada vermelha = Custo acumulado de manutenção tradicional
            </span>
          </div>

          {/* Visibility Toggles for Chart Series */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSeries((s) => ({ ...s, netRoi: !s.netRoi }))}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSeries.netRoi
                  ? 'bg-emerald-50 text-[#15803d] border-emerald-300'
                  : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#15803d]" />
              <span>Retorno All Green</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSeries((s) => ({ ...s, conventionalOpex: !s.conventionalOpex }))}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSeries.conventionalOpex
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
              <span>Manutenção Convencional</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSeries((s) => ({ ...s, avoidedOpex: !s.avoidedOpex }))}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSeries.avoidedOpex
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-gray-100 text-gray-400 border-gray-200 line-through'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
              <span>Economia OPEX Evitado</span>
            </button>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                label={{
                  value: 'Ciclo de Vida do Empreendimento (Anos)',
                  position: 'insideBottom',
                  offset: -12,
                  fontSize: 11,
                  fill: '#475569',
                  fontWeight: 600,
                }}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `R$${Math.round(val / 1000)}k`}
                label={{
                  value: 'Valor Financeiro Acumulado (R$)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 5,
                  fontSize: 11,
                  fill: '#475569',
                  fontWeight: 600,
                }}
              />

              <RechartsTooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                verticalAlign="top"
                align="right"
              />

              {/* Breakeven / Zero Axis Reference Line */}
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="2 2" />

              {/* Selected Milestone Reference Dots */}
              <ReferenceDot
                x={selectedMilestone === 5 ? 'Ano 5' : selectedMilestone === 10 ? 'Ano 10' : 'Ano 20'}
                y={currentMilestoneData.retornoLiquidoAllGreen}
                r={6}
                fill="#15803d"
                stroke="#ffffff"
                strokeWidth={2}
              />

              {/* Line 1: Retorno Líquido All Green (Preserved) */}
              {activeSeries.netRoi && (
                <Line
                  type="monotone"
                  dataKey="retornoLiquidoAllGreen"
                  name="Retorno Líquido Biofílico (All Green)"
                  stroke="#15803d"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#15803d', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              )}

              {/* Line 2: Custo Acumulado de Manutenção Convencional (Living Wall) */}
              {activeSeries.conventionalOpex && (
                <Line
                  type="monotone"
                  dataKey="custoManutencaoConvencional"
                  name="Custo Manutenção Tradicional (Jardim Vivo)"
                  stroke="#dc2626"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#dc2626' }}
                />
              )}

              {/* Line 3: Economia Pura em OPEX Predial Evitado */}
              {activeSeries.avoidedOpex && (
                <Line
                  type="monotone"
                  dataKey="economiaOpexPura"
                  name="Economia Pura em Facilities Evitada"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#0284c7' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer info & comparison summary */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Scale className="w-4 h-4 text-[#15803d] shrink-0" />
            <span>
              No horizonte de <strong>{selectedMilestone} anos</strong>, a economia pura de água e jardineiros atinge{' '}
              <strong className="text-[#072a1a] font-mono">
                R$ {currentMilestoneData.economiaOpexPura.toLocaleString('pt-BR')}
              </strong>
              , superando o investimento inicial em{' '}
              <strong className="text-[#15803d] font-mono">
                {Math.round((currentMilestoneData.economiaOpexPura / estimatedInvestment) * 100)}%
              </strong>
              .
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenQuote?.(`Proposta técnica com análise de ciclo de vida de ${selectedMilestone} anos (${area} m²)`)}
            className="px-3 py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Incluir no Memorial Descritivo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Architect's Argumentation & Value Presentation Board */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#15803d]" />
            <h5 className="text-xs font-bold text-[#072a1a] uppercase tracking-wider">
              Argumentação Técnica para Apresentação a Clientes & Diretoria (CAPEX vs. OPEX)
            </h5>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Dossiê de Decisão
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>Zero Risco de Infiltração</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Sem tubulações hidráulicas ou bombas embutidas atrás de drywall. Risco zero de vazamento em lajes corporativas.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>OPEX Predial Previsível</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Elimina aditivos de jardineiros quinzenais e taxas constantes de replantio de mudas mortas (saving de ~R$ 360/m²/a).
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Estabilidade Estética 10+ Anos</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Folhagens 100% naturais preservadas por glicerina botânica. Não perdem cor nem densidade ao longo das estações.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Pontos WELL v2 Garantidos</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Pontuação válida no conceito Mind M02 sem a necessidade de auditorias semestrais de rega e controle de pragas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongTermRoiArchitectChart;
