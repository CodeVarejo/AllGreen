import React from 'react';
import { Volume2, Droplets, Award, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ValueProps: React.FC = () => {
  const { language } = useLanguage();

  const isPt = language === 'pt';

  const pillars = [
    {
      title: isPt ? 'Preservação por Seiva Vegetal' : 'Cellular Sap Preservation',
      desc: isPt
        ? 'Substituição gradual da água celular por composto ecológico de glicerina e sais minerais. A folhagem mantém toque macio e cor viva sem terra, sol ou rega.'
        : 'Gradual replacement of cellular water with an eco-friendly compound of vegetable glycerin and minerals. Foliage retains soft touch and color with zero soil, sunlight, or watering.',
      metric: '0 L / ano',
      metricLabel: isPt ? 'Sem ponto hidráulico' : 'Zero plumbing connection',
      icon: Leaf,
    },
    {
      title: isPt ? 'Atenuação Acústica NRC 0.89' : 'Acoustic Attenuation NRC 0.89',
      desc: isPt
        ? 'A macroestrutura alveolar do musgo polar e das folhagens atua como difusor acústico tridimensional, atenuando a reverberação de voz em escritórios.'
        : 'The cellular honeycomb structure of reindeer moss and foliage functions as a 3D acoustic diffuser, effectively cutting voice reverberation in workspaces.',
      metric: 'NRC 0.89',
      metricLabel: isPt ? 'Laudo IPT ISO 354' : 'IPT ISO 354 Certified',
      icon: Volume2,
    },
    {
      title: isPt ? 'Montagem Mecânica Limpa' : 'Clean Mechanical Assembly',
      desc: isPt
        ? 'Módulos leves com encaixe oculto fixados diretamente em drywall, alvenaria ou concreto. Sem risco de vazamentos prediais ou reformas estruturais.'
        : 'Lightweight concealed-interlocking modules mounted onto drywall, masonry or concrete. Zero structural remodeling or leak hazards.',
      metric: 'Plug & Play',
      metricLabel: isPt ? 'Instalação em horas' : 'Hours-fast install',
      icon: Droplets,
    },
    {
      title: isPt ? 'Créditos WELL & LEED' : 'WELL & LEED Credits',
      desc: isPt
        ? 'Composição livre de compostos orgânicos voláteis (VOC free), certificada para pontuação nos critérios de neuroarquitetura e qualidade do ambiente interno.'
        : 'Zero VOC formulation tested and certified to yield direct neuroarchitecture and indoor environmental quality credits.',
      metric: '+12 Pts',
      metricLabel: isPt ? 'Homologação Green Building' : 'Green Building Certified',
      icon: Award,
    },
  ];

  return (
    <section id="manifesto-botanico" className="bg-[#fbfcf9] py-16 md:py-24 border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#072a1a] tracking-tight leading-tight">
            {isPt ? (
              <>
                Engenharia botânica para <br />
                <span className="italic font-light text-emerald-800">arquitetura perene.</span>
              </>
            ) : (
              <>
                Botanical engineering for <br />
                <span className="italic font-light text-emerald-800">perennial architecture.</span>
              </>
            )}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed pt-3 font-normal">
            {isPt
              ? 'Eliminamos os custos contínuos de jardinagem, riscos de infiltração e descarte de plantas mortas com tecnologia de preservação vegetal testada e homologada.'
              : 'Eliminate recurring landscaping costs, structural leak hazards, and plant mortality with certified, lab-tested plant preservation technology.'}
          </p>
        </div>

        {/* 4 Clean Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-700/30 transition-all shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#072a1a] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="font-serif text-xl font-bold text-[#072a1a]">
                    {item.metric}
                  </div>
                  <div className="text-xs text-gray-500 font-sans">
                    {item.metricLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
