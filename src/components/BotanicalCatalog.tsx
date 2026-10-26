import React, { useState } from 'react';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import { BOTANICAL_SPECIES } from '../data/mockData';
import { BotanicalSpecies } from '../types';
import { 
  Leaf, 
  Volume2, 
  Sun, 
  Camera, 
  Check, 
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
  ThermometerSun,
  Scale
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { SpeciesComparisonModal } from './SpeciesComparisonModal';
import { useLanguage } from '../context/LanguageContext';

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
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 260,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
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
  const { language, t } = useLanguage();
  const isPt = language === 'pt';
  const isEs = language === 'es';

  const shouldReduceMotion = useReducedMotion();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'preservado' | 'permanente'>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<BotanicalSpecies>(BOTANICAL_SPECIES[0]);
  const [simulatedEnv, setSimulatedEnv] = useState<SimulatedEnvType>('corporativo');
  const [hoveredSpeciesId, setHoveredSpeciesId] = useState<string | null>(null);

  // Species Comparison state (up to 3 species)
  const [comparisonSpeciesIds, setComparisonSpeciesIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [comparisonToast, setComparisonToast] = useState<string | null>(null);

  const toggleCompareSpecies = (speciesId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (comparisonSpeciesIds.includes(speciesId)) {
      setComparisonSpeciesIds((prev) => prev.filter((id) => id !== speciesId));
    } else {
      if (comparisonSpeciesIds.length >= 3) {
        const msg = isPt
          ? 'Você pode selecionar no máximo 3 espécies para comparação simultânea.'
          : isEs
          ? 'Puede seleccionar un máximo de 3 especies para comparación simultánea.'
          : 'You can select a maximum of 3 species for simultaneous comparison.';
        setComparisonToast(msg);
        setTimeout(() => setComparisonToast(null), 3500);
        return;
      }
      setComparisonSpeciesIds((prev) => [...prev, speciesId]);
    }
  };

  const handleAddSpeciesToCompare = (species: BotanicalSpecies) => {
    if (comparisonSpeciesIds.length >= 3) return;
    if (!comparisonSpeciesIds.includes(species.id)) {
      setComparisonSpeciesIds((prev) => [...prev, species.id]);
    }
  };

  const handleRemoveSpeciesFromCompare = (speciesId: string) => {
    setComparisonSpeciesIds((prev) => prev.filter((id) => id !== speciesId));
  };

  const selectedForComparisonList = BOTANICAL_SPECIES.filter((s) =>
    comparisonSpeciesIds.includes(s.id)
  );

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
  const estimatedLifespanYears = isPreserved
    ? isPt ? '7 a 10 anos' : isEs ? '7 a 10 años' : '7 to 10 years'
    : isPt ? '10 a 15 anos' : isEs ? '10 a 15 años' : '10 to 15 years';

  const cleaningTool = isPreserved 
    ? isPt 
      ? 'Espanador suave de microfibra ou ar frio de secador' 
      : isEs 
      ? 'Plumero suave de microfibra o aire frío de secador'
      : 'Soft microfiber duster or cold air blow'
    : isPt 
      ? 'Pano levemente umedecido ou espanador antiestático' 
      : isEs 
      ? 'Paño ligeramente humedecido o plumero antiestático'
      : 'Slightly damp cloth or antistatic duster';

  const lightAlert = isPreserved 
    ? isPt 
      ? 'Evitar exposição direta ao sol forte ou fontes pontuais de calor extremo.' 
      : isEs 
      ? 'Evitar exposición directa al sol intenso o fuentes de calor extremo.'
      : 'Avoid direct intense sunlight and extreme heat sources.'
    : isPt 
      ? 'Totalmente resistente ao sol direto e raios UV com tecnologia anti-desbotamento.' 
      : isEs 
      ? 'Totalmente resistente al sol directo y rayos UV con tecnología anti-decoloración.'
      : 'Fully resistant to direct sun and UV rays with anti-fade technology.';

  return (
    <section id="botanical-catalog" className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-mono font-bold tracking-wide uppercase">
                  <CheckCircle2 className="w-3 h-3 text-[#15803d]" />
                  <span>
                    {isPt
                      ? 'Catálogo Disponível Offline (PWA)'
                      : isEs
                      ? 'Catálogo Disponible Offline (PWA)'
                      : 'Catalog Available Offline (PWA)'}
                  </span>
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 leading-tight">
                {isPt ? (
                  <>Curadoria Botânica & <span className="italic font-light text-[#15803d]">Fichas Técnicas</span></>
                ) : isEs ? (
                  <>Curaduría Botánica & <span className="italic font-light text-[#15803d]">Fichas Técnicas</span></>
                ) : (
                  <>Botanical Curation & <span className="italic font-light text-[#15803d]">Technical Data Sheets</span></>
                )}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {isPt
                  ? 'Texturas, absorção acústica e propriedades de durabilidade para especificação em projetos sob medida.'
                  : isEs
                  ? 'Texturas, absorción acústica y propiedades de durabilidad para especificación en proyectos a medida.'
                  : 'Textures, acoustic absorption, and durability properties for custom architectural specifications.'}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1 sm:p-1.5 rounded-2xl sm:rounded-full border border-gray-200 shrink-0 self-start lg:self-auto shadow-xs overflow-x-auto max-w-full">
              <button
                type="button"
                id="cat-filter-all"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === 'all'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                {isPt ? 'Todas' : isEs ? 'Todas' : 'All'} ({BOTANICAL_SPECIES.length})
              </button>
              <button
                type="button"
                id="cat-filter-preservado"
                onClick={() => setCategoryFilter('preservado')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === 'preservado'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                {isPt ? 'Preservadas' : isEs ? 'Preservadas' : 'Preserved'}
              </button>
              <button
                type="button"
                id="cat-filter-permanente"
                onClick={() => setCategoryFilter('permanente')}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === 'permanente'
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                {isPt ? 'Permanentes UV' : isEs ? 'Permanentes UV' : 'Permanent UV'}
              </button>
            </div>
          </div>

          {/* Property Tag Filter Bar */}
          <div className="bg-white/80 backdrop-blur-xs p-3 sm:p-4 rounded-2xl border border-gray-200/90 shadow-xs mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803d]" />
                <span className="uppercase tracking-wider text-[11px] text-[#072a1a]">
                  {isPt ? 'Filtrar por Propriedade:' : isEs ? 'Filtrar por Propiedad:' : 'Filter by Property:'}
                </span>
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

                  const translatedShortLabel = 
                    tag.id === 'all' ? (isPt ? 'Todas' : isEs ? 'Todas' : 'All') :
                    tag.id === 'acustico' ? (isPt ? 'Acústica' : isEs ? 'Acústica' : 'Acoustics') :
                    tag.id === 'sol_pleno' ? (isPt ? 'Sol Pleno' : isEs ? 'Pleno Sol' : 'Full Sun') :
                    tag.id === 'zero_manutencao' ? (isPt ? 'Zero Rega' : isEs ? 'Cero Riego' : 'Zero Irrigation') :
                    tag.id === 'leed_well' ? 'LEED / WELL' : tag.shortLabel;

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
                      <span>{translatedShortLabel}</span>
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
                    <span>{isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          
          {/* Left Species List with Staggered Entrance Animation */}
          <div className="lg:col-span-5 w-full min-w-0">
            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center space-y-3">
                <p className="text-sm font-semibold text-gray-700">Nenhuma espécie encontrada com estes filtros.</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-xl hover:bg-[#15803d] transition-colors cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <motion.div
                key={`species-grid-${categoryFilter}-${activeTag}`}
                variants={shouldReduceMotion ? undefined : listContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar"
                role="listbox"
                aria-label="Lista de espécies botânicas disponíveis"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredList.map((item) => {
                    const isSelected = selectedSpecies?.id === item.id;
                    const isHovered = hoveredSpeciesId === item.id;
                    const itemIsPreserved = item.category === 'preservado';
                    const isCompared = comparisonSpeciesIds.includes(item.id);

                    return (
                      <motion.div
                        layout={!shouldReduceMotion}
                        key={item.id}
                        variants={shouldReduceMotion ? undefined : cardItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.018, x: 5, transition: { duration: 0.2, ease: 'easeOut' } }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                        onClick={() => setSelectedSpecies(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedSpecies(item);
                          }
                        }}
                        onMouseEnter={() => setHoveredSpeciesId(item.id)}
                        onMouseLeave={() => setHoveredSpeciesId(null)}
                        onFocus={() => setHoveredSpeciesId(item.id)}
                        onBlur={() => setHoveredSpeciesId(null)}
                        role="button"
                        tabIndex={0}
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
                              <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider">
                                {item.category === 'preservado' ? 'Preservado' : 'Permanente'}
                              </span>
                              {item.uvProtection && (
                                <span className="text-[9px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.2 rounded border border-amber-300">
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
                                <span>
                                  {isPt
                                    ? 'Cuidado Inteligente: Zero Rega'
                                    : isEs
                                    ? 'Cuidado Inteligente: Cero Riego'
                                    : 'Smart Care: Zero Irrigation'}
                                </span>
                              </span>
                              <span className="text-[10px] text-emerald-800 font-mono font-bold bg-white/90 px-1.5 py-0.2 rounded border border-emerald-200">
                                {itemIsPreserved
                                  ? isPt ? 'Vida útil 8-10a' : isEs ? 'Vida útil 8-10a' : 'Lifespan 8-10y'
                                  : isPt ? 'Vida útil 12+a' : isEs ? 'Vida útil 12+a' : 'Lifespan 12+y'}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Compare Action Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-emerald-900/60 mt-0.5">
                          <button
                            type="button"
                            onClick={(e) => toggleCompareSpecies(item.id, e)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isCompared
                                ? 'bg-[#0d3822] text-[#86efac] border border-[#0d3822] shadow-xs'
                                : 'bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#0d3822] border border-gray-200 hover:border-emerald-300 shadow-2xs'
                            }`}
                            title={
                              isCompared
                                ? isPt ? 'Remover do comparativo técnico' : isEs ? 'Eliminar de la comparación técnica' : 'Remove from technical comparison'
                                : isPt ? 'Selecionar para comparar até 3 espécies lado a lado' : isEs ? 'Seleccionar para comparar hasta 3 especies lado a lado' : 'Select to compare up to 3 species side-by-side'
                            }
                            aria-label={
                              isCompared
                                ? `${isPt ? 'Remover' : isEs ? 'Eliminar' : 'Remove'} ${item.name}`
                                : `${isPt ? 'Comparar' : isEs ? 'Comparar' : 'Compare'} ${item.name}`
                            }
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>
                              {isCompared
                                ? isPt ? 'Comparando ✓' : isEs ? 'Comparando ✓' : 'Comparing ✓'
                                : isPt ? 'Comparar Espécie' : isEs ? 'Comparar Especie' : 'Compare Species'}
                            </span>
                          </button>

                          <span className="text-[11px] text-gray-400 font-medium">
                            {isSelected
                              ? isPt ? 'Em foco' : isEs ? 'En foco' : 'In focus'
                              : isPt ? 'Ver ficha →' : isEs ? 'Ver ficha →' : 'View sheet →'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right Detail Card - FICHA TÉCNICA DE ESPECIFICAÇÃO */}
          <ScrollReveal animation="fade-left" delay={0.15} distance={25} className="lg:col-span-7 w-full min-w-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 xs:p-6 sm:p-8 border border-gray-200 shadow-xl overflow-hidden w-full min-w-0">
              
              {selectedSpecies && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedSpecies.id}
                    variants={detailContentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 w-full min-w-0"
                  >
                    {/* Header Badge */}
                    <div className="flex items-start sm:items-center justify-between border-b border-gray-100 pb-4 gap-4 flex-col sm:flex-row">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-widest">
                          {isPt
                            ? 'FICHA TÉCNICA DE ESPECIFICAÇÃO'
                            : isEs
                            ? 'FICHA TÉCNICA DE ESPECIFICACIÓN'
                            : 'TECHNICAL SPECIFICATION SHEET'}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                          {selectedSpecies.name}
                        </h3>
                        <p className="text-xs text-gray-500 italic font-mono mt-0.5">
                          {isPt ? 'Nome Científico' : isEs ? 'Nombre Científico' : 'Scientific Name'}: {selectedSpecies.scientificName}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => toggleCompareSpecies(selectedSpecies.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                            comparisonSpeciesIds.includes(selectedSpecies.id)
                              ? 'bg-[#0d3822] text-[#86efac] border border-[#0d3822]'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-[#0d3822] border border-emerald-300'
                          }`}
                          title={
                            comparisonSpeciesIds.includes(selectedSpecies.id)
                              ? isPt ? 'Remover do comparativo' : isEs ? 'Eliminar de la comparación' : 'Remove from comparison'
                              : isPt ? 'Adicionar ao comparativo (até 3 plantas)' : isEs ? 'Añadir a la comparación (hasta 3 plantas)' : 'Add to comparison (up to 3 plants)'
                          }
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>
                            {comparisonSpeciesIds.includes(selectedSpecies.id)
                              ? isPt ? 'No Comparador ✓' : isEs ? 'En Comparador ✓' : 'In Comparator ✓'
                              : isPt ? 'Comparar Espécie' : isEs ? 'Comparar Especie' : 'Compare Species'}
                          </span>
                        </button>

                        <span className="px-3 py-1 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-full shrink-0">
                          {selectedSpecies.line}
                        </span>
                      </div>
                    </div>

                    {/* Image & Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center w-full">
                      
                      {/* Species Preview Image with proportional aspect ratio */}
                      <motion.div 
                        variants={metricBoxVariants}
                        className="sm:col-span-5 aspect-[4/3] sm:h-56 w-full rounded-2xl overflow-hidden border border-gray-200 group relative"
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
                      <div className="sm:col-span-7 flex flex-col gap-2.5 sm:gap-3 w-full min-w-0">
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
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              Cuidado & Longevidade Botânica
                            </h4>
                            <p className="text-[11px] text-emerald-200/80">
                              Estimativa de manutenção para {selectedSpecies.name}
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
                        <span>
                          {isPt
                            ? 'Simular Esta Folhagem'
                            : isEs
                            ? 'Simular este Follaje'
                            : 'Simulate This Foliage'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={onOpenQuote}
                        className="w-full sm:w-auto py-3 px-6 bg-emerald-50 text-[#072a1a] hover:bg-emerald-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        {isPt
                          ? 'Incluir na Amostra'
                          : isEs
                          ? 'Pedir Kit de Muestra'
                          : 'Include in Sample Kit'}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

            </div>
          </ScrollReveal>

        </div>

      </div>

      {/* Floating Comparison Dock Bar */}
      <AnimatePresence>
        {comparisonSpeciesIds.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#071d13]/95 text-white backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-2 sm:gap-6 max-w-[calc(100vw-24px)] sm:max-w-2xl w-full"
            role="region"
            aria-label="Barra de comparação botânica"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 text-[#86efac] flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                    {isPt ? 'Comparador' : isEs ? 'Comparador' : 'Comparator'}
                  </span>
                  <span className="text-[10px] bg-[#86efac] text-[#071d13] px-1.5 py-0.2 rounded font-extrabold">
                    {comparisonSpeciesIds.length}/3
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 overflow-x-auto">
                  {selectedForComparisonList.map((sp) => (
                    <span
                      key={sp.id}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] bg-white/10 text-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[80px] sm:max-w-[120px]"
                    >
                      <span className="truncate">{sp.name.split(' ')[0]}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompareSpecies(sp.id);
                        }}
                        className="hover:text-red-400 p-0.5 cursor-pointer"
                        title={`${isPt ? 'Remover' : isEs ? 'Eliminar' : 'Remove'} ${sp.name}`}
                        aria-label={`${isPt ? 'Remover' : isEs ? 'Eliminar' : 'Remove'} ${sp.name}`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparisonSpeciesIds([])}
                className="text-xs text-gray-300 hover:text-white underline cursor-pointer px-1 py-1"
              >
                {isPt ? 'Limpar' : isEs ? 'Limpiar' : 'Clear'}
              </button>

              <button
                type="button"
                onClick={() => setIsComparisonModalOpen(true)}
                className="px-2.5 sm:px-4 py-2 bg-[#86efac] text-[#071d13] font-bold text-xs rounded-xl hover:bg-emerald-300 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {isPt
                    ? 'Ver Tabela Lado a Lado'
                    : isEs
                    ? 'Ver Tabla Lado a Lado'
                    : 'View Side-by-Side Table'}
                </span>
                <span className="sm:hidden">
                  {isPt ? 'Comparar' : isEs ? 'Comparar' : 'Compare'}
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Maximum 3 Species Alert Toast */}
      <AnimatePresence>
        {comparisonToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-amber-950/95 text-amber-100 border border-amber-600/80 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md text-center max-w-sm pointer-events-none"
            role="alert"
          >
            {comparisonToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Modal */}
      <SpeciesComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedSpeciesList={selectedForComparisonList}
        onRemoveSpecies={handleRemoveSpeciesFromCompare}
        onAddSpecies={handleAddSpeciesToCompare}
        onClearAll={() => setComparisonSpeciesIds([])}
        onSimulateSpecies={onSimulateSpecies}
        onOpenQuote={onOpenQuote}
      />
    </section>
  );
};
