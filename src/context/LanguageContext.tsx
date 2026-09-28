import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

export const DICTIONARY: Record<Language, Record<string, any>> = {
  pt: {
    common: {
      brand: 'ALL GREEN',
      tagline: 'Biofilia Arquitetônica',
      close: 'Fechar',
      save: 'Salvar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Voltar',
      submit: 'Enviar',
      details: 'Ver Detalhes',
      downloadPdf: 'Baixar PDF',
      loading: 'Carregando...',
      success: 'Sucesso',
      search: 'Buscar',
      actions: 'Ações',
      status: 'Status',
      date: 'Data',
      allRights: 'Todos os direitos reservados.',
      switchLanguage: 'Alterar idioma',
    },
    nav: {
      solutions: 'Soluções',
      catalog: 'Catálogo',
      quiz: 'Quiz Biofílico',
      comparison: 'Comparativo',
      roi: 'Calculadora & ROI',
      projects: 'Projetos',
      searchPlaceholder: 'Buscar produtos, laudos...',
      searchCmd: 'Buscar',
      architectArea: 'Área do Arquiteto',
      simulator: 'Simulador IA',
      openNavigation: 'Abrir Menu de Navegação',
      closeNavigation: 'Fechar Menu de Navegação',
      audioActive: 'Desativar som do ateliê',
      audioInactive: 'Ativar som ambiente: brisa e folhagem',
      themeLight: 'Alternar para tema claro',
      themeDark: 'Alternar para tema escuro botânico',
    },
    hero: {
      headlinePart1: 'Jardins Verticais Preservados.',
      headlinePart2: 'Folhagem natural com',
      headlineEterno: 'zero irrigação.',
      subtitle: 'Substituição celular com glicerina vegetal pura: conforto acústico homologado e vegetação de toque vivo para interiores corporativos e residenciais.',
      simulateCta: 'Simular ambiente com IA',
      viewProjects: 'Ver projetos',
      waterMetric: '0 L',
      waterLabel: 'Água por ano',
      acousticMetric: '0.89',
      acousticLabel: 'NRC acústico IPT',
      durabilityMetric: '10 Anos',
      durabilityLabel: 'Durabilidade atestada',
      lookupCode: 'Consultar memorial por código de projeto',
      sunset: 'Pôr do Sol',
      twilight: 'Noite LED',
      tropical: 'Dia',
      villaViva: 'Villa Viva 3D',
      beforeAfter: 'Antes / Depois',
      soundOn: 'Brisa Ativa',
      soundOff: 'Som Natural',
      beforeTag: 'Antes: Alvenaria Convencional',
    },
    valueProps: {
      prop1Title: '100% Isento de Irrigação',
      prop1Desc: 'Zero ponto hidráulico, bombas ou escoamento de água.',
      prop2Title: 'Atenuação Acústica NRC 0.89',
      prop2Desc: 'Laudo IPT que comprova absorção de reverberação e eco.',
      prop3Title: 'Pontuação LEED & WELL',
      prop3Desc: 'Créditos diretos de sustentabilidade e biofilia para empreendimentos.',
      prop4Title: '5 Anos de Garantia Homologada',
      prop4Desc: 'Tratamento que previne ressecamento e mantém coloração viva.',
    },
    solutions: {
      title: 'Nossas Linhas de',
      titleHighlight: 'Soluções',
      subtitle: 'Três tecnologias arquitetônicas para integrar a biofilia com durabilidade extrema e zero manutenção.',
      requestQuote: 'Solicitar Orçamento',
      specSheet: 'Ver Ficha Técnica',
      filterAll: 'Todas as Linhas',
      filterPreserved: 'Jardins Preservados',
      filterPermanent: 'Jardins Permanentes',
      filterAcoustic: 'Painéis Acústicos',
    },
    methodology: {
      title: 'Metodologia de Engenharia &',
      titleHighlight: 'Execução Turnkey',
      subtitle: 'Do diagnóstico botânico à instalação final sem poeira ou pontos hidráulicos.',
      step1Title: '01. Diagnóstico Biofílico',
      step1Desc: 'Avaliação de incidência solar, luxometria e dimensões do vão para especificação exata das espécies.',
      step2Title: '02. Projeto Executivo BIM',
      step2Desc: 'Modelagem 3D paramétrica em Revit e SketchUp com modulação sob medida e encaixes ocultos.',
      step3Title: '03. Produção no Ateliê',
      step3Desc: 'Substituição celular de seiva por glicerina botânica e montagem artesanal módulo a módulo.',
      step4Title: '04. Instalação Plug & Play',
      step4Desc: 'Fixação a seco limpa e rápida em perfil oculto de alumínio naval, sem tubulação hidráulica.',
    },
    catalog: {
      title: 'Curadoria Botânica &',
      titleHighlight: 'Espécies Preservadas',
      subtitle: 'Espécies naturais tratadas por processo de substituição celular que preserva flexibilidade, textura e tom por anos.',
      filterAll: 'Todas as Espécies',
      filterFoliage: 'Folhagens Tropicais',
      filterMoss: 'Musgos & Rasteiras',
      filterSpecial: 'Especiais',
      simulate: 'Simular no Espaço',
      sampleRequest: 'Pedir Amostra',
      tactileFeel: 'Toque:',
      acousticAbs: 'Absorção Acústica:',
      idealEnvironments: 'Ambientes Ideais:',
    },
    quiz: {
      title: 'Diagnóstico de Perfil',
      titleHighlight: 'Biofílico',
      subtitle: 'Mapeie requisitos de iluminação, isolamento acústico e metas LEED/WELL para receber a curadoria de espécies sob medida.',
      startQuiz: 'Iniciar Diagnóstico',
      question: 'Pergunta',
      of: 'de',
      next: 'Próxima',
      previous: 'Anterior',
      viewResult: 'Ver Resultado Completo',
      restart: 'Refazer Diagnóstico',
      downloadReport: 'Baixar Memorial Técnico (PDF)',
      recommendedSpecies: 'Espécies Recomendadas',
      acousticProfile: 'Perfil Acústico Estimado',
      leedImpact: 'Impacto LEED/WELL',
    },
    comparison: {
      title: 'Matriz Comparativa das',
      titleHighlight: 'Tecnologias Verticais',
      subtitle: 'Diferenças de investimento inicial (Capex), despesas anuais (Opex), atenuação acústica e créditos LEED/WELL entre os sistemas.',
      sideBySide: 'Lado a Lado (1x1)',
      fullTable: 'Tabela Completa',
      preserved: 'Jardim Preservado',
      permanent: 'Jardim Permanente',
      naturalVivo: 'Jardim Natural Vivo',
      capex: 'Investimento Inicial (Capex)',
      opex: 'Manutenção Anual (Opex)',
      water: 'Consumo Hídrico',
      acoustics: 'Absorção Acústica',
      leed: 'Créditos LEED / WELL',
      lifespan: 'Vida Útil Estimada',
    },
    roi: {
      title: 'Calculadora de Impacto &',
      titleHighlight: 'ROI Biofílico',
      subtitle: 'Calcule a economia em água, podas, irrigação e os ganhos em produtividade corporativa ao longo de 5 e 10 anos.',
      areaInput: 'Área da Parede (m²)',
      spaceType: 'Tipologia do Espaço',
      corporate: 'Corporativo',
      residential: 'Residencial',
      hospitality: 'Hotelaria / Clínicas',
      annualWaterSaving: 'Economia Hídrica Anual',
      annualMaintenanceSaving: 'Economia de Manutenção',
      tenYearSavings: 'Economia Total em 10 Anos',
      wellPoints: 'Pontos Potenciais WELL v2',
      leedCredits: 'Créditos Diretos LEED v4.1',
      requestDetailedStudy: 'Solicitar Estudo de Viabilidade Completo',
    },
    gallery: {
      title: 'Galeria de Projetos &',
      titleHighlight: 'Transformações Reais',
      subtitle: 'Arraste o divisor para comparar ambientes residenciais e corporativos antes e depois da instalação All Green.',
      allCategories: 'Todos os Projetos',
      residential: 'Residenciais',
      corporate: 'Corporativos',
      commercial: 'Comerciais & Lojas',
      dragHint: 'Arraste o cursor para comparar',
      before: 'Antes',
      after: 'Depois',
    },
    testimonials: {
      title: 'A palavra de quem especificou a',
      titleHighlight: 'biofilia de alta precisão.',
      subtitle: 'Avaliações de arquitetos, diretores de facilities e clientes residenciais sobre a experiência com os jardins verticais All Green.',
      gain: 'Ganho registrado',
    },
    newsletter: {
      title: 'Boletim Biofílico & Especificação',
      subtitle: 'Lançamentos de espécies, novos blocos BIM paramétricos para Revit e dados técnicos para certificações ambientais.',
      placeholder: 'Seu e-mail profissional...',
      button: 'Cadastrar',
      subscribed: 'Inscrição confirmada com sucesso! Bem-vindo ao Clube All Green Decor.',
    },
    portal: {
      title: 'Portal do Arquiteto & Especificador',
      backToSite: 'Voltar ao Site',
      newProject: 'Nova Obra',
      totalArea: 'Área Total Projetada',
      activeProjects: 'Obras em Fabricação/Trânsito',
      waterSaved: 'Economia Hídrica Real',
      leedCredits: 'Créditos LEED / WELL',
      downloadSpecPdf: 'Baixar Memorial Descritivo (PDF)',
      statusProduction: 'Em Produção',
      statusTransit: 'Em Trânsito',
      statusInstalled: 'Instalado',
      statusSpec: 'Especificação',
      statusAiStudy: 'Estudo IA',
      actions: 'Ações',
      details: 'Ver Projeto',
      logout: 'Sair da Conta',
    }
  },
  en: {
    common: {
      brand: 'ALL GREEN',
      tagline: 'Architectural Biophilia',
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      submit: 'Submit',
      details: 'View Details',
      downloadPdf: 'Download PDF',
      loading: 'Loading...',
      success: 'Success',
      search: 'Search',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      allRights: 'All rights reserved.',
      switchLanguage: 'Change language',
    },
    nav: {
      solutions: 'Solutions',
      catalog: 'Catalog',
      quiz: 'Biophilic Quiz',
      comparison: 'Comparison',
      roi: 'Calculator & ROI',
      projects: 'Projects',
      searchPlaceholder: 'Search products, reports...',
      searchCmd: 'Search',
      architectArea: 'Architect Portal',
      simulator: 'AI Simulator',
      openNavigation: 'Open Navigation Menu',
      closeNavigation: 'Close Navigation Menu',
      audioActive: 'Mute atelier soundscape',
      audioInactive: 'Play soundscape: breeze and foliage',
      themeLight: 'Switch to light theme',
      themeDark: 'Switch to dark botanical theme',
    },
    hero: {
      headlinePart1: 'Preserved Living Walls.',
      headlinePart2: 'Natural foliage with',
      headlineEterno: 'zero irrigation.',
      subtitle: 'Cellular substitution with pure botanical glycerin: certified acoustic comfort and living-touch foliage for corporate and residential spaces.',
      simulateCta: 'Simulate space with AI',
      viewProjects: 'View projects',
      waterMetric: '0 L',
      waterLabel: 'Water per year',
      acousticMetric: '0.89',
      acousticLabel: 'IPT Acoustic NRC',
      durabilityMetric: '10 Years',
      durabilityLabel: 'Certified durability',
      lookupCode: 'Look up project by code',
      sunset: 'Sunset',
      twilight: 'Night LED',
      tropical: 'Daylight',
      villaViva: 'Living Villa 3D',
      beforeAfter: 'Before / After',
      soundOn: 'Sound On',
      soundOff: 'Natural Sound',
      beforeTag: 'Before: Plain Masonry Wall',
    },
    valueProps: {
      prop1Title: '100% Irrigation-Free',
      prop1Desc: 'Zero plumbing pipes, pumps, drainage or water connections.',
      prop2Title: 'Acoustic Attenuation NRC 0.89',
      prop2Desc: 'IPT official report certifying superior reverberation and echo control.',
      prop3Title: 'LEED & WELL Credits',
      prop3Desc: 'Direct sustainability and biophilic credits for certified buildings.',
      prop4Title: '5-Year Certified Warranty',
      prop4Desc: 'Cellular substitution preventing drying, fading, and insect damage.',
    },
    solutions: {
      title: 'Our Architectural',
      titleHighlight: 'Solutions',
      subtitle: 'Three green engineering technologies designed for high-end architecture with zero maintenance.',
      requestQuote: 'Request Quote',
      specSheet: 'View Spec Sheet',
      filterAll: 'All Lines',
      filterPreserved: 'Preserved Gardens',
      filterPermanent: 'Permanent Gardens',
      filterAcoustic: 'Acoustic Panels',
    },
    methodology: {
      title: 'Engineering Methodology &',
      titleHighlight: 'Turnkey Execution',
      subtitle: 'From botanical diagnosis to final dust-free installation without plumbing.',
      step1Title: '01. Biophilic Diagnosis',
      step1Desc: 'Evaluation of solar incidence, lux levels and wall dimensions for exact species curation.',
      step2Title: '02. BIM Executive Design',
      step2Desc: 'Parametric 3D Revit and SketchUp modeling with custom modulation and concealed interlocking joints.',
      step3Title: '03. Atelier Crafting',
      step3Desc: 'Sap cellular replacement with botanical glycerin and hand-crafted module-by-module assembly.',
      step4Title: '04. Plug & Play Install',
      step4Desc: 'Clean dry fastening on concealed naval aluminum profiles with zero water plumbing.',
    },
    catalog: {
      title: 'Botanical Curatorship &',
      titleHighlight: 'Preserved Species',
      subtitle: 'Natural species preserved via cellular substitution maintaining flexibility, texture, and color for years.',
      filterAll: 'All Species',
      filterFoliage: 'Tropical Foliage',
      filterMoss: 'Mosses & Groundcovers',
      filterSpecial: 'Specialty Species',
      simulate: 'Simulate in Space',
      sampleRequest: 'Request Sample',
      tactileFeel: 'Texture:',
      acousticAbs: 'Acoustic Absorption:',
      idealEnvironments: 'Ideal Environments:',
    },
    quiz: {
      title: 'Biophilic Profile',
      titleHighlight: 'Diagnostic',
      subtitle: 'Map lighting conditions, acoustic isolation, and LEED/WELL targets to receive a custom botanical specification.',
      startQuiz: 'Start Diagnostic',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      viewResult: 'View Full Diagnostic',
      restart: 'Retake Quiz',
      downloadReport: 'Download Technical Report (PDF)',
      recommendedSpecies: 'Recommended Species',
      acousticProfile: 'Estimated Acoustic Profile',
      leedImpact: 'LEED/WELL Impact',
    },
    comparison: {
      title: 'Comparative Matrix of',
      titleHighlight: 'Vertical Technologies',
      subtitle: 'Initial investment (Capex), annual expenses (Opex), acoustic attenuation, and LEED/WELL credits comparison.',
      sideBySide: 'Side-by-Side (1x1)',
      fullTable: 'Full Table',
      preserved: 'Preserved Garden',
      permanent: 'Permanent Garden',
      naturalVivo: 'Living Irrigation Garden',
      capex: 'Initial Investment (Capex)',
      opex: 'Annual Maintenance (Opex)',
      water: 'Water Consumption',
      acoustics: 'Acoustic Absorption',
      leed: 'LEED / WELL Credits',
      lifespan: 'Estimated Lifespan',
    },
    roi: {
      title: 'Biophilic Impact &',
      titleHighlight: 'ROI Calculator',
      subtitle: 'Simulate water savings, pruning, plumbing maintenance and corporate productivity gains over 5 and 10 years.',
      areaInput: 'Wall Area (sqm)',
      spaceType: 'Space Typology',
      corporate: 'Corporate Office',
      residential: 'Residential Living',
      hospitality: 'Hospitality / Healthcare',
      annualWaterSaving: 'Annual Water Saved',
      annualMaintenanceSaving: 'Annual Maintenance Saved',
      tenYearSavings: '10-Year Cumulative Savings',
      wellPoints: 'Potential WELL v2 Points',
      leedCredits: 'Direct LEED v4.1 Credits',
      requestDetailedStudy: 'Request Full Feasibility Study',
    },
    gallery: {
      title: 'Project Gallery &',
      titleHighlight: 'Real Transformations',
      subtitle: 'Drag the slider to compare corporate and residential environments before and after the All Green installation.',
      allCategories: 'All Projects',
      residential: 'Residential',
      corporate: 'Corporate',
      commercial: 'Commercial & Retail',
      dragHint: 'Drag the slider to compare',
      before: 'Before',
      after: 'After',
    },
    testimonials: {
      title: 'Endorsed by leading architects and',
      titleHighlight: 'high-precision biophilic designers.',
      subtitle: 'Real reviews from architects, facility directors, and property managers about All Green vertical gardens.',
      gain: 'Measured improvement',
    },
    newsletter: {
      title: 'Biophilic Bulletin & Specifications',
      subtitle: 'New species launches, parametric Revit BIM blocks, and technical specs for green building certifications.',
      placeholder: 'Your professional email...',
      button: 'Subscribe',
      subscribed: 'Subscription confirmed! Welcome to the All Green Design Club.',
    },
    portal: {
      title: 'Architect & Specifier Portal',
      backToSite: 'Back to Website',
      newProject: 'New Project',
      totalArea: 'Total Projected Area',
      activeProjects: 'Projects in Production/Transit',
      waterSaved: 'Real Water Saved',
      leedCredits: 'LEED / WELL Credits',
      downloadSpecPdf: 'Download Specification (PDF)',
      statusProduction: 'In Production',
      statusTransit: 'In Transit',
      statusInstalled: 'Installed',
      statusSpec: 'Specification',
      statusAiStudy: 'AI Study',
      actions: 'Actions',
      details: 'View Project',
      logout: 'Sign Out',
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ag_language');
      if (saved === 'pt' || saved === 'en') return saved;
      if (typeof navigator !== 'undefined' && navigator.language) {
        if (navigator.language.startsWith('en')) return 'en';
      }
    } catch (e) {}
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ag_language', lang);
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    } catch (e) {}
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let current: any = DICTIONARY[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') return current;

    // Fallback to Portuguese if missing in English
    let fallbackCurrent: any = DICTIONARY['pt'];
    for (const k of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === 'object' && k in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[k];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }
    if (typeof fallbackCurrent === 'string') return fallbackCurrent;

    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
