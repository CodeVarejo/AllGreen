import React from 'react';
import { Camera, Layers, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { PageHeader } from './PageHeader';

interface MethodologyStepsProps {
  onOpenSimulator: () => void;
  onOpenQuote: () => void;
}

export const MethodologySteps: React.FC<MethodologyStepsProps> = ({
  onOpenSimulator,
  onOpenQuote,
}) => {
  const steps = [
    {
      num: '01',
      icon: Camera,
      tag: 'SEM CADASTRO OU COMPLICAÇÕES',
      title: 'Simulação Instantânea por IA',
      desc: 'Envie a foto do seu ambiente e receba a visualização realista de como a parede verde se integrará com a sua mobília e iluminação.',
      badge: '✓ Grátis & Instantâneo',
    },
    {
      num: '02',
      icon: Layers,
      tag: 'DESENHO EXCLUSIVO SOB MEDIDA',
      title: 'Projeto & Seleção Botânica',
      desc: 'Nossa curadoria seleciona a densidade, texturas e espécies botânicas (preservadas ou artificiais premium anti-UV) adequadas à arquitetura do seu espaço.',
      badge: '✓ Amostras Físicas Disponíveis',
    },
    {
      num: '03',
      icon: Wrench,
      tag: 'SEM REFORMAS OU QUEBRA-QUEBRA',
      title: 'Instalação Rápida e Limpa',
      desc: 'Módulos produzidos sob medida na fábrica. A fixação é precisa, ultraleve e concluída em poucas horas por instaladores certificados.',
      badge: '✓ Instalação em poucas horas',
    },
    {
      num: '04',
      icon: ShieldCheck,
      tag: 'VERDE PERFEITO O ANO TODO',
      title: 'Garantia & Zero Manutenção',
      desc: 'Entregamos o certificado de garantia estrutural e ignífuga. Desfrute da beleza natural sem preocupações com água, pragas ou podas.',
      badge: '✓ Garantia de Fábrica',
    },
  ];

  return (
    <section className="bg-[#072a1a] text-white py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <PageHeader
            theme="dark"
            align="center"
            badge="METODOLOGIA TURNKEY ALL GREEN"
            badgeIcon={Layers}
            title={
              <>
                Do conceito à transformação em <br className="hidden sm:inline" />
                <span className="italic font-light text-emerald-300">4 passos simples</span>
              </>
            }
            description="Inspirado nos mais rigorosos processos de arquitetura paisagística corporativa e residencial. Cuidamos de todas as etapas com agilidade e precisão."
          />
        </ScrollReveal>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <ScrollReveal
                key={step.num}
                animation="fade-up"
                delay={idx * 0.1}
                distance={28}
                className="h-full"
              >
                <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/60 shadow-lg flex flex-col justify-between hover:border-emerald-500 hover:-translate-y-1 transition-all group h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl font-extrabold text-emerald-400/80">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        {step.tag}
                      </span>
                      <h3 className="font-serif font-bold text-white text-lg mt-1 group-hover:text-emerald-300 transition-colors">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-emerald-800/50">
                    <span className="text-[11px] font-semibold text-emerald-300">
                      {step.badge}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA Buttons */}
        <ScrollReveal animation="fade-up" delay={0.2} distance={20}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenSimulator}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#86efac] text-[#072a1a] font-bold rounded-full hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4 text-[#072a1a]" />
              <span>Iniciar Passo 1: Enviar Foto do Espaço</span>
            </button>

            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-semibold rounded-full border border-emerald-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Solicitar Orçamento Executivo</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
