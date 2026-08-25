import React, { useState } from 'react';
import { COMPARISON_MATRIX } from '../data/mockData';
import { ShieldCheck, Droplets, Sun, Wrench, Volume2, Scale, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ComparisonMatrix: React.FC = () => {
  const [techFilter, setTechFilter] = useState<'all' | 'preservado' | 'permanente' | 'natural'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-4 h-4 text-[#15803d]" />;
      case 'Sun': return <Sun className="w-4 h-4 text-[#15803d]" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-[#15803d]" />;
      case 'Volume2': return <Volume2 className="w-4 h-4 text-[#15803d]" />;
      case 'ShieldAlert': return <ShieldCheck className="w-4 h-4 text-[#15803d]" />;
      case 'Scale': return <Scale className="w-4 h-4 text-[#15803d]" />;
      default: return <CheckCircle2 className="w-4 h-4 text-[#15803d]" />;
    }
  };

  return (
    <section id="comparison-matrix" className="bg-[#f9fbf9] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full">
              PADRÃO TÉCNICO ALL GREEN (BENCHMARK DE MERCADO)
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              Matriz Comparativa das <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">Tecnologias Verticais</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Compreenda a diferença técnica entre Jardins Preservados, Permanentes (Artificiais Premium) e Naturais Vivos. Escolha a solução exata para a especificação do seu projeto imobiliário ou corporativo.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Pills */}
        <ScrollReveal animation="fade-up" delay={0.1} distance={15}>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-6 mt-4">
            <button
              onClick={() => setTechFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                techFilter === 'all' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
              }`}
            >
              Todas as Tecnologias
            </button>
            <button
              onClick={() => setTechFilter('preservado')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                techFilter === 'preservado' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
              }`}
            >
              Preservado Natural
            </button>
            <button
              onClick={() => setTechFilter('permanente')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                techFilter === 'permanente' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
              }`}
            >
              Permanente UV Premium
            </button>
            <button
              onClick={() => setTechFilter('natural')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                techFilter === 'natural' ? 'bg-[#072a1a] text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-emerald-50'
              }`}
            >
              Natural Vivo
            </button>
          </div>
        </ScrollReveal>

        {/* Comparison Table Box */}
        <ScrollReveal animation="fade-up" delay={0.15} distance={25}>
          <div className="mt-4 bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-x-auto">
            <table 
              className="w-full text-left border-collapse min-w-[750px]"
              role="table"
              aria-label="Matriz Comparativa das Tecnologias Verticais All Green"
            >
              <caption className="sr-only font-serif text-[#072a1a] font-bold py-2">
                Matriz Comparativa Técnica entre Jardim Preservado 100% Natural, Permanente Anti-UV e Natural Vivo Hidropônico
              </caption>
              <thead>
                <tr className="border-b border-gray-200 bg-emerald-50/60">
                  <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                    Critério de Especificação
                  </th>

                  {(techFilter === 'all' || techFilter === 'preservado') && (
                    <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-[#072a1a]">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-800" aria-hidden="true" />
                          Jardim Preservado
                        </span>
                        <span className="text-[10px] font-sans font-normal text-gray-600">
                          100% Botânico Natural Estabilizado
                        </span>
                      </div>
                    </th>
                  )}

                  {(techFilter === 'all' || techFilter === 'permanente') && (
                    <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-[#072a1a]">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-800" aria-hidden="true" />
                          Permanente Premium
                        </span>
                        <span className="text-[10px] font-sans font-normal text-gray-600">
                          Articulado Hiper-realista + Anti-UV
                        </span>
                      </div>
                    </th>
                  )}

                  {(techFilter === 'all' || techFilter === 'natural') && (
                    <th scope="col" className="py-5 px-6 font-serif font-bold text-gray-900 text-sm w-1/4">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-gray-900">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-blue-800" aria-hidden="true" />
                          Natural Vivo
                        </span>
                        <span className="text-[10px] font-sans font-normal text-gray-600">
                          Hidropônico com Autoirrigação
                        </span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                {COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 transition-colors focus-within:bg-emerald-100/50">
                    
                    {/* Criterion */}
                    <th scope="row" className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-2.5 text-left">
                      <span aria-hidden="true">{getIcon(row.iconName)}</span>
                      <span>{row.criterion}</span>
                    </th>

                    {/* Preservado */}
                    {(techFilter === 'all' || techFilter === 'preservado') && (
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {row.preservadoHighlight ? (
                          <span className="font-bold text-[#15803d]">
                            ✓ {row.preservadoHighlight}
                          </span>
                        ) : (
                          row.preservadoText
                        )}
                      </td>
                    )}

                    {/* Permanente */}
                    {(techFilter === 'all' || techFilter === 'permanente') && (
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {row.permanenteHighlight ? (
                          <span className="font-bold text-[#15803d]">
                            ✓ {row.permanenteHighlight}
                          </span>
                        ) : (
                          row.permanenteText
                        )}
                      </td>
                    )}

                    {/* Natural Vivo */}
                    {(techFilter === 'all' || techFilter === 'natural') && (
                      <td className="py-4 px-6 text-gray-800">
                        {row.naturalVivoText.includes('R$') ? (
                          <span className="text-amber-900 font-bold bg-amber-100/90 px-2.5 py-1 rounded border border-amber-300 inline-block">
                            {row.naturalVivoText}
                          </span>
                        ) : (
                          row.naturalVivoText
                        )}
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
