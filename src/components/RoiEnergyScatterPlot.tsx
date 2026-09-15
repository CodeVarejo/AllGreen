import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  Zap,
  TrendingUp,
  Leaf,
  Activity,
  Sliders,
  Sparkles,
  Info,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Flame,
} from 'lucide-react';

export interface RoiEnergyScatterPlotProps {
  area: number; // m²
  employees: number;
  salary: number;
  industry: string;
  level: string;
  timeHorizonYears: 1 | 3 | 5;
  estimatedInvestment: number;
  annualTotalGrossSavings: number;
  annualHvacSavings: number;
  paybackMonths: number;
  className?: string;
}

export interface ScatterPoint {
  id: string;
  mes: number;
  periodoLabel: string;
  fase: 'payback' | 'retorno' | 'expansao';
  economiaEnergiaAcumulada: number; // R$ (Eixo X)
  roiAcumuladoPct: number; // % (Eixo Y)
  kwhEconomizados: number; // kWh
  co2EvitadoKg: number; // kg CO2
  fluxoLiquido: number; // R$
  cenario: string;
  tamanhoPonto: number; // Para o ZAxis (m² ou relevância)
  cor: string;
}

export const RoiEnergyScatterPlot: React.FC<RoiEnergyScatterPlotProps> = ({
  area,
  employees,
  salary,
  industry,
  level,
  timeHorizonYears,
  estimatedInvestment,
  annualTotalGrossSavings,
  annualHvacSavings,
  paybackMonths,
  className = '',
}) => {
  // Mode selection: 'timeline' (trajectory across months) or 'comparative' (scenarios)
  const [viewMode, setViewMode] = useState<'timeline' | 'comparative'>('timeline');
  const [showBenchmarks, setShowBenchmarks] = useState<boolean>(true);
  const [highlightPoint, setHighlightPoint] = useState<string | null>(null);

  // Energy Tariff (BRL/kWh corporativo médio no Brasil)
  const tariffKwh = 0.88;
  const sinEmissionFactorKgPerKwh = 0.084; // SIN médio Brasil

  // Generate Scatter Plot Data across the timeline (Meses 3 a 60)
  const { currentTrajectoryPoints, benchmarkHighEfficiencyPoints, benchmarkStandardPoints } =
    useMemo(() => {
      // Determine milestone months based on time horizon
      const maxMonths = timeHorizonYears * 12;
      const monthSteps = [
        3,
        6,
        Math.round(paybackMonths),
        12,
        18,
        24,
        30,
        36,
        42,
        48,
        54,
        60,
      ].filter((m, index, self) => m <= maxMonths && self.indexOf(m) === index).sort((a, b) => a - b);

      // Trajectory 1: Current Selected Configuration
      const currentPoints: ScatterPoint[] = monthSteps.map((m) => {
        const years = m / 12;
        // Thermal inflation & summer seasonality factor
        const inflationFactor = 1 + years * 0.045;
        const seasonalModifier = m % 12 >= 11 || m % 12 <= 3 ? 1.15 : 0.95; // Summer peak in Brazil
        const energySavings = Math.round(years * annualHvacSavings * inflationFactor * seasonalModifier);
        const grossSavings = Math.round(years * annualTotalGrossSavings);
        const netSavings = grossSavings - estimatedInvestment;
        const roiPct = Math.round((netSavings / estimatedInvestment) * 100);
        const kwh = Math.round(energySavings / tariffKwh);
        const co2 = Math.round(kwh * sinEmissionFactorKgPerKwh);

        let fase: 'payback' | 'retorno' | 'expansao' = 'payback';
        let cor = '#f59e0b'; // amber-500
        if (m < paybackMonths) {
          fase = 'payback';
          cor = '#ea580c'; // orange-600
        } else if (m <= 36) {
          fase = 'retorno';
          cor = '#16a34a'; // green-600
        } else {
          fase = 'expansao';
          cor = '#0f766e'; // teal-700
        }

        return {
          id: `curr-${m}`,
          mes: m,
          periodoLabel: m === Math.round(paybackMonths) ? `Mês ${m} (Breakeven)` : m >= 12 ? `Ano ${(m / 12).toFixed(1).replace('.0', '')} (${m}m)` : `Mês ${m}`,
          fase,
          economiaEnergiaAcumulada: Math.max(150, energySavings),
          roiAcumuladoPct: roiPct,
          kwhEconomizados: kwh,
          co2EvitadoKg: co2,
          fluxoLiquido: netSavings,
          cenario: 'Sua Projeção (Configuração Atual)',
          tamanhoPonto: Math.round(area * 1.8 + m * 0.8),
          cor,
        };
      });

      // Trajectory 2: Alta Eficiência Térmica (Fachada Ensolarada / Clima Quente, ~1.55x economia térmica)
      const highPoints: ScatterPoint[] = monthSteps.map((m) => {
        const years = m / 12;
        const energySavings = Math.round(years * annualHvacSavings * 1.55 * (1 + years * 0.05));
        const grossSavings = Math.round(years * (annualTotalGrossSavings + annualHvacSavings * 0.55));
        const netSavings = grossSavings - (estimatedInvestment * 1.05);
        const roiPct = Math.round((netSavings / (estimatedInvestment * 1.05)) * 100);
        const kwh = Math.round(energySavings / tariffKwh);
        const co2 = Math.round(kwh * sinEmissionFactorKgPerKwh);

        return {
          id: `high-${m}`,
          mes: m,
          periodoLabel: `Alta Eficiência - Mês ${m}`,
          fase: m < paybackMonths - 2 ? 'payback' : 'retorno',
          economiaEnergiaAcumulada: energySavings,
          roiAcumuladoPct: roiPct,
          kwhEconomizados: kwh,
          co2EvitadoKg: co2,
          fluxoLiquido: netSavings,
          cenario: 'Fachada Ensolarada / Alta Carga Térmica',
          tamanhoPonto: Math.round(area * 1.6 + m * 0.7),
          cor: '#0284c7', // sky-600
        };
      });

      // Trajectory 3: Iluminação Circadiana Integrada + Parede Verde (~1.85x economia energética global)
      const integratedPoints: ScatterPoint[] = monthSteps.map((m) => {
        const years = m / 12;
        const energySavings = Math.round(years * annualHvacSavings * 1.95);
        const grossSavings = Math.round(years * (annualTotalGrossSavings + annualHvacSavings * 0.95));
        const netSavings = grossSavings - (estimatedInvestment * 1.15);
        const roiPct = Math.round((netSavings / (estimatedInvestment * 1.15)) * 100);
        const kwh = Math.round(energySavings / tariffKwh);
        const co2 = Math.round(kwh * sinEmissionFactorKgPerKwh);

        return {
          id: `int-${m}`,
          mes: m,
          periodoLabel: `Sinergia Circadiana - Mês ${m}`,
          fase: m < paybackMonths ? 'payback' : 'retorno',
          economiaEnergiaAcumulada: energySavings,
          roiAcumuladoPct: roiPct,
          kwhEconomizados: kwh,
          co2EvitadoKg: co2,
          fluxoLiquido: netSavings,
          cenario: 'Sinergia Térmica + Luz Circadiana Inteligente',
          tamanhoPonto: Math.round(area * 2.0 + m * 0.9),
          cor: '#8b5cf6', // purple-500
        };
      });

      return {
        currentTrajectoryPoints: currentPoints,
        benchmarkHighEfficiencyPoints: highPoints,
        benchmarkStandardPoints: integratedPoints,
      };
    }, [
      timeHorizonYears,
      paybackMonths,
      annualHvacSavings,
      annualTotalGrossSavings,
      estimatedInvestment,
      area,
    ]);

  // Aggregate Key Metrics for the Selected Horizon
  const horizonMonths = timeHorizonYears * 12;
  const finalPoint = currentTrajectoryPoints[currentTrajectoryPoints.length - 1];
  const totalEnergySavingsHorizon = finalPoint?.economiaEnergiaAcumulada || 0;
  const totalKwhSavedHorizon = finalPoint?.kwhEconomizados || 0;
  const totalCo2Horizon = finalPoint?.co2EvitadoKg || 0;
  const finalRoiPct = finalPoint?.roiAcumuladoPct || 0;

  // Custom Tooltip Renderer
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ScatterPoint = payload[0].payload;
      return (
        <div className="bg-[#072a1a] text-white p-3.5 rounded-2xl border border-emerald-500/50 shadow-xl max-w-xs text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-1.5">
            <span className="font-bold text-[#86efac] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {data.periodoLabel}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-900 text-emerald-200 border border-emerald-700">
              {data.cenario.split(' ')[0]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div>
              <span className="text-[10px] text-emerald-300/80 block uppercase">ROI Acumulado</span>
              <span className={`font-mono text-sm font-extrabold ${data.roiAcumuladoPct >= 0 ? 'text-[#86efac]' : 'text-orange-300'}`}>
                {data.roiAcumuladoPct >= 0 ? `+${data.roiAcumuladoPct}%` : `${data.roiAcumuladoPct}%`}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-emerald-300/80 block uppercase">Economia Energia</span>
              <span className="font-mono text-sm font-extrabold text-white">
                R$ {data.economiaEnergiaAcumulada.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1 border-t border-emerald-900/80 text-[11px] text-emerald-100/90">
            <div className="flex justify-between">
              <span className="text-gray-300">Eletricidade Evitada:</span>
              <span className="font-mono font-bold text-white">{data.kwhEconomizados.toLocaleString('pt-BR')} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Pegada CO₂ Reduzida:</span>
              <span className="font-mono font-bold text-emerald-300">-{data.co2EvitadoKg} kg CO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Saldo Líquido:</span>
              <span className={`font-mono font-bold ${data.fluxoLiquido >= 0 ? 'text-[#86efac]' : 'text-amber-300'}`}>
                R$ {data.fluxoLiquido.toLocaleString('pt-BR')}
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
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/90 p-3.5 rounded-2xl border border-gray-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#072a1a] flex items-center justify-center text-[#86efac] shadow-2xs">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 tracking-tight">
              Gráfico de Dispersão: ROI vs. Economia em Eficiência Energética
            </h4>
          </div>
          <p className="text-[11px] text-gray-600">
            Correlação multivariada entre a redução de carga térmica (HVAC passivo) e o retorno financeiro acumulado.
          </p>
        </div>

        {/* View Switches & Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowBenchmarks(!showBenchmarks)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showBenchmarks
                ? 'bg-emerald-100/80 border-emerald-300 text-[#072a1a]'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{showBenchmarks ? 'Cenários Ativos' : 'Apenas Sua Sala'}</span>
          </button>
        </div>
      </div>

      {/* Main Scatter Chart Container */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        
        {/* Top Metric Strip inside Scatter view */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block">
              Economia HVAC ({timeHorizonYears} Anos)
            </span>
            <span className="font-mono text-lg font-extrabold text-[#072a1a]">
              R$ {totalEnergySavingsHorizon.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-gray-500 block">Isolamento vegetal passivo</span>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200">
            <span className="text-[10px] font-bold text-[#0f766e] uppercase tracking-wider block">
              Eletricidade Evitada
            </span>
            <span className="font-mono text-lg font-extrabold text-[#0f766e]">
              {totalKwhSavedHorizon.toLocaleString('pt-BR')} kWh
            </span>
            <span className="text-[10px] text-gray-500 block">Tarifa média R$ {tariffKwh}/kWh</span>
          </div>

          <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-200">
            <span className="text-[10px] font-bold text-[#0284c7] uppercase tracking-wider block">
              ROI Acumulado
            </span>
            <span className="font-mono text-lg font-extrabold text-[#0284c7]">
              +{finalRoiPct}%
            </span>
            <span className="text-[10px] text-gray-500 block">Horizonte de {timeHorizonYears} anos</span>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider block">
              Pegada Descarbonizada
            </span>
            <span className="font-mono text-lg font-extrabold text-[#d97706]">
              -{totalCo2Horizon} kg CO₂
            </span>
            <span className="text-[10px] text-gray-500 block">Créditos de carbono indiretos</span>
          </div>

        </div>

        {/* Recharts Scatter Chart */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, bottom: 25, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              {/* X-Axis: Economia Acumulada em Eficiência Energética (R$) */}
              <XAxis
                type="number"
                dataKey="economiaEnergiaAcumulada"
                name="Economia em Energia"
                unit=" R$"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `R$ ${Math.round(val / 1000)}k`}
                label={{
                  value: 'Economia Acumulada em Climatização & Energia Elétrica (R$)',
                  position: 'insideBottom',
                  offset: -15,
                  fontSize: 11,
                  fill: '#475569',
                  fontWeight: 600,
                }}
              />

              {/* Y-Axis: Retorno sobre o Investimento Acumulado (%) */}
              <YAxis
                type="number"
                dataKey="roiAcumuladoPct"
                name="ROI Acumulado"
                unit="%"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `${val}%`}
                label={{
                  value: 'Retorno sobre o Investimento Líquido (ROI %)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -5,
                  fontSize: 11,
                  fill: '#475569',
                  fontWeight: 600,
                }}
              />

              {/* Z-Axis for point diameter sizing based on scale */}
              <ZAxis
                type="number"
                dataKey="tamanhoPonto"
                range={[80, 260]}
                name="Escala do Ponto"
              />

              <RechartsTooltip content={<CustomScatterTooltip />} />

              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                verticalAlign="top"
                align="right"
              />

              {/* Series 1: Sua Configuração Atual */}
              <Scatter
                name="Sua Empresa (Trajetória Mensal)"
                data={currentTrajectoryPoints}
                fill="#15803d"
                shape="circle"
              >
                {currentTrajectoryPoints.map((entry, index) => (
                  <Cell
                    key={`cell-curr-${index}`}
                    fill={entry.cor}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="transition-all hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Scatter>

              {/* Series 2: Benchmark Alta Carga Térmica */}
              {showBenchmarks && (
                <Scatter
                  name="Fachada Ensolarada (Maior Inércia)"
                  data={benchmarkHighEfficiencyPoints}
                  fill="#0284c7"
                  shape="diamond"
                >
                  {benchmarkHighEfficiencyPoints.map((_, index) => (
                    <Cell
                      key={`cell-high-${index}`}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      opacity={0.8}
                    />
                  ))}
                </Scatter>
              )}

              {/* Series 3: Benchmark Sinergia Circadiana */}
              {showBenchmarks && (
                <Scatter
                  name="Sinergia Térmica + Luz Circadiana"
                  data={benchmarkStandardPoints}
                  fill="#8b5cf6"
                  shape="triangle"
                >
                  {benchmarkStandardPoints.map((_, index) => (
                    <Cell
                      key={`cell-int-${index}`}
                      fill="#8b5cf6"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      opacity={0.75}
                    />
                  ))}
                </Scatter>
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Key Explanation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-500 font-medium">Legenda de Fases:</span>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
              <span className="text-gray-700">Período de Amortização (Mês 0 a {Math.round(paybackMonths)})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
              <span className="text-gray-700">Retorno Positivo Consolidado (Ano 1 a 3)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f766e]" />
              <span className="text-gray-700">Expansão de Margem Sustentável (Ano 4 e 5)</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 italic">
            *Tamanho da bolha proporcional ao volume de folhagem biofílica instalada ({area} m²).
          </div>
        </div>

      </div>

      {/* Engineering Insights Card: Why Thermal Efficiency Boosts ROI */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 rounded-3xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#072a1a]">
            <Sparkles className="w-4 h-4 text-[#15803d]" />
            <span>Física Térmica Aplicada às Paredes Verdes Preservadas</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            A biomassa vegetal preservada atua como um colchão térmico passivo de baixa condutividade térmica, amortecendo a radiação de paredes periféricas em até <strong>3.8°C</strong>. Isso reduz o ciclo de acionamento dos compressores de ar-condicionado (HVAC), acelerando a curva de ROI em até <strong>18%</strong> em relação a reformas corporativas convencionais.
          </p>
        </div>

        <div className="bg-white px-3.5 py-2.5 rounded-2xl border border-emerald-300 shadow-2xs shrink-0 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Redução de Carga Térmica</span>
          <span className="font-mono text-base font-extrabold text-[#15803d] block">-14% a -22%</span>
          <span className="text-[10px] text-gray-600">em salas voltadas ao poente</span>
        </div>
      </div>

    </div>
  );
};

export default RoiEnergyScatterPlot;
