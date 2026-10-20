import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Scale, 
  ArrowLeftRight, 
  Check, 
  Plus, 
  Trash2, 
  Droplets, 
  Volume2, 
  Sun, 
  ShieldCheck, 
  Clock, 
  Camera, 
  PhoneCall, 
  Layers, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { BotanicalSpecies } from '../types';
import { BOTANICAL_SPECIES } from '../data/mockData';
import { useLanguage, Language } from '../context/LanguageContext';

export interface TechnicalSpecs {
  nrcValue: number;
  nrcFormatted: string;
  nrcRating: string;
  humidityRange: string;
  humidityBehavior: string;
  maintenanceWater: string;
  maintenancePruning: string;
  maintenanceCleaning: string;
  lifespanYears: string;
  sunlightTolerance: string;
  uvProtection: boolean;
  certifications: string;
}

export function getSpeciesTechnicalSpecs(species: BotanicalSpecies, language: Language = 'pt'): TechnicalSpecs {
  const isPt = language === 'pt';
  const isEs = language === 'es';

  switch (species.id) {
    case 'moss-dinamarques':
      return {
        nrcValue: 0.85,
        nrcFormatted: 'NRC 0.85',
        nrcRating: isPt
          ? 'Classe A (Absorção Sonora Máxima)'
          : isEs
          ? 'Clase A (Absorción Sonora Máxima)'
          : 'Class A (Maximum Sound Absorption)',
        humidityRange: '40% a 70% UR',
        humidityBehavior: isPt
          ? 'Higroscópico natural; preserva maciez com a umidade do ar. Não requer borrifação.'
          : isEs
          ? 'Higroscópico natural; conserva suavidad con la humedad ambiental. No requiere aspersión.'
          : 'Natural hygroscopic; preserves softness with ambient air humidity. No misting required.',
        maintenanceWater: isPt
          ? 'Zero rega (dispensa encanamento ou dreno)'
          : isEs
          ? 'Cero riego (sin fontanería ni desagüe)'
          : 'Zero irrigation (no plumbing or drainage required)',
        maintenancePruning: isPt
          ? 'Sem poda ou adubação periódica'
          : isEs
          ? 'Sin poda ni fertilización periódica'
          : 'No pruning or periodic fertilization',
        maintenanceCleaning: isPt
          ? 'Espanador eletrostático ou ar frio a cada 6 meses'
          : isEs
          ? 'Plumero electrostático o aire frío cada 6 meses'
          : 'Electrostatic duster or cold air every 6 months',
        lifespanYears: isPt ? '8 a 10 anos' : isEs ? '8 a 10 años' : '8 to 10 years',
        sunlightTolerance: isPt
          ? 'Sombra total / Luz artificial (evitar radiação solar direta)'
          : isEs
          ? 'Sombra total / Luz artificial (evitar radiación solar directa)'
          : 'Full shade / Artificial light (avoid direct sunlight)',
        uvProtection: false,
        certifications: isPt
          ? 'Laudo IPT Classe II-A (Retardante a chamas) + Estabilização Orgânica'
          : isEs
          ? 'Informe IPT Clase II-A (Retardante de fuego) + Estabilización Orgánica'
          : 'IPT Class II-A Flame-Retardant Report + Certified Organic Stabilization',
      };
    case 'samambaia-chorona':
      return {
        nrcValue: 0.45,
        nrcFormatted: 'NRC 0.45',
        nrcRating: isPt
          ? 'Classe D (Atenuação Foliar & Difusão)'
          : isEs
          ? 'Clase D (Atenuación Foliar y Difusión)'
          : 'Class D (Foliar Attenuation & Sound Diffusion)',
        humidityRange: '10% a 95% UR',
        humidityBehavior: isPt
          ? 'Imune a variações bruscas, ar-condicionado contínuo e áreas litorâneas.'
          : isEs
          ? 'Inmune a variaciones bruscas, aire acondicionado continuo y zonas costeras.'
          : 'Immune to abrupt temperature shifts, 24/7 HVAC, and coastal environments.',
        maintenanceWater: isPt
          ? 'Zero rega (estrutura polimérica inerte)'
          : isEs
          ? 'Cero riego (estructura polimérica inerte)'
          : 'Zero irrigation (inert polymer foliage)',
        maintenancePruning: isPt
          ? 'Sem necessidade de poda'
          : isEs
          ? 'Sin necesidad de poda'
          : 'No pruning needed',
        maintenanceCleaning: isPt
          ? 'Pano microfibra levemente úmido a cada 6 a 12 meses'
          : isEs
          ? 'Paño de microfibra ligeramente húmedo cada 6 a 12 meses'
          : 'Slightly damp microfiber cloth every 6 to 12 months',
        lifespanYears: isPt ? '12+ anos' : isEs ? '12+ años' : '12+ years',
        sunlightTolerance: isPt
          ? 'Sol pleno / Meia sombra (Tratamento Anti-Fade UV)'
          : isEs
          ? 'Pleno sol / Media sombra (Tratamiento Anti-Fade UV)'
          : 'Full sun / Partial shade (Anti-Fade UV Protected)',
        uvProtection: true,
        certifications: isPt
          ? 'Ensaio ASTM G154 de Proteção Solar UV + Polímeros Recicláveis'
          : isEs
          ? 'Ensayo ASTM G154 de Protección Solar UV + Polímeros Reciclables'
          : 'ASTM G154 Solar UV Resistance Testing + Recyclable Polymers',
      };
    case 'costela-de-adao':
      return {
        nrcValue: 0.70,
        nrcFormatted: 'NRC 0.70',
        nrcRating: isPt
          ? 'Classe B (Alta Absorção de Frequências Médias)'
          : isEs
          ? 'Clase B (Alta Absorción de Frecuencias Medias)'
          : 'Class B (High Medium-Frequency Acoustic Absorption)',
        humidityRange: '40% a 70% UR',
        humidityBehavior: isPt
          ? 'Estabilidade celular com flexibilidade foliar original mantida.'
          : isEs
          ? 'Estabilidad celular con flexibilidad foliar original mantenida.'
          : 'Cellular stability maintaining authentic leaf flexibility.',
        maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
        maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
        maintenanceCleaning: isPt
          ? 'Espanador macio semestral'
          : isEs
          ? 'Plumero suave semestral'
          : 'Soft dusting every 6 months',
        lifespanYears: isPt ? '8 a 10 anos' : isEs ? '8 a 10 años' : '8 to 10 years',
        sunlightTolerance: isPt
          ? 'Luz indireta / Ambientes internos sem sol direto'
          : isEs
          ? 'Luz indirecta / Ambientes interiores sin sol directo'
          : 'Indirect light / Indoor spaces without direct sun',
        uvProtection: false,
        certifications: isPt
          ? 'Laudo IPT de Não-Propagação + Preservação Biológica Certificada'
          : isEs
          ? 'Informe IPT de No Propagación + Preservación Biológica Certificada'
          : 'IPT Non-Propagation Testing + Certified Bio Preservation',
      };
    case 'eucalipto-perfumado':
      return {
        nrcValue: 0.60,
        nrcFormatted: 'NRC 0.60',
        nrcRating: isPt
          ? 'Classe C (Difusão Acústica e Conforto)'
          : isEs
          ? 'Clase C (Difusión Acústica y Confort)'
          : 'Class C (Acoustic Diffusion & Comfort)',
        humidityRange: '40% a 70% UR',
        humidityBehavior: isPt
          ? 'Liberação gradual de notas sutis de eucaliptol; sensível ao sol direto.'
          : isEs
          ? 'Liberación gradual de notas sutiles de eucaliptol; sensible al sol directo.'
          : 'Subtle natural aroma release; sensitive to harsh direct sun.',
        maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
        maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
        maintenanceCleaning: isPt
          ? 'Espanador suave semestral'
          : isEs
          ? 'Plumero suave semestral'
          : 'Soft duster biannually',
        lifespanYears: isPt ? '7 a 10 anos' : isEs ? '7 a 10 años' : '7 to 10 years',
        sunlightTolerance: isPt
          ? 'Ambientes internos com iluminação indireta'
          : isEs
          ? 'Ambientes interiores con iluminación indirecta'
          : 'Indoor settings with indirect light',
        uvProtection: false,
        certifications: isPt
          ? 'Hipoalergênico & Atóxico + Laudo Anti-chama'
          : isEs
          ? 'Hipoalergénico y No Tóxico + Informe Anti-llama'
          : 'Hypoallergenic & Non-Toxic + Flame Retardant Certified',
      };
    case 'jiboia-imperial':
      return {
        nrcValue: 0.40,
        nrcFormatted: 'NRC 0.40',
        nrcRating: isPt
          ? 'Classe D (Atenuação de Reverberação e Eco)'
          : isEs
          ? 'Clase D (Atenuación de Reverberación y Eco)'
          : 'Class D (Reverberation & Echo Attenuation)',
        humidityRange: '10% a 95% UR',
        humidityBehavior: isPt
          ? 'Totalmente insensível a umidade ou ar-condicionado direto.'
          : isEs
          ? 'Totalmente insensible a humedad o aire acondicionado directo.'
          : 'Fully resistant to humidity fluctuations and direct HVAC airflow.',
        maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
        maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
        maintenanceCleaning: isPt
          ? 'Lavável ou espanador rápido a cada 6 a 12 meses'
          : isEs
          ? 'Lavable o plumero rápido cada 6 a 12 meses'
          : 'Washable or quick dusting every 6-12 months',
        lifespanYears: isPt ? '12+ anos' : isEs ? '12+ años' : '12+ years',
        sunlightTolerance: isPt
          ? 'Sol pleno, claraboias ou sombra (Proteção UV)'
          : isEs
          ? 'Pleno sol, claraboyas o sombra (Protección UV)'
          : 'Full sun, skylights, or shaded areas (UV Protected)',
        uvProtection: true,
        certifications: isPt
          ? 'Norma UL94 Anti-chama + Teste de Resistência Térmica'
          : isEs
          ? 'Norma UL94 Anti-llama + Ensayo de Resistencia Térmica'
          : 'UL94 Flame Retardant Rating + Thermal Resistance Testing',
      };
    case 'avenca-selvagem':
      return {
        nrcValue: 0.35,
        nrcFormatted: 'NRC 0.35',
        nrcRating: isPt
          ? 'Classe D (Filtragem de Agudos e Ruído de Fundo)'
          : isEs
          ? 'Clase D (Filtrado de Agudos y Ruido de Fondo)'
          : 'Class D (High-Frequency Filtering & Background Noise)',
        humidityRange: '10% a 95% UR',
        humidityBehavior: isPt
          ? 'Alta resistência mecânica em folíolos plumosos.'
          : isEs
          ? 'Alta resistencia mecánica en folíolos plumosos.'
          : 'High mechanical resilience across delicate feathery fronds.',
        maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
        maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
        maintenanceCleaning: isPt
          ? 'Jato de ar frio ou espanador suave semestral'
          : isEs
          ? 'Chorro de aire frío o plumero suave semestral'
          : 'Cool air blower or gentle dusting biannually',
        lifespanYears: isPt ? '12+ anos' : isEs ? '12+ años' : '12+ years',
        sunlightTolerance: isPt
          ? 'Áreas internas e externas cobertas com proteção UV'
          : isEs
          ? 'Áreas interiores y exteriores cubiertas con protección UV'
          : 'Indoor and covered outdoor spaces with UV protection',
        uvProtection: true,
        certifications: isPt
          ? 'Tratamento UV-Protected + Teste de Durabilidade Mecânica'
          : isEs
          ? 'Tratamiento UV-Protected + Test de Durabilidad Mecánica'
          : 'UV-Protected Coating + Mechanical Durability Testing',
      };
    default:
      if (species.category === 'preservado') {
        return {
          nrcValue: 0.65,
          nrcFormatted: 'NRC 0.65',
          nrcRating: isPt
            ? 'Classe C (Boa Absorção Sonora)'
            : isEs
            ? 'Clase C (Buena Absorción Sonora)'
            : 'Class C (Good Sound Absorption)',
          humidityRange: '40% a 70% UR',
          humidityBehavior: isPt
            ? 'Equilíbrio higrométrico natural; evitar exposição à água.'
            : isEs
            ? 'Equilibrio higrométrico natural; evitar exposición al agua.'
            : 'Natural hygrometric balance; avoid water exposure.',
          maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
          maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
          maintenanceCleaning: isPt ? 'Espanador semestral' : isEs ? 'Plumero semestral' : 'Dusting every 6 months',
          lifespanYears: isPt ? '8 a 10 anos' : isEs ? '8 a 10 años' : '8 to 10 years',
          sunlightTolerance: isPt ? 'Luz indireta' : isEs ? 'Luz indirecta' : 'Indirect light',
          uvProtection: false,
          certifications: isPt
            ? 'Preservação Biológica Certificada + Laudo IPT'
            : isEs
            ? 'Preservación Biológica Certificada + Informe IPT'
            : 'Certified Bio-Preservation + IPT Test Report',
        };
      }
      return {
        nrcValue: 0.40,
        nrcFormatted: 'NRC 0.40',
        nrcRating: isPt
          ? 'Classe D (Difusão e Conforto)'
          : isEs
          ? 'Clase D (Difusión y Confort)'
          : 'Class D (Diffusion & Acoustic Comfort)',
        humidityRange: '10% a 95% UR',
        humidityBehavior: isPt
          ? 'Resistente a qualquer variação de umidade.'
          : isEs
          ? 'Resistente a cualquier variación de humedad.'
          : 'Resistant to any humidity variation.',
        maintenanceWater: isPt ? 'Zero rega' : isEs ? 'Cero riego' : 'Zero irrigation',
        maintenancePruning: isPt ? 'Sem poda' : isEs ? 'Sin poda' : 'No pruning',
        maintenanceCleaning: isPt ? 'Pano seco/úmido semestral' : isEs ? 'Paño seco/húmedo semestral' : 'Dry/damp cloth biannually',
        lifespanYears: isPt ? '12+ anos' : isEs ? '12+ años' : '12+ years',
        sunlightTolerance: isPt ? 'Sol pleno / UV Resistente' : isEs ? 'Pleno sol / UV Resistente' : 'Full sun / UV Resistant',
        uvProtection: true,
        certifications: isPt
          ? 'Proteção UV Anti-Fade + Polímeros Premium'
          : isEs
          ? 'Protección UV Anti-Fade + Polímeros Premium'
          : 'Anti-Fade UV Protection + Premium Polymers',
      };
  }
}

