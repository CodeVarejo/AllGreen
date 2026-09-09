import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueProps } from './components/ValueProps';
import { VideoShowroom } from './components/VideoShowroom';
import { SolutionsGrid } from './components/SolutionsGrid';
import { SmartSearchHub } from './components/SmartSearchHub';
import { MethodologySteps } from './components/MethodologySteps';
import { BotanicalCatalog } from './components/BotanicalCatalog';
import { BiophilicQuiz } from './components/BiophilicQuiz';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { LeedCalculator } from './components/LeedCalculator';
import { BiophilicRoiCalculator } from './components/BiophilicRoiCalculator';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { NewsletterAndFooter } from './components/NewsletterAndFooter';

import { SimulatorModal } from './components/SimulatorModal';
import { ProjectLookupModal } from './components/ProjectLookupModal';
import { QuoteModal } from './components/QuoteModal';
import { LoginModal } from './components/LoginModal';
import { ConsultationBookingModal } from './components/ConsultationBookingModal';
import { ProjectPdfReportModal } from './components/ProjectPdfReportModal';
import { ArchitectPortal } from './components/ArchitectPortal';
import { ScrollReveal } from './components/ScrollReveal';
import { LgpdBanner } from './components/LgpdBanner';
import { BioTipWidget } from './components/BioTipWidget';
import { ProjectSample, SimulationResult, UserProfile, PortalNotification, BiophilicProfileResult } from './types';
import { DEFAULT_USER, INITIAL_PORTAL_NOTIFICATIONS } from './data/portalData';
import { generateBiophilicGuidePdf } from './utils/generateBiophilicGuidePdf';
import { NotificationCenter } from './components/NotificationCenter';
import { GlobalCommandPalette } from './components/GlobalCommandPalette';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { ConfirmationDialogProvider } from './context/ConfirmationDialogContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DevToolsWidget, BreakableSectionKey } from './components/DevToolsWidget';
import { BuggyTester } from './components/BuggyTester';

