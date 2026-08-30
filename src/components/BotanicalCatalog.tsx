import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { BOTANICAL_SPECIES } from '../data/mockData';
import { BotanicalSpecies } from '../types';
import { 
  Leaf, 
  Volume2, 
  Sun, 
  Camera, 
  Check, 
  Sparkles, 
  Wind, 
  ShieldCheck, 
  Tag, 
  X, 
  SlidersHorizontal,
  Droplets,
  Calendar,
  Clock,
  CheckCircle2,
  Info,
  Layers,
  ThermometerSun
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface BotanicalCatalogProps {
  onSimulateSpecies: (speciesName: string) => void;
  onOpenQuote: () => void;
}

// Available property tags for filtering
interface TagFilterOption {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PROPERTY_TAGS: TagFilterOption[] = [
  {
    id: 'all',
    label: 'Todas as Propriedades',
    shortLabel: 'Todas',
    icon: Leaf,
    description: 'Exibir todas as espécies disponíveis',
  },
  {
    id: 'acustica',
    label: 'Isolamento Acústico (NRC Alto)',
    shortLabel: 'Acústica',
    icon: Volume2,
    description: 'Absorção de reverberação e ruídos',
  },
  {
    id: 'purificacao',
    label: 'Purificação & Bem-Estar',
    shortLabel: 'Purificação de Ar',
    icon: Wind,
    description: 'Sensação botânica, aromas e conforto biofílico',
  },
  {
    id: 'baixa-manutencao',
    label: 'Baixa Manutenção (Zero Rega)',
    shortLabel: 'Baixa Manutenção',
    icon: ShieldCheck,
    description: 'Sem necessidade de rega, poda ou dreno',
  },
  {
    id: 'anti-uv',
    label: 'Proteção Anti-UV Premium',
    shortLabel: 'Proteção Anti-UV',
    icon: Sun,
    description: 'Resistência a áreas com incidência de luz e varandas',
  },
];

// Simulated environments for Smart Care calculation
type SimulatedEnvType = 'corporativo' | 'varanda' | 'living' | 'recepcao';

interface EnvCareProfile {
  name: string;
  humidityRange: string;
  lightExposure: string;
  cleaningIntervalMonths: number;
  dustLevel: string;
}

const ENV_CARE_PROFILES: Record<SimulatedEnvType, EnvCareProfile> = {
  corporativo: {
    name: 'Escritório Climatizado (Ar-condicionado)',
    humidityRange: '40% - 60% UR',
    lightExposure: 'Luz Artificial / Sem Sol Direto',
    cleaningIntervalMonths: 12,
    dustLevel: 'Muito Baixo (ambiente fechado)',
  },
  varanda: {
    name: 'Varanda Gourmet / Semifechada',
    humidityRange: '45% - 75% UR',
    lightExposure: 'Luz Natural Intensa / Ventilação',
    cleaningIntervalMonths: 6,
    dustLevel: 'Médio (ventilação externa)',
  },
  living: {
    name: 'Living Residencial Integrado',
    humidityRange: '40% - 65% UR',
    lightExposure: 'Luz Indireta Aconchegante',
    cleaningIntervalMonths: 9,
    dustLevel: 'Baixo',
  },
  recepcao: {
    name: 'Recepção / Hall de Alto Fluxo',
    humidityRange: '45% - 60% UR',
    lightExposure: 'Iluminação Contínua LED',
    cleaningIntervalMonths: 6,
    dustLevel: 'Médio (circulação constante)',
  },
};

// Framer-motion variants for sequential staggered entrance of species cards
const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const detailContentVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: 'easeInOut' },
  },
};

const metricBoxVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const BotanicalCatalog: React.FC<BotanicalCatalogProps> = ({
  onSimulateSpecies,
  onOpenQuote,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'preservado' | 'permanente'>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<BotanicalSpecies>(BOTANICAL_SPECIES[0]);
  const [simulatedEnv, setSimulatedEnv] = useState<SimulatedEnvType>('corporativo');
  const [hoveredSpeciesId, setHoveredSpeciesId] = useState<string | null>(null);

  // Filter list by both Category and Tag property
  const filteredList = BOTANICAL_SPECIES.filter((s) => {
    const matchCategory =
      categoryFilter === 'all' || s.category === categoryFilter;
    
    const matchTag =
      activeTag === 'all' || (s.tags && s.tags.includes(activeTag));

    return matchCategory && matchTag;
  });

  // Ensure selectedSpecies stays valid if filtered list changes
  React.useEffect(() => {
    if (filteredList.length > 0 && !filteredList.some((s) => s.id === selectedSpecies.id)) {
      setSelectedSpecies(filteredList[0]);
    }
  }, [categoryFilter, activeTag, filteredList, selectedSpecies.id]);

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setActiveTag('all');
  };

  const hasActiveFilters = categoryFilter !== 'all' || activeTag !== 'all';
  const currentEnvCare = ENV_CARE_PROFILES[simulatedEnv];

  // Dynamic Care Calculation
  const isPreserved = selectedSpecies.category === 'preservado';
  const estimatedLifespanYears = isPreserved ? '7 a 10 anos' : '10 a 15 anos';
  const cleaningTool = isPreserved ? 'Espanador suave de microfibra ou ar frio de secador' : 'Pano levemente umedecido ou espanador antiestático';
  const lightAlert = isPreserved 
    ? 'Evitar exposição direta ao sol forte ou fontes pontuais de calor extremo.' 
    : 'Totalmente resistente ao sol direto e raios UV com tecnologia anti-desbotamento.';

  return (
    <section id="botanical-catalog" className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>CATÁLOGO DE ESPÉCIES & TEXTURAS BOTÂNICAS</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 leading-tight">
                Curadoria Botânica <span className="italic font-light text-[#15803d]">All Green</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                Explore a riqueza tátil, os índices de absorção acústica, propriedades de purificação de ar e proteção UV de cada espécie botânica disponível para composições sob medida.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shrink-0 self-start lg:self-auto shadow-xs">
              <button
                type="button"
                id="cat-filter-all"
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Todas ({BOTANICAL_SPECIES.length})
              </button>
              <button
                type="button"
                id="cat-filter-preservado"
                onClick={() => setCategoryFilter('preservado')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'preservado'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Preservadas Naturais
              </button>
              <button
                type="button"
                id="cat-filter-permanente"
                onClick={() => setCategoryFilter('permanente')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === 'permanente'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Permanentes Anti-UV
              </button>
            </div>
          </div>

          {/* Property Tag Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xs p-3 sm:p-4 rounded-2xl border border-gray-200/90 shadow-xs mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803d]" />
                <span className="uppercase tracking-wider text-[11px] text-[#072a1a]">Filtrar por Propriedade:</span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {PROPERTY_TAGS.map((tag) => {
                  const Icon = tag.icon;
                  const isActive = activeTag === tag.id;
                  
                  // Count species matching this tag in current category filter
                  const count = BOTANICAL_SPECIES.filter((s) => {
                    const matchCategory = categoryFilter === 'all' || s.category === categoryFilter;
                    const matchThisTag = tag.id === 'all' || (s.tags && s.tags.includes(tag.id));
                    return matchCategory && matchThisTag;
                  }).length;

                  return (
                    <button
                      type="button"
                      key={tag.id}
                      id={`tag-filter-${tag.id}`}
                      onClick={() => setActiveTag(tag.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isActive
                          ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:text-[#072a1a] hover:bg-emerald-50/40'
                      }`}
                      title={tag.description}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#86efac]' : 'text-[#15803d]'}`} />
                      <span>{tag.shortLabel}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-emerald-900/80 text-emerald-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-gray-500 hover:text-red-600 font-semibold px-2 py-1 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpar</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Species List with Staggered Entrance Animation */}
          <div className="lg:col-span-5">
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-3">
                <Tag className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-gray-800">Nenhuma espécie encontrada</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Não encontramos folhagens com os filtros combinados de categoria e propriedade.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer"
                >
                  Restaurar Todos os Filtros
                </button>
              </div>
            ) : (
              <motion.div
                key={`${categoryFilter}-${activeTag}`}
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar"
                role="listbox"
                aria-label="Lista de espécies botânicas disponíveis"
              >
                {filteredList.map((item) => {
                  const isSelected = selectedSpecies?.id === item.id;
                  const isHovered = hoveredSpeciesId === item.id;
                  const itemIsPreserved = item.category === 'preservado';

                  return (
                    <motion.button
                      type="button"
                      key={item.id}
                      variants={cardItemVariants}
                      whileHover={{ scale: 1.015, x: 4 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setSelectedSpecies(item)}
                      onMouseEnter={() => setHoveredSpeciesId(item.id)}
                      onMouseLeave={() => setHoveredSpeciesId(null)}
                      onFocus={() => setHoveredSpeciesId(item.id)}
                      onBlur={() => setHoveredSpeciesId(null)}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#072a1a] ${
                        isSelected
                          ? 'bg-white border-[#072a1a] shadow-md ring-2 ring-[#072a1a]/20 font-bold'
                          : 'bg-white/90 border-gray-200 hover:bg-white hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-start gap-4 w-full">
                        <img
                          src={item.image}
                          alt={`Espécie botânica: ${item.name}`}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200 mt-0.5"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-wider">
                              {item.category === 'preservado' ? 'PRESERVADO 100% NATURAL' : 'PERMANENTE UV PREMIUM'}
                            </span>
                            {item.uvProtection && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-300">
                                Anti-UV
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-serif font-bold text-gray-900 text-sm truncate">
                            {item.name}
                          </h3>

                          <p className="text-xs text-gray-600 italic truncate font-sans">
                            {item.scientificName}
                          </p>

                          {/* Species Property Badges Chips */}
                          {item.propertyBadges && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.propertyBadges.map((badge, bIdx) => (
                                <span 
                                  key={bIdx}
                                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                    activeTag === badge.tagKey
                                      ? 'bg-emerald-100 text-[#072a1a] font-bold border border-emerald-300'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {badge.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Smart Care Card Hover Preview Badge */}
                      <AnimatePresence>
                        {(isHovered || isSelected) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full pt-2 border-t border-emerald-100/80 mt-1 flex items-center justify-between text-[11px] text-[#072a1a] bg-emerald-50/70 px-2.5 py-1.5 rounded-lg overflow-hidden"
                          >
                            <span className="flex items-center gap-1.5 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>Cuidado Inteligente: Zero Rega</span>
                            </span>
                            <span className="text-[10px] text-emerald-800 font-mono font-bold bg-white/90 px-1.5 py-0.2 rounded border border-emerald-200">
                              {itemIsPreserved ? 'Vida útil 8-10a' : 'Vida útil 12+a'}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right Detail Card - FICHA TÉCNICA DE ESPECIFICAÇÃO */}
          <ScrollReveal animation="fade-left" delay={0.15} distance={25} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl overflow-hidden">
              
              {selectedSpecies && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSpecies.id}
                    variants={detailContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Header Badge */}
                    <div className="flex items-start sm:items-center justify-between border-b border-gray-100 pb-4 gap-4 flex-col sm:flex-row">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-widest">
                          FICHA TÉCNICA DE ESPECIFICAÇÃO
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                          {selectedSpecies.name}
                        </h3>
                        <p className="text-xs text-gray-500 italic font-mono mt-0.5">
                          Nome Científico: {selectedSpecies.scientificName}
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-full shrink-0">
                        {selectedSpecies.line}
                      </span>
                    </div>

                    {/* Image & Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      
                      {/* Species Preview Image */}
                      <motion.div 
                        variants={metricBoxVariants}
                        className="sm:col-span-5 h-56 rounded-2xl overflow-hidden border border-gray-200 group relative"
                      >
                        <img
                          src={selectedSpecies.image}
                          alt={selectedSpecies.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {selectedSpecies.uvProtection && (
                          <div className="absolute top-2.5 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            <span>Proteção UV Ativa</span>
                          </div>
                        )}
                      </motion.div>

                      {/* Metrics */}
                      <div className="sm:col-span-7 space-y-3">
                        <motion.div
                          variants={metricBoxVariants}
                          whileHover={{ y: -2 }}
                          className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80 transition-shadow hover:shadow-xs"
                        >
                          <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider block">
                            SENSAÇÃO TÁTIL & TEXTURA
                          </span>
                          <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {selectedSpecies.tactileFeel}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={metricBoxVariants}
                          whileHover={{ y: -2 }}
                          className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80 transition-shadow hover:shadow-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-[#15803d]" />
                            <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider">
                              ÍNDICE DE ABSORÇÃO ACÚSTICA
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {selectedSpecies.acousticAbsorption}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={metricBoxVariants}
                          whileHover={{ y: -2 }}
                          className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80 transition-shadow hover:shadow-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-[#15803d]" />
                            <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider">
                              ILUMINAÇÃO RECOMENDADA
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {selectedSpecies.recommendedLighting}
                          </p>
                        </motion.div>
                      </div>

                    </div>

                    {/* Properties & Benefits Tag List */}
                    {selectedSpecies.propertyBadges && (
                      <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/70 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">
                          Propriedades em Destaque:
                        </span>
                        {selectedSpecies.propertyBadges.map((b, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setActiveTag(b.tagKey)}
                            className="text-xs bg-white text-[#072a1a] border border-gray-200 hover:border-emerald-400 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            ✓ {b.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {selectedSpecies.description}
                    </p>

                    {/* Ideal Environments */}
                    <div>
                      <span className="text-[11px] font-bold text-[#072a1a] uppercase tracking-wider block mb-2">
                        AMBIENTES IDEAIS DE APLICAÇÃO:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpecies.idealEnvironments.map((env, idx) => (
                          <motion.span
                            key={idx}
                            variants={tagVariants}
                            className="text-xs bg-emerald-100/80 text-[#072a1a] font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-[#15803d]" />
                            <span>{env}</span>
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* SMART CARE CARD: Cartão de Cuidado Inteligente & Previsão de Manutenção */}
                    <div className="bg-gradient-to-br from-emerald-900/90 to-[#072a1a] text-white p-5 rounded-2xl border border-emerald-700/50 shadow-md space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#86efac]/20 text-[#86efac] flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                              Cartão de Cuidado Inteligente & Longevidade
                              <span className="px-1.5 py-0.2 bg-[#86efac] text-[#072a1a] font-mono text-[9px] font-extrabold rounded">IA Smart Care</span>
                            </h4>
                            <p className="text-[11px] text-emerald-200/80">
                              Previsão de manutenção calculada para {selectedSpecies.name}
                            </p>
                          </div>
                        </div>

                        {/* Simulated Environment Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider hidden sm:inline">Ambiente:</span>
                          <select
                            value={simulatedEnv}
                            onChange={(e) => setSimulatedEnv(e.target.value as SimulatedEnvType)}
                            className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-600/60 rounded-lg text-xs text-[#86efac] font-bold focus:outline-none focus:ring-1 focus:ring-[#86efac]"
                          >
                            <option value="corporativo">Escritório Climatizado</option>
                            <option value="varanda">Varanda Gourmet / Luz</option>
                            <option value="living">Living Residencial</option>
                            <option value="recepcao">Recepção / Hall Comercial</option>
                          </select>
                        </div>
                      </div>

                      {/* Care Parameters Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl border border-emerald-500/20 text-center">
                          <span className="text-[9px] text-emerald-300 font-bold uppercase block">REGA & PODA</span>
                          <strong className="text-xs text-white font-bold block mt-0.5">0 Litros/ano</strong>
                          <span className="text-[9px] text-[#86efac] font-semibold">100% Livre</span>
                        </div>

                        <div className="p-2.5 bg-white/5 rounded-xl border border-emerald-500/20 text-center">
                          <span className="text-[9px] text-emerald-300 font-bold uppercase block">HIGIENIZAÇÃO</span>
                          <strong className="text-xs text-white font-bold block mt-0.5">A cada {currentEnvCare.cleaningIntervalMonths} meses</strong>
                          <span className="text-[9px] text-emerald-200 font-semibold">{currentEnvCare.dustLevel}</span>
                        </div>

                        <div className="p-2.5 bg-white/5 rounded-xl border border-emerald-500/20 text-center">
                          <span className="text-[9px] text-emerald-300 font-bold uppercase block">DURABILIDADE</span>
                          <strong className="text-xs text-white font-bold block mt-0.5">{estimatedLifespanYears}</strong>
                          <span className="text-[9px] text-[#86efac] font-semibold">Garantia 5 Anos</span>
                        </div>

                        <div className="p-2.5 bg-white/5 rounded-xl border border-emerald-500/20 text-center">
                          <span className="text-[9px] text-emerald-300 font-bold uppercase block">UMIDADE DO AR</span>
                          <strong className="text-xs text-white font-bold block mt-0.5">{currentEnvCare.humidityRange}</strong>
                          <span className="text-[9px] text-emerald-200 font-semibold">Sem mofo/fungos</span>
                        </div>
                      </div>

                      {/* Care Instructions Detail */}
                      <div className="bg-black/20 p-3 rounded-xl border border-emerald-800/40 space-y-1.5 text-xs text-emerald-100/90">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#86efac] shrink-0 mt-0.5" />
                          <span><strong>Método de Limpeza:</strong> {cleaningTool}.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                          <span><strong>Luminosidade no ambiente:</strong> {lightAlert}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onSimulateSpecies(selectedSpecies.name)}
                        className="w-full sm:flex-1 py-3 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <Camera className="w-4 h-4 text-[#86efac]" />
                        <span>Simular Esta Folhagem</span>
                      </button>

                      <button
                        type="button"
                        onClick={onOpenQuote}
                        className="w-full sm:w-auto py-3 px-6 bg-emerald-50 text-[#072a1a] hover:bg-emerald-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Incluir na Amostra
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
