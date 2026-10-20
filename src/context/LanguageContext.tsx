import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es';

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
      simulator: 'Simulador de Ambientes',
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
      simulateCta: 'Simular ambiente',
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
      statusAiStudy: 'Estudo Técnico',
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
      simulator: 'Space Simulator',
      openNavigation: 'Open Navigation Menu',
      closeNavigation: 'Close Navigation Menu',
      audioActive: 'Mute atelier soundscape',
      audioInactive: 'Play soundscape: breeze and foliage',
      themeLight: 'Switch to light mode',
      themeDark: 'Switch to dark botanical mode',
    },
    hero: {
      headlinePart1: 'Preserved Vertical Gardens.',
      headlinePart2: 'Natural foliage with',
      headlineEterno: 'zero irrigation.',
      subtitle: 'Cellular preservation using pure vegetable glycerin: certified acoustic comfort and tactile organic plants for corporate and residential spaces.',
      simulateCta: 'Simulate space',
      viewProjects: 'View projects',
      waterMetric: '0 gal',
      waterLabel: 'Water per year',
      acousticMetric: '0.89',
      acousticLabel: 'IPT acoustic NRC',
      durabilityMetric: '10 Years',
      durabilityLabel: 'Certified durability',
      lookupCode: 'Look up project by code',
      sunset: 'Sunset Mode',
      twilight: 'LED Twilight',
      tropical: 'Daylight',
      villaViva: 'Villa Viva 3D',
      beforeAfter: 'Before / After',
      soundOn: 'Breeze On',
      soundOff: 'Natural Sound',
      beforeTag: 'Before: Plain Drywall',
    },
    valueProps: {
      prop1Title: '100% Irrigation Free',
      prop1Desc: 'Zero plumbing pipes, pumps, or drainage required.',
      prop2Title: 'Acoustic NRC 0.89',
      prop2Desc: 'Certified sound absorption for echo and reverberation.',
      prop3Title: 'LEED & WELL Credits',
      prop3Desc: 'Direct biophilia and indoor environmental quality credits.',
      prop4Title: '5-Year Certified Warranty',
      prop4Desc: 'Patented formula prevents drying and preserves color.',
    },
    solutions: {
      title: 'Our Botanical',
      titleHighlight: 'Solutions',
      subtitle: 'Three architectural technologies integrating high-fidelity biophilia with zero maintenance.',
      requestQuote: 'Request Quote',
      specSheet: 'View Spec Sheet',
      filterAll: 'All Systems',
      filterPreserved: 'Preserved Gardens',
      filterPermanent: 'Permanent Gardens',
      filterAcoustic: 'Acoustic Panels',
    },
    methodology: {
      title: 'Engineering Method &',
      titleHighlight: 'Turnkey Delivery',
      subtitle: 'From lux diagnostic to dry, dust-free installation without plumbing.',
      step1Title: '01. Biophilic Diagnostic',
      step1Desc: 'Solar incidence, lux levels and space dimensions for exact species matching.',
      step2Title: '02. BIM Executive Project',
      step2Desc: 'Parametric 3D Revit & SketchUp modeling with custom modular backing.',
      step3Title: '03. Atelier Craftsmanship',
      step3Desc: 'Cellular sap replacement with botanical glycerin and hand-assembled modules.',
      step4Title: '04. Plug & Play Installation',
      step4Desc: 'Quick dry fastening into naval aluminum concealed track, zero plumbing.',
    },
    catalog: {
      title: 'Botanical Curatorship &',
      titleHighlight: 'Preserved Species',
      subtitle: 'Living plants stabilized through organic cellular preservation for years of longevity.',
      filterAll: 'All Species',
      filterFoliage: 'Tropical Foliage',
      filterMoss: 'Mosses & Groundcovers',
      filterSpecial: 'Signature Lines',
      simulate: 'Simulate in Space',
      sampleRequest: 'Request Sample Box',
      tactileFeel: 'Texture:',
      acousticAbs: 'Acoustic Absorption:',
      idealEnvironments: 'Recommended Spaces:',
    },
    quiz: {
      title: 'Biophilic Profile',
      titleHighlight: 'Diagnostic',
      subtitle: 'Map light exposure, acoustic needs and LEED/WELL targets for a customized botanical recommendation.',
      startQuiz: 'Start Diagnostic',
      question: 'Question',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      viewResult: 'View Full Report',
      restart: 'Retake Diagnostic',
      downloadReport: 'Download Technical PDF',
      recommendedSpecies: 'Recommended Species',
      acousticProfile: 'Acoustic Profile',
      leedImpact: 'LEED / WELL Impact',
    },
    comparison: {
      title: 'Comparative Matrix of',
      titleHighlight: 'Vertical Technologies',
      subtitle: 'Initial Capex, annual maintenance Opex, acoustics, and LEED certification credits.',
      sideBySide: 'Side by Side (1x1)',
      fullTable: 'Full Matrix',
      preserved: 'Preserved Garden',
      permanent: 'Permanent UV Garden',
      naturalVivo: 'Living Hydroponic Garden',
      capex: 'Initial Capex',
      opex: 'Annual Opex',
      water: 'Water Consumption',
      acoustics: 'Acoustic NRC',
      leed: 'LEED / WELL Credits',
      lifespan: 'Estimated Lifespan',
    },
    roi: {
      title: 'Impact Calculator &',
      titleHighlight: 'Biophilic ROI',
      subtitle: 'Calculate water savings, pruning elimination and productivity gains across 5 and 10 years.',
      areaInput: 'Wall Area (sqm)',
      spaceType: 'Building Type',
      corporate: 'Corporate Office',
      residential: 'Residential Living',
      hospitality: 'Hotels & Healthcare',
      annualWaterSaving: 'Annual Water Saved',
      annualMaintenanceSaving: 'Annual Maintenance Saved',
      tenYearSavings: '10-Year Total Net Savings',
      wellPoints: 'Potential WELL Points',
      leedCredits: 'Direct LEED Credits',
      requestDetailedStudy: 'Request Full Feasibility Study',
    },
    gallery: {
      title: 'Project Gallery &',
      titleHighlight: 'Real Transformations',
      subtitle: 'Slide the comparison cursor to view corporate and luxury spaces before and after All Green.',
      allCategories: 'All Projects',
      residential: 'Residential',
      corporate: 'Corporate',
      commercial: 'Commercial & Retail',
      dragHint: 'Drag the slider to compare',
      before: 'Before',
      after: 'After',
    },
    testimonials: {
      title: 'Architects and Leaders who specify',
      titleHighlight: 'high-precision biophilia.',
      subtitle: 'Reviews from architectural firms, facilities directors and luxury developers.',
      gain: 'Measured Benefit',
    },
    newsletter: {
      title: 'Biophilic Bulletin & Specs',
      subtitle: 'New species launches, parametric Revit BIM blocks and environmental certification data.',
      placeholder: 'Your corporate email...',
      button: 'Subscribe',
      subscribed: 'Subscription confirmed! Welcome to the All Green Decor Club.',
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
      statusAiStudy: 'Technical Study',
      actions: 'Actions',
      details: 'View Project',
      logout: 'Sign Out',
    }
  },
  es: {
    common: {
      brand: 'ALL GREEN',
      tagline: 'Biofilia Arquitectónica',
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      back: 'Volver',
      submit: 'Enviar',
      details: 'Ver Detalles',
      downloadPdf: 'Descargar PDF',
      loading: 'Cargando...',
      success: 'Éxito',
      search: 'Buscar',
      actions: 'Acciones',
      status: 'Estado',
      date: 'Fecha',
      allRights: 'Todos los derechos reservados.',
      switchLanguage: 'Cambiar idioma',
    },
    nav: {
      solutions: 'Soluciones',
      catalog: 'Catálogo',
      quiz: 'Test Biofílico',
      comparison: 'Comparativa',
      roi: 'Calculadora & ROI',
      projects: 'Proyectos',
      searchPlaceholder: 'Buscar especies, informes...',
      searchCmd: 'Buscar',
      architectArea: 'Área del Arquitecto',
      simulator: 'Simulador de Espacios',
      openNavigation: 'Abrir Menú de Navegación',
      closeNavigation: 'Cerrar Menú de Navegación',
      audioActive: 'Silenciar ambiente del taller',
      audioInactive: 'Activar sonido ambiental: brisa y follaje',
      themeLight: 'Cambiar a modo claro',
      themeDark: 'Cambiar a modo oscuro botánico',
    },
    hero: {
      headlinePart1: 'Jardines Verticales Preservados.',
      headlinePart2: 'Follaje natural con',
      headlineEterno: 'cero irrigación.',
      subtitle: 'Sustitución celular con glicerina vegetal pura: confort acústico certificado y vegetación de tacto vivo para interiores corporativos y residenciales.',
      simulateCta: 'Simular espacio',
      viewProjects: 'Ver proyectos',
      waterMetric: '0 L',
      waterLabel: 'Agua por año',
      acousticMetric: '0.89',
      acousticLabel: 'NRC acústico IPT',
      durabilityMetric: '10 Años',
      durabilityLabel: 'Durabilidad certificada',
      lookupCode: 'Consultar memoria por código de proyecto',
      sunset: 'Puesta de Sol',
      twilight: 'Noche LED',
      tropical: 'Día',
      villaViva: 'Villa Viva 3D',
      beforeAfter: 'Antes / Después',
      soundOn: 'Brisa Activa',
      soundOff: 'Sonido Natural',
      beforeTag: 'Antes: Pared Convencional',
    },
    valueProps: {
      prop1Title: '100% Exento de Riego',
      prop1Desc: 'Cero conexiones hidráulicas, bombas o desagües de agua.',
      prop2Title: 'Atenuación Acústica NRC 0.89',
      prop2Desc: 'Informe IPT que certifica la absorción de reverberación y eco.',
      prop3Title: 'Puntuación LEED & WELL',
      prop3Desc: 'Créditos directos de sostenibilidad y biofilia para edificaciones.',
      prop4Title: '5 Años de Garantía Homologada',
      prop4Desc: 'Tratamiento que evita la sequedad y conserva el color vivo.',
    },
    solutions: {
      title: 'Nuestras Líneas de',
      titleHighlight: 'Soluciones',
      subtitle: 'Tres tecnologías arquitectónicas para integrar la biofilia con durabilidad extrema y cero mantenimiento.',
      requestQuote: 'Solicitar Presupuesto',
      specSheet: 'Ver Ficha Técnica',
      filterAll: 'Todas las Líneas',
      filterPreserved: 'Jardines Preservados',
      filterPermanent: 'Jardines Permanentes',
      filterAcoustic: 'Paneles Acústicos',
    },
    methodology: {
      title: 'Metodología de Ingeniería &',
      titleHighlight: 'Ejecución Turnkey',
      subtitle: 'Del diagnóstico botánico a la instalación en seco sin polvo ni conexiones hidráulicas.',
      step1Title: '01. Diagnóstico Biofílico',
      step1Desc: 'Evaluación de incidencia solar, luxometría y dimensiones para la especificación botánica exacta.',
      step2Title: '02. Proyecto Ejecutivo BIM',
      step2Desc: 'Modelado 3D paramétrico en Revit y SketchUp con modulación a medida y fijaciones ocultas.',
      step3Title: '03. Producción en el Taller',
      step3Desc: 'Sustitución celular de savia por glicerina vegetal y montaje artesanal módulo a módulo.',
      step4Title: '04. Instalación Plug & Play',
      step4Desc: 'Fijación en seco limpia y rápida en perfil oculto de aluminio naval, sin tuberías.',
    },
    catalog: {
      title: 'Curaduría Botánica &',
      titleHighlight: 'Especies Preservadas',
      subtitle: 'Especies naturales tratadas por proceso de sustitución celular que conserva flexibilidad, textura y color por años.',
      filterAll: 'Todas las Especies',
      filterFoliage: 'Follajes Tropicales',
      filterMoss: 'Musgos y Rastreras',
      filterSpecial: 'Especiales',
      simulate: 'Simular en el Espacio',
      sampleRequest: 'Pedir Muestra',
      tactileFeel: 'Tacto:',
      acousticAbs: 'Absorción Acústica:',
      idealEnvironments: 'Ambientes Ideales:',
    },
    quiz: {
      title: 'Diagnóstico de Perfil',
      titleHighlight: 'Biofílico',
      subtitle: 'Mapee requisitos de iluminación, aislamiento acústico y metas LEED/WELL para recibir una curaduría botánica a medida.',
      startQuiz: 'Iniciar Diagnóstico',
      question: 'Pregunta',
      of: 'de',
      next: 'Siguiente',
      previous: 'Anterior',
      viewResult: 'Ver Resultado Completo',
      restart: 'Reiniciar Diagnóstico',
      downloadReport: 'Descargar Memoria Técnica (PDF)',
      recommendedSpecies: 'Especies Recomendadas',
      acousticProfile: 'Perfil Acústico Estimado',
      leedImpact: 'Impacto LEED/WELL',
    },
    comparison: {
      title: 'Matriz Comparativa de',
      titleHighlight: 'Tecnologías Verticales',
      subtitle: 'Diferencias de inversión inicial (Capex), gastos anuales (Opex), atenuación acústica y créditos LEED/WELL.',
      sideBySide: 'Lado a Lado (1x1)',
      fullTable: 'Tabla Completa',
      preserved: 'Jardín Preservado',
      permanent: 'Jardín Permanente',
      naturalVivo: 'Jardín Natural Vivo',
      capex: 'Inversión Inicial (Capex)',
      opex: 'Mantenimiento Anual (Opex)',
      water: 'Consumo de Agua',
      acoustics: 'Absorción Acústica',
      leed: 'Créditos LEED / WELL',
      lifespan: 'Vida Útil Estimada',
    },
    roi: {
      title: 'Calculadora de Impacto &',
      titleHighlight: 'ROI Biofílico',
      subtitle: 'Calcule el ahorro en agua, podas y los beneficios de productividad a lo largo de 5 y 10 años.',
      areaInput: 'Área de Pared (m²)',
      spaceType: 'Tipología del Espacio',
      corporate: 'Corporativo',
      residential: 'Residencial',
      hospitality: 'Hotelería / Clínicas',
      annualWaterSaving: 'Ahorro Hídrico Anual',
      annualMaintenanceSaving: 'Ahorro de Mantenimiento',
      tenYearSavings: 'Ahorro Total en 10 Años',
      wellPoints: 'Puntos Potenciales WELL v2',
      leedCredits: 'Créditos Directos LEED v4.1',
      requestDetailedStudy: 'Solicitar Estudio de Viabilidad',
    },
    gallery: {
      title: 'Galería de Proyectos &',
      titleHighlight: 'Transformaciones Reais',
      subtitle: 'Deslice el comparador para ver espacios residenciales y corporativos antes y después de All Green.',
      allCategories: 'Todos los Proyectos',
      residential: 'Residenciales',
      corporate: 'Corporativos',
      commercial: 'Comerciales y Tiendas',
      dragHint: 'Deslice el cursor para comparar',
      before: 'Antes',
      after: 'Después',
    },
    testimonials: {
      title: 'La opinión de quienes especificaron',
      titleHighlight: 'biofilia de alta precisión.',
      subtitle: 'Reseñas de arquitectos, directores de instalaciones y clientes residenciales sobre los jardines All Green.',
      gain: 'Beneficio registrado',
    },
    newsletter: {
      title: 'Boletín Biofílico & Especificación',
      subtitle: 'Novedades de especies, nuevos bloques BIM paramétricos para Revit y datos técnicos.',
      placeholder: 'Su correo electrónico profesional...',
      button: 'Suscribirse',
      subscribed: '¡Suscripción confirmada! Bienvenido al Club All Green Decor.',
    },
    portal: {
      title: 'Portal del Arquitecto & Especificador',
      backToSite: 'Volver al Sitio',
      newProject: 'Nuevo Proyecto',
      totalArea: 'Área Total Proyectada',
      activeProjects: 'Obras en Fabricación/Tránsito',
      waterSaved: 'Ahorro Hídrico Real',
      leedCredits: 'Créditos LEED / WELL',
      downloadSpecPdf: 'Descargar Memoria Descriptiva (PDF)',
      statusProduction: 'En Producción',
      statusTransit: 'En Tránsito',
      statusInstalled: 'Instalado',
      statusSpec: 'Especificación',
      statusAiStudy: 'Estudio Técnico',
      actions: 'Acciones',
      details: 'Ver Proyecto',
      logout: 'Cerrar Sesión',
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ag_language') as Language | null;
      if (saved === 'pt' || saved === 'en' || saved === 'es') return saved;
      if (typeof navigator !== 'undefined' && navigator.language) {
        if (navigator.language.startsWith('es')) return 'es';
        if (navigator.language.startsWith('en')) return 'en';
      }
    } catch (e) {}
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ag_language', lang);
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es' : 'en';
    } catch (e) {}
  };

  const toggleLanguage = () => {
    if (language === 'pt') setLanguage('en');
    else if (language === 'en') setLanguage('es');
    else setLanguage('pt');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es' : 'en';
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

    // Fallback to Portuguese if missing in target language
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
