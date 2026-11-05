import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
  ReferenceLine,
  LineChart,
  Line,
} from 'recharts';
import {
  Volume2,
  VolumeX,
  Sliders,
  Award,
  Sparkles,
  Info,
  CheckCircle2,
  Activity,
  Layers,
  Leaf,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

export interface BotanicalAcousticSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: 'Preservado' | 'Permanente' | 'Natural Vivo' | 'Referência Convencional';
  nrcRating: number; // Noise Reduction Coefficient (0.0 to 1.0)
  baseReductionDb: number; // Nominal decibel reduction (at reference 25m²)
  leafTexture: string;
  speechAbsorptionPct: number; // 500Hz - 2000Hz speech frequency absorption
  fireRating: string;
  recommendedUse: string;
  color: string;
  // Frequency absorption coefficients (ISO 354)
  freqAbsorption: {
    f125: number;
    f250: number;
    f500: number;
    f1000: number;
    f2000: number;
    f4000: number;
  };
}

export const BOTANICAL_ACOUSTIC_SPECIES: BotanicalAcousticSpecies[] = [
  {
    id: 'moss_polar',
    name: 'Musgo Polar Moss Preservado',
    scientificName: 'Cladonia rangiferina',
    category: 'Preservado',
    nrcRating: 0.88,
    baseReductionDb: 15.6,
    leafTexture: 'Estrutura celular 3D microporosa de 50mm',
    speechAbsorptionPct: 92,
    fireRating: 'Classe B-s1,d0 (Autoextinguível NBR 9442)',
    recommendedUse: 'Salas de reunião executivas, call booths, salas de videoconferência e forros acústicos vegetados',
    color: '#15803d',
    freqAbsorption: { f125: 0.35, f250: 0.65, f500: 0.88, f1000: 0.95, f2000: 0.92, f4000: 0.85 },
  },
  {
    id: 'samambaia_americana',
    name: 'Samambaia Americana Real Touch',
    scientificName: 'Nephrolepis exaltata',
    category: 'Permanente',
    nrcRating: 0.78,
    baseReductionDb: 12.8,
    leafTexture: 'Frondes pendentes articuladas em múltiplas camadas',
    speechAbsorptionPct: 82,
    fireRating: 'Retardante de chama UV Grade A',
    recommendedUse: 'Open spaces corporativos, recepções e divisórias vegetadas de estações de trabalho',
    color: '#10b981',
    freqAbsorption: { f125: 0.25, f250: 0.50, f500: 0.78, f1000: 0.86, f2000: 0.84, f4000: 0.75 },
  },
  {
    id: 'jiboia_verde',
    name: 'Jiboia Verde Tropical Preservada',
    scientificName: 'Epipremnum aureum',
    category: 'Preservado',
    nrcRating: 0.72,
    baseReductionDb: 11.2,
    leafTexture: 'Folhas coriáceas espessas e sobrepostas',
    speechAbsorptionPct: 76,
    fireRating: 'Tratamento atóxico retardante NBR 9442',
    recommendedUse: 'Paredes verdes de grande formato, corredores corporativos e lounges',
    color: '#059669',
    freqAbsorption: { f125: 0.20, f250: 0.44, f500: 0.72, f1000: 0.79, f2000: 0.77, f4000: 0.70 },
  },
  {
    id: 'costela_adao',
    name: 'Costela-de-Adão Preservada (Monstera)',
    scientificName: 'Monstera deliciosa',
    category: 'Preservado',
    nrcRating: 0.70,
    baseReductionDb: 10.4,
    leafTexture: 'Lâminas foliares largas com fenestrações difusoras',
    speechAbsorptionPct: 73,
    fireRating: 'Norma ABNT NBR 10152',
    recommendedUse: 'Painéis artísticos biofílicos e atriuns de pé-direito duplo',
    color: '#047857',
    freqAbsorption: { f125: 0.22, f250: 0.42, f500: 0.69, f1000: 0.76, f2000: 0.74, f4000: 0.68 },
  },
  {
    id: 'ficus_lyrata',
    name: 'Ficus Lyrata Hiper-Realista',
    scientificName: 'Ficus lyrata (Bambino)',
    category: 'Permanente',
    nrcRating: 0.65,
    baseReductionDb: 9.1,
    leafTexture: 'Folhas rígidas onduladas de formato violão',
    speechAbsorptionPct: 67,
    fireRating: 'Proteção Anti-UV & Autoextinguível',
    recommendedUse: 'Composições verticais mistas e floreiras suspensas',
    color: '#0d9488',
    freqAbsorption: { f125: 0.18, f250: 0.38, f500: 0.64, f1000: 0.71, f2000: 0.69, f4000: 0.62 },
  },
  {
    id: 'peperomia',
    name: 'Peperômia & Echevéria Preservada',
    scientificName: 'Peperomia obtusifolia',
    category: 'Preservado',
    nrcRating: 0.58,
    baseReductionDb: 7.8,
    leafTexture: 'Folhas carnosas compactas de textura gomosa',
    speechAbsorptionPct: 60,
    fireRating: 'Preservação com sais minerais retardantes',
    recommendedUse: 'Logos verdes, letras corporativas e molduras acústicas compactas',
    color: '#14b8a6',
    freqAbsorption: { f125: 0.15, f250: 0.32, f500: 0.57, f1000: 0.64, f2000: 0.62, f4000: 0.55 },
  },
  {
    id: 'drywall_convencional',
    name: 'Parede Lisa Convencional (Sem Biofilia)',
    scientificName: 'Drywall / Alvenaria Pintada (Referência)',
    category: 'Referência Convencional',
    nrcRating: 0.05,
    baseReductionDb: 0.8,
    leafTexture: 'Superfície rígida lisa (Reflete 95% das ondas sonoras em eco)',
    speechAbsorptionPct: 6,
    fireRating: 'Padrão da construção civil',
    recommendedUse: 'Cenário base sem conforto acústico',
    color: '#94a3b8',
    freqAbsorption: { f125: 0.03, f250: 0.04, f500: 0.05, f1000: 0.06, f2000: 0.06, f4000: 0.05 },
  },
];