function AppContent() {
  const { isHighContrast, fontSize, isWcagTableMode, toggleHighContrast } = useAccessibility();

  // Developer & QA Error Testing State
  const [brokenSections, setBrokenSections] = useState<Record<string, boolean>>({});

  const handleBreakSection = (key: BreakableSectionKey) => {
    setBrokenSections((prev) => ({ ...prev, [key]: true }));
  };

  const handleResetSection = (key: BreakableSectionKey) => {
    setBrokenSections((prev) => ({ ...prev, [key]: false }));
  };

  const handleResetAllSections = () => {
    setBrokenSections({});
  };

  // Navigation View State
  const [currentView, setCurrentView] = useState<'landing' | 'portal'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('allgreen_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER;
  });

  const handleSaveBiophilicProfile = (
    profile: BiophilicProfileResult,
    userOverride?: Partial<UserProfile>,
    autoDownload: boolean = true
  ) => {
    const baseUser = currentUser || DEFAULT_USER;
    const updatedUser: UserProfile = {
      ...baseUser,
      ...(userOverride || {}),
      savedBiophilicProfile: profile,
      savedBiophilicProfileDate: new Date().toLocaleDateString('pt-BR'),
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('allgreen_user_profile', JSON.stringify(updatedUser));
    } catch (e) {}

    const newNotif: PortalNotification = {
      id: `notif_bio_${Date.now()}`,
      type: 'botanical_update',
      title: `Perfil Biofílico Salvo: ${profile.archetypeTitle}`,
      description: `Diagnóstico vinculado com sucesso ao perfil de ${updatedUser.name}. Guia técnico homologado gerado (Cód. ${profile.recommendedSolutionCode}).`,
      timestamp: 'Agora mesmo',
      isRead: false,
      actionLabel: 'Ver Perfil no Painel',
      actionType: 'view_project',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (autoDownload) {
      generateBiophilicGuidePdf(profile, {
        user: updatedUser,
        downloadImmediately: true,
      });
    }

    return updatedUser;
  };

  // Notifications State
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_PORTAL_NOTIFICATIONS);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Modal states
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isProjectLookupOpen, setIsProjectLookupOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isPdfReportModalOpen, setIsPdfReportModalOpen] = useState(false);
  const [consultationPrefillType, setConsultationPrefillType] = useState<string | undefined>();
  const [consultationPrefillProjectCode, setConsultationPrefillProjectCode] = useState<string | undefined>();

  // Prefilled contexts
  const [selectedProjectForLookup, setSelectedProjectForLookup] = useState<ProjectSample | null>(null);
  const [quoteContext, setQuoteContext] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleOpenSimulator = () => {
    setIsSimulatorOpen(true);
  };

  const handleOpenConsultation = (type?: string, projectCode?: string) => {
    setConsultationPrefillType(type);
    setConsultationPrefillProjectCode(projectCode);
    setIsConsultationModalOpen(true);
  };

  const handleOpenPdfReport = () => {
    setIsPdfReportModalOpen(true);
  };

  const handleOpenProjectLookup = (project?: ProjectSample) => {
    if (project) {
      setSelectedProjectForLookup(project);
    } else {
      setSelectedProjectForLookup(null);
    }
    setIsProjectLookupOpen(true);
  };

  const handleOpenQuote = (context?: string) => {
    setQuoteContext(context || '');
    setIsQuoteOpen(true);
  };

  const handleOpenLogin = () => {
    if (currentUser) {
      setCurrentView(currentView === 'portal' ? 'landing' : 'portal');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleScrollToBotanical = () => {
    if (currentView === 'portal') {
      setCurrentView('landing');
      setTimeout(() => {
        const elem = document.getElementById('botanical-catalog');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const elem = document.getElementById('botanical-catalog');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseAllModals = () => {
    setIsSimulatorOpen(false);
    setIsProjectLookupOpen(false);
    setIsQuoteOpen(false);
    setIsLoginOpen(false);
    setIsNotificationCenterOpen(false);
    setIsCommandPaletteOpen(false);
    setIsShortcutsModalOpen(false);
    setIsConsultationModalOpen(false);
    setIsPdfReportModalOpen(false);
  };

  // Wire Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onOpenSearch: () => setIsCommandPaletteOpen(prev => !prev),
    onOpenSimulator: () => setIsSimulatorOpen(prev => !prev),
    onTogglePortal: () => handleOpenLogin(),
    onOpenProjectLookup: () => handleOpenProjectLookup(),
    onOpenQuote: () => handleOpenQuote('Atalho de Teclado'),
    onOpenBotanical: () => handleScrollToBotanical(),
    onOpenNotifications: () => setIsNotificationCenterOpen(prev => !prev),
    onToggleHighContrast: () => toggleHighContrast(),
    onOpenShortcutsModal: () => setIsShortcutsModalOpen(prev => !prev),
    onCloseAllModals: () => handleCloseAllModals(),
  });

  const handleExecuteShortcut = (shortcutId: string) => {
    switch (shortcutId) {
      case 'search':
        setIsCommandPaletteOpen(true);
        break;
      case 'simulator':
        setIsSimulatorOpen(true);
        break;
      case 'portal':
        handleOpenLogin();
        break;
      case 'lookup':
        handleOpenProjectLookup();
        break;
      case 'quote':
        handleOpenQuote('Atalho de Teclado');
        break;
      case 'botanical':
        handleScrollToBotanical();
        break;
      case 'notifications':
        setIsNotificationCenterOpen(true);
        break;
      case 'contrast':
        toggleHighContrast();
        break;
      case 'shortcuts_help':
        setIsShortcutsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationActionClick = (notification: PortalNotification) => {
    setIsNotificationCenterOpen(false);
    handleMarkNotificationAsRead(notification.id);

    if (notification.actionType === 'open_simulator') {
      setIsSimulatorOpen(true);
    } else if (notification.actionType === 'view_project') {
      if (currentUser) {
        setCurrentView('portal');
      } else {
        setIsProjectLookupOpen(true);
      }
    } else if (notification.actionType === 'recalculate_leed') {
      if (currentUser) {
        setCurrentView('portal');
      } else {
        const elem = document.getElementById('leed-calculator');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (notification.actionType === 'view_botanical') {
      const elem = document.getElementById('botanical-catalog');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    } else if (notification.actionType === 'download_report') {
      if (currentUser) {
        setCurrentView('portal');
      }
    }
  };

  const handleTriggerSimulation = (type: 'ai' | 'project' | 'botanical' | 'leed') => {
    const timestamp = 'Agora';
    let newNotif: PortalNotification;

    if (type === 'ai') {
      newNotif = {
        id: `notif_ai_${Date.now()}`,
        type: 'ai_assistant_message',
        title: 'Assistente IA: Nova Simulação Biofílica Gerada',
        description: 'O algoritmo analisou a orientação solar e a acústica do projeto e recomenda uma composição mista de Musgo Polar com Eucalipto Preservado para ganho de +5.8 dB no isolamento.',
        timestamp,
        isRead: false,
        sender: 'Assistente IA All Green',
        projectCode: 'AG-8492',
        impactSummary: {
          parameterChanged: 'Composição de Espécies & Acústica',
          oldValue: 'Musgo Dinamarquês Puro',
          newValue: 'Mix Polar Moss + Eucalipto Real Touch (+18% absorção)',
          deltaWell: '+4 Pts WELL Sound',
          deltaLeed: '+2 Créditos LEED v4.1',
        },
        actionLabel: 'Abrir Simulador IA',
        actionType: 'open_simulator',
      };
    } else if (type === 'project') {
      newNotif = {
        id: `notif_proj_${Date.now()}`,
        type: 'project_status',
        title: 'Status do Projeto AG-8492: Montagem Concluída na Fábrica',
        description: 'Os módulos Plug & Play com travamento oculto foram finalizados com controle de qualidade 100% aprovado. Expedição agendada.',
        timestamp,
        isRead: false,
        projectCode: 'AG-8492',
        impactSummary: {
          parameterChanged: 'Etapa Fabril',
          oldValue: 'Em Corte e Montagem',
          newValue: 'Pronto para Transporte & Instalação',
        },
        actionLabel: 'Ver Detalhes do Projeto',
        actionType: 'view_project',
      };
    } else if (type === 'botanical') {
      newNotif = {
        id: `notif_bot_${Date.now()}`,
        type: 'botanical_update',
        title: 'Laudo IPT Atualizado: Absorção Sonora NRC 0.89',
        description: 'Novo teste de câmara reverberante em laboratório creditou NRC 0.89 em placas de 60mm.',
        timestamp,
        isRead: false,
        speciesId: 'moss-dinamarques',
        speciesName: 'Musgo Polar Moss Escandinavo',
        impactSummary: {
          parameterChanged: 'Absorção Acústica (NRC ISO 354)',
          oldValue: 'NRC 0.85',
          newValue: 'NRC 0.89 (+4.7%)',
          deltaWell: '+3 Pts WELL Sound S04',
        },
        actionLabel: 'Ver Catálogo Botânico',
        actionType: 'view_botanical',
      };
    } else {
      newNotif = {
        id: `notif_leed_${Date.now()}`,
        type: 'leed_well_update',
        title: 'Atualização LEED: +3 Novos Créditos Homologados',
        description: 'O relatório de ciclo de vida atestou pontuação máxima nos créditos de materiais regionais e zero consumo de água.',
        timestamp,
        isRead: false,
        projectCode: 'AG-8492',
        impactSummary: {
          parameterChanged: 'Pontuação de Sustentabilidade',
          oldValue: '12 créditos LEED',
          newValue: '15 créditos homologados (+3)',
          deltaLeed: '+3 Créditos',
          deltaWell: '+6 Pts WELL v2',
        },
        actionLabel: 'Ver Memorial LEED',
        actionType: 'recalculate_leed',
      };
    }

    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleOpenQuoteFromSimulation = (simResult: SimulationResult) => {
    const summary = `Simulação IA: ${simResult.roomType} (${simResult.estimatedArea}m²) - ${simResult.recommendedStyle}. Orçamento estimado: R$ ${simResult.estimatedBudgetMin} - R$ ${simResult.estimatedBudgetMax}.`;
    handleOpenQuote(summary);
  };

  const handleExploreProjects = () => {
    const elem = document.getElementById('before-after-gallery');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSimulateSpecies = (speciesName: string) => {
    handleOpenSimulator();
  };

  const fontSizeClass = 
    fontSize === 'large' ? 'font-size-large' : 
    fontSize === 'xlarge' ? 'font-size-xlarge' : 
    fontSize === 'huge' ? 'font-size-huge' : '';

  const contrastClass = isHighContrast ? 'high-contrast' : '';
  const wcagTableClass = isWcagTableMode ? 'wcag-table-mode' : '';

  return (
    <div className={`min-h-screen bg-[#f3f7f4] text-gray-900 font-sans antialiased selection:bg-[#86efac] selection:text-[#072a1a] transition-all ${fontSizeClass} ${contrastClass} ${wcagTableClass}`}>
      
      {/* Skip Links for Screen Readers */}
      <a 
        href="#botanical-catalog" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:p-3 focus:bg-[#072a1a] focus:text-[#86efac] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:border-2 focus:border-yellow-400"
      >
        Ir para o Catálogo de Plantas (WCAG)
      </a>
      <a 
        href="#comparison-matrix" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-36 focus:z-50 focus:p-3 focus:bg-[#072a1a] focus:text-[#86efac] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:border-2 focus:border-yellow-400"
      >
        Ir para a Matriz Comparativa (WCAG)
      </a>
      <a 
        href="#accessibility-selector" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-80 focus:z-50 focus:p-3 focus:bg-[#072a1a] focus:text-[#86efac] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:border-2 focus:border-yellow-400"
      >
        Ir para o Seletor de Acessibilidade no Rodapé
      </a>

      {/* Conditionally Render Portal View OR Landing Page with Smooth Transition */}
      <AnimatePresence mode="wait">
        {currentView === 'portal' && (
          <motion.div
            key="portal-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <ErrorBoundary sectionName="Portal do Arquiteto">
              <ArchitectPortal
                user={currentUser || DEFAULT_USER}
                onBackToLanding={() => setCurrentView('landing')}
                onLogout={handleLogout}
                onOpenSimulator={handleOpenSimulator}
                onOpenQuote={handleOpenQuote}
                onRetakeQuiz={() => {
                  setCurrentView('landing');
                  setTimeout(() => {
                    const el = document.getElementById('biophilic-quiz');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                onDownloadBiophilicGuide={(profile) => {
                  generateBiophilicGuidePdf(profile, {
                    user: currentUser || DEFAULT_USER,
                    downloadImmediately: true,
                  });
                }}
              />
            </ErrorBoundary>
          </motion.div>
        )}

        {currentView === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Navigation Header */}
            <Navbar
              onOpenSimulator={handleOpenSimulator}
              onOpenProjectLookup={() => handleOpenProjectLookup()}
              onOpenQuote={() => handleOpenQuote('Atendimento Direto')}
              onOpenLogin={handleOpenLogin}
              currentUser={currentUser}
              onSearchQueryChange={(query) => setSearchQuery(query)}
              onOpenNotifications={() => setIsNotificationCenterOpen(true)}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenSearch={() => setIsCommandPaletteOpen(true)}
              onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenProjectPdfReport={handleOpenPdfReport}
            />

            {/* Main Hero Section with interactive before/after slider */}
            <ErrorBoundary 
              sectionName="Hero Section"
              onReset={() => handleResetSection('hero')}
            >
              <BuggyTester shouldThrow={!!brokenSections['hero']} name="Hero Section" />
              <Hero
                onOpenSimulator={handleOpenSimulator}
                onOpenProjectLookup={() => handleOpenProjectLookup()}
                onExploreProjects={handleExploreProjects}
              />
            </ErrorBoundary>

            {/* Value Proposition Badges */}
            <ValueProps />

            {/* Video Showroom & Interactive Player */}
            <ErrorBoundary sectionName="Video Showroom">
              <VideoShowroom
                onOpenSimulator={handleOpenSimulator}
              />
            </ErrorBoundary>

            {/* Nossas Soluções Grid */}
            <ErrorBoundary 
              sectionName="Catálogo de Soluções"
              onReset={() => handleResetSection('solutions')}
            >
              <BuggyTester shouldThrow={!!brokenSections['solutions']} name="Catálogo de Soluções" />
              <SolutionsGrid
                onSelectSolution={(title) => handleOpenQuote(`Linha de Solução: ${title}`)}
                onOpenQuote={() => handleOpenQuote('Solicitação Geral de Soluções')}
              />
            </ErrorBoundary>

            {/* Busca Inteligente All Green */}
            <ErrorBoundary sectionName="Busca Inteligente">
              <SmartSearchHub
                initialSearchQuery={searchQuery}
                onOpenQuoteForProduct={(productName) => handleOpenQuote(`Produto do Catálogo: ${productName}`)}
              />
            </ErrorBoundary>

            {/* Metodologia Turnkey em 4 passos */}
            <MethodologySteps
              onOpenSimulator={handleOpenSimulator}
              onOpenQuote={() => handleOpenQuote('Interesse em Metodologia Turnkey')}
            />

            {/* Curadoria Botânica & Ficha Técnica */}
            <ErrorBoundary 
              sectionName="Catálogo Botânico & Ficha Técnica"
              onReset={() => handleResetSection('botanical')}
            >
              <BuggyTester shouldThrow={!!brokenSections['botanical']} name="Catálogo Botânico & Ficha Técnica" />
              <BotanicalCatalog
                onSimulateSpecies={handleSimulateSpecies}
                onOpenQuote={() => handleOpenQuote('Solicitação de Amostras Botânicas')}
              />
            </ErrorBoundary>

            {/* Diagnóstico Interativo de Perfil Biofílico (Quiz 5 Perguntas) */}
            <ErrorBoundary sectionName="Diagnóstico de Perfil Biofílico">
              <BiophilicQuiz
                onOpenSimulator={handleOpenSimulator}
                onOpenQuote={(ctx) => handleOpenQuote(ctx || 'Diagnóstico de Perfil Biofílico')}
                onOpenPdfReport={handleOpenPdfReport}
                onScrollToCatalog={handleScrollToBotanical}
                currentUser={currentUser}
                onSaveProfile={handleSaveBiophilicProfile}
                onOpenLogin={handleOpenLogin}
                onNavigateToPortal={() => setCurrentView('portal')}
              />
            </ErrorBoundary>

            {/* Matriz Comparativa das Tecnologias Verticais (com Modo Lado a Lado 1x1) */}
            <ErrorBoundary sectionName="Matriz Comparativa">
              <ComparisonMatrix
                onOpenSimulator={handleOpenSimulator}
                onOpenQuote={(ctx) => handleOpenQuote(ctx || 'Matriz Comparativa das Tecnologias Verticais')}
                onOpenPdfReport={handleOpenPdfReport}
              />
            </ErrorBoundary>

            {/* Calculadora de Créditos WELL & LEED */}
            <ErrorBoundary 
              sectionName="Calculadora de Créditos WELL/LEED"
              onReset={() => handleResetSection('leed')}
            >
              <BuggyTester shouldThrow={!!brokenSections['leed']} name="Calculadora de Créditos WELL/LEED" />
              <LeedCalculator />
            </ErrorBoundary>

            {/* Calculadora de ROI Biofílico & Redução de Absenteísmo */}
            <ErrorBoundary 
              sectionName="Calculadora de ROI Biofílico"
              onReset={() => handleResetSection('roi')}
            >
              <BuggyTester shouldThrow={!!brokenSections['roi']} name="Calculadora de ROI Biofílico" />
              <BiophilicRoiCalculator
                onOpenQuote={(ctx) => handleOpenQuote(ctx || 'Estudo de ROI Biofílico')}
              />
            </ErrorBoundary>

            {/* Galeria Interativa Antes & Depois */}
            <ErrorBoundary 
              sectionName="Galeria Antes & Depois"
              onReset={() => handleResetSection('gallery')}
            >
              <BuggyTester shouldThrow={!!brokenSections['gallery']} name="Galeria Antes & Depois" />
              <BeforeAfterGallery
                onOpenProjectDetail={(project) => handleOpenProjectLookup(project)}
              />
            </ErrorBoundary>

            {/* Depoimentos de Clientes & Impacto Biofílico (Carrossel) */}
            <ErrorBoundary sectionName="Depoimentos de Clientes">
              <CustomerTestimonials
                onOpenConsultation={() => handleOpenConsultation()}
                onOpenSimulator={handleOpenSimulator}
                onOpenProjectDetail={(projectCode) => handleOpenProjectLookup()}
              />
            </ErrorBoundary>

            {/* Newsletter & Footer */}
            <NewsletterAndFooter
              onOpenSimulator={handleOpenSimulator}
              onOpenProjectLookup={() => handleOpenProjectLookup()}
              onOpenQuote={() => handleOpenQuote('Solicitação via Rodapé')}
              onOpenLogin={handleOpenLogin}
              onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
              onOpenConsultation={() => handleOpenConsultation()}
              onOpenProjectPdfReport={handleOpenPdfReport}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modals with Error Boundaries */}
      <ErrorBoundary sectionName="Simulador IA Modal">
        <SimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          onOpenQuoteWithData={handleOpenQuoteFromSimulation}
        />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Consulta de Projeto Modal">
        <ProjectLookupModal
          isOpen={isProjectLookupOpen}
          onClose={() => setIsProjectLookupOpen(false)}
          initialProject={selectedProjectForLookup}
          onOpenQuoteForCode={(code) => handleOpenQuote(`Projeto Referência Código: ${code}`)}
        />
      </ErrorBoundary>

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        prefilledContext={quoteContext}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Agendamento de Consultoria Técnica Modal (Calendly / Meet) */}
      <ErrorBoundary sectionName="Agendamento de Consultoria Técnica">
        <ConsultationBookingModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          prefilledType={consultationPrefillType}
          prefilledProjectCode={consultationPrefillProjectCode}
        />
      </ErrorBoundary>

      {/* Gerador de Laudo & Relatório Consolidado do Projeto em PDF */}
      <ErrorBoundary sectionName="Gerador de Relatório PDF">
        <ProjectPdfReportModal
          isOpen={isPdfReportModalOpen}
          onClose={() => setIsPdfReportModalOpen(false)}
        />
      </ErrorBoundary>

      {/* Real-time Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onActionClick={handleNotificationActionClick}
        onTriggerSimulation={handleTriggerSimulation}
      />

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <GlobalCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenProjectLookup={() => handleOpenProjectLookup()}
        onOpenQuote={(ctx) => handleOpenQuote(ctx)}
        onTogglePortal={() => handleOpenLogin()}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenProjectPdfReport={handleOpenPdfReport}
        onTriggerBreakTest={() => handleBreakSection('botanical')}
      />

      {/* Global Keyboard Shortcuts Cheatsheet Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onExecuteShortcut={handleExecuteShortcut}
      />

      {/* Floating Developer Tools & QA Widget with 'Break Component' button */}
      <DevToolsWidget
        brokenSections={brokenSections}
        onBreakSection={handleBreakSection}
        onResetSection={handleResetSection}
        onResetAllSections={handleResetAllSections}
      />

      {/* Floating Widgets */}
      <LgpdBanner />

    </div>
  );
}

export function App() {
  return (
    <AccessibilityProvider>
      <ConfirmationDialogProvider>
        <AppContent />
      </ConfirmationDialogProvider>
    </AccessibilityProvider>
  );
}

export default App;

