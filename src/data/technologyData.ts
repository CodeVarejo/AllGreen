export interface VerticalTechnology {
  id: string;
  name: string;
  shortName: string;
  category: 'preservado' | 'permanente' | 'natural';
  tagline: string;
  badge: string;
  badgeColor: string;
  image: string;
  capexPerM2: number; // R$/m2 initial cost
  infrastructureBaseCost: number; // Fixed base plumbing/pumps
  opexPerM2Year: number; // R$/m2/year maintenance
  waterLitersPerM2Year: number; // L/m2/year
  waterCostPerM2Year: number; // R$/m2/year in water & power bills
  acousticNRC: number; // 0.00 to 1.00
  acousticLabel: string;
  structuralWeightKgM2: number; // kg/m2
  structuralNote: string;
  lightingRequirement: string;
  solarTolerance: string;
  uvProtection: boolean;
  plumbingRequired: boolean;
  drainRequired: boolean;
  waterproofingRequired: boolean;
  wellScore: number;
  leedCredits: number;
  fireRating: string;
  warrantyYears: number;
  lifespanYears: string;
  installationSpeed: string;
  bestFor: string[];
  keyStrengths: string[];
  keyLimitations: string[];
  verdictRecommendation: string;
}

export const VERTICAL_TECHNOLOGIES: VerticalTechnology[] = [
  {
    id: 'preservado_tropical',
    name: 'Jardim Preservado 100% Natural (All Green Signature)',
    shortName: 'Preservado Natural',
    category: 'preservado',
    tagline: 'Plantas 100% naturais estabilizadas com seiva biodegradável ecológica e zero manutenção.',
    badge: 'Mais Recomendado Corporativo',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    capexPerM2: 1850,
    infrastructureBaseCost: 0,
    opexPerM2Year: 0,
    waterLitersPerM2Year: 0,
    waterCostPerM2Year: 0,
    acousticNRC: 0.86,
    acousticLabel: 'Alta Absorção (NRC 0.86 - Laudo IPT ISO 354)',
    structuralWeightKgM2: 3.8,
    structuralNote: 'Ultraleve — dispensa reforço de alvenaria ou drywall',
    lightingRequirement: 'Qualquer ambiente interno (mesmo 100% artificial)',
    solarTolerance: 'Apenas interiores sem incidência solar direta',
    uvProtection: false,
    plumbingRequired: false,
    drainRequired: false,
    waterproofingRequired: false,
    wellScore: 92,
    leedCredits: 15,
    fireRating: 'Laudo IPT NBR 9442 / Retardante Opcional',
    warrantyYears: 5,
    lifespanYears: '8 a 12+ anos sem perda de maciez',
    installationSpeed: 'Plug & Play modular (15 a 30 m² instalados por dia)',
    bestFor: [
      'Salas de reunião e auditórios executivos',
      'Open spaces corporativos e call rooms',
      'Halls de entrada, recepções e consultórios',
      'Áreas internas sem pontos hidráulicos e sem luz natural'
    ],
    keyStrengths: [
      'R$ 0 de custo de manutenção e jardinagem mensal',
      'Absorção acústica certificada em laboratório (NRC 0.86)',
      '100% natural ao toque, sem pragas, fungos ou insetos',
      'Dispensa obras civis, encanamento e ralos'
    ],
    keyLimitations: [
      'Não pode ser instalado em áreas externas sob sol pleno direto',
      'Não deve ser molhado ou exposto a chuva'
    ],
    verdictRecommendation: 'A melhor escolha para ambientes corporativos e comerciais internos que exigem biofilia autêntica, alto conforto acústico e ZERO custo operacional contínuo.'
  },
  {
    id: 'permanente_uv',
    name: 'Jardim Permanente UV Anti-Fade (Real Touch Premium)',
    shortName: 'Permanente Anti-UV',
    category: 'permanente',
    tagline: 'Folhagens articuladas hiper-realistas com polímeros resistentes à radiação solar e intempéries.',
    badge: 'Ideal para Sol & Fachadas',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
    capexPerM2: 1450,
    infrastructureBaseCost: 0,
    opexPerM2Year: 0,
    waterLitersPerM2Year: 0,
    waterCostPerM2Year: 0,
    acousticNRC: 0.68,
    acousticLabel: 'Atenuação Média (NRC 0.68 - Difusão Foliar)',
    structuralWeightKgM2: 4.2,
    structuralNote: 'Leve — fixação direta em estruturas metálicas ou alvenaria',
    lightingRequirement: 'Totalmente flexível (Sol pleno, sombra ou luz artificial)',
    solarTolerance: 'Resistência solar total com proteção UV ASTM G154',
    uvProtection: true,
    plumbingRequired: false,
    drainRequired: false,
    waterproofingRequired: false,
    wellScore: 84,
    leedCredits: 12,
    fireRating: 'Classificação NBR 16626 / UL94 Antichama',
    warrantyYears: 5,
    lifespanYears: '7 a 10 anos sem desbotamento',
    installationSpeed: 'Fixação rápida (20 a 40 m² por dia)',
    bestFor: [
      'Varandas abertas, sacadas e áreas gourmet',
      'Fachadas comerciais com alta incidência de sol da tarde',
      'Átrios envidraçados e coberturas com luz zenital direta',
      'Locais de difícil acesso para manutenção'
    ],
    keyStrengths: [
      'Menor custo inicial (Capex) por m²',
      'Imune ao desbotamento solar (Proteção UV 5 Anos)',
      'Lavável com jato d\'água ou espanador',
      'Zero manutenção e zero consumo hídrico'
    ],
    keyLimitations: [
      'Menor absorção acústica em comparação com o musgo preservado',
      'Toque sintético emborrachado (embora visualmente idêntico ao vivo)'
    ],
    verdictRecommendation: 'Indispensável para fachadas, varandas ensolaradas e locais de altíssima insolação onde plantas naturais morreriam queimadas ou exigiriam irrigação exorbitante.'
  },
  {
    id: 'natural_hidroponico',
    name: 'Jardim Natural Vivo Hidropônico (Sistema Tradicional)',
    shortName: 'Natural Vivo com Irrigação',
    category: 'natural',
    tagline: 'Plantas vivas com raízes em substrato inerte, sistema automático de fertirrigação e calha coletora.',
    badge: 'Tecnologia Tradicional',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    capexPerM2: 1950,
    infrastructureBaseCost: 4500, // Automação, bombas, filtros e calhas
    opexPerM2Year: 1800, // Jardinagem, poda, reposição de mudas (~R$ 150/m2/mês)
    waterLitersPerM2Year: 3650, // ~10 L/m2/dia
    waterCostPerM2Year: 120, // Custo de água da concessionária + energia da bomba
    acousticNRC: 0.84,
    acousticLabel: 'Alta Absorção (NRC 0.84 - Folhas e Substrato)',
    structuralWeightKgM2: 38.0,
    structuralNote: 'Pesado (35 a 50 kg/m² saturado) — exige laudo de carga estrutural',
    lightingRequirement: 'Exige luz solar natural intensa ou luminárias botânicas especiais (12h/dia)',
    solarTolerance: 'Necessita de sol moderado constante',
    uvProtection: false,
    plumbingRequired: true,
    drainRequired: true,
    waterproofingRequired: true,
    wellScore: 89,
    leedCredits: 14,
    fireRating: 'Autoextinguível por umidade natural',
    warrantyYears: 1, // Geralmente 90 dias a 1 ano com contrato
    lifespanYears: 'Contínuo (requer reposição de 15-25% das mudas/ano)',
    installationSpeed: 'Complexo (obras hidráulicas, impermeabilização, 5-10 m²/dia)',
    bestFor: [
      'Grandes praças externas de empreendimentos com equipe de facilities dedicada',
      'Paredes com acesso direto a água, esgoto e iluminação zenital abundante',
      'Projetos com orçamento recorrente mensal para jardinagem terceirizada'
    ],
    keyStrengths: [
      'Purificação de ar por fotossíntese ativa',
      'Sensação bioclimática de frescor e evapotranspiração',
      'Aromas vivos e floração sazonal'
    ],
    keyLimitations: [
      'Altíssimo custo operacional contínuo (R$ 1.800+/m²/ano em podas e reposição)',
      'Consome milhares de litros de água potável por ano',
      'Risco de vazamentos, entupimento de gotejadores, pragas e infiltração na alvenaria',
      'Carga estrutural pesada (38+ kg/m²)'
    ],
    verdictRecommendation: 'Viável apenas se o empreendimento contar com infraestrutura hidráulica completa, equipe de jardinagem mensal permanente e verba operacional contínua para reposição de mudas.'
  },
  {
    id: 'musgo_polar_moss',
    name: 'Musgo Polar Moss Escandinavo (Líquens Puros 3D)',
    shortName: 'Musgo Polar Moss',
    category: 'preservado',
    tagline: 'Líquens escandinavos preservados com densidade uniforme, máxima absorção acústica e toque aveludado.',
    badge: 'Campeão em Acústica (NRC 0.89)',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    capexPerM2: 2100,
    infrastructureBaseCost: 0,
    opexPerM2Year: 0,
    waterLitersPerM2Year: 0,
    waterCostPerM2Year: 0,
    acousticNRC: 0.89,
    acousticLabel: 'Máxima Absorção (NRC 0.89 - Laudo IPT ISO 354)',
    structuralWeightKgM2: 3.2,
    structuralNote: 'Ultraleve (3.2 kg/m²) — pode ser aplicado em forros e divisórias',
    lightingRequirement: 'Qualquer ambiente interno (não necessita de luz)',
    solarTolerance: 'Apenas interiores sem sol direto',
    uvProtection: false,
    plumbingRequired: false,
    drainRequired: false,
    waterproofingRequired: false,
    wellScore: 96,
    leedCredits: 16,
    fireRating: 'Laudo IPT NBR 9442 Classe A / Antiestático',
    warrantyYears: 5,
    lifespanYears: '10 a 15 anos de integridade tátil',
    installationSpeed: 'Modular em placas acústicas (20 a 30 m² por dia)',
    bestFor: [
      'Salas de videoconferência e estúdios de podcast',
      'Open offices com problemas críticos de eco e reverberação de vozes',
      'Painéis geométricos e logotipos corporativos em relevo',
      'Tetos acústicos e biombos móveis'
    ],
    keyStrengths: [
      'Maior coeficiente de absorção sonora do mercado (NRC 0.89)',
      'Propriedades higroscópicas naturais (regula umidade do ar sem molhar)',
      'Antiestático: repele poeira naturalmente',
      'Ampla variedade de cores (24 tonalidades botânicas)'
    ],
    keyLimitations: [
      'Requer umidade relativa do ar entre 40% e 70% para manter a maciez',
      'Não indicado para sol pleno direto ou intempéries'
    ],
    verdictRecommendation: 'A solução definitiva para escritórios e salas de reunião que sofrem com eco, reverberação e ruído de fundo, unindo arquitetura nórdica e silêncio produtivo.'
  }
];