interface SpeciesComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpeciesList: BotanicalSpecies[];
  onRemoveSpecies: (speciesId: string) => void;
  onAddSpecies: (species: BotanicalSpecies) => void;
  onClearAll: () => void;
  onSimulateSpecies?: (speciesName: string) => void;
  onOpenQuote?: () => void;
}

export const SpeciesComparisonModal: React.FC<SpeciesComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedSpeciesList,
  onRemoveSpecies,
  onAddSpecies,
  onClearAll,
  onSimulateSpecies,
  onOpenQuote,
}) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const isEs = language === 'es';

  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const availableToAdd = BOTANICAL_SPECIES.filter(
    (s) => !selectedSpeciesList.some((sel) => sel.id === s.id)
  );

  return createPortal(
    <div
      id="species-comparison-modal"
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={
        isPt
          ? 'Tabela de Comparação Técnica de Espécies Botânicas'
          : isEs
          ? 'Tabla de Comparación Técnica de Especies Botánicas'
          : 'Technical Botanical Species Comparison Table'
      }
    >
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl bg-white dark:bg-[#071d13] rounded-3xl shadow-2xl border border-emerald-900/30 overflow-hidden flex flex-col max-h-[92vh] z-10 my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-gray-100 dark:border-emerald-900/60 bg-[#f9fbf9] dark:bg-[#06180f] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0d3822] text-[#86efac] flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#15803d] dark:text-[#86efac] uppercase tracking-wider">
                  {isPt
                    ? 'Especificação Comparativa Lado a Lado'
                    : isEs
                    ? 'Especificación Comparativa Lado a Lado'
                    : 'Side-by-Side Comparative Specification'}
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {selectedSpeciesList.length} {isPt ? 'de 3 Espécies' : isEs ? 'de 3 Especies' : 'of 3 Species'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-white leading-tight">
                {isPt
                  ? 'Comparativo Técnico de Propriedades Botânicas'
                  : isEs
                  ? 'Comparativa Técnica de Propiedades Botánicas'
                  : 'Technical Botanical Properties Comparison'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedSpeciesList.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isPt ? 'Limpar Todas' : isEs ? 'Limpiar Todas' : 'Clear All'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              aria-label={isPt ? 'Fechar comparador' : isEs ? 'Cerrar comparador' : 'Close comparison'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 custom-scrollbar">
          {selectedSpeciesList.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#15803d] mx-auto flex items-center justify-center">
                <ArrowLeftRight className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {isPt
                    ? 'Nenhuma espécie selecionada para comparação'
                    : isEs
                    ? 'Ninguna especie seleccionada para comparación'
                    : 'No species selected for comparison'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                  {isPt ? (
                    <>Selecione até 3 plantas no Catálogo Botânico clicando em <strong>"Comparar Espécie"</strong> para visualizar a análise lado a lado.</>
                  ) : isEs ? (
                    <>Seleccione hasta 3 plantas en el Catálogo Botánico haciendo clic en <strong>"Comparar Especie"</strong> para ver el análisis lado a lado.</>
                  ) : (
                    <>Select up to 3 plants from the Botanical Catalog by clicking <strong>"Compare Species"</strong> to view the side-by-side analysis.</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#0d3822] text-[#86efac] font-bold text-xs rounded-xl shadow-xs hover:bg-[#15803d] transition-colors cursor-pointer"
              >
                {isPt
                  ? 'Ir para o Catálogo Botânico'
                  : isEs
                  ? 'Ir al Catálogo Botánico'
                  : 'Go to Botanical Catalog'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Plant Cards Column Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedSpeciesList.map((species) => {
                  const specs = getSpeciesTechnicalSpecs(species, language);
                  return (
                    <div
                      key={species.id}
                      className="bg-[#f9fbf9] dark:bg-[#0a2318] rounded-2xl p-4 border border-emerald-900/15 dark:border-emerald-800/60 relative flex flex-col justify-between shadow-xs group"
                    >
                      <button
                        type="button"
                        onClick={() => onRemoveSpecies(species.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white dark:bg-emerald-950 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 shadow-2xs transition-colors cursor-pointer"
                        title={`${isPt ? 'Remover' : isEs ? 'Eliminar' : 'Remove'} ${species.name}`}
                        aria-label={`${isPt ? 'Remover' : isEs ? 'Eliminar' : 'Remove'} ${species.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3">
                        <div className="relative h-36 rounded-xl overflow-hidden border border-gray-200 dark:border-emerald-800">
                          <img
                            src={species.image}
                            alt={species.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#072a1a]/90 text-[#86efac] px-2 py-0.5 rounded-md backdrop-blur-xs">
                              {species.category === 'preservado'
                                ? isPt ? '100% Preservado' : isEs ? '100% Preservado' : '100% Preserved'
                                : isPt ? 'Permanente UV' : isEs ? 'Permanente UV' : 'Permanent UV'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {species.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic font-mono truncate">
                            {species.scientificName}
                          </p>
                        </div>
                      </div>

                      {/* Quick CTA per species */}
                      {onSimulateSpecies && (
                        <div className="pt-3 border-t border-gray-200/80 dark:border-emerald-900/60 mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSimulateSpecies(species.name);
                            }}
                            className="w-full py-1.5 px-3 bg-white dark:bg-emerald-950/80 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-[#0d3822] dark:text-[#86efac] border border-emerald-300/80 dark:border-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>
                              {isPt
                                ? 'Simular no Ambiente'
                                : isEs
                                ? 'Simular en Espacio'
                                : 'Simulate in Space'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty slot to add more species if < 3 */}
                {selectedSpeciesList.length < 3 && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-emerald-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-gray-50/50 dark:bg-emerald-950/20 relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-[#15803d] flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {isPt
                          ? 'Adicionar outra planta'
                          : isEs
                          ? 'Añadir otra planta'
                          : 'Add another plant'}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {isPt
                          ? 'Compare até 3 espécies em paralelo'
                          : isEs
                          ? 'Compare hasta 3 especies en paralelo'
                          : 'Compare up to 3 species side-by-side'}
                      </p>
                    </div>

                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                        className="w-full py-2 px-3 bg-white dark:bg-emerald-950 border border-gray-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-[#0d3822] dark:text-[#86efac] hover:bg-emerald-50 transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {isPt
                            ? 'Escolher Espécie'
                            : isEs
                            ? 'Elegir Especie'
                            : 'Choose Species'}
                        </span>
                      </button>

                      {/* Dropdown with remaining species */}
                      {showAddDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#071d13] border border-gray-200 dark:border-emerald-800 rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto p-1 text-left custom-scrollbar">
                          {availableToAdd.map((avail) => (
                            <button
                              key={avail.id}
                              type="button"
                              onClick={() => {
                                onAddSpecies(avail);
                                setShowAddDropdown(false);
                              }}
                              className="w-full p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/60 rounded-lg flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                            >
                              <img
                                src={avail.image}
                                alt={avail.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-gray-900 dark:text-white block truncate">
                                  {avail.name}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">
                                  {avail.category === 'preservado'
                                    ? isPt ? 'Preservado' : isEs ? 'Preservado' : 'Preserved'
                                    : isPt ? 'Permanente' : isEs ? 'Permanente' : 'Permanent'}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Side-by-Side Detailed Criteria Table */}
              <div className="border border-gray-200 dark:border-emerald-900/60 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-[#06180f]">
                
                {/* 1. CRITERION: Coeficiente de Absorção Acústica (NRC) */}
                <div className="border-b border-gray-100 dark:border-emerald-900/50">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '1. Coeficiente de Redução de Ruído (NRC)'
                        : isEs
                        ? '1. Coeficiente de Reducción de Ruido (NRC)'
                        : '1. Noise Reduction Coefficient (NRC)'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => {
                      const specs = getSpeciesTechnicalSpecs(species, language);
                      const percent = Math.round(specs.nrcValue * 100);
                      return (
                        <div key={species.id} className="sm:px-4 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-serif font-extrabold text-[#072a1a] dark:text-white">
                              {specs.nrcFormatted}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#15803d] dark:text-[#86efac]">
                              {percent}% {isPt ? 'Absorção' : isEs ? 'Absorción' : 'Absorption'}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-100 dark:bg-emerald-950 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-600 to-[#15803d] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {specs.nrcRating}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. CRITERION: Taxa de Umidade & Tolerância */}
                <div className="border-b border-gray-100 dark:border-emerald-900/50">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '2. Faixa de Umidade Relativa & Comportamento Higrométrico'
                        : isEs
                        ? '2. Rango de Humedad Relativa & Comportamiento Higrométrico'
                        : '2. Relative Humidity Range & Hygrometric Behavior'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => {
                      const specs = getSpeciesTechnicalSpecs(species, language);
                      return (
                        <div key={species.id} className="sm:px-4 space-y-1.5">
                          <span className="inline-block text-xs font-bold font-mono text-[#072a1a] dark:text-[#86efac] bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                            {specs.humidityRange}
                          </span>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            {specs.humidityBehavior}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. CRITERION: Protocolo de Manutenção & Limpeza */}
                <div className="border-b border-gray-100 dark:border-emerald-900/50">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '3. Protocolo de Manutenção, Higienização & Vida Útil'
                        : isEs
                        ? '3. Protocolo de Mantenimiento, Higienización & Vida Útil'
                        : '3. Maintenance, Cleaning & Lifespan Protocol'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => {
                      const specs = getSpeciesTechnicalSpecs(species, language);
                      return (
                        <div key={species.id} className="sm:px-4 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                            <Clock className="w-3.5 h-3.5 text-[#15803d]" />
                            <span>{isPt ? 'Expectativa' : isEs ? 'Expectativa' : 'Expectancy'}: {specs.lifespanYears}</span>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                            <div className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{specs.maintenanceWater}</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{specs.maintenanceCleaning}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. CRITERION: Iluminação & Proteção Solar */}
                <div className="border-b border-gray-100 dark:border-emerald-900/50">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '4. Iluminação Recomendada & Proteção Anti-UV'
                        : isEs
                        ? '4. Iluminación Recomendada & Protección Anti-UV'
                        : '4. Recommended Lighting & UV Protection'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => {
                      const specs = getSpeciesTechnicalSpecs(species, language);
                      return (
                        <div key={species.id} className="sm:px-4 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {specs.sunlightTolerance}
                            </span>
                            {specs.uvProtection && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                                Anti-UV
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. CRITERION: Sensação Tátil & Textura */}
                <div className="border-b border-gray-100 dark:border-emerald-900/50">
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '5. Textura & Sensação Tátil'
                        : isEs
                        ? '5. Textura & Sensación Táctil'
                        : '5. Texture & Tactile Feel'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => (
                      <div key={species.id} className="sm:px-4">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {species.tactileFeel}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. CRITERION: Laudos e Certificações */}
                <div>
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/60 px-4 py-2.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#072a1a] dark:text-[#86efac]">
                      {isPt
                        ? '6. Laudos Técnicos & Conformidade Normativa'
                        : isEs
                        ? '6. Informes Técnicos & Conformidad Normativa'
                        : '6. Technical Reports & Standard Compliance'}
                    </span>
                  </div>
                  <div className={`grid grid-cols-1 ${selectedSpeciesList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-emerald-900/50 p-4 gap-4 sm:gap-0`}>
                    {selectedSpeciesList.map((species) => {
                      const specs = getSpeciesTechnicalSpecs(species, language);
                      return (
                        <div key={species.id} className="sm:px-4">
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-mono">
                            {specs.certifications}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 sm:px-8 py-4 border-t border-gray-100 dark:border-emerald-900/60 bg-[#f9fbf9] dark:bg-[#06180f] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-3.5 h-3.5 text-[#15803d]" />
            <span>
              {isPt
                ? 'Dados balizados por ensaios IPT acústicos e normas LEED/WELL.'
                : isEs
                ? 'Datos basados en ensayos IPT acústicos y normas LEED/WELL.'
                : 'Data verified by certified IPT acoustic tests and LEED/WELL standards.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0d3822] text-[#86efac] font-bold text-xs rounded-xl shadow-xs hover:bg-[#15803d] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>
                  {isPt
                    ? 'Solicitar Proposta com estas Espécies'
                    : isEs
                    ? 'Solicitar Presupuesto con estas Especies'
                    : 'Request Proposal with these Species'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white dark:bg-emerald-950 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl border border-gray-300 dark:border-emerald-800 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isPt ? 'Fechar' : isEs ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
