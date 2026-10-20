import { PortalProject, LeedWellSimulationPoint } from '../types';

/**
 * Returns the LEED certification tier based on whole building credits or All Green contribution.
 */
export function getLeedTier(credits: number): 'Certificado' | 'Silver' | 'Gold' | 'Platinum' {
  if (credits >= 14) return 'Platinum';
  if (credits >= 11) return 'Gold';
  if (credits >= 8) return 'Silver';
  return 'Certificado';
}

/**
 * Returns the WELL v2 certification tier based on score (0 - 100).
 */
export function getWellTier(score: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
  if (score >= 80) return 'Platinum';
  if (score >= 60) return 'Gold';
  if (score >= 50) return 'Silver';
  return 'Bronze';
}

/**
 * Curated simulation evolution profiles for existing demo projects.
 */
const SEEDED_SIMULATION_HISTORY: Record<string, LeedWellSimulationPoint[]> = {
  proj_1: [
    {
      id: 'sim_proj1_1',
      simulationIndex: 1,
      simulationName: 'Simulação 1: Estudo Conceitual IA Preliminar',
      shortLabel: 'Sim. 1 • IA Preliminar',
      date: '12/08/2026',
      leedCredits: 8,
      wellScore: 68,
      acousticNrc: 0.74,
      waterSavedLiters: 24000,
      co2OffsetKg: 95,
      certificationTierLeed: 'Silver',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Modelagem volumétrica inicial de 25m²',
        'Isenção hídrica base (Crédito WEc1)',
        'Módulos MDF convencionais'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: 'sim_proj1_2',
      simulationIndex: 2,
      simulationName: 'Simulação 2: Otimização Hídrica & Ampliação de Área',
      shortLabel: 'Sim. 2 • Otimização 32.5m²',
      date: '14/08/2026',
      leedCredits: 11,
      wellScore: 78,
      acousticNrc: 0.82,
      waterSavedLiters: 32000,
      co2OffsetKg: 140,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Expansão da área para 32.5 m² contígua a estações de trabalho',
        'Vegetação estabilizada com glicerina vegetal sem toxinas (EQc4)',
        'Acesso visual direto à natureza a menos de 5m (WELL M02)'
      ],
      keyMilestone: 'Nível Gold Atingido'
    },
    {
      id: 'sim_proj1_3',
      simulationIndex: 3,
      simulationName: 'Simulação 3: Engenharia Acústica Moss & Laudo IPT',
      shortLabel: 'Sim. 3 • Laudo IPT NRC 0.86',
      date: '16/08/2026',
      leedCredits: 13,
      wellScore: 84,
      acousticNrc: 0.86,
      waterSavedLiters: 39000,
      co2OffsetKg: 170,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Mescla de Musgo Polar Moss Escandinavo com costelas preservadas',
        'Atenuação sonora ensaiada conforme ISO 354 (+4.2 dB)',
        'Redução do tempo de reverberação RT60 para < 0.45s (WELL S04)'
      ],
      keyMilestone: 'WELL Platinum Atingido'
    },
    {
      id: 'sim_proj1_4',
      simulationIndex: 4,
      simulationName: 'Simulação 4: Homologação Final Plug & Play',
      shortLabel: 'Sim. 4 • Homologação Final',
      date: '18/08/2026',
      leedCredits: 14,
      wellScore: 88,
      acousticNrc: 0.88,
      waterSavedLiters: 39000,
      co2OffsetKg: 185,
      certificationTierLeed: 'Platinum',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Homologação de 100% de isenção de pontos hidráulicos (WEc1)',
        'MDF Ultra Naval com tratamento retardante Classe B-s1,d0',
        'Emissão de Memorial Descritivo com selo GBC Brasil'
      ],
      keyMilestone: 'Homologação para Produção'
    }
  ],
  proj_2: [
    {
      id: 'sim_proj2_1',
      simulationIndex: 1,
      simulationName: 'Simulação 1: Estudo Conceitual com Preservado',
      shortLabel: 'Sim. 1 • Estudo Inicial',
      date: '08/08/2026',
      leedCredits: 5,
      wellScore: 56,
      acousticNrc: 0.52,
      waterSavedLiters: 11000,
      co2OffsetKg: 42,
      certificationTierLeed: 'Certificado',
      certificationTierWell: 'Silver',
      technicalEnhancements: [
        'Layout com plantas preservadas em varanda com sol matinal',
        'Zero irrigação hidropônica'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: 'sim_proj2_2',
      simulationIndex: 2,
      simulationName: 'Simulação 2: Adequação Solar Anti-UV (ASTM G154)',
      shortLabel: 'Sim. 2 • Ajuste Anti-UV',
      date: '10/08/2026',
      leedCredits: 7,
      wellScore: 65,
      acousticNrc: 0.60,
      waterSavedLiters: 14000,
      co2OffsetKg: 60,
      certificationTierLeed: 'Certificado',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Substituição por folhagens permanentes Real Touch com proteção Anti-UV',
        'Certificação de resistência solar 3.500 horas sem alteração cromática',
        'Estrutura em perfil de alumínio naval leve'
      ],
      keyMilestone: 'Validação de Durabilidade'
    },
    {
      id: 'sim_proj2_3',
      simulationIndex: 3,
      simulationName: 'Simulação 3: Homologação Comercial & Acústica de Tráfego',
      shortLabel: 'Sim. 3 • Homologação',
      date: '12/08/2026',
      leedCredits: 9,
      wellScore: 72,
      acousticNrc: 0.65,
      waterSavedLiters: 16800,
      co2OffsetKg: 78,
      certificationTierLeed: 'Silver',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Absorção de ruído viário urbano de 4.2 dB(A)',
        'Ciclo de vida de 5 anos com zero descarte de vegetação',
        'Acréscimo de crédito de conforto visual (WELL V01)'
      ],
      keyMilestone: 'Proposta Comercial Emitida'
    }
  ],
  proj_3: [
    {
      id: 'sim_proj3_1',
      simulationIndex: 1,
      simulationName: 'Simulação 1: Dimensionamento Acústico de Recepção',
      shortLabel: 'Sim. 1 • Estudo Acústico',
      date: '15/07/2026',
      leedCredits: 7,
      wellScore: 72,
      acousticNrc: 0.78,
      waterSavedLiters: 6500,
      co2OffsetKg: 28,
      certificationTierLeed: 'Certificado',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Análise de tempo de reverberação no balcão de check-in hospitalar',
        'Fixação magnética oculta para higienização rápida'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: 'sim_proj3_2',
      simulationIndex: 2,
      simulationName: 'Simulação 2: Composição Bicolor Polar Moss IPT',
      shortLabel: 'Sim. 2 • Polar Moss Bicolor',
      date: '18/07/2026',
      leedCredits: 10,
      wellScore: 86,
      acousticNrc: 0.85,
      waterSavedLiters: 8500,
      co2OffsetKg: 38,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Adoção de musgo esférico e polar da Dinamarca',
        'Elevação de NRC para 0.85 na faixa de fala (500Hz a 2000Hz)',
        'Certificação de ausência total de bactérias e fungos (análise IPT)'
      ],
      keyMilestone: 'Aprovação Sanitária'
    },
    {
      id: 'sim_proj3_3',
      simulationIndex: 3,
      simulationName: 'Simulação 3: Certificação Sanitária & Zero COV',
      shortLabel: 'Sim. 3 • Homologação Clínica',
      date: '20/07/2026',
      leedCredits: 12,
      wellScore: 94,
      acousticNrc: 0.89,
      waterSavedLiters: 9840,
      co2OffsetKg: 45,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Isenção de Compostos Orgânicos Voláteis (Eurofins Gold)',
        'NRC final homologado em 0.89 com redução de estresse do paciente',
        'Garantia clínica estendida de 5 anos'
      ],
      keyMilestone: 'Instalado & Homologado'
    }
  ],
  proj_4: [
    {
      id: 'sim_proj4_1',
      simulationIndex: 1,
      simulationName: 'Simulação 1: Estudo Volumétrico em Pé-Direito Duplo (6m)',
      shortLabel: 'Sim. 1 • Concepção 6m',
      date: '17/08/2026',
      leedCredits: 9,
      wellScore: 74,
      acousticNrc: 0.70,
      waterSavedLiters: 38000,
      co2OffsetKg: 180,
      certificationTierLeed: 'Silver',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Mapeamento de átrio com 45m² de jardim vertical',
        'Cálculo de alívio térmico no hall de elevadores'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: 'sim_proj4_2',
      simulationIndex: 2,
      simulationName: 'Simulação 2: Otimização Estrutural de Alumínio Modular',
      shortLabel: 'Sim. 2 • Chassi Alumínio',
      date: '19/08/2026',
      leedCredits: 12,
      wellScore: 82,
      acousticNrc: 0.76,
      waterSavedLiters: 48000,
      co2OffsetKg: 220,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Encaixe macho-fêmea rápido com redução de 40% no tempo de instalação',
        'Inclusão de espécies de grande porte (Licuala e Guaimbê)',
        'Crédito MRc4 de conteúdo reciclado na estrutura metálica'
      ],
      keyMilestone: 'Otimização Estrutural'
    },
    {
      id: 'sim_proj4_3',
      simulationIndex: 3,
      simulationName: 'Simulação 3: Matriz Biofílica Mista & Atenuação de Eco',
      shortLabel: 'Sim. 3 • Atenuação de Eco',
      date: '22/08/2026',
      leedCredits: 15,
      wellScore: 91,
      acousticNrc: 0.82,
      waterSavedLiters: 54000,
      co2OffsetKg: 260,
      certificationTierLeed: 'Platinum',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Redução do eco em átrio de 6m (RT60 < 0.6s)',
        'Zero consumo de 54.000 L/ano de água tratada (WEc1)',
        'Conexão com a natureza no hall corporativo de alta circulação'
      ],
      keyMilestone: 'Simulação IA Validada'
    }
  ],
  proj_5: [
    {
      id: 'sim_proj5_1',
      simulationIndex: 1,
      simulationName: 'Simulação 1: Diagnóstico Acústico de Call Pods & Reuniões',
      shortLabel: 'Sim. 1 • Diagnóstico Calls',
      date: '20/08/2026',
      leedCredits: 10,
      wellScore: 78,
      acousticNrc: 0.80,
      waterSavedLiters: 22000,
      co2OffsetKg: 110,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Gold',
      technicalEnhancements: [
        'Isolamento acústico focado em frequências vocais (1000Hz a 4000Hz)',
        'Substituição de drywall nu por painel acústico biofílico'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: 'sim_proj5_2',
      simulationIndex: 2,
      simulationName: 'Simulação 2: Manta Fono-Absorvente & Eucalipto Prata',
      shortLabel: 'Sim. 2 • Manta Fono-Absorvente',
      date: '22/08/2026',
      leedCredits: 13,
      wellScore: 88,
      acousticNrc: 0.87,
      waterSavedLiters: 28000,
      co2OffsetKg: 140,
      certificationTierLeed: 'Gold',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Inclusão de manta de lã de rocha basáltica protegida por tecido acústico',
        'Laudo IPT de atenuação de 8.8 dB(A) entre baias e cabines',
        'Crédito de conforto acústico no trabalho intelectual (WELL S04)'
      ],
      keyMilestone: 'Privacidade Vocal Homologada'
    },
    {
      id: 'sim_proj5_3',
      simulationIndex: 3,
      simulationName: 'Simulação 3: Painel NRC 0.91 & Certificação Platinum Total',
      shortLabel: 'Sim. 3 • Platinum Total',
      date: '25/08/2026',
      leedCredits: 16,
      wellScore: 96,
      acousticNrc: 0.91,
      waterSavedLiters: 33600,
      co2OffsetKg: 165,
      certificationTierLeed: 'Platinum',
      certificationTierWell: 'Platinum',
      technicalEnhancements: [
        'Absorção máxima NRC 0.91 comprovada em laboratório',
        'Economia de energia de climatização HVAC (-25.5%) pelo efeito térmico',
        'Crédito de Inovação de Design Biofílico (INc1) e Zero COV (EQc4)'
      ],
      keyMilestone: 'Em Produção Plug & Play'
    }
  ]
};

