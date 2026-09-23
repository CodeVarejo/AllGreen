import React, { useState } from 'react';
import { Camera, Layers, Wrench, ShieldCheck, ArrowRight, Sparkles, BookOpen, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface MethodologyStepsProps {
  onOpenSimulator: () => void;
  onOpenQuote: () => void;
}

export const MethodologySteps: React.FC<MethodologyStepsProps> = ({
  onOpenSimulator,
  onOpenQuote,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      stage: 'ETAPA INICIAL • CONCEPT',
      title: 'Diagnóstico Digital & Simulação IA',
      subtitle: 'Uma fotografia do seu espaço é o ponto de partida',
      desc: 'Nossa inteligência artificial analisa a geometria do ambiente, incidência lumínica e mobiliário existente, projetando em segundos uma composição biofílica fotorrealista para você e seus clientes avaliarem antes de qualquer intervenção física.',
      tools: ['Visão Computacional Gemini IA', 'Renderização Instantânea', 'Estimativa Orçamentária Paramétrica'],
      materialNote: 'Sem compromisso comercial prévio • Acesso instantâneo via browser',
      actionLabel: 'Abrir Simulador Agora',
      isSimulatorAction: true,
    },
    {
      num: '02',
      stage: 'CURADORIA BOTÂNICA • ATELIÊ',
      title: 'Seleção das Espécies & Amostras Físicas',
      subtitle: 'Composição sob medida para harmonizar com a paleta do projeto',
      desc: 'Nossa equipe de biólogos e designers botânicos combina texturas de Musgo Polar escandinavo, Samambaias imperiais e Folhas de Eucalipto preservadas. Enviamos a caixa de amostras físicas de toque real para validação em prancha de materiais com o cliente.',
      tools: ['Caixa de Amostras Físicas', 'Estudo de Densidade por m²', 'Equilíbrio Cromático Orgânico'],
      materialNote: 'Plantas 100% naturais preservadas em seiva vegetal ecológica',
      actionLabel: 'Solicitar Caixa de Amostras',
      isSimulatorAction: false,
    },
    {
      num: '03',
      stage: 'ENGENHARIA FABRIL • PRECISION',
      title: 'Usinagem Modular Plug & Play',
      subtitle: 'Módulos milimétricos com fixação mecânica oculta',
      desc: 'Toda a montagem é executada em nosso ateliê industrial em São Paulo. As placas recebem suporte em compensado naval certificado FSC com engate macho/fêmea oculto. Zero marcenaria úmida ou barulho prolongado na sua obra.',
      tools: ['Corte Computadorizado CNC', 'Painéis Ultraleves (14 kg/m²)', 'Travamento Francês Invisível'],
      materialNote: 'Compatível com qualquer parede (Drywall, Alvenaria ou Concreto)',
      actionLabel: 'Consultar Memorial Fabril',
      isSimulatorAction: false,
    },
    {
      num: '04',
      stage: 'INSTALAÇÃO LIMPA • FINAL TOUCH',
      title: 'Fixação em Poucas Horas & Garantia Decenal',
      subtitle: 'Sem água, sem tubulações, sem manutenções surpresa',
      desc: 'Instaladores certificados realizam a fixação limpa em um único período — frequentemente durante o fim de semana para não interromper a rotina corporativa. Entregamos o certificado de garantia de 10 anos e laudos IPT de isolamento acústico e fogo.',
      tools: ['Instalação Silenciosa', 'Laudo IPT ISO 354', 'Certificado 10 Anos All Green'],
      materialNote: 'Zero custos recorrentes de irrigação, jardineiro ou troca de mudas',
      actionLabel: 'Agendar Visita Técnica',
      isSimulatorAction: false,
    },
  ];

  return (
    <section id="metodologia-ateliê" className="bg-[#051c11] text-white py-16 md:py-28 relative overflow-hidden bg-grain-dark border-y border-emerald-900/50">
      
      {/* Delicate organic glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <ScrollReveal animation="fade-up" distance={20}>
          <div className="max-w-3xl space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.12]">
              Do conceito inicial à instalação em <br />
              <span className="italic font-light text-[#86efac]">quatro etapas estruturadas.</span>
            </h2>

            <p className="text-emerald-100/70 text-base sm:text-lg font-sans font-light leading-relaxed">
              Processo turnkey completo para arquitetura de interiores com previsibilidade orçamentária e sem reformas hidráulicas.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Editorial Stepper & Journal Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 items-stretch">
          
          {/* Left Column: Timeline Selectors */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {steps.map((s, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 group ${
                    isSelected
                      ? 'bg-emerald-950/90 border-[#86efac]/70 shadow-xl shadow-emerald-950/80 scale-[1.01]'
                      : 'bg-emerald-950/30 border-emerald-900/50 hover:bg-emerald-950/60 hover:border-emerald-800'
                  }`}
                >
                  <span className={`font-serif text-2xl sm:text-3xl font-bold transition-colors ${
                    isSelected ? 'text-[#86efac]' : 'text-emerald-500/60 group-hover:text-emerald-400'
                  }`}>
                    {s.num}
                  </span>

                  <div className="space-y-1 flex-1">
                    <span className="font-mono text-[10px] tracking-wider uppercase block text-emerald-400 font-semibold">
                      {s.stage}
                    </span>
                    <h3 className={`font-serif text-lg sm:text-xl font-semibold transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {s.title}
                    </h3>
                  </div>

                  <ChevronRight className={`w-5 h-5 transition-transform mt-2 ${
                    isSelected ? 'text-[#86efac] translate-x-1' : 'text-emerald-700/60 group-hover:text-emerald-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Expanded Architectural Spec Sheet for Active Step */}
          <div className="lg:col-span-7 bg-emerald-950/70 p-6 sm:p-10 rounded-3xl border border-emerald-700/60 shadow-2xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Spec Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#86efac] text-[#051c11] flex items-center justify-center font-bold text-sm">
                    {steps[activeStep].num}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold block">
                      {steps[activeStep].stage}
                    </span>
                    <span className="font-serif italic text-emerald-200 text-sm">
                      {steps[activeStep].subtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                  {steps[activeStep].title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans font-light">
                  {steps[activeStep].desc}
                </p>
              </div>

              {/* Tools & Deliverables Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono tracking-wider text-emerald-400 uppercase block font-semibold">
                  Entregáveis & Especificação:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {steps[activeStep].tools.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-200 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#86efac] shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action for this step */}
            <div className="pt-8 mt-8 border-t border-emerald-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  if (steps[activeStep].isSimulatorAction) {
                    onOpenSimulator();
                  } else {
                    onOpenQuote();
                  }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#86efac] text-[#051c11] font-bold rounded-full hover:bg-emerald-300 transition-all shadow-lg cursor-pointer text-sm"
              >
                <span>{steps[activeStep].actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-right text-[11px] font-mono text-emerald-400/80">
                <span>Passo {activeStep + 1} de 4 • Garantia Total de Fábrica</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