interface NoisePreset {
  id: string;
  name: string;
  baselineDb: number;
  description: string;
  standardComfortLimitDb: number;
}

const NOISE_PRESETS: NoisePreset[] = [
  {
    id: 'open_space',
    name: 'Open Space Corporativo / Vendas',
    baselineDb: 68,
    description: 'Conversas cruzadas, digitação, chamadas de clientes e circulação contínua.',
    standardComfortLimitDb: 50,
  },
  {
    id: 'call_center',
    name: 'Área de Atendimento / Call Center',
    baselineDb: 74,
    description: 'Múltiplas vozes simultâneas exigindo alta absorção de fala.',
    standardComfortLimitDb: 55,
  },
  {
    id: 'meeting_room',
    name: 'Sala de Reuniões & Apresentações',
    baselineDb: 58,
    description: 'Reverberação de vozes e eco indesejado em videoconferências.',
    standardComfortLimitDb: 45,
  },
  {
    id: 'restaurant',
    name: 'Restaurante Corporativo / Praça de Convivência',
    baselineDb: 78,
    description: 'Barulho de talheres, música ambiente e aglomeração de colaboradores.',
    standardComfortLimitDb: 60,
  },
];

interface BotanicalNoiseReductionChartProps {
  currentProjectArea?: number;
  onOpenQuote?: (context?: string) => void;
}

