import React, { useState } from 'react';
import { ArrowRight, Leaf, X, Check } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface SolutionsGridProps {
  onSelectSolution: (solutionTitle: string) => void;
  onOpenQuote: () => void;
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({
  onSelectSolution,
  onOpenQuote,
}) => {
  const [selectedModal, setSelectedModal] = useState<any | null>(null);

  const solutions = [
    {
      id: 'preservado',
      tag: '100% NATURAL',
      tagBg: 'bg-[#86efac] text-[#072a1a]',
      title: 'Jardins Verticais Preservados',
      desc: 'Plantas 100% naturais que passam por um processo ecológico de preservação com glicerina vegetal. Mantêm textura macia e viva por anos sem precisar de sol, rega ou poda.',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Plantas naturais estabilizadas com glicerina vegetal',
        'Máxima absorção acústica certificada (NRC 0.85)',
        'Garantia de 5 anos com zero manutenção de irrigação',
        'Perfeito para interiores corporativos, salas de reunião e livings',
      ],
    },
    {
      id: 'permanente',
      tag: 'HIPER-REALISTA ANTI-UV',
      tagBg: 'bg-emerald-100 text-[#072a1a]',
      title: 'Jardins Verticais Permanentes',
      desc: 'Folhagens artificiais importadas de última geração, com toque real (silicone, seda e látex) e tratamento anti-UV resistente ao sol, intempéries e áreas gourmet.',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Mais de 30 espécies botânicas com fidelidade hiper-realista',
        'Tratamento Anti-UV que impede desbotamento e ressecamento',
        'Leveza estrutural (~4kg/m²) instalável em drywall e alvenaria',
        'Ideal para varandas gourmet, fachadas e áreas com luz solar',
      ],
    },
    {
      id: 'moss',
      tag: 'ARTE BOTÂNICA & MOSS',
      tagBg: 'bg-emerald-200 text-[#072a1a]',
      title: 'Musgo Polar Moss & Quadros Biofílicos',
      desc: 'Musgo escandinavo preservado de alta densidade (Cladonia rangiferina). Disponível em várias cores para composições artísticas, logotipos 3D e painéis acústicos de estúdio.',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Musgo escandinavo autêntico de toque aveludado tridimensional',
        'Excelente atenuação de eco e reverberação em escritórios',
        'Customizável com cortes geométricos, logos e retroiluminação LED',
        'Imune a pragas, ácaros e livre de fungos',
      ],
    },
    {
      id: 'modulos_diy',
      tag: 'ENVIO BRASIL',
      tagBg: 'bg-teal-100 text-teal-900',
      title: 'Módulos Plug & Play (100x50 cm e Sob Medida)',
      desc: 'Painéis verdes pré-montados de fácil fixação enviados para qualquer cidade do Brasil. Sistema inteligente que permite instalação rápida e sem sujeira.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Módulos padronizados de 100x50 cm ou confeccionados sob medida',
        'Gabarito e kit de ancoragem rápida inclusos',
        'Envio express por transportadora com seguro total',
        'Manual passo a passo ilustrado para instalação em minutos',
      ],
    },
    {
      id: 'vasos',
      tag: 'ÁRVORES & VASOS',
      tagBg: 'bg-emerald-100 text-[#072a1a]',
      title: 'Paisagismo em Vasos & Árvores Semi-Naturais',
      desc: 'Árvores montadas com troncos naturais tratados e folhagens importadas de alta escala (Ficus Lyrata, Costela de Adão, Palmeiras e Oliveiras) com vasos em fibra de vidro e polietileno.',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Troncos naturais desidratados e tratados contra cupim',
        'Folhagens com caimento natural e visual imponente',
        'Vasos e jardineiras sob medida para halls e divisórias de ambiente',
        'Flexibilidade total para reformas e reposicionamento',
      ],
    },
    {
      id: 'eventos',
      tag: 'CENOGRAFIA & EVENTOS',
      tagBg: 'bg-emerald-200 text-[#072a1a]',
      title: 'Cenografia Verde & Locação para Eventos',
      desc: 'Backdrops biofílicos instagramáveis, painéis para stands em feiras de negócios, cenografia corporativa, casamentos e congressos com montagem e desmontagem ágeis.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Estruturas autoportantes ou modulares para estandes',
        'Integração com letreiros neon, testeiras e iluminação cênica',
        'Opções flexíveis de compra ou locação temporária',
        'Equipe de montagem ágil em feiras e pavilhões',
      ],
    },
  ];

  return (
    <section id="solutions" className="bg-[#f9fbf9] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full">
              PORTFÓLIO & SOLUÇÕES ALL GREEN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              Verde autoral desenhado para <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">cada projeto e ambiente</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Conheça as linhas completas de jardins verticais preservados, permanentes hiper-realistas, musgo polar moss e módulos prontos para instalar em todo o Brasil.
            </p>
          </div>
        </ScrollReveal>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {solutions.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              animation="fade-up"
              delay={idx * 0.12}
              distance={30}
              className="h-full"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group h-full">
                <div>
                  {/* Image Box */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs ${item.tagBg}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-gray-900 text-lg leading-snug group-hover:text-[#15803d] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedModal(item)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#072a1a] hover:text-[#15803d] pt-3 border-t border-gray-100 transition-colors group/btn cursor-pointer"
                  >
                    <span>Saiba mais sobre esta solução</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Solution Detail Modal */}
      {selectedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-md ${selectedModal.tagBg}`}>
              {selectedModal.tag}
            </span>

            <h3 className="text-2xl font-serif font-bold text-gray-900">
              {selectedModal.title}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedModal.desc}
            </p>

            <div className="bg-emerald-50 p-4 rounded-2xl space-y-2 border border-emerald-100">
              <p className="text-xs font-bold text-[#072a1a] uppercase tracking-wider">
                Destaques & Especificações:
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {selectedModal.highlights.map((h: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#15803d] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const title = selectedModal.title;
                  setSelectedModal(null);
                  onSelectSolution(title);
                }}
                className="flex-1 py-3 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors cursor-pointer"
              >
                Solicitar Orçamento para esta Linha
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
