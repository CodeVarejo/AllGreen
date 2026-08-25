import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building,
  HeartPulse,
  Brain,
  Clock,
  Download,
  Sliders,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { ScrollReveal } from './ScrollReveal';

export interface BiophilicRoiCalculatorProps {
  onOpenQuote?: (context?: string) => void;
  className?: string;
  isCompact?: boolean;
}

type IndustryType = 'tech' | 'corporate' | 'finance_law' | 'healthcare' | 'creative';
type IntegrationLevel = 'accent' | 'core' | 'immersive';

interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  employees: number;
  salary: number;
  area: number;
  industry: IndustryType;
  level: IntegrationLevel;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'startup',
    name: 'Tech Startup / Scale-up',
    badge: 'Inovação',
    employees: 30,
    salary: 9500,
    area: 20,
    industry: 'tech',
    level: 'core',
  },
  {
    id: 'corporate_hq',
    name: 'Escritório Corporativo',
    badge: 'Mais Popular',
    employees: 80,
    salary: 8200,
    area: 45,
    industry: 'corporate',
    level: 'core',
  },
  {
    id: 'finance_law',
    name: 'Boutique Financeira & Direito',
    badge: 'Alta Performance',
    employees: 25,
    salary: 16500,
    area: 18,
    industry: 'finance_law',
    level: 'immersive',
  },
  {
    id: 'healthcare',
    name: 'Clínica & Centro de Saúde',
    badge: 'Bem-Estar',
    employees: 40,
    salary: 7500,
    area: 28,
    industry: 'healthcare',
    level: 'core',
  },
  {
    id: 'enterprise',
    name: 'Sede Multinacional',
    badge: 'Enterprise',
    employees: 250,
    salary: 11000,
    area: 120,
    industry: 'corporate',
    level: 'immersive',
  },
];

const INDUSTRY_CONFIG: Record<
  IndustryType,
  {
    name: string;
    description: string;
    productivityBasePct: number; // Base productivity gain %
    absenteeismDaysReduced: number; // Days saved per employee/year
    turnoverReductionPct: number; // Reduction in voluntary turnover
    focusHoursGainedPerDay: number; // Minutes/day of recovered deep work
  }
> = {
  tech: {
    name: 'Tecnologia & Startups',
    description: 'Ambientes ágeis focados em código, engenharia de produto e resolução de problemas complexos.',
    productivityBasePct: 10.5,
    absenteeismDaysReduced: 3.2,
    turnoverReductionPct: 24,
    focusHoursGainedPerDay: 0.45, // ~27 min/day
  },
  corporate: {
    name: 'Corporativo & Serviços',
    description: 'Operações executivas, gestão estratégica, consultoria e vendas corporativas.',
    productivityBasePct: 8.0,
    absenteeismDaysReduced: 2.6,
    turnoverReductionPct: 18,
    focusHoursGainedPerDay: 0.35, // ~21 min/day
  },
  finance_law: {
    name: 'Mercado Financeiro & Jurídico',
    description: 'Tomada de decisão sob alta pressão, análise de riscos e necessidade de foco ininterrupto.',
    productivityBasePct: 9.5,
    absenteeismDaysReduced: 3.0,
    turnoverReductionPct: 20,
    focusHoursGainedPerDay: 0.40, // ~24 min/day
  },
  healthcare: {
    name: 'Clínicas & Setor de Saúde',
    description: 'Redução de estresse de pacientes e equipe médica, recuperação sensorial acelerada.',
    productivityBasePct: 11.0,
    absenteeismDaysReduced: 3.6,
    turnoverReductionPct: 22,
    focusHoursGainedPerDay: 0.42, // ~25 min/day
  },
  creative: {
    name: 'Agências, Design & Arquitetura',
    description: 'Processos criativos intensos, geração de insights e colaboração visual.',
    productivityBasePct: 13.5,
    absenteeismDaysReduced: 3.4,
    turnoverReductionPct: 25,
    focusHoursGainedPerDay: 0.52, // ~31 min/day
  },
};

const INTEGRATION_MULTIPLIERS: Record<
  IntegrationLevel,
  {
    name: string;
    factor: number;
    costPerM2: number;
    desc: string;
  }
