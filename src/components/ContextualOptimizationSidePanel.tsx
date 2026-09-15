import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Zap,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  Layers,
  ShieldCheck,
  Cpu,
  Volume2,
  Sun,
  Droplets,
  Sliders,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type GrowthScenario = 'conservative' | 'optimistic';
export type IndustryType = 'corporate' | 'tech' | 'finance_law' | 'healthcare' | 'creative';
export type IntegrationLevel = 'accent' | 'core' | 'immersive';

export interface ContextualOptimizationTip {
  id: string;
  category: 'energy' | 'roi' | 'tech';
  title: string;
  badge: string;
  description: string;
  technologyRecommendation: string;
  impactMetric: string;
  isApplied: boolean;
  actionLabel?: string;
  actionPayload?: {
    area?: number;
    level?: IntegrationLevel;
    growthScenario?: GrowthScenario;
    timeHorizonYears?: 1 | 3 | 5;
  };
  onQuoteContext?: string;
}

export interface ContextualOptimizationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  employees: number;
  salary: number;
  area: number;
  industry: IndustryType;
  level: IntegrationLevel;
  growthScenario: GrowthScenario;
  timeHorizonYears: number;
  calculation: {
    estimatedInvestment: number;
    annualTotalGrossSavings: number;
    annualHvacSavings: number;
    annualMaintenanceAvoided: number;
    annualProductivityGainValue: number;
    paybackMonths: number;
    netRoiPercentage: number;
    wellPoints: number;
    acousticDb: number;
  };
  onApplyAdjustment: (adjustments: {
    area?: number;
    level?: IntegrationLevel;
    growthScenario?: GrowthScenario;
    timeHorizonYears?: 1 | 3 | 5;
  }) => void;
  onOpenQuote?: (context?: string) => void;
}