/**
 * Gets or dynamically generates the simulation history for any project.
 */
export function getProjectSimulationHistory(project: PortalProject): LeedWellSimulationPoint[] {
  // 1. Direct simulationHistory on project if already stored
  if (project.simulationHistory && project.simulationHistory.length > 0) {
    return project.simulationHistory;
  }

  // 2. Pre-seeded curated history for existing projects
  if (SEEDED_SIMULATION_HISTORY[project.id]) {
    return SEEDED_SIMULATION_HISTORY[project.id];
  }

  // 3. Fallback: generate dynamic progression based on project characteristics
  const baseLeed = Math.max(6, Math.round((project.leedPointsTotal || 12) * 0.65));
  const targetLeed = project.leedPointsTotal || 12;
  const baseWell = Math.max(55, Math.round((project.wellScore || 80) * 0.75));
  const targetWell = project.wellScore || 80;
  const baseNrc = Math.max(0.65, Number(((project.acousticNrc || 0.85) - 0.15).toFixed(2)));
  const targetNrc = project.acousticNrc || 0.85;
  const totalWater = project.waterSavedLitersYear || project.area * 1200;

  const points: LeedWellSimulationPoint[] = [
    {
      id: `sim_${project.id}_1`,
      simulationIndex: 1,
      simulationName: 'Simulação 1: Estudo Preliminar & Concepção Inicial',
      shortLabel: 'Sim. 1 • Inicial',
      date: project.dateCreated || '01/08/2026',
      leedCredits: baseLeed,
      wellScore: baseWell,
      acousticNrc: baseNrc,
      waterSavedLiters: Math.round(totalWater * 0.55),
      co2OffsetKg: Math.round((project.co2OffsetKgYear || 100) * 0.5),
      certificationTierLeed: getLeedTier(baseLeed),
      certificationTierWell: getWellTier(baseWell),
      technicalEnhancements: [
        'Dimensionamento preliminar da área projetada',
        'Estimativa de isenção hídrica base (WEc1)'
      ],
      keyMilestone: 'Baseline Inicial'
    },
    {
      id: `sim_${project.id}_2`,
      simulationIndex: 2,
      simulationName: 'Simulação 2: Otimização Acústica & Espécies Homologadas',
      shortLabel: 'Sim. 2 • Otimização',
      date: '10/08/2026',
      leedCredits: Math.round((baseLeed + targetLeed) / 2),
      wellScore: Math.round((baseWell + targetWell) / 2),
      acousticNrc: Number(((baseNrc + targetNrc) / 2).toFixed(2)),
      waterSavedLiters: Math.round(totalWater * 0.8),
      co2OffsetKg: Math.round((project.co2OffsetKgYear || 100) * 0.8),
      certificationTierLeed: getLeedTier(Math.round((baseLeed + targetLeed) / 2)),
      certificationTierWell: getWellTier(Math.round((baseWell + targetWell) / 2)),
      technicalEnhancements: [
        'Seleção de espécies fono-absorventes All Green',
        'Controle de reverberação vocal (WELL S04)'
      ],
      keyMilestone: 'Refinamento Acústico'
    },
    {
      id: `sim_${project.id}_3`,
      simulationIndex: 3,
      simulationName: 'Simulação 3: Homologação Técnica & Memorial Final',
      shortLabel: 'Sim. 3 • Homologação Final',
      date: '15/08/2026',
      leedCredits: targetLeed,
      wellScore: targetWell,
      acousticNrc: targetNrc,
      waterSavedLiters: totalWater,
      co2OffsetKg: project.co2OffsetKgYear || 120,
      certificationTierLeed: getLeedTier(targetLeed),
      certificationTierWell: getWellTier(targetWell),
      technicalEnhancements: [
        'Homologação de isenção total de água (WEc1 - 100%)',
        'Laudo IPT de segurança ao fogo e conforto fono-absorvente',
        'Especificação final com garantia de 5 anos'
      ],
      keyMilestone: project.statusLabel || 'Especificação Homologada'
    }
  ];

  return points;
}