> = {
  accent: {
    name: 'Destaque Pontual (Accent)',
    factor: 0.75,
    costPerM2: 1250,
    desc: 'Quadros e painéis focais em recepção e salas de reuniões nobres.',
  },
  core: {
    name: 'Integração Central (Core)',
    factor: 1.0,
    costPerM2: 1450,
    desc: 'Paredes verdes de grande formato no open space e áreas de descompressão.',
  },
  immersive: {
    name: 'Imersão 360° (Full Biophilia)',
    factor: 1.35,
    costPerM2: 1750,
    desc: 'Paredes verdes, forros acústicos vegetados e divisórias com musgos e plantas preservadas.',
  },
};

export const BiophilicRoiCalculator: React.FC<BiophilicRoiCalculatorProps> = ({
  onOpenQuote,
  className = '',
  isCompact = false,
}) => {
  // Input States
  const [employees, setEmployees] = useState<number>(45);
  const [salary, setSalary] = useState<number>(8500); // R$/mês
  const [area, setArea] = useState<number>(32); // m²
  const [industry, setIndustry] = useState<IndustryType>('corporate');
  const [level, setLevel] = useState<IntegrationLevel>('core');
  const [timeHorizonYears, setTimeHorizonYears] = useState<1 | 3 | 5>(3);
  const [activeTab, setActiveTab] = useState<'overview' | 'projection' | 'breakdown'>('overview');

  // Multipliers
  const indConfig = INDUSTRY_CONFIG[industry];
  const levelConfig = INTEGRATION_MULTIPLIERS[level];

  // Mathematical & Financial Modeling (Harvard COGfx, Terrapin Bright Green, WGBC)
  const calculation = useMemo(() => {
    // 1. Total Annual Payroll Base (including CLT charges ~1.68x)
    const cltMultiplier = 1.68;
    const monthlyTotalPayroll = employees * salary * cltMultiplier;
    const annualTotalPayroll = monthlyTotalPayroll * 12;

    // Working days per year: ~250 days, 8 hours/day = 2,000 hours/year
    const annualHoursPerEmployee = 2000;
    const hourlyCostPerEmployee = (salary * cltMultiplier * 12) / annualHoursPerEmployee;

    // 2. Initial Turnkey Investment in Preserved Green Wall
    const estimatedInvestment = area * levelConfig.costPerM2;

    // Maintenance cost of Preserved Plants is ZERO irrigation, ZERO hydraulic infrastructure
    // compared to natural live walls that cost ~R$ 180/m²/ano in maintenance and water!
    const annualMaintenanceAvoided = area * 180;

    // 3. Productivity Gain Calculations (Harvard COGfx model: +6% to +14% focus elasticity)
    const effectiveProdPct = (indConfig.productivityBasePct * levelConfig.factor) / 100;
    const annualProductivityGainValue = annualTotalPayroll * (effectiveProdPct * 0.45); // conservative 45% monetization capture

    // 4. Reduced Absenteeism Savings (Terrapin Bright Green model: 2 to 3.8 days saved/year)
    const effectiveDaysSaved = indConfig.absenteeismDaysReduced * levelConfig.factor;
    const dailyCostPerEmployee = hourlyCostPerEmployee * 8;
    const annualAbsenteeismSavings = employees * effectiveDaysSaved * dailyCostPerEmployee;

    // 5. Talent Retention & Turnover Cost Savings (Society for Human Resource Management - SHRM)
    // Average cost to replace an employee = ~30% of annual salary.
    // Biophilic offices reduce annual turnover by ~18% to 25%.
    const baselineTurnoverRate = 0.15; // 15% annual baseline
    const turnoverReductionRate = (indConfig.turnoverReductionPct * levelConfig.factor) / 100;
    const employeesRetainedPerYear = employees * baselineTurnoverRate * turnoverReductionRate;
    const replacementCostPerEmployee = salary * cltMultiplier * 12 * 0.30;
    const annualTurnoverSavings = employeesRetainedPerYear * replacementCostPerEmployee;

    // 6. Energy & HVAC Savings from thermal mass of vertical green wall (~R$ 130/m²/year)
    const annualHvacSavings = area * 140;

    // 7. Aggregate Annual Gross Savings
    const annualTotalGrossSavings =
      annualProductivityGainValue +
      annualAbsenteeismSavings +
      annualTurnoverSavings +
      annualHvacSavings +
      annualMaintenanceAvoided;

    // 8. Cumulative Horizon Savings & Net ROI
    const cumulativeGrossSavings = annualTotalGrossSavings * timeHorizonYears;
    const cumulativeNetSavings = cumulativeGrossSavings - estimatedInvestment;
    const netRoiPercentage = Math.round((cumulativeNetSavings / estimatedInvestment) * 100);

    // 9. Payback Period in Months
    const monthlyGrossSavings = annualTotalGrossSavings / 12;
    const paybackMonths = Number((estimatedInvestment / monthlyGrossSavings).toFixed(1));

    // 10. Multi-year Cashflow Projection Data
    const projectionData = [
      {
        yearLabel: 'Mês 0 (Implantação)',
        mes: 0,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: 0,
        fluxoLiquido: -estimatedInvestment,
        produtividade: 0,
        absenteismo: 0,
        retencao: 0,
        hvac: 0,
      },
      {
        yearLabel: `Mês ${Math.round(paybackMonths)} (Payback)`,
        mes: Math.round(paybackMonths),
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(monthlyGrossSavings * paybackMonths),
        fluxoLiquido: 0,
        produtividade: Math.round(annualProductivityGainValue * (paybackMonths / 12)),
        absenteismo: Math.round(annualAbsenteeismSavings * (paybackMonths / 12)),
        retencao: Math.round(annualTurnoverSavings * (paybackMonths / 12)),
        hvac: Math.round(annualHvacSavings * (paybackMonths / 12)),
      },
      {
        yearLabel: 'Ano 1',
        mes: 12,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(annualTotalGrossSavings * 1),
        fluxoLiquido: Math.round(annualTotalGrossSavings * 1 - estimatedInvestment),
        produtividade: Math.round(annualProductivityGainValue * 1),
        absenteismo: Math.round(annualAbsenteeismSavings * 1),
        retencao: Math.round(annualTurnoverSavings * 1),
        hvac: Math.round(annualHvacSavings * 1),
      },
      {
        yearLabel: 'Ano 2',
        mes: 24,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(annualTotalGrossSavings * 2),
        fluxoLiquido: Math.round(annualTotalGrossSavings * 2 - estimatedInvestment),
        produtividade: Math.round(annualProductivityGainValue * 2),
        absenteismo: Math.round(annualAbsenteeismSavings * 2),
        retencao: Math.round(annualTurnoverSavings * 2),
        hvac: Math.round(annualHvacSavings * 2),
      },
      {
        yearLabel: 'Ano 3',
        mes: 36,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(annualTotalGrossSavings * 3),
        fluxoLiquido: Math.round(annualTotalGrossSavings * 3 - estimatedInvestment),
        produtividade: Math.round(annualProductivityGainValue * 3),
        absenteismo: Math.round(annualAbsenteeismSavings * 3),
        retencao: Math.round(annualTurnoverSavings * 3),
        hvac: Math.round(annualHvacSavings * 3),
      },
      {
        yearLabel: 'Ano 4',
        mes: 48,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(annualTotalGrossSavings * 4),
        fluxoLiquido: Math.round(annualTotalGrossSavings * 4 - estimatedInvestment),
        produtividade: Math.round(annualProductivityGainValue * 4),
        absenteismo: Math.round(annualAbsenteeismSavings * 4),
        retencao: Math.round(annualTurnoverSavings * 4),
        hvac: Math.round(annualHvacSavings * 4),
      },
      {
        yearLabel: 'Ano 5',
        mes: 60,
        investimentoAcumulado: estimatedInvestment,
        economiaAcumulada: Math.round(annualTotalGrossSavings * 5),
        fluxoLiquido: Math.round(annualTotalGrossSavings * 5 - estimatedInvestment),
        produtividade: Math.round(annualProductivityGainValue * 5),
        absenteismo: Math.round(annualAbsenteeismSavings * 5),
        retencao: Math.round(annualTurnoverSavings * 5),
        hvac: Math.round(annualHvacSavings * 5),
      },
    ];

    // Breakdown components for chart
    const breakdownData = [
      {
        categoria: 'Produtividade & Foco',
        valorAnual: Math.round(annualProductivityGainValue),
        percentual: Math.round((annualProductivityGainValue / annualTotalGrossSavings) * 100),
        cor: '#15803d',
        icone: Brain,
      },
      {
        categoria: 'Redução de Absenteísmo',
        valorAnual: Math.round(annualAbsenteeismSavings),
        percentual: Math.round((annualAbsenteeismSavings / annualTotalGrossSavings) * 100),
        cor: '#047857',
        icone: HeartPulse,
      },
      {
        categoria: 'Retenção de Talentos',
        valorAnual: Math.round(annualTurnoverSavings),
        percentual: Math.round((annualTurnoverSavings / annualTotalGrossSavings) * 100),
        cor: '#0d9488',
        icone: Users,
      },
      {
        categoria: 'HVAC & Manutenção Evitada',
        valorAnual: Math.round(annualHvacSavings + annualMaintenanceAvoided),
        percentual: Math.round(((annualHvacSavings + annualMaintenanceAvoided) / annualTotalGrossSavings) * 100),
        cor: '#0284c7',
        icone: Zap,
      },
    ];

    return {
      annualTotalPayroll,
      estimatedInvestment,
      annualProductivityGainValue,
      annualAbsenteeismSavings,
      annualTurnoverSavings,
      annualHvacSavings,
      annualMaintenanceAvoided,
      annualTotalGrossSavings,
      cumulativeGrossSavings,
      cumulativeNetSavings,
      netRoiPercentage,
      paybackMonths,
      projectionData,
      breakdownData,
      effectiveProdPct: Number((effectiveProdPct * 100).toFixed(1)),
      effectiveDaysSaved: Number(effectiveDaysSaved.toFixed(1)),
    };
  }, [employees, salary, area, industry, level, timeHorizonYears, indConfig, levelConfig]);

  // Preset Apply Handler
  const handleApplyPreset = (preset: PresetScenario) => {
    setEmployees(preset.employees);
    setSalary(preset.salary);
    setArea(preset.area);
    setIndustry(preset.industry);
    setLevel(preset.level);
  };

  // Reset to default
  const handleReset = () => {
    setEmployees(45);
    setSalary(8500);
    setArea(32);
    setIndustry('corporate');
    setLevel('core');
    setTimeHorizonYears(3);
  };

  // PDF Business Case Export with jsPDF
  const handleDownloadPdfBusinessCase = () => {
    try {
      const doc = new jsPDF();

      // Top Header Ribbon
      doc.setFillColor(7, 42, 26); // #072a1a
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ALL GREEN DECOR & BIOPHILIA', 15, 16);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Business Case: Estudo de Retorno sobre Investimento (ROI) Biofílico', 15, 24);
      doc.setFontSize(8);
      doc.text('Base Científica: Harvard T.H. Chan COGfx Study & Terrapin Bright Green (The Economics of Biophilia)', 15, 30);

      // Metadata
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 15, 45);
      doc.text(`Ref. Executiva: AG-ROI-${Math.floor(1000 + Math.random() * 9000)}`, 15, 51);

      // Section 1: Inputs
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('1. PREMISSAS DO EMPREENDIMENTO & EQUIPE', 15, 63);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`- Quadro de Colaboradores: ${employees} pessoas`, 20, 71);
      doc.text(`- Salário Médio Mensal: R$ ${salary.toLocaleString('pt-BR')} (Base CLT encargos ~1.68x)`, 20, 77);
      doc.text(`- Setor de Atuação: ${indConfig.name}`, 20, 83);
      doc.text(`- Área Prevista de Jardim Vertical: ${area} m²`, 20, 89);
      doc.text(`- Nível de Integração Biofílica: ${levelConfig.name}`, 20, 95);

      // Section 2: Executive Financial Summary Box
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('2. SUMÁRIO EXECUTIVO FINANCEIRO & PAYBACK', 15, 109);

      doc.setFillColor(243, 247, 244);
      doc.roundedRect(15, 114, 180, 52, 3, 3, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 128, 61);
      doc.text(`- Investimento Inicial Estimado (Turnkey Plug & Play): R$ ${calculation.estimatedInvestment.toLocaleString('pt-BR')}`, 20, 124);
      doc.text(`- Economia Bruta Anual Estimada: R$ ${calculation.annualTotalGrossSavings.toLocaleString('pt-BR')}/ano`, 20, 132);
      doc.text(`- Ponto de Equilíbrio (Payback): ${calculation.paybackMonths} meses`, 20, 140);
      doc.text(`- Retorno Líquido em ${timeHorizonYears} Anos: R$ ${calculation.cumulativeNetSavings.toLocaleString('pt-BR')} (ROI Líquido: +${calculation.netRoiPercentage}%)`, 20, 148);
      doc.text(`- Horas de Foco Cognitivo Ganhas: +${calculation.effectiveProdPct}% de produtividade média`, 20, 156);

      // Section 3: Pilar Breakdown
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('3. DESDOBRAMENTO ANUAL DOS GANHOS POR PILAR', 15, 178);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      calculation.breakdownData.forEach((item, index) => {
        const yPos = 187 + index * 7;
        doc.text(
          `• ${item.categoria}: R$ ${item.valorAnual.toLocaleString('pt-BR')}/ano (${item.percentual}% da economia total)`,
          20,
          yPos
        );
      });

      // Section 4: Technological Advantages of Preserved Green Walls
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('4. VANTAGENS OPERACIONAIS DA VEGETAÇÃO PRESERVADA ALL GREEN', 15, 222);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('• Zero Consumo de Água & Eletricidade: Não requer pontos hidráulicos de irrigação nem bombas.', 20, 230);
      doc.text('• Tratamento Acústico Homologado IPT: Coeficiente de absorção NRC até 0.89 em conformidade ISO 354.', 20, 236);
      doc.text('• Laudo Retardante a Chamas Classe A: Atende aos rigorosos critérios do Corpo de Bombeiros (IT-10).', 20, 242);
      doc.text('• 5 Anos de Garantia Estrutural e Botânica com suporte técnico especializado nacional.', 20, 248);

      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('All Green Decor & Biophilia • sac@allgreendecor.com.br • +55 11 5096-3047 • São Paulo/SP', 15, 275);
      doc.text('Documento gerado automaticamente pela Calculadora de ROI Biofílico All Green Pro.', 15, 280);

      doc.save(`business-case-roi-biofilico-allgreen-${employees}pax-${area}m2.pdf`);
    } catch (e) {
      console.error('PDF Generation Error:', e);
    }
  };

  const handleRequestQuoteWithRoi = () => {
    const summary = `Estudo de ROI Biofílico: ${employees} colaboradores (${indConfig.name}), ${area}m² de parede verde (${levelConfig.name}). Economia anual estimada: R$ ${calculation.annualTotalGrossSavings.toLocaleString('pt-BR')}, Payback: ${calculation.paybackMonths} meses, ROI ${timeHorizonYears} anos: +${calculation.netRoiPercentage}%.`;
    if (onOpenQuote) {
      onOpenQuote(summary);
    }
  };

  return (
    <section
      id="biophilic-roi-calculator"
      className={`bg-gradient-to-b from-[#f3f7f4] via-white to-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/80 transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-[#072a1a] border border-emerald-300 text-xs font-bold shadow-2xs">
              <TrendingUp className="w-4 h-4 text-[#15803d]" />
              <span className="uppercase tracking-wider">ESTUDO DE VIABILIDADE & PRODUTIVIDADE CORPORATIVA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-950 leading-tight">
              Calculadora de ROI Biofílico <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">Retorno Financeiro & Redução de Absenteísmo</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Descubra o impacto financeiro mensurável da inserção de vegetação natural preservada All Green. 
              Estimativas baseadas nos estudos científicos da <strong>Harvard T.H. Chan</strong> e <strong>Terrapin Bright Green</strong>.
            </p>

            {/* Quick Preset Selector Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#15803d]" /> Cenários Típicos:
              </span>
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer bg-white hover:bg-emerald-50 text-gray-800 border-gray-300 hover:border-emerald-500 shadow-2xs hover:scale-102 flex items-center gap-1.5"
                >
                  <span>{preset.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-[#15803d] font-bold">
                    {preset.employees} pax
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Main Interactive Grid: Controls (Left) & Results/Visualizations (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Parametric Inputs Panel (5 cols) */}
          <ScrollReveal animation="fade-right" delay={0.1} distance={25} className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#15803d]" />
                  <h3 className="font-serif font-bold text-gray-900 text-lg">
                    Parâmetros da Empresa
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-[#15803d] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Restaurar padrões"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
              </div>

              {/* 1. Headcount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#15803d]" />
                    Nº de Colaboradores Beneficiados:
                  </span>
                  <span className="font-mono text-base font-bold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {employees} pessoas
                  </span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={350}
                  step={5}
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
                />

                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>5 pax</span>
                  <span>100 pax</span>
                  <span>200 pax</span>
                  <span>350 pax</span>
                </div>
              </div>

              {/* 2. Salary Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#15803d]" />
                    Salário Médio Bruto Mensal:
                  </span>
                  <span className="font-mono text-base font-bold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    R$ {salary.toLocaleString('pt-BR')}/mês
                  </span>
                </div>

                <input
                  type="range"
                  min={3000}
                  max={30000}
                  step={500}
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
                />

                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>R$ 3.000</span>
                  <span>R$ 15.000</span>
                  <span>R$ 30.000</span>
                </div>
              </div>

              {/* 3. Green Wall Area Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#15803d]" />
                    Área Total do Jardim Vertical:
                  </span>
                  <span className="font-mono text-base font-bold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {area} m²
                  </span>
                </div>

                <input
                  type="range"
                  min={6}
                  max={120}
                  step={2}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
                />

                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>6 m² (Focal)</span>
                  <span>50 m² (Amplo)</span>
                  <span>120 m² (Edifício)</span>
                </div>
              </div>

              {/* 4. Industry Sector Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Setor de Atuação / Atividade:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'corporate', label: 'Corporativo & Serviços' },
                      { id: 'tech', label: 'Tech & Startups' },
                      { id: 'finance_law', label: 'Financeiro & Jurídico' },
                      { id: 'healthcare', label: 'Saúde & Clínicas' },
                      { id: 'creative', label: 'Agências & Design' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIndustry(item.id)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                        industry === item.id
                          ? 'bg-[#072a1a] text-white border-[#072a1a] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 italic mt-1">
                  {indConfig.description}
                </p>
              </div>

              {/* 5. Integration Level (Accent vs Core vs Immersive) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Intensidade da Aplicação Biofílica:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['accent', 'core', 'immersive'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        level === lvl
                          ? 'bg-[#15803d] text-white border-[#15803d] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      <span>{lvl === 'accent' ? 'Pontual' : lvl === 'core' ? 'Central' : 'Imersivo'}</span>
                      <span className="text-[9px] opacity-85 font-mono">
                        {lvl === 'accent' ? '+4.5%' : lvl === 'core' ? '+9.0%' : '+14.5%'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Time Horizon Selector */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Horizonte de Análise Financeira:</span>
                  <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {[1, 3, 5].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setTimeHorizonYears(years as 1 | 3 | 5)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          timeHorizonYears === years
                            ? 'bg-[#072a1a] text-white shadow-2xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {years} {years === 1 ? 'Ano' : 'Anos'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPdfBusinessCase}
                  className="w-full py-3 px-4 bg-[#072a1a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.01] active:scale-98"
                >
                  <Download className="w-4 h-4 text-[#86efac]" />
                  <span>Baixar Business Case Executivo (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestQuoteWithRoi}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold rounded-xl text-xs border border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Solicitar Proposta Baseada Neste Estudo</span>
                  <ChevronRight className="w-4 h-4 text-[#15803d]" />
                </button>
              </div>

            </div>
          </ScrollReveal>

          {/* RIGHT: Financial Results, KPI Strip & Visualizations (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Financial Hero Card */}
            <ScrollReveal animation="fade-up" delay={0.15} distance={20}>
              <div className="bg-gradient-to-br from-[#062316] via-[#072a1a] to-[#041a10] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
                
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  
                  {/* Top ribbon */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                        Retorno Líquido Projetado ({timeHorizonYears} {timeHorizonYears === 1 ? 'Ano' : 'Anos'})
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                        R$ {calculation.cumulativeNetSavings.toLocaleString('pt-BR')}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-[#86efac] text-[#072a1a] font-mono font-extrabold text-xs shadow-md">
                        +{calculation.netRoiPercentage}% ROI Líquido
                      </span>
                    </div>
                  </div>

                  {/* 3 Core Highlight Badges */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/70">
                      <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                        Tempo de Payback
                      </span>
                      <p className="text-xl sm:text-2xl font-mono font-bold text-white mt-0.5">
                        {calculation.paybackMonths} <span className="text-xs font-sans font-normal text-emerald-300">meses</span>
                      </p>
                      <span className="text-[9px] text-emerald-400/80 block mt-0.5">Ponto de Equilíbrio</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/70">
                      <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                        Economia Anual
                      </span>
                      <p className="text-lg sm:text-xl font-mono font-bold text-[#86efac] mt-0.5 truncate">
                        R$ {Math.round(calculation.annualTotalGrossSavings / 1000)}k<span className="text-xs text-emerald-200">/ano</span>
                      </p>
                      <span className="text-[9px] text-emerald-400/80 block mt-0.5">Produtiv. + Faltas</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/70">
                      <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                        Investimento Turnkey
                      </span>
                      <p className="text-lg sm:text-xl font-mono font-bold text-white mt-0.5 truncate">
                        R$ {Math.round(calculation.estimatedInvestment / 1000)}k
                      </p>
                      <span className="text-[9px] text-emerald-400/80 block mt-0.5">Plug & Play All Green</span>
                    </div>
                  </div>

                  {/* Scientific Citations note */}
                  <div className="flex items-center gap-2 text-xs text-emerald-200/80 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                    <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>
                      Harvard T.H. Chan comprovou ganho de até +15% em foco cognitivo e -30% em queixas de dores de cabeça e fadiga em ambientes com biofilia ativa.
                    </span>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* Sub-Tabs for Analytics (Overview vs Projection vs Breakdown) */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-md space-y-5">
              
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'overview'
                        ? 'bg-white text-[#072a1a] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pilares de Economia
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('projection')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'projection'
                        ? 'bg-white text-[#072a1a] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Curva de Fluxo de Caixa
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('breakdown')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'breakdown'
                        ? 'bg-white text-[#072a1a] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Detalhamento (%)
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-gray-500 hidden sm:inline">
                  {employees} colaboradores • {area} m²
                </span>
              </div>

              {/* TAB 1: 4 Pillars of Economy Cards */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Pillar 1: Productivity */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider flex items-center gap-1.5">
                        <Brain className="w-4 h-4" /> Produtividade Cognitiva
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-200/80 text-[#072a1a] font-mono text-[10px] font-bold rounded">
                        +{calculation.effectiveProdPct}% Foco
                      </span>
                    </div>
                    <p className="text-xl font-mono font-extrabold text-gray-900">
                      R$ {calculation.annualProductivityGainValue.toLocaleString('pt-BR')}
                      <span className="text-xs text-gray-500 font-sans font-normal">/ano</span>
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Recuperação de ~{Math.round(indConfig.focusHoursGainedPerDay * 60)} min/dia de concentração profunda por colaborador.
                    </p>
                  </div>

                  {/* Pillar 2: Reduced Absenteeism */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4" /> Absenteísmo Evitado
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-200/80 text-[#072a1a] font-mono text-[10px] font-bold rounded">
                        -{calculation.effectiveDaysSaved} dias/ano
                      </span>
                    </div>
                    <p className="text-xl font-mono font-extrabold text-gray-900">
                      R$ {calculation.annualAbsenteeismSavings.toLocaleString('pt-BR')}
                      <span className="text-xs text-gray-500 font-sans font-normal">/ano</span>
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Redução comprovada de afastamentos por estresse, cefaleia e sobrecarga mental.
                    </p>
                  </div>

                  {/* Pillar 3: Retention & Turnover */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> Retenção de Talentos
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-200/80 text-[#072a1a] font-mono text-[10px] font-bold rounded">
                        -{indConfig.turnoverReductionPct}% Turnover
                      </span>
                    </div>
                    <p className="text-xl font-mono font-extrabold text-gray-900">
                      R$ {calculation.annualTurnoverSavings.toLocaleString('pt-BR')}
                      <span className="text-xs text-gray-500 font-sans font-normal">/ano</span>
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Menor rotatividade voluntária e redução drástica de custos de recrutamento e onboarding.
                    </p>
                  </div>

                  {/* Pillar 4: HVAC & Zero Maintenance */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> HVAC & Zero Rega
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-200/80 text-[#072a1a] font-mono text-[10px] font-bold rounded">
                        100% Preservado
                      </span>
                    </div>
                    <p className="text-xl font-mono font-extrabold text-gray-900">
                      R$ {(calculation.annualHvacSavings + calculation.annualMaintenanceAvoided).toLocaleString('pt-BR')}
                      <span className="text-xs text-gray-500 font-sans font-normal">/ano</span>
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      Isolamento térmico passivo e eliminação de R$ 180/m² em água e jardineiros.
                    </p>
                  </div>

                </div>
              )}

              {/* TAB 2: Cumulative Cash Flow Projection Chart */}
              {activeTab === 'projection' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-semibold">Projeção Acumulada de Fluxo Líquido (R$)</span>
                    <span className="text-emerald-700 font-bold">Ponto de Equilíbrio aos {calculation.paybackMonths} meses</span>
                  </div>

                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={calculation.projectionData}
                        margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="yearLabel"
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(val) => `R$${Math.round(val / 1000)}k`}
                        />
                        <RechartsTooltip
                          formatter={(value: any, name: any) => {
                            const valNum = Number(value) || 0;
                            const formatted = `R$ ${valNum.toLocaleString('pt-BR')}`;
                            if (name === 'fluxoLiquido') return [formatted, 'Saldo Líquido Acumulado'];
                            if (name === 'economiaAcumulada') return [formatted, 'Economia Total Bruta'];
                            if (name === 'investimentoAcumulado') return [formatted, 'Investimento Inicial'];
                            return [formatted, name];
                          }}
                          contentStyle={{
                            backgroundColor: '#072a1a',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '11px',
                            border: '1px solid #15803d',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                        <Area
                          type="monotone"
                          dataKey="fluxoLiquido"
                          name="Saldo Líquido Acumulado"
                          fill="#86efac"
                          fillOpacity={0.25}
                          stroke="#15803d"
                          strokeWidth={3}
                        />

                        <Line
                          type="monotone"
                          dataKey="economiaAcumulada"
                          name="Economia Bruta"
                          stroke="#0284c7"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />

                        <Line
                          type="monotone"
                          dataKey="investimentoAcumulado"
                          name="Custo Inicial"
                          stroke="#dc2626"
                          strokeDasharray="4 4"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* TAB 3: Category Breakdown Bar Chart */}
              {activeTab === 'breakdown' && (
                <div className="space-y-4">
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={calculation.breakdownData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          type="number"
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(val) => `R$${Math.round(val / 1000)}k`}
                        />
                        <YAxis
                          type="category"
                          dataKey="categoria"
                          stroke="#64748b"
                          tick={{ fontSize: 10 }}
                          width={140}
                        />
                        <RechartsTooltip
                          formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}/ano`, 'Economia Anual']}
                          contentStyle={{
                            backgroundColor: '#072a1a',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '11px',
                            border: '1px solid #15803d',
                          }}
                        />
                        <Bar dataKey="valorAnual" name="Economia Anual Estimada" radius={[0, 8, 8, 0]}>
                          {calculation.breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                    {calculation.breakdownData.map((b) => (
                      <div key={b.categoria} className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-500 block truncate">{b.categoria}</span>
                        <span className="font-bold text-gray-900 font-mono block mt-0.5">{b.percentual}%</span>
                        <span className="text-[10px] text-[#15803d] font-mono">R$ {Math.round(b.valorAnual / 1000)}k/a</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