export const ContextualOptimizationSidePanel: React.FC<ContextualOptimizationSidePanelProps> = ({
  isOpen,
  onClose,
  employees,
  salary,
  area,
  industry,
  level,
  growthScenario,
  timeHorizonYears,
  calculation,
  onApplyAdjustment,
  onOpenQuote,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'energy' | 'roi' | 'tech'>('all');
  const [recentlyAppliedId, setRecentlyAppliedId] = useState<string | null>(null);

  // Derive Contextual Tips based on real-time inputs
  const tips: ContextualOptimizationTip[] = useMemo(() => {
    const list: ContextualOptimizationTip[] = [];

    // Density calculation (m² of green wall per employee)
    const m2PerPax = Number((area / employees).toFixed(2));
    const suggestedOptimalArea = Math.min(120, Math.max(12, Math.round(employees * 0.7)));

    // 1. ENERGY: HVAC Thermal Insulation & Green Surface Ratio
    const isThermalAreaSuboptimal = area < suggestedOptimalArea && suggestedOptimalArea > area;
    const additionalHvacGain = isThermalAreaSuboptimal
      ? Math.round((suggestedOptimalArea - area) * (growthScenario === 'optimistic' ? 180 : 130))
      : 0;

    list.push({
      id: 'thermal_mass_hvac',
      category: 'energy',
      title: isThermalAreaSuboptimal
        ? `Ampliar Cobertura Térmica da Parede Verde (Alvo: ${suggestedOptimalArea} m²)`
        : 'Cobertura Térmica Vegetal em Ponto Ideal de Alta Eficiência',
      badge: isThermalAreaSuboptimal ? '+18% a +25% Eficiência Térmica' : 'Otimizado ✓',
      description: isThermalAreaSuboptimal
        ? `Sua taxa atual é de ${m2PerPax} m² por colaborador. Expandir a área para ${suggestedOptimalArea} m² atua como escudo bio-térmico contínuo na envoltória interna, gerando +R$ ${additionalHvacGain.toLocaleString('pt-BR')}/ano em economia direta de ar condicionado (HVAC).`
        : `Excelente! Com ${area} m² para ${employees} colaboradores (${m2PerPax} m²/pax), a barreira térmica vegetal reduz a transmissão de calor das paredes periféricas em até 3,8°C.`,
      technologyRecommendation:
        'Jardins verticais preservados sobre painéis de MDF naval com colchão de ar traseiro de 25mm para maximizar resistência térmica (R-value).',
      impactMetric: isThermalAreaSuboptimal
        ? `+R$ ${additionalHvacGain.toLocaleString('pt-BR')}/ano em energia`
        : 'Máxima eficiência térmica atingida',
      isApplied: !isThermalAreaSuboptimal,
      actionLabel: isThermalAreaSuboptimal ? `Expandir Área para ${suggestedOptimalArea} m²` : undefined,
      actionPayload: isThermalAreaSuboptimal ? { area: suggestedOptimalArea } : undefined,
    });

    // 2. ROI: Integration Level Upgrade (Accent to Core or Immersive)
    if (level === 'accent') {
      const estimatedGain = Math.round(calculation.annualProductivityGainValue * 0.85);
      list.push({
        id: 'upgrade_to_core',
        category: 'roi',
        title: 'Evoluir para Nível Central (Core)',
        badge: 'Aceleração de Retorno',
        description: `O nível Pontual captura apenas +4,5% de elasticidade produtiva. Para uma equipe de ${employees} pessoas com folha de R$ ${(employees * salary).toLocaleString('pt-BR')}/mês, a migração para o nível Central (+9,0%) dobra o retorno monetário e reduz o payback em ${(calculation.paybackMonths * 0.3).toFixed(1)} meses.`,
        technologyRecommendation:
          'Composição mista de Musgo Pole com folhagens nobres (Samambaias e Eucaliptos preservados) em campo de visão direto dos postos de trabalho.',
        impactMetric: `+R$ ${estimatedGain.toLocaleString('pt-BR')}/ano em produtividade`,
        isApplied: false,
        actionLabel: 'Ativar Nível Central (Core)',
        actionPayload: { level: 'core' },
      });
    } else if (level === 'core' && employees >= 60) {
      const estimatedGain = Math.round(calculation.annualProductivityGainValue * 0.55);
      list.push({
        id: 'upgrade_to_immersive',
        category: 'roi',
        title: 'Potencializar para Integração Imersiva',
        badge: 'Alta Performance',
        description: `Com mais de 60 colaboradores, áreas de circulação e lounges biofílicos contínuos (+14,5% foco) proporcionam ganho de escala significativo com retenção de talentos superior (+25% SHRM).`,
        technologyRecommendation:
          'Paredes verdes em 360° em hubs de descompressão e salas de reuniões executivas, blindadas acusticamente.',
        impactMetric: `+R$ ${estimatedGain.toLocaleString('pt-BR')}/ano em retenção`,
        isApplied: false,
        actionLabel: 'Ativar Nível Imersivo',
        actionPayload: { level: 'immersive' },
      });
    }

    // 3. ENERGY & TECH: Human Centric Lighting (HCL / Circadian Pairing)
    list.push({
      id: 'circadian_hcl',
      category: 'tech',
      title: 'Integrar Iluminação Circadiana Dinâmica (HCL)',
      badge: 'Sinergia Tecnológica',
      description:
        'Sincronizar a parede verde com fitas LED Tunable-White (2700K ao amanhecer a 5000K ao meio-dia) amplifica a resposta neuroendócrina (supressão de melatonina diurna). Atinge +15% de acuidade cognitiva segundo Harvard COGfx com consumo elétrico de apenas 10W/m².',
      technologyRecommendation:
        'LEDs CRI > 95 em calha embutida de alumínio anodizado a 45° com dimerização DALI-2 integrada à automação predial.',
      impactMetric: '+15% Foco & Consumo LED Ultrabaixo',
      isApplied: false,
      actionLabel: 'Incluir Especificação Circadiana',
      onQuoteContext: `Especificação de Iluminação Circadiana HCL Tunable-White com dimerização DALI-2 para ${area}m² de jardim vertical`,
    });

    // 4. ENERGY: Indoor Air Quality (IAQ) Demand-Controlled Ventilation (DCV)
    list.push({
      id: 'iaq_iot_sensors',
      category: 'energy',
      title: 'Sensores IoT de CO₂ & Controle por Demanda (DCV)',
      badge: '-22% Desperdício em Ar Condicionado',
      description:
        'A presença botânica reduz a percepção de estresse e fadiga respiratória. O pareamento com sensores IoT de CO₂ e VOC permite ao sistema de automação predial (BMS) modular a taxa de ar externo, evitando super-resfriamento de salas vazias.',
      technologyRecommendation:
        'Módulos wireless BACnet/Modbus para monitoramento contínuo de CO₂ (<600 ppm) e controle modular de dampers de insuflamento.',
      impactMetric: 'Até -22% de consumo em dampers',
      isApplied: false,
      actionLabel: 'Adicionar Consultoria de Sensores IoT',
      onQuoteContext: `Consultoria de Sensores IoT de Qualidade do Ar (IAQ) e integração com BMS para ${employees} colaboradores`,
    });

    // 5. ROI: Elimination of Conventional Landscape OPEX (Zero Water / Zero Pumps)
    list.push({
      id: 'zero_hydraulic_opex',
      category: 'roi',
      title: 'Eliminação de Manutenção Hidráulica e Risco de Vazamento',
      badge: `R$ ${(area * (growthScenario === 'optimistic' ? 380 : 320)).toLocaleString('pt-BR')}/ano Poupados`,
      description: `Para seus ${area} m², um jardim vivo convencional geraria ~R$ ${(area * 340).toLocaleString('pt-BR')}/ano em despesas de irrigação, água tratada, podas e reposição de mudas mortas (15%/ano). A tecnologia 100% Preservada All Green zera esse OPEX e anula risco de infiltração em drywalls corporativos.`,
      technologyRecommendation:
        'Estabilização molecular com glicerina vegetal ecológica biodegradável e sais minerais naturais. Sem necessidade de drenos.',
      impactMetric: 'OPEX Predial R$ 0,00',
      isApplied: true,
    });

    // 6. TECH: High NRC Acoustic Baffles
    list.push({
      id: 'acoustic_zoning',
      category: 'tech',
      title: 'Zonificação Acústica de Alto Desempenho (NRC 0.88)',
      badge: `Atenuação de até -${calculation.acousticDb} dB`,
      description: `Em ambientes de trabalho de ${industry === 'tech' ? 'Tecnologia' : industry === 'finance_law' ? 'Mercado Financeiro/Jurídico' : 'Serviços Corporativos'}, a reverberação da fala é o principal causador de perda de concentração. As folhagens preservadas All Green atingem NRC até 0.88 (teste IPT), dissipando reflexões de alta frequência.`,
      technologyRecommendation:
        'Disposição em painéis de transição entre estações de trabalho e zonas de call/reunião para atenuação sonora passiva.',
      impactMetric: `Redução acústica de -${calculation.acousticDb} dB`,
      isApplied: false,
      actionLabel: 'Ver Laudo Acústico IPT',
      onQuoteContext: `Laudo Acústico IPT e projeto de barreiras fonoabsorventes All Green para ${area}m²`,
    });

    // 7. ROI: Scenario Sensitivity Calibration
    if (growthScenario === 'conservative') {
      list.push({
        id: 'toggle_optimistic_scenario',
        category: 'roi',
        title: 'Calibrar para Cenário Otimista (Alta Performance)',
        badge: 'Multiplicador de ROI',
        description:
          'Seu cálculo está adotando premissas ultra-conservadoras (35% de monetização de foco). Em empresas com gestão ágil por objetivos (OKRs), o cenário Otimista (60% de captura) reflete com maior precisão o retorno real sobre o capital investido.',
        technologyRecommendation:
          'Modelo com 60% de captura de produtividade e maior sinergia de retenção de talentos corporativos.',
        impactMetric: `ROI estimado de +${Math.round(calculation.netRoiPercentage * 1.35)}%`,
        isApplied: false,
        actionLabel: 'Ativar Cenário Otimista',
        actionPayload: { growthScenario: 'optimistic' },
      });
    }

    return list;
  }, [employees, salary, area, industry, level, growthScenario, calculation]);

  // Filtered tips
  const filteredTips = useMemo(() => {
    if (activeCategory === 'all') return tips;
    return tips.filter((t) => t.category === activeCategory);
  }, [tips, activeCategory]);

  const energyTipsCount = tips.filter((t) => t.category === 'energy').length;
  const roiTipsCount = tips.filter((t) => t.category === 'roi').length;
  const techTipsCount = tips.filter((t) => t.category === 'tech').length;

  const handleApplySingleTip = (tip: ContextualOptimizationTip) => {
    if (tip.actionPayload) {
      onApplyAdjustment(tip.actionPayload);
      setRecentlyAppliedId(tip.id);

      // Trigger celebratory micro-confetti
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7, x: 0.8 },
          colors: ['#15803d', '#86efac', '#0284c7'],
        });
      } catch (e) {
        // ignore
      }

      setTimeout(() => setRecentlyAppliedId(null), 2500);
    } else if (tip.onQuoteContext && onOpenQuote) {
      onOpenQuote(tip.onQuoteContext);
    }
  };

  const handleApplyAllOptimizations = () => {
    const suggestedArea = Math.min(120, Math.max(12, Math.round(employees * 0.7)));
    onApplyAdjustment({
      area: suggestedArea,
      level: level === 'accent' ? 'core' : level,
      growthScenario: 'optimistic',
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6, x: 0.75 },
        colors: ['#15803d', '#86efac', '#fbbf24', '#0284c7'],
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Lateral Slide-Over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] lg:w-[520px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 overflow-hidden"
            role="dialog"
            aria-label="Dicas Contextuais de Otimização"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#062316] via-[#072a1a] to-[#041a10] text-white flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#86efac] shadow-sm">
                    <Lightbulb className="w-5 h-5 text-amber-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                      <span>Dicas Contextuais de Otimização</span>
                    </h3>
                    <p className="text-xs text-emerald-200/80">
                      Recomendações técnicas baseadas nos inputs do seu projeto
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Fechar painel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input Context Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-900/60 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                  <span className="text-[10px] text-gray-400 block">Equipe</span>
                  <span className="font-bold text-white font-mono">{employees} pax</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                  <span className="text-[10px] text-gray-400 block">Área Atual</span>
                  <span className="font-bold text-[#86efac] font-mono">{area} m²</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60">
                  <span className="text-[10px] text-gray-400 block">Nível</span>
                  <span className="font-bold text-white capitalize">
                    {level === 'accent' ? 'Pontual' : level === 'core' ? 'Central' : 'Imersivo'}
                  </span>
                </div>
              </div>

              {/* Master One-Click Optimization Button */}
              <button
                type="button"
                onClick={handleApplyAllOptimizations}
                className="w-full py-2.5 px-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer hover:scale-[1.01] active:scale-99"
              >
                <Sparkles className="w-4 h-4 text-gray-950" />
                <span>Aplicar Configuração Recomendada de Alto ROI</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-[#072a1a] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 bg-white border border-gray-200'
                }`}
              >
                Todas ({tips.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('energy')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeCategory === 'energy'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 bg-white border border-gray-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Eficiência Energética ({energyTipsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('roi')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeCategory === 'roi'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 bg-white border border-gray-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Maximização de ROI ({roiTipsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('tech')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeCategory === 'tech'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 bg-white border border-gray-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Tecnologia & Luz ({techTipsCount})</span>
              </button>
            </div>

            {/* Tips List Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {filteredTips.map((tip) => {
                const isJustApplied = recentlyAppliedId === tip.id;

                const categoryTheme =
                  tip.category === 'energy'
                    ? {
                        bg: 'bg-emerald-50/70',
                        border: 'border-emerald-200',
                        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                        iconBg: 'bg-emerald-600 text-white',
                        icon: Zap,
                      }
                    : tip.category === 'roi'
                    ? {
                        bg: 'bg-amber-50/70',
                        border: 'border-amber-200',
                        badge: 'bg-amber-100 text-amber-900 border-amber-300',
                        iconBg: 'bg-amber-600 text-white',
                        icon: TrendingUp,
                      }
                    : {
                        bg: 'bg-teal-50/70',
                        border: 'border-teal-200',
                        badge: 'bg-teal-100 text-teal-900 border-teal-300',
                        iconBg: 'bg-teal-600 text-white',
                        icon: Cpu,
                      };

                const IconComponent = categoryTheme.icon;

                return (
                  <div
                    key={tip.id}
                    className={`rounded-2xl border p-4.5 transition-all shadow-2xs relative space-y-3 ${
                      tip.isApplied
                        ? 'bg-gray-50/80 border-gray-200'
                        : `${categoryTheme.bg} ${categoryTheme.border} hover:shadow-md`
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${categoryTheme.iconBg}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${categoryTheme.badge}`}
                          >
                            {tip.badge}
                          </span>
                        </div>
                      </div>

                      {tip.isApplied && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ativo</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-gray-900 text-sm leading-snug">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>

                    {/* Technical Specification Box */}
                    <div className="p-2.5 bg-white rounded-xl border border-gray-200/90 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Especificação Técnica:</span>
                        <span className="font-mono text-[#15803d] font-bold">{tip.impactMetric}</span>
                      </div>
                      <p className="text-[11px] text-gray-700 font-medium">
                        {tip.technologyRecommendation}
                      </p>
                    </div>

                    {/* Action Button */}
                    {tip.actionLabel && !tip.isApplied && (
                      <button
                        type="button"
                        onClick={() => handleApplySingleTip(tip)}
                        className={`w-full py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                          isJustApplied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#072a1a] hover:bg-[#15803d] text-white'
                        }`}
                      >
                        {isJustApplied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Ajuste Aplicado com Sucesso!</span>
                          </>
                        ) : (
                          <>
                            <span>{tip.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer summary & Quote Link */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Estimativa de Retorno Anual:</span>
                <span className="font-mono font-extrabold text-[#15803d]">
                  R$ {calculation.annualTotalGrossSavings.toLocaleString('pt-BR')}/ano
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenQuote) {
                    onOpenQuote(
                      `Projeto com Dicas de Otimização Aplicadas (${area}m², ${employees} pax, setor ${industry}, payback ${calculation.paybackMonths} meses).`
                    );
                  }
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-[#072a1a] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
              >
                <span>Solicitar Memorial Técnico com Estas Diretrizes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextualOptimizationSidePanel;
