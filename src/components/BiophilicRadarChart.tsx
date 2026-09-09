import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Activity,
  Target,
  Leaf,
  Info,
  TrendingUp,
  Volume2,
  Award,
  HeartHandshake,
  Droplets,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { BiophilicProfileResult } from '../types';

interface BiophilicRadarChartProps {
  result: BiophilicProfileResult;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const BiophilicRadarChart: React.FC<BiophilicRadarChartProps> = ({ result }) => {
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null);

  // Compute 6-axis data for the Radar Chart
  const acousticScore = Math.min(100, Math.round(result.acousticNRC * 100));
  const productivityScore = Math.min(100, Math.round(result.productivityBoost * 5.8));
  const stressScore = Math.min(100, Math.round(result.stressReduction * 2.5));
  const wellScore = result.scoreWell;
  const leedScore = Math.min(100, Math.round((result.scoreLeed / 18) * 100));
  const autonomyScore = 98;

  const radarData = [
    {
      subject: 'Conforto Acústico',
      shortKey: 'acoustic',
      userScore: acousticScore,
      benchmarkScore: 35,
      icon: Volume2,
      fullMark: 100,
      label: `NRC ${result.acousticNRC}`,
      description: 'Absorção de frequências de fala humana e redução de reverberação (ISO 354).',
      strengthBadge: acousticScore >= 85 ? 'Ponto Forte' : undefined,
    },
    {
      subject: 'Foco & Cognição',
      shortKey: 'productivity',
      userScore: productivityScore,
      benchmarkScore: 45,
      icon: TrendingUp,
      fullMark: 100,
      label: `+${result.productivityBoost}% Produtividade`,
      description: 'Elevação de foco cognitivo e clareza mental baseado no estudo Harvard COGfx.',
      strengthBadge: productivityScore >= 85 ? 'Ponto Forte' : undefined,
    },
    {
      subject: 'Alívio de Estresse',
      shortKey: 'stress',
      userScore: stressScore,
      benchmarkScore: 30,
      icon: HeartHandshake,
      fullMark: 100,
      label: `-${result.stressReduction}% Cortisol`,
      description: 'Sensação restaurativa de bem-estar psicológico e desaceleração de ansiedade.',
      strengthBadge: stressScore >= 85 ? 'Ponto Forte' : undefined,
    },
    {
      subject: 'Pontos WELL v2',
      shortKey: 'well',
      userScore: wellScore,
      benchmarkScore: 25,
      icon: Award,
      fullMark: 100,
      label: `${result.scoreWell} pts WELL`,
      description: 'Atendimento a créditos WELL v2 em Conceitos Mind, Comfort e Light.',
      strengthBadge: wellScore >= 90 ? 'Classificação Platinum' : undefined,
    },
    {
      subject: 'Créditos LEED',
      shortKey: 'leed',
      userScore: leedScore,
      benchmarkScore: 20,
      icon: Leaf,
      fullMark: 100,
      label: `${result.scoreLeed} Créditos`,
      description: 'Eficiência de materiais de ciclo sustentável e conformidade ESG.',
      strengthBadge: leedScore >= 80 ? 'Alta Pontuação' : undefined,
    },
    {
      subject: 'Autonomia Operacional',
      shortKey: 'autonomy',
      userScore: autonomyScore,
      benchmarkScore: 40,
      icon: Droplets,
      fullMark: 100,
      label: 'Zero Rega / 100% Seco',
      description: 'Sem necessidade de encanamentos, impermeabilizações ou podas periódicas.',
      strengthBadge: 'Zero Opex Hídrico',
    },
  ];

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#072a1a] text-white p-3.5 rounded-xl shadow-xl border border-emerald-700/60 text-xs max-w-xs z-50">
          <div className="flex items-center justify-between gap-2 border-b border-emerald-800 pb-2 mb-2">
            <span className="font-bold text-emerald-200 text-sm">{data.subject}</span>
            <span className="font-mono text-[#86efac] font-bold">{data.userScore}/100</span>
          </div>
          <p className="text-emerald-100/90 text-[11px] leading-relaxed mb-2">
            {data.description}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-emerald-900 text-[10px] text-emerald-300">
            <span>Destaque: <strong>{data.label}</strong></span>
            {showBenchmark && (
              <span className="text-gray-400">Padrão: {data.benchmarkScore}/100</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-[#f4f8f5] rounded-2xl border border-emerald-900/15 p-5 sm:p-7 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0 border border-emerald-300/60">
            <Activity className="w-5 h-5 text-[#15803d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 tracking-wider">
                Análise Multivariada de Impacto
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#072a1a] leading-tight">
              Radar de Desempenho do Perfil Biofílico
            </h4>
          </div>
        </div>

        {/* Benchmark Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              showBenchmark
                ? 'bg-emerald-50 border-emerald-300 text-[#072a1a] shadow-2xs'
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
            }`}
            title="Alternar comparativo com escritório convencional sem biofilia"
          >
            <Sliders className="w-3.5 h-3.5 text-[#15803d]" />
            <span>{showBenchmark ? 'Comparativo com Convencional: Ativo' : 'Mostrar Benchmark Convencional'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Dimensional Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Radar Chart Container */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[360px] bg-white rounded-2xl border border-gray-100 p-2 shadow-2xs">
          
          <div className="w-full h-[320px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#0f3c27', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 9 }}
                  stroke="#cbd5e1"
                />

                {/* Benchmark Conventional Radar Layer */}
                {showBenchmark && (
                  <Radar
                    name="Escritório Convencional (Sem Biofilia)"
                    dataKey="benchmarkScore"
                    stroke="#94a3b8"
                    fill="#94a3b8"
                    fillOpacity={0.2}
                    strokeDasharray="4 4"
                  />
                )}

                {/* User Calculated Profile Radar Layer */}
                <Radar
                  name={`Seu Perfil: ${result.archetypeTitle}`}
                  dataKey="userScore"
                  stroke="#15803d"
                  strokeWidth={2.5}
                  fill="#86efac"
                  fillOpacity={0.55}
                />

                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: '11px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-gray-400 text-center font-mono mt-1">
            *Pontuação normalizada de 0 a 100 em 6 dimensões de engenharia e biofilia.
          </p>
        </div>

        {/* 6 Dimension Breakdown Cards */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-700">Dimensões Analisadas no Diagnóstico:</span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">Média do Perfil: {Math.round((acousticScore + productivityScore + stressScore + wellScore + leedScore + autonomyScore) / 6)}/100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {radarData.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedAxis === item.shortKey;

              return (
                <div
                  key={item.shortKey}
                  onMouseEnter={() => setSelectedAxis(item.shortKey)}
                  onMouseLeave={() => setSelectedAxis(null)}
                  className={`p-3 rounded-xl border transition-all cursor-default ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-xs'
                      : 'bg-white hover:bg-emerald-50/40 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-[#072a1a] flex items-center justify-center">
                        <IconComp className="w-3 h-3 text-[#15803d]" />
                      </div>
                      <span className="text-xs font-bold text-gray-800 leading-tight">
                        {item.subject}
                      </span>
                    </div>

                    <span className="font-mono font-bold text-xs text-[#072a1a] bg-emerald-100 px-1.5 py-0.5 rounded">
                      {item.userScore}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-1.5">
                    <div
                      className="bg-gradient-to-r from-[#15803d] to-[#86efac] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.userScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500 truncate">{item.label}</span>
                    {item.strengthBadge && (
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 rounded">
                        {item.strengthBadge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Insight Callout */}
          <div className="p-3.5 bg-emerald-950 text-white rounded-xl border border-emerald-800 text-xs flex items-start gap-2.5 mt-3">
            <CheckCircle2 className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#86efac] text-xs">Veredito do Algoritmo All Green:</span>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Seu perfil apresenta uma vantagem de <strong>+{Math.round(((acousticScore + productivityScore + stressScore + wellScore + leedScore + autonomyScore) / 6) - 32)}%</strong> de performance integral sobre instalações convencionais, maximizando retorno sobre investimento (ROI) com zero necessidade de hidráulica.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
