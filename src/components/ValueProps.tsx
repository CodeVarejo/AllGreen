import React from 'react';
import { ShieldCheck, Truck, CheckCircle2, Ribbon } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ValueProps: React.FC = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Excelência em Biofilia',
      desc: 'Soluções hiper-realistas para projetos de alto padrão',
    },
    {
      icon: Truck,
      title: 'Atendimento Nacional',
      desc: 'Projetos diretos e sistema modular pronto para instalar',
    },
    {
      icon: CheckCircle2,
      title: 'Instalação Limpa',
      desc: 'Sem sujeira, irrigação ou manutenção constante',
    },
    {
      icon: Ribbon,
      title: 'Garantia de Qualidade',
      desc: 'Materiais selecionados com proteção UV e toque natural',
    },
  ];

  return (
    <section className="bg-[#f3f7f4] py-10 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 0.1}
                distance={24}
              >
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4 hover:border-emerald-600/40 hover:shadow-md transition-all group h-full">
                  <div className="w-11 h-11 rounded-xl bg-[#072a1a] text-[#86efac] flex items-center justify-center shrink-0 group-hover:bg-[#15803d] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
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
