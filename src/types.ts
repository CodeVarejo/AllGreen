export interface BotanicalSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: 'preservado' | 'permanente';
  line: string;
  image: string;
  tactileFeel: string;
  acousticAbsorption: string;
  recommendedLighting: string;
  description: string;
  idealEnvironments: string[];
  uvProtection?: boolean;
}

export interface ComparisonRow {
  criterion: string;
  iconName: string;
  preservadoText: string;
  preservadoHighlight?: string;
  permanenteText: string;
  permanenteHighlight?: string;
  naturalVivoText: string;
  naturalVivoHighlight?: string;
}

export interface ProjectSample {
  id: string;
  code: string;
  title: string;
  category: 'Residencial & Living' | 'Escritórios Corporativos' | 'Varandas & Sacadas' | 'Recepções & Lojas';
  client: string;
  location: string;
  area: number;
  type: 'Jardim Preservado' | 'Jardim Permanente' | 'Misto Biofílico';
  beforeImage: string;
  afterImage: string;
  description: string;
  speciesUsed: string[];
  completionDate: string;
}

export interface BuildingTypeOption {
  id: 'corporativo' | 'varejo' | 'residencial';
  label: string;
  wellMultiplier: number;
  leedMultiplier: number;
}

export interface SimulationResult {
  roomType: string;
  estimatedArea: number;
  recommendedStyle: string;
  recommendedSpecies: string[];
  acousticImprovement: string;
  wellScore: number;
  leedCredits: number;
  estimatedBudgetMin: number;
  estimatedBudgetMax: number;
  aiAnalysisText: string;
  transformedImage: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  code: string;
  category: 'Jardins Verticais' | 'Módulos DIY' | 'Vasos & Eventos' | 'Catálogos';
  badge: string;
  image: string;
  description: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'arquiteto' | 'cliente' | 'especificador';
  company: string;
  cau_rrt?: string;
  phone: string;
  city: string;
  points: number;
  tier: 'Gold' | 'Platinum' | 'Diamond';
  avatar: string;
}

export interface PortalProject {
  id: string;
  code: string;
  title: string;
  client: string;
  location: string;
  category: 'Residencial' | 'Corporativo' | 'Comercial' | 'Eventos';
  style: 'Jardim Preservado' | 'Jardim Permanente Hiper-Realista' | 'Musgo Polar Moss' | 'Misto Biofílico' | 'Árvores & Jardineiras';
  area: number;
  status: 'estudo_ia' | 'orcamento_enviado' | 'em_producao' | 'enviado_transportadora' | 'instalado';
  statusLabel: string;
  dateCreated: string;
  estimatedTotal: number;
  specPdfUrl?: string;
  cadUrl?: string;
  thumbnail: string;
  notes?: string;
  // Technical Specifications & Sustainability Metrics
  speciesUsed?: string[];
  structureType?: string;
  acousticNrc?: number;
  acousticDamping?: string;
  acousticDbDamping?: number;
  rt60ReductionSec?: number;
  acousticFrequencies?: {
    f125: number;
    f250: number;
    f500: number;
    f1000: number;
    f2000: number;
    f4000: number;
  };
  energySavedKwhYear?: number;
  thermalReductionPercent?: number;
  thermalDeltaCelsius?: number;
  hvacSavingsBrlYear?: number;
  waterSavedLitersYear?: number;
  leedPointsTotal?: number;
  leedCreditsList?: string[];
  wellScore?: number;
  wellFeaturesList?: string[];
  uvProtectionHours?: number;
  fireRating?: string;
  warrantyYears?: number;
  co2OffsetKgYear?: number;
  maintenanceFreq?: string;
  weightPerM2?: number;
}

export interface TechnicalAsset {
  id: string;
  title: string;
  category: 'Revit (BIM)' | 'SketchUp (3D)' | 'AutoCAD (DWG)' | 'Texturas PBR 4K' | 'Especificação Técnica';
  fileFormat: string;
  fileSize: string;
  thumbnail: string;
  description: string;
  downloadsCount: number;
}

export interface PortalNotification {
  id: string;
  type: 'project_status' | 'ai_assistant_message' | 'botanical_update' | 'leed_well_update' | 'system_alert';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  speciesId?: string;
  speciesName?: string;
  projectCode?: string;
  sender?: string;
  impactSummary?: {
    parameterChanged: string;
    oldValue: string;
    newValue: string;
    deltaLeed?: string;
    deltaWell?: string;
  };
  actionLabel?: string;
  actionType?: 'view_project' | 'recalculate_leed' | 'view_botanical' | 'download_report' | 'open_simulator' | 'open_chat';
}