export const BotanicalNoiseReductionChart: React.FC<BotanicalNoiseReductionChartProps> = ({
  currentProjectArea = 32,
  onOpenQuote,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('open_space');
  const [simulatedArea, setSimulatedArea] = useState<number>(currentProjectArea || 32);
  const [frequencyFilter, setFrequencyFilter] = useState<'dBA_overall' | 'speech_focal' | 'spectrum'>('dBA_overall');
  const [activeSpeciesId, setActiveSpeciesId] = useState<string>('moss_polar');

  const selectedPreset = NOISE_PRESETS.find((p) => p.id === selectedPresetId) || NOISE_PRESETS[0];

  // Scale factor: as vegetated area increases relative to typical 25m², acoustic efficiency scales logarithmically
  const areaScaleFactor = useMemo(() => {
    // Logarithmic acoustic area scaling according to Sabine formula RT60
    return Math.min(1.45, Math.max(0.65, 0.75 + Math.log10(simulatedArea / 10) * 0.45));
  }, [simulatedArea]);

  // Compute calculated chart data
  const chartData = useMemo(() => {
    return BOTANICAL_ACOUSTIC_SPECIES.map((species) => {
      let reductionDb = 0;

      if (species.id === 'drywall_convencional') {
        reductionDb = 0.8;
      } else if (frequencyFilter === 'speech_focal') {
        // Speech frequency average (500Hz + 1000Hz + 2000Hz)
        const speechNrc = (species.freqAbsorption.f500 + species.freqAbsorption.f1000 + species.freqAbsorption.f2000) / 3;
        reductionDb = Math.round(species.baseReductionDb * 1.15 * areaScaleFactor * (speechNrc / 0.85) * 10) / 10;
      } else {
        // Overall weighted dBA reduction
        reductionDb = Math.round(species.baseReductionDb * areaScaleFactor * 10) / 10;
      }

      const resultantNoiseDb = Math.max(35, Math.round((selectedPreset.baselineDb - reductionDb) * 10) / 10);
      const isCompliantWithWell = resultantNoiseDb <= selectedPreset.standardComfortLimitDb + 3;

      return {
        id: species.id,
        name: species.name.split(' ')[0] + ' ' + (species.name.split(' ')[1] || ''),
        fullName: species.name,
        scientificName: species.scientificName,
        category: species.category,
        nrc: species.nrcRating,
        reductionDb,
        resultantNoiseDb,
        baselineDb: selectedPreset.baselineDb,
        comfortLimitDb: selectedPreset.standardComfortLimitDb,
        isCompliantWithWell,
        color: species.color,
        speechAbsorption: species.speechAbsorptionPct,
        leafTexture: species.leafTexture,
      };
    });
  }, [selectedPreset, areaScaleFactor, frequencyFilter]);

  // Frequency spectrum data for active species comparison
  const spectrumData = useMemo(() => {
    const frequencies = [
      { freq: '125 Hz', label: 'Graves (HVAC)', key: 'f125' as const },
      { freq: '250 Hz', label: 'Médio-Grave', key: 'f250' as const },
      { freq: '500 Hz', label: 'Voz Humana I', key: 'f500' as const },
      { freq: '1.000 Hz', label: 'Voz Humana II', key: 'f1000' as const },
      { freq: '2.000 Hz', label: 'Articulação', key: 'f2000' as const },
      { freq: '4.000 Hz', label: 'Agudos (Teclado)', key: 'f4000' as const },
    ];

    const activeSpecies = BOTANICAL_ACOUSTIC_SPECIES.find((s) => s.id === activeSpeciesId) || BOTANICAL_ACOUSTIC_SPECIES[0];
    const mossSpecies = BOTANICAL_ACOUSTIC_SPECIES[0];
    const drywall = BOTANICAL_ACOUSTIC_SPECIES[BOTANICAL_ACOUSTIC_SPECIES.length - 1];

    return frequencies.map((f) => ({
      frequency: f.freq,
      label: f.label,
      activeAbsorption: Math.round(activeSpecies.freqAbsorption[f.key] * 100),
      mossAbsorption: Math.round(mossSpecies.freqAbsorption[f.key] * 100),
      drywallAbsorption: Math.round(drywall.freqAbsorption[f.key] * 100),
    }));
  }, [activeSpeciesId]);

  const bestSpecies = chartData[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-[#072a1a] via-[#093521] to-[#041a10] text-white p-5 sm:p-6 rounded-3xl border border-emerald-500/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#86efac] border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                CERTIFICAÇÃO WELL SOUND (S04) & IPT ISO 354
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-300/80">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Laudos Acústicos Físicos
              </span>
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-[#86efac] shrink-0" />
              <span>Atenuação Acústica & Redução de Ruído por Espécie (dB)</span>
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Visualize como cada espécie botânica dissipa reverberações e ruídos da fala humana no escritório,
              reduzindo a fadiga mental e elevando o conforto acústico segundo a norma ABNT NBR 10152.
            </p>
          </div>

          <div className="bg-emerald-950/70 p-3.5 rounded-2xl border border-emerald-800/80 shrink-0 text-center md:text-right space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              Atenuação Máxima Simulada
            </span>
            <div className="text-2xl font-mono font-extrabold text-[#86efac]">
              -{bestSpecies.reductionDb} dB
            </div>
            <span className="text-[10px] text-gray-300 block">
              Com {bestSpecies.fullName} ({simulatedArea} m²)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-5">
        
        {/* Row 1: Presets & Frequency Focus Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Preset Selector */}
          <div className="md:col-span-7 space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#15803d]" />
              <span>Ambiente Corporativo Simulado:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NOISE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPresetId(preset.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPresetId === preset.id
                      ? 'bg-emerald-50/80 border-[#15803d] shadow-2xs ring-1 ring-[#15803d]'
                      : 'bg-gray-50/70 border-gray-200 hover:bg-emerald-50/40 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{preset.name}</span>
                    <span className="text-[10px] font-mono font-bold text-[#15803d] bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                      {preset.baselineDb} dB
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis View Mode Buttons */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#15803d]" />
              <span>Foco da Análise Acústica:</span>
            </label>

            <div className="flex flex-col gap-1.5 bg-gray-50 p-2 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setFrequencyFilter('dBA_overall')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                  frequencyFilter === 'dBA_overall'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <span>Atenuação Global Ponderada (dBA)</span>
                <span className="text-[10px] font-mono font-normal">Escala Total</span>
              </button>

              <button
                type="button"
                onClick={() => setFrequencyFilter('speech_focal')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                  frequencyFilter === 'speech_focal'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <span>Faixa de Fala Humana (500Hz - 2kHz)</span>
                <span className="text-[10px] font-mono font-normal">Conforto WELL</span>
              </button>

              <button
                type="button"
                onClick={() => setFrequencyFilter('spectrum')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                  frequencyFilter === 'spectrum'
                    ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                <span>Espectro de Frequências (125Hz - 4kHz)</span>
                <span className="text-[10px] font-mono font-normal">ISO 354</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Vegetated Area Slider */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#15803d]" />
            <span className="text-xs font-bold text-gray-800">
              Área Vegetada no Ambiente:
            </span>
            <span className="font-mono text-sm font-bold text-[#15803d] bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {simulatedArea} m²
            </span>
          </div>

          <div className="flex-1 max-w-md w-full flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-400">6 m²</span>
            <input
              type="range"
              min={6}
              max={100}
              step={2}
              value={simulatedArea}
              onChange={(e) => setSimulatedArea(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
            />
            <span className="text-[10px] font-mono text-gray-400">100 m²</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Chart View */}
      {frequencyFilter !== 'spectrum' ? (
        /* ================= VIEW 1: COMPARATIVE BAR CHART (REDUCTION dB & RESIDUAL dB) ================= */
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                {frequencyFilter === 'speech_focal'
                  ? 'Redução de Ruído na Frequência da Fala Humana (500Hz a 2.000Hz)'
                  : 'Redução Sonora em Decibéis (dB) vs. Ruído Residual no Ambiente'}
              </span>
              <span className="text-[11px] text-gray-500">
                Ambiente Inicial: {selectedPreset.baselineDb} dB • Limite de Conforto WELL: {selectedPreset.standardComfortLimitDb} dB
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#15803d]" />
                <span>Redução em dB (Absorção)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span>Ruído Residual (dBA)</span>
              </span>
            </div>
          </div>

          {/* Responsive Recharts Container */}
          <div className="h-80 sm:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={50}
                />
                
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#15803d"
                  tick={{ fontSize: 11, fill: '#15803d' }}
                  label={{ value: 'Redução de Ruído (dB)', angle: -90, position: 'insideLeft', fill: '#15803d', fontSize: 11 }}
                  domain={[0, 20]}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#d97706"
                  tick={{ fontSize: 11, fill: '#d97706' }}
                  label={{ value: 'Ruído Residual (dBA)', angle: 90, position: 'insideRight', fill: '#d97706', fontSize: 11 }}
                  domain={[30, 85]}
                />

                {/* Target Comfort Limit Reference Line */}
                <ReferenceLine
                  yAxisId="right"
                  y={selectedPreset.standardComfortLimitDb}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Meta WELL (${selectedPreset.standardComfortLimitDb} dB)`,
                    position: 'insideTopLeft',
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#072a1a] text-white p-3.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs space-y-2 max-w-xs">
                          <div className="border-b border-emerald-800 pb-1.5">
                            <span className="text-[10px] font-mono text-[#86efac] uppercase font-bold">
                              {data.category}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-white">
                              {data.fullName}
                            </h4>
                            <span className="text-[10px] text-gray-300 italic block">
                              {data.scientificName}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Atenuação Sonora:</span>
                              <strong className="text-[#86efac] font-mono text-sm">
                                -{data.reductionDb} dB
                              </strong>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Ruído Resultante:</span>
                              <strong className="text-amber-300 font-mono text-sm">
                                {data.resultantNoiseDb} dBA
                              </strong>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Coeficiente NRC (ISO 354):</span>
                              <strong className="text-white font-mono">
                                NRC {data.nrc}
                              </strong>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Absorção de Fala:</span>
                              <strong className="text-white font-mono">
                                {data.speechAbsorption}%
                              </strong>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-emerald-800/80 text-[10px] text-emerald-200">
                            <strong>Textura:</strong> {data.leafTexture}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Reduction in dB Bar */}
                <Bar
                  yAxisId="left"
                  dataKey="reductionDb"
                  name="Redução de Ruído (dB)"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.id === 'drywall_convencional' ? '#cbd5e1' : entry.color}
                    />
                  ))}
                </Bar>

                {/* Residual Noise Level Bar */}
                <Bar
                  yAxisId="right"
                  dataKey="resultantNoiseDb"
                  name="Ruído Residual no Ambiente (dBA)"
                  fill="#f59e0b"
                  opacity={0.75}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* ================= VIEW 2: FREQUENCY SPECTRUM LINE CHART (ISO 354) ================= */
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Curva de Absorção por Banda de Frequência Sonora (125 Hz a 4.000 Hz)
              </span>
              <span className="text-[11px] text-gray-500">
                Padrão laboratorial ISO 354 / ASTM C423 • Comparação direta com o cenário convencional
              </span>
            </div>

            {/* Select species for comparison */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">Comparar com:</span>
              <select
                value={activeSpeciesId}
                onChange={(e) => setActiveSpeciesId(e.target.value)}
                className="bg-emerald-50 border border-emerald-300 rounded-xl px-2.5 py-1 text-xs font-bold text-[#072a1a] focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {BOTANICAL_ACOUSTIC_SPECIES.filter((s) => s.id !== 'drywall_convencional').map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spectrumData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                <XAxis dataKey="frequency" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 11, fill: '#15803d' }}
                  label={{ value: 'Absorção Acústica (%)', angle: -90, position: 'insideLeft', fill: '#15803d', fontSize: 11 }}
                  domain={[0, 100]}
                />
                <RechartsTooltip
                  formatter={(value: any, name: any) => [`${value}% de absorção`, name]}
                  contentStyle={{ backgroundColor: '#072a1a', borderRadius: '14px', border: '1px solid #10b981', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                
                <Line
                  type="monotone"
                  dataKey="activeAbsorption"
                  name={`${BOTANICAL_ACOUSTIC_SPECIES.find((s) => s.id === activeSpeciesId)?.name} (Selecionada)`}
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                  activeDot={{ r: 7 }}
                />
                
                <Line
                  type="monotone"
                  dataKey="mossAbsorption"
                  name="Musgo Polar Moss (Benchmark de Máxima Absorção)"
                  stroke="#15803d"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#15803d' }}
                />

                <Line
                  type="monotone"
                  dataKey="drywallAbsorption"
                  name="Parede Convencional Lisa (Sem Biofilia)"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#94a3b8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Acoustic Insights & Species Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-[#15803d]" />
            <span className="text-xs font-bold text-gray-900">Por que a Biofilia Absorve Som?</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            As folhas tridimensionais atuam como micro-armadilhas acústicas (helmholtz ressonators),
            transformando a energia mecânica das ondas sonoras em calor através da vibração dos tecidos vegetais.
          </p>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold text-gray-900">Impacto em Produtividade</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Estudos da Universidade de Sydney comprovam que a redução de 68 dB para 52 dB diminui em até 40%
            os erros por perda de concentração e reduz o cortisol dos colaboradores.
          </p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-gray-900">Solução Recomendada All Green</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            A combinação de <strong>Musgo Polar Moss</strong> nas salas de reunião e <strong>Samambaias Preservadas</strong> no open space
            oferece o melhor custo-benefício acústico sem necessidade de água ou duto hidráulico.
          </p>
        </div>
      </div>

    </div>
  );
};
