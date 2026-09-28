import React, { useState } from 'react';
import { ArrowRight, Leaf, X, Check } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { PageHeader } from './PageHeader';
import { useLanguage } from '../context/LanguageContext';

interface SolutionsGridProps {
  onSelectSolution: (solutionTitle: string) => void;
  onOpenQuote: () => void;
}

// Framer-motion scroll entrance variants
const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1], // Smooth cubic ease-out
    },
  },
};

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({
  onSelectSolution,
  onOpenQuote,
}) => {
  const { t, language } = useLanguage();
  const [selectedModal, setSelectedModal] = useState<any | null>(null);
  const isPt = language === 'pt';

  const solutions = [
    {
      id: 'preservado',
      title: 'Jardins Verticais Preservados',
      desc: 'Plantas 100% naturais que passam por processo ecológico de preservação com glicerina vegetal. Mantêm textura macia e viva por anos sem precisar de sol, rega ou poda.',
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
      title: 'Jardins Verticais Permanentes',
      desc: 'Folhagens artificiais importadas com toque real (silicone, seda e látex) e tratamento anti-UV resistente ao sol, intempéries e áreas gourmet.',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Mais de 30 espécies botânicas com fidelidade botânica',
        'Tratamento Anti-UV que impede desbotamento e ressecamento',
        'Leveza estrutural (~4kg/m²) instalável em drywall e alvenaria',
        'Ideal para varandas gourmet, fachadas e áreas com luz solar',
      ],
    },
    {
      id: 'moss',
      title: 'Musgo Polar Moss & Quadros Biofílicos',
      desc: 'Musgo escandinavo preservado de alta densidade (Cladonia rangiferina). Disponível em várias cores para composições artísticas, logotipos e painéis acústicos.',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Musgo escandinavo autêntico de toque aveludado tridimensional',
        'Excelente atenuação de eco e reverberação em escritórios',
        'Customizável com cortes geométricos, logos e iluminação LED',
        'Imune a pragas, ácaros e livre de fungos',
      ],
    },
    {
      id: 'modulos_diy',
      title: 'Módulos Plug & Play Sob Medida',
      desc: 'Painéis verdes pré-montados com engate oculto enviados para qualquer cidade do Brasil. Sistema que permite instalação rápida e sem sujeira.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Módulos padronizados de 100x50 cm ou sob medida',
        'Gabarito e kit de ancoragem rápida inclusos',
        'Envio express por transportadora com seguro total',
        'Manual passo a passo ilustrado para instalação em minutos',
      ],
    },
    {
      id: 'vasos',
      title: 'Paisagismo em Vasos & Árvores Semi-Naturais',
      desc: 'Árvores montadas com troncos naturais tratados e folhagens de alta escala (Ficus Lyrata, Costela de Adão, Palmeiras e Oliveiras) com vasos em fibra de vidro.',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Troncos naturais desidratados e tratados contra cupim',
        'Folhagens com caimento natural e visual imponente',
        'Vasos sob medida para halls e divisórias de ambiente',
        'Flexibilidade total para reformas e reposicionamento',
      ],
    },
    {
      id: 'eventos',
      title: 'Cenografia Verde & Locação para Eventos',
      desc: 'Backdrops biofílicos, painéis para estandes em feiras de negócios, cenografia corporativa, casamentos e congressos com montagem ágil.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      highlights: [
        'Estruturas autoportantes ou modulares para estandes',
        'Integração com letreiros neon e iluminação cênica',
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
          <PageHeader
            align="center"
            title={
              isPt ? (
                <>
                  Verde autoral desenhado para <br className="hidden sm:inline" />
                  <span className="italic font-light text-[#15803d]">cada projeto e ambiente</span>
                </>
              ) : (
                <>
                  Signature greenery designed for <br className="hidden sm:inline" />
                  <span className="italic font-light text-[#15803d]">every space and architectural vision</span>
                </>
              )
            }
            description={
              isPt
                ? "Soluções modulares de jardins preservados, musgo polar escandinavo e biofilia arquitetônica com entrega e instalação em todo o Brasil."
                : "Modular preserved vertical walls, Scandinavian reindeer moss, and architectural biophilia delivered and installed nationwide."
            }
          />
        </ScrollReveal>

        {/* 6 Cards Grid with Framer Motion Scroll Entrance */}
        <motion.div
          id="solutions-grid"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {solutions.map((item) => (
            <motion.div
              key={item.id}
              id={`solution-card-${item.id}`}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{
                y: { duration: 0.25, ease: 'easeOut' },
              }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between group h-full cursor-pointer"
              onClick={() => setSelectedModal(item)}
            >
              <div>
                {/* Image Box */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Solution Detail Modal with Smooth Motion Entrance */}
      <AnimatePresence>
        {selectedModal && (
          <motion.div
            id="solution-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedModal(null)}
          >
            <motion.div
              id="solution-modal-content"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5"
            >
              <button
                type="button"
                id="btn-close-solution-modal"
                onClick={() => setSelectedModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-serif font-bold text-gray-900">
                {selectedModal.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedModal.desc}
              </p>

              <div className="bg-emerald-50 p-4 rounded-2xl space-y-2 border border-emerald-100">
                <p className="text-xs font-bold text-[#072a1a] uppercase tracking-wider">
                  {isPt ? 'Destaques & Especificações:' : 'Highlights & Specifications:'}
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
                  type="button"
                  id="btn-quote-solution-modal"
                  onClick={() => {
                    const title = selectedModal.title;
                    setSelectedModal(null);
                    onSelectSolution(title);
                  }}
                  className="flex-1 py-3 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors cursor-pointer shadow-md"
                >
                  {isPt ? 'Solicitar Orçamento para esta Linha' : 'Request Quote for this Line'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
