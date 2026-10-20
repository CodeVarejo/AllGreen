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
  const isEs = language === 'es';

  const solutions = [
    {
      id: 'preservado',
      title: isPt
        ? 'Jardins Verticais Preservados'
        : isEs
        ? 'Jardines Verticales Preservados'
        : 'Preserved Vertical Gardens',
      desc: isPt
        ? 'Plantas 100% naturais que passam por processo ecológico de preservação com glicerina vegetal. Mantêm textura macia e viva por anos sem precisar de sol, rega ou poda.'
        : isEs
        ? 'Plantas 100% naturales tratadas con glicerina vegetal ecológica. Conservan textura suave y viva por años sin necesidad de sol, riego o poda.'
        : '100% natural foliage stabilized with eco-friendly plant glycerin. Maintains authentic soft texture and vibrant color for years with zero sunlight, water, or pruning.',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Plantas naturais estabilizadas com glicerina vegetal',
            'Máxima absorção acústica certificada (NRC 0.85)',
            'Garantia de 5 anos com zero manutenção de irrigação',
            'Perfeito para interiores corporativos, salas de reunião e livings',
          ]
        : isEs
        ? [
            'Plantas naturales estabilizadas con glicerina vegetal',
            'Máxima absorción acústica certificada (NRC 0.85)',
            'Garantía de 5 años con cero mantenimiento de riego',
            'Perfecto para interiores corporativos, salas de juntas y livings',
          ]
        : [
            'Natural plants stabilized with organic plant glycerin',
            'Certified maximum acoustic absorption (NRC 0.85)',
            '5-year manufacturer warranty with zero irrigation maintenance',
            'Ideal for corporate workplaces, boardrooms, and living spaces',
          ],
    },
    {
      id: 'permanente',
      title: isPt
        ? 'Jardins Verticais Permanentes'
        : isEs
        ? 'Jardines Verticales Permanentes'
        : 'Permanent Anti-UV Gardens',
      desc: isPt
        ? 'Folhagens artificiais importadas com toque real (silicone, seda e látex) e tratamento anti-UV resistente ao sol, intempéries e áreas gourmet.'
        : isEs
        ? 'Follajes artificiales de tacto real (silicona, seda y látex) con tratamiento anti-UV resistente al sol directo, intemperie y terrazas.'
        : 'Real-touch artificial foliage (silicone, silk, and latex) engineered with anti-UV protection against sun fade, weather, and outdoor balconies.',
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Mais de 30 espécies botânicas com fidelidade botânica',
            'Tratamento Anti-UV que impede desbotamento e ressecamento',
            'Leveza estrutural (~4kg/m²) instalável em drywall e alvenaria',
            'Ideal para varandas gourmet, fachadas e áreas com luz solar',
          ]
        : isEs
        ? [
            'Más de 30 especies botánicas con fidelidad artesanal',
            'Tratamiento Anti-UV que previene decoloración y resequedad',
            'Ligereza estructural (~4kg/m²) instalable en drywall y mampostería',
            'Ideal para terrazas gourmet, fachadas y áreas soleadas',
          ]
        : [
            'Over 30 botanical species with high botanical fidelity',
            'Anti-UV treatment preventing discoloration and brittleness',
            'Structural lightweight (~4kg/m²) mountable on drywall',
            'Ideal for outdoor terraces, facades, and high-sun spaces',
          ],
    },
    {
      id: 'moss',
      title: isPt
        ? 'Musgo Polar Moss & Quadros Biofílicos'
        : isEs
        ? 'Musgo Polar Moss & Cuadros Biofílicos'
        : 'Polar Reindeer Moss & Acoustic Panels',
      desc: isPt
        ? 'Musgo escandinavo preservado de alta densidade (Cladonia rangiferina). Disponível em várias cores para composições artísticas, logotipos e painéis acústicos.'
        : isEs
        ? 'Musgo escandinavo preservado de alta densidad (Cladonia rangiferina). Disponible en varios colores para composiciones artísticas, logotipos y paneles acústicos.'
        : 'High-density preserved Scandinavian reindeer moss (Cladonia rangiferina). Available in varied shades for bespoke artistic compositions and acoustic absorption.',
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Musgo escandinavo autêntico de toque aveludado tridimensional',
            'Excelente atenuação de eco e reverberação em escritórios',
            'Customizável com cortes geométricos, logos e iluminação LED',
            'Imune a pragas, ácaros e livre de fungos',
          ]
        : isEs
        ? [
            'Musgo escandinavo auténtico de tacto aterciopelado tridimensional',
            'Excelente atenuación de eco y reverberación en oficinas',
            'Personalizable con cortes geométricos, logos e iluminación LED',
            'Inmune a plagas, ácaros y libre de hongos',
          ]
        : [
            'Authentic Scandinavian moss with a velvety 3D touch',
            'High-performance echo and reverberation attenuation',
            'Customizable with geometric shapes, corporate logos, and LED accents',
            'Naturally hypoallergenic, dust repellent, and insect-proof',
          ],
    },
    {
      id: 'modulos_diy',
      title: isPt
        ? 'Módulos Plug & Play Sob Medida'
        : isEs
        ? 'Módulos Plug & Play a Medida'
        : 'Custom Plug & Play Modules',
      desc: isPt
        ? 'Painéis verdes pré-montados com engate oculto enviados para qualquer cidade do Brasil. Sistema que permite instalação rápida e sem sujeira.'
        : isEs
        ? 'Paneles verdes premontados con anclaje oculto enviados a todo el país. Sistema que permite instalación limpia y rápida.'
        : 'Pre-assembled green wall modules with hidden hardware delivered ready-to-hang for rapid, dust-free installation.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Módulos padronizados de 100x50 cm ou sob medida',
            'Gabarito e kit de ancoragem rápida inclusos',
            'Envio express por transportadora com seguro total',
            'Manual passo a passo ilustrado para instalação em minutos',
          ]
        : isEs
        ? [
            'Módulos estandarizados de 100x50 cm o a medida',
            'Plantilla y kit de anclaje rápido incluidos',
            'Envío express con seguro total de transporte',
            'Manual ilustrado paso a paso para instalación en minutos',
          ]
        : [
            'Standardized 100x50 cm modules or custom dimensions',
            'Drilling template and quick-mount anchor kit included',
            'Express insured freight shipping',
            'Illustrated step-by-step guide for installation in minutes',
          ],
    },
    {
      id: 'vasos',
      title: isPt
        ? 'Paisagismo em Vasos & Árvores Semi-Naturais'
        : isEs
        ? 'Paisajismo en Macetas & Árboles Semi-Naturales'
        : 'Planter Greenery & Semi-Natural Trees',
      desc: isPt
        ? 'Árvores montadas com troncos naturais tratados e folhagens de alta escala (Ficus Lyrata, Costela de Adão, Palmeiras e Oliveiras) com vasos em fibra de vidro.'
        : isEs
        ? 'Árboles confeccionados con troncos naturales tratados y follajes de gran escala (Ficus Lyrata, Monstera, Palmeras y Olivos) con macetas de fibra de vidrio.'
        : 'Bespoke trees assembled with preserved organic wood trunks and high-grade foliage (Ficus Lyrata, Monstera, Palms, and Olive trees) paired with fiberglass planters.',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Troncos naturais desidratados e tratados contra cupim',
            'Folhagens com caimento natural e visual imponente',
            'Vasos sob medida para halls e divisórias de ambiente',
            'Flexibilidade total para reformas e reposicionamento',
          ]
        : isEs
        ? [
            'Troncos naturales deshidratados y tratados contra termitas',
            'Follajes de caída orgánica y porte imponente',
            'Macetas a medida para vestíbulos y divisorias de ambientes',
            'Flexibilidad total para reformas y reorganización espacial',
          ]
        : [
            'Natural dehydrated wood trunks treated against pests',
            'Foliage with natural draping and architectural presence',
            'Custom fiberglass planters for lobbies and space zoning',
            'Total agility for interior layout reconfigurations',
          ],
    },
    {
      id: 'eventos',
      title: isPt
        ? 'Cenografia Verde & Locação para Eventos'
        : isEs
        ? 'Escenografía Verde & Alquiler para Eventos'
        : 'Green Scenography & Event Rentals',
      desc: isPt
        ? 'Backdrops biofílicos, painéis para estandes em feiras de negócios, cenografia corporativa, casamentos e congressos com montagem ágil.'
        : isEs
        ? 'Backdrops biofílicos, paneles para stands de ferias comerciales, escenografía corporativa, bodas y congresos con montaje ágil.'
        : 'Biophilic backdrops, trade show booth green walls, corporate staging, and special event installations with rapid setup.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      highlights: isPt
        ? [
            'Estruturas autoportantes ou modulares para estandes',
            'Integração com letreiros neon e iluminação cênica',
            'Opções flexíveis de compra ou locação temporária',
            'Equipe de montagem ágil em feiras e pavilhões',
          ]
        : isEs
        ? [
            'Estructuras autoportantes o modulares para stands',
            'Integración con letreros de neón e iluminación escénica',
            'Opciones flexibles de compra o alquiler temporal',
            'Equipo de montaje ágil en ferias y centros de exposiciones',
          ]
        : [
            'Freestanding or modular structural backdrops',
            'Seamless integration with neon signs and stage lighting',
            'Flexible outright purchase or short-term rental plans',
            'Swift assembly crew for trade shows and venues',
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
              ) : isEs ? (
                <>
                  Verde de autor diseñado para <br className="hidden sm:inline" />
                  <span className="italic font-light text-[#15803d]">cada espacio y visión arquitectónica</span>
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
                : isEs
                ? "Soluciones modulares de jardines preservados, musgo polar escandinavo y biofilia arquitectónica con entrega e instalación garantizada."
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
                  {isPt
                    ? 'Destaques & Especificações:'
                    : isEs
                    ? 'Aspectos Destacados & Especificaciones:'
                    : 'Highlights & Specifications:'}
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
                  {isPt
                    ? 'Solicitar Orçamento para esta Linha'
                    : isEs
                    ? 'Solicitar Presupuesto para esta Línea'
                    : 'Request Quote for this Line'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
