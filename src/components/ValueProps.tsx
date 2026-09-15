import React from 'react';
import { ShieldCheck, Droplets, Volume2, Award, Sparkles, Compass, CheckCircle2, Leaf, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ValueProps: React.FC = () => {
  const pillars = [
    {
      roman: 'I',
      code: 'ESTAB-BIO',
      title: 'Substituição Molecular por Seiva Vegetal',
      subtitle: 'A folha permanece viva ao toque por mais de uma década',
      desc: 'No ateliê All Green, a água celular das plantas é gradualmente substituída por um composto ecológico de glicerina vegetal pura e sais minerais. A clorofila, a flexibilidade e a textura aveludada original são preservadas no tempo — sem luz solar, terra ou rega.',
      metric: '100% Orgânico',
      metricLabel: 'Zero químicos tóxicos',
      icon: Leaf,
    },
    {
      roman: 'II',
      code: 'IPT-ISO354',
      title: 'Engenharia Acústica Passiva (NRC 0.89)',
      subtitle: 'Atenuação drástica da reverberação e eco em escritórios',
      desc: 'A macroestrutura alveolar do musgo polar escandinavo e da folhagem preservada atua como um difusor acústico tridimensional de alta performance. Ensaiado em câmara reverberante (ISO 354), reduz o ruído da fala humana e a fadiga cognitiva.',
      metric: 'NRC 0.89',
      metricLabel: 'Laudo IPT Certificado',
      icon: Volume2,
    },
    {
      roman: 'III',
      code: 'PLUG-PLAY',
      title: 'Montagem Mecânica Limpa & Zero Risco Predial',
      subtitle: 'Fixação em drywall sem tubulação de água ou impermeabilização',
      desc: 'Eliminamos 100% dos riscos associados a jardins verticais vivos: vazamentos em lajes, entupimento de calhas, mofo, pragas e custos contínuos de jardinagem. Módulos leves com travamento oculto instalados sem sujeira em poucas horas.',
      metric: '0 L/ano',
      metricLabel: 'Sem ponto hidráulico',
      icon: Droplets,
    },
    {
      roman: 'IV',
      code: 'WELL-LEED',
      title: 'Homologação Técnica WELL v2 & LEED v4.1',
      subtitle: 'Pontuação comprovada para certificações internacionais de sustentabilidade',
      desc: 'Nossas composições botânicas atendem aos mais rigorosos critérios de materiais renováveis, qualidade do ar interno (baixo VOC) e conforto neurobiológico, elevando o valor venal e o prestígio patrimonial do edifício.',
      metric: '+12 Pts',
      metricLabel: 'Créditos WELL & LEED',
      icon: Award,
    },
  ];

  return (
    <section id="manifesto-botanico" className="bg-[#fbfcf9] py-16 md:py-28 border-b border-emerald-950/10 relative overflow-hidden bg-grain-subtle">
      {/* Background architectural watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full border border-emerald-900/5 pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[850px] h-[850px] rounded-full border border-emerald-900/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Editorial Row: Manifesto Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pb-14 border-b border-emerald-900/10">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-amber-800 uppercase font-semibold">
                TRATADO DE BIOFILIA ARQUITETÔNICA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span className="font-mono text-xs tracking-wider text-emerald-800 uppercase">
                VOL. IV
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#072a1a] tracking-tight leading-[1.12]">
              A arquitetura do toque & <br />
              a ciência da <span className="italic font-light text-emerald-800">imortalidade vegetal.</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans font-normal pt-1">
              Diferente das plantas de plástico artificiais ou dos dispendiosos jardins hidropônicos vivos que secam em meses, a All Green desenvolveu uma disciplina botânica autoral: a preservação perpétua.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#f4f7f4] p-6 sm:p-8 rounded-3xl border border-emerald-900/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-800 uppercase tracking-widest font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Manifesto do Ateliê All Green
              </span>
              <span className="font-mono text-xs text-gray-500">São Paulo, Brasil</span>
            </div>

            <p className="dropcap font-serif text-gray-800 text-lg sm:text-xl leading-relaxed italic">
              Acreditamos que o homem contemporâneo adoece quando apartado da floresta. Mas sabemos que a rotina das cidades e a infraestrutura dos edifícios corporativos não comportam vazamentos, podas semanais e custos ocultos de jardinagem. Por isso, fundamos a intersecção perfeita entre o rigor da arquitetura de precisão e a poesia da botânica preservada.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-600 border-t border-emerald-900/10">
              <span>CONTROLE BIOLÓGICO RASTREADO</span>
              <span>•</span>
              <span>ZERO EMISSÃO DE POLUENTES (VOC FREE)</span>
              <span>•</span>
              <span className="text-emerald-800 font-bold">10 ANOS DE GARANTIA</span>
            </div>
          </div>

        </div>

        {/* Four Architectural Plates (Asymmetric Editorial Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal
                key={pillar.code}
                animation="fade-up"
                delay={idx * 0.1}
                distance={24}
                className="h-full"
              >
                <div className="bg-white p-7 sm:p-9 rounded-3xl border border-emerald-900/10 shadow-xs hover:shadow-xl hover:border-emerald-700/40 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden">
                  
                  {/* Subtle corner roman numeral */}
                  <span className="absolute top-4 right-6 font-serif text-5xl font-light text-emerald-900/5 select-none pointer-events-none group-hover:text-emerald-900/10 transition-colors">
                    {pillar.roman}
                  </span>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-mono font-bold tracking-wider uppercase border border-emerald-200/80">
                        <span>PILARES ALL GREEN</span>
                        <span>•</span>
                        <span>{pillar.code}</span>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-[#072a1a] text-[#86efac] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#072a1a] group-hover:text-emerald-800 transition-colors leading-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-serif italic text-emerald-800/80 mt-1">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm font-sans leading-relaxed font-normal pt-1">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Bottom Metrology Plate */}
                  <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between relative z-10">
                    <div>
                      <span className="font-serif text-2xl font-bold text-[#072a1a]">
                        {pillar.metric}
                      </span>
                      <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        {pillar.metricLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-emerald-800 group-hover:translate-x-1 transition-transform">
                      <span>Memorial Técnico</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
