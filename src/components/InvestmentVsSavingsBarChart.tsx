import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

export interface InvestmentVsSavingsBarChartProps {
  area: number;
  employees: number;
  salary: number;
  estimatedInvestment: number;
  annualTotalGrossSavings: number;
  annualMaintenanceAvoided: number;
  annualProductivityGainValue: number;
  annualAbsenteeismSavings: number;
  annualTurnoverSavings: number;
  annualHvacSavings: number;
  growthScenario: 'conservative' | 'optimistic';
  paybackMonths: number;
  onOpenQuote?: (context?: string) => void;
  className?: string;
}

export interface BarComparisonPoint {
  year: number;
  label: string;
  investimento: number; // Cumulative Capex
  economiaAcumulada: number; // Cumulative operational savings
  economiaAnual: number; // Isolated year savings
  saldoLiquido: number; // Cumulative savings - Capex
  isPaybackYear: boolean;
}

export const InvestmentVsSavingsBarChart: React.FC<InvestmentVsSavingsBarChartProps> = ({
  area,
  employees,
  salary,
  estimatedInvestment,
  annualTotalGrossSavings,
  annualMaintenanceAvoided,
  annualProductivityGainValue,
  annualAbsenteeismSavings,
  annualTurnoverSavings,
  annualHvacSavings,
  growthScenario,
  paybackMonths,
  onOpenQuote,
  className = '',
}) => {
  // Toggle between 5-Year and 10-Year Projections as requested
  const [timeHorizon, setTimeHorizon] = useState<5 | 10>(5);
  // View metric mode: cumulative comparison vs isolated annual
  const [viewMode, setViewMode] = useState<'cumulative' | 'annual'>('cumulative');

  // Annual inflation and salary escalation rate
  const annualInflationRate = growthScenario === 'optimistic' ? 0.05 : 0.035;

  // Generate multi-year data for 5 or 10 years
  const chartData = useMemo<BarComparisonPoint[]>(() => {
    const data: BarComparisonPoint[] = [];
    let runningGrossSavings = 0;
    const paybackYearFloat = paybackMonths / 12;

    for (let yr = 1; yr <= timeHorizon; yr++) {
      // Annual compounding factor
      const compoundingFactor = Math.pow(1 + annualInflationRate, yr - 1);
      const isolatedYearSavings = Math.round(annualTotalGrossSavings * compoundingFactor);
      runningGrossSavings += isolatedYearSavings;

      const isPaybackYear = yr === Math.ceil(paybackYearFloat) || (yr === 1 && paybackMonths <= 12);

      data.push({
        year: yr,
        label: `Ano ${yr}`,
        // For All Green preserved walls, investment is 100% turnkey upfront Capex with zero irrigation upkeep
        investimento: viewMode === 'cumulative' ? estimatedInvestment : (yr === 1 ? estimatedInvestment : 0),
        economiaAcumulada: Math.round(runningGrossSavings),
        economiaAnual: isolatedYearSavings,
        saldoLiquido: Math.round(runningGrossSavings - estimatedInvestment),
        isPaybackYear,
      });
    }

    return data;
  }, [timeHorizon, annualInflationRate, annualTotalGrossSavings, estimatedInvestment, paybackMonths, viewMode]);

  // Aggregate metrics for selected horizon
  const horizonCumulativeSavings = chartData[chartData.length - 1]?.economiaAcumulada || 0;
  const horizonNetProfit = horizonCumulativeSavings - estimatedInvestment;
  const horizonRoiMultiple = estimatedInvestment > 0 ? Number((horizonCumulativeSavings / estimatedInvestment).toFixed(1)) : 0;
  const horizonRoiPercent = estimatedInvestment > 0 ? Math.round((horizonNetProfit / estimatedInvestment) * 100) : 0;

  // Custom Recharts Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: BarComparisonPoint = payload[0].payload;
      const isBreakevenReached = dataPoint.saldoLiquido >= 0;

      return (
        <div className="bg-[#071f14] text-white p-3.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs min-w-[240px] space-y-2 z-50">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
            <span className="font-serif font-bold text-sm text-[#86efac]">{dataPoint.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              isBreakevenReached ? 'bg-emerald-500/20 text-[#86efac] border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isBreakevenReached ? '✓ Payback Superado' : 'Período Pré-Payback'}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-center text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0d3822] border border-emerald-400" />
                Investimento Capex:
              </span>
              <span className="font-bold text-white">
                R$ {estimatedInvestment.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex justify-between items-center text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
                Economia Acumulada:
              </span>
              <span className="font-bold text-[#86efac]">
                R$ {dataPoint.economiaAcumulada.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-emerald-900/60">
              <span>Economia Isolada do Ano:</span>
              <span>R$ {dataPoint.economiaAnual.toLocaleString('pt-BR')}</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-emerald-900/80 font-bold">
              <span className="text-gray-200">Saldo Líquido Gerado:</span>
              <span className={dataPoint.saldoLiquido >= 0 ? 'text-[#86efac]' : 'text-amber-400'}>
                {dataPoint.saldoLiquido >= 0 ? '+' : ''}R$ {dataPoint.saldoLiquido.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-5 ${className}`}>
      
      {/* Top Controls Ribbon: 5-Year / 10-Year Toggle + View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gray-50/90 dark:bg-emerald-950/40 rounded-2xl border border-gray-200 dark:border-emerald-800/80">
        
        {/* Left: Section Title & Horizon Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
            <span className="font-serif font-bold text-sm text-gray-900 dark:text-white">
              Investimento vs. Economia Operacional
            </span>
          </div>

          {/* 5-Year vs. 10-Year Toggle Button Group */}
          <div className="flex items-center p-0.5 bg-white dark:bg-emerald-900/60 rounded-xl border border-gray-300 dark:border-emerald-800 shadow-2xs">
            <button
              type="button"
              id="btn-horizon-5-years"
              onClick={() => setTimeHorizon(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timeHorizon === 5
                  ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>5 Anos</span>
              <span className="text-[10px] opacity-75 font-normal">(Quinquenal)</span>
            </button>

            <button
              type="button"
              id="btn-horizon-10-years"
              onClick={() => setTimeHorizon(10)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                timeHorizon === 10
                  ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>10 Anos</span>
              <span className="text-[10px] opacity-75 font-normal">(Decenal)</span>
            </button>
          </div>
        </div>

        {/* Right: Mode Toggle (Cumulative vs Isolated Annual) */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Modo:</span>
          <div className="flex items-center p-0.5 bg-white dark:bg-emerald-900/60 rounded-lg border border-gray-300 dark:border-emerald-800 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('cumulative')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'cumulative'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
              title="Compara o Capex inicial total versus a Economia acumulada"
            >
              Acumulado
            </button>
            <button
              type="button"
              onClick={() => setViewMode('annual')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'annual'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
              title="Exibe a economia gerada ano a ano"
            >
              Ano a Ano
            </button>
          </div>
        </div>

      </div>

      {/* 4 Summary Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
        
        {/* Metric 1: Initial Capex */}
        <div className="p-3 bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-200 dark:border-emerald-800/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
            Investimento Capex
          </span>
          <p className="text-base sm:text-lg font-mono font-bold text-gray-900 dark:text-white mt-0.5 truncate">
            R$ {estimatedInvestment.toLocaleString('pt-BR')}
          </p>
          <span className="text-[9px] text-gray-500 dark:text-gray-400 block mt-0.5">Implantação Turnkey</span>
        </div>

        {/* Metric 2: Horizon Cumulative Savings */}
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-900/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803d] dark:text-emerald-300 block">
            Economia em {timeHorizon} Anos
          </span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#15803d] dark:text-[#86efac] mt-0.5 truncate">
            R$ {horizonCumulativeSavings.toLocaleString('pt-BR')}
          </p>
          <span className="text-[9px] text-emerald-700 dark:text-emerald-400 block mt-0.5">Opex evitado + Foco</span>
        </div>

        {/* Metric 3: Net Profit */}
        <div className="p-3 bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-200 dark:border-emerald-800/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
            Saldo Líquido ({timeHorizon}a)
          </span>
          <p className="text-base sm:text-lg font-mono font-bold text-[#072a1a] dark:text-[#86efac] mt-0.5 truncate">
            +R$ {horizonNetProfit.toLocaleString('pt-BR')}
          </p>
          <span className="text-[9px] text-[#15803d] dark:text-emerald-400 font-bold block mt-0.5">
            +{horizonRoiPercent}% ROI Líquido
          </span>
        </div>

        {/* Metric 4: Multiple */}
        <div className="p-3 bg-white dark:bg-emerald-950/40 rounded-2xl border border-gray-200 dark:border-emerald-800/80 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
            Multiplicador de Retorno
          </span>
          <p className="text-base sm:text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {horizonRoiMultiple}x
          </p>
          <span className="text-[9px] text-gray-500 dark:text-gray-400 block mt-0.5">
            Payback aos {paybackMonths} meses
          </span>
        </div>

      </div>

      {/* Main Bar Chart Container */}
      <div className="bg-white dark:bg-[#06180f] p-4 sm:p-5 rounded-3xl border border-gray-200 dark:border-emerald-900/60 shadow-md">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
              Confronto Direto Anual ({timeHorizon} Anos) • {growthScenario === 'optimistic' ? 'Cenário Otimista' : 'Cenário Conservador'}
            </span>
          </div>

          <span className="text-[11px] font-mono font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0 self-start sm:self-auto">
            Breakeven: Ano {Math.ceil(paybackMonths / 12)}
          </span>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -5, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              
              <YAxis
                tickFormatter={(val) => `R$ ${Math.round(val / 1000)}k`}
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              
              <RechartsTooltip content={<CustomBarTooltip />} />
              
              <Legend
                wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs ml-1">
                    {value}
                  </span>
                )}
              />

              {/* Bar 1: Investimento Capex */}
              <Bar
                dataKey="investimento"
                name="Investimento (Capex Implantação)"
                fill="#0d3822"
                radius={[5, 5, 0, 0]}
                maxBarSize={48}
              />

              {/* Bar 2: Economia Operacional Acumulada */}
              <Bar
                dataKey="economiaAcumulada"
                name={viewMode === 'cumulative' ? "Economia Operacional Acumulada" : "Economia do Ano"}
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                maxBarSize={48}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.economiaAcumulada >= estimatedInvestment ? '#10b981' : '#34d399'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Explanatory Caption */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500 dark:text-gray-400">
          <p>
            * O investimento All Green é quitado no Mês 0 (Capex). Por dispensar tubulação de água, bombas e podas, a economia operacional acumulada ultrapassa o valor investido já a partir do <strong>{paybackMonths}º mês</strong>.
          </p>
          {onOpenQuote && (
            <button
              type="button"
              onClick={() => onOpenQuote(`Estudo Comparativo Capex vs Economia (${timeHorizon} Anos)`)}
              className="text-[#15803d] dark:text-[#86efac] font-bold hover:underline cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-1"
            >
              <span>Solicitar Estudo Customizado</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