/**
 * Forward-looking what-if options for the architect to simulate technical upgrades.
 */
export interface WhatIfSimulationOption {
  id: string;
  label: string;
  description: string;
  deltaLeed: number;
  deltaWell: number;
  deltaNrc: number;
  deltaCo2: number;
  category: 'Acústica' | 'Ar & Fitoremediação' | 'Iluminação Circadiana' | 'Circularidade';
}

export const WHAT_IF_OPTIONS: WhatIfSimulationOption[] = [
  {
    id: 'ceiling_moss_baffles',
    label: 'Baffles Acústicos de Teto Polar Moss',
    description: 'Adição de nuvens acústicas suspensas em musgo polar dinamarquês para absorção omnidirecional no teto.',
    deltaLeed: 2,
    deltaWell: 6,
    deltaNrc: 0.05,
    deltaCo2: 25,
    category: 'Acústica'
  },
  {
    id: 'circadian_biophilic_lighting',
    label: 'Iluminação Circadiana Integrada (6500K Tunable)',
    description: 'Fitas LED de espectro solar sincronizadas com o ciclo de sono e vigília para estimulação de foco e bem-estar.',
    deltaLeed: 1,
    deltaWell: 5,
    deltaNrc: 0.0,
    deltaCo2: 15,
    category: 'Iluminação Circadiana'
  },
  {
    id: 'active_phytoremediation_co2',
    label: 'Filtro Bioativo & Monitor IoT de CO2',
    description: 'Ventilação forçada micro-filtrada na raiz da vegetação para captura acelerada de partículas finas PM2.5 e CO2.',
    deltaLeed: 2,
    deltaWell: 5,
    deltaNrc: 0.02,
    deltaCo2: 45,
    category: 'Ar & Fitoremediação'
  },
  {
    id: 'certified_fsc_circular_wood',
    label: 'MDF Ultra Naval com Selo FSC & Resina de Soja',
    description: 'Substrato estrutural com rastreabilidade 100% circular, carbono negativo na extração e ausência de formaldeído.',
    deltaLeed: 2,
    deltaWell: 3,
    deltaNrc: 0.01,
    deltaCo2: 30,
    category: 'Circularidade'
  }
];