export interface TechnologyDuelPreset {
  id: string;
  title: string;
  techAId: string;
  techBId: string;
  summary: string;
  badge: string;
}

export const TECHNOLOGY_DUEL_PRESETS: TechnologyDuelPreset[] = [
  {
    id: 'preservado-vs-natural',
    title: 'Preservado Natural vs. Natural Vivo',
    techAId: 'preservado_tropical',
    techBId: 'natural_hidroponico',
    summary: 'Comparativo clássico de TCO: Economia de até R$ 90.000 em 5 anos com eliminação de rega e jardinagem.',
    badge: 'Duelo Mais Consultado',
  },
  {
    id: 'preservado-vs-permanente',
    title: 'Preservado Natural vs. Permanente Anti-UV',
    techAId: 'preservado_tropical',
    techBId: 'permanente_uv',
    summary: 'Interiores com toque 100% natural vs. Varandas ensolaradas com proteção UV anti-desbotamento.',
    badge: 'Interiores vs Fachadas',
  },
  {
    id: 'musgo-vs-natural',
    title: 'Musgo Polar Moss vs. Natural Vivo',
    techAId: 'musgo_polar_moss',
    techBId: 'natural_hidroponico',
    summary: 'Máxima performance acústica (NRC 0.89) e peso ultraleve (3.2 kg/m²) vs 38 kg/m² com drenos.',
    badge: 'Foco Acústico & Leveza',
  },
  {
    id: 'permanente-vs-natural',
    title: 'Permanente Anti-UV vs. Natural Vivo',
    techAId: 'permanente_uv',
    techBId: 'natural_hidroponico',
    summary: 'Zero risco de pragas e economia de 100% de água vs sistema de irrigação com risco de vazamento.',
    badge: 'Zero Manutenção',
  },
];