/**
 * Computes projected simulation point when what-if options are active.
 */
export function computeForecastSimulationPoint(
  lastPoint: LeedWellSimulationPoint,
  activeOptions: WhatIfSimulationOption[]
): LeedWellSimulationPoint | null {
  if (activeOptions.length === 0) return null;

  const totalDeltaLeed = activeOptions.reduce((acc, opt) => acc + opt.deltaLeed, 0);
  const totalDeltaWell = activeOptions.reduce((acc, opt) => acc + opt.deltaWell, 0);
  const totalDeltaNrc = activeOptions.reduce((acc, opt) => acc + opt.deltaNrc, 0);
  const totalDeltaCo2 = activeOptions.reduce((acc, opt) => acc + opt.deltaCo2, 0);

  const projectedLeed = Math.min(22, lastPoint.leedCredits + totalDeltaLeed);
  const projectedWell = Math.min(100, lastPoint.wellScore + totalDeltaWell);
  const projectedNrc = Math.min(0.96, Number((lastPoint.acousticNrc + totalDeltaNrc).toFixed(2)));
  const projectedCo2 = lastPoint.co2OffsetKg + totalDeltaCo2;

  return {
    id: 'sim_forecast_next',
    simulationIndex: lastPoint.simulationIndex + 1,
    simulationName: `Simulação ${lastPoint.simulationIndex + 1} (Projeção): Salto Técnico Parametrizado`,
    shortLabel: `Sim. ${lastPoint.simulationIndex + 1} • Projeção IA`,
    date: 'Projeção',
    leedCredits: projectedLeed,
    wellScore: projectedWell,
    acousticNrc: projectedNrc,
    waterSavedLiters: lastPoint.waterSavedLiters,
    co2OffsetKg: projectedCo2,
    certificationTierLeed: getLeedTier(projectedLeed),
    certificationTierWell: getWellTier(projectedWell),
    technicalEnhancements: activeOptions.map(opt => `${opt.label} (+${opt.deltaLeed} LEED / +${opt.deltaWell} WELL)`),
    keyMilestone: 'Projeção Tecnológica Futura',
    isForecast: true
  };
}
