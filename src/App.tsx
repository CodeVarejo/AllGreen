import React, { useState, useEffect } from 'react';
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
import { ModalProvider, useModals } from './context/ModalContext';
import { CloudStorageProvider } from './context/CloudStorageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GuidedTour } from './components/GuidedTour';

function AppContent() {
  const { isHighContrast, fontSize, isWcagTableMode, toggleHighContrast } = useAccessibility();
  const {
    isSimulatorOpen,
    openSimulator,
    closeSimulator,
    isProjectLookupOpen,
    openProjectLookup,
    closeProjectLookup,
    selectedProjectForLookup,
    isQuoteOpen,
    openQuote,
    closeQuote,
    quoteContext,
    isLoginOpen,
    openLogin,
    closeLogin,
    isConsultationModalOpen,
    openConsultation,
    closeConsultation,
    consultationPrefillType,
    consultationPrefillProjectCode,
    isPdfReportModalOpen,
    openPdfReport,
    closePdfReport,
    isNotificationCenterOpen,
    openNotificationCenter,
    closeNotificationCenter,
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    isShortcutsModalOpen,
    openShortcutsModal,
    closeShortcutsModal,
    isTourOpen,
    openTour,
    closeTour,
    closeAllModals,
  } = useModals();

  // Navigation View State
  const [currentView, setCurrentView] = useState<'landing' | 'portal'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('allgreen_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_USER;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_PORTAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check first visit to trigger guided onboarding tour
  useEffect(() => {
    try {
      const hasSeenTour = localStorage.getItem('allgreen_onboarding_completed_v1');
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          openTour();
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [openTour]);

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

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenLogin = () => {
    if (currentUser) {
      setCurrentView(currentView === 'portal' ? 'landing' : 'portal');
    } else {
      openLogin();
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

  const handleScrollToQuiz = () => {
    if (currentView === 'portal') {
      setCurrentView('landing');
      setTimeout(() => {
        const elem = document.getElementById('biophilic-quiz');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const elem = document.getElementById('biophilic-quiz');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Wire Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onOpenSearch: () => openCommandPalette(),
    onOpenSimulator: () => openSimulator(),
    onTogglePortal: () => handleOpenLogin(),
    onOpenProjectLookup: () => openProjectLookup(),
    onOpenQuote: () => openQuote('Atalho de Teclado'),
    onOpenBotanical: () => handleScrollToBotanical(),
    onOpenNotifications: () => openNotificationCenter(),
    onToggleHighContrast: () => toggleHighContrast(),
    onOpenShortcutsModal: () => openShortcutsModal(),
    onCloseAllModals: () => closeAllModals(),
  });

  const handleExecuteShortcut = (shortcutId: string) => {
    switch (shortcutId) {
      case 'search':
        openCommandPalette();
        break;
      case 'simulator':
        openSimulator();
        break;
      case 'portal':
        handleOpenLogin();
        break;
      case 'lookup':
        openProjectLookup();
        break;
      case 'quote':
        openQuote('Atalho de Teclado');
        break;
      case 'botanical':
        handleScrollToBotanical();
        break;
      case 'notifications':
        openNotificationCenter();
        break;
      case 'contrast':
        toggleHighContrast();
        break;
      case 'shortcuts_help':
        openShortcutsModal();
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
    closeNotificationCenter();
    handleMarkNotificationAsRead(notification.id);

    if (notification.actionType === 'open_simulator') {
      openSimulator();
    } else if (notification.actionType === 'view_project') {
      if (currentUser) {
        setCurrentView('portal');
      } else {
        openProjectLookup();
      }
    } else if (notification.actionType === 'recalculate_leed') {
      if (currentUser) {
        setCurrentView('portal');
      } else {
        const elem = document.getElementById('biophilic-roi-calculator');
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
    openQuote(summary);
  };

  const handleExploreProjects = () => {
    const elem = document.getElementById('before-after-gallery');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
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
                onOpenSimulator={openSimulator}
                onOpenQuote={openQuote}
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
              onOpenSimulator={openSimulator}
              onOpenProjectLookup={() => openProjectLookup()}
              onOpenQuote={() => openQuote('Atendimento Direto')}
              onOpenLogin={handleOpenLogin}
              currentUser={currentUser}
              onSearchQueryChange={(query) => setSearchQuery(query)}
              onOpenNotifications={() => openNotificationCenter()}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenSearch={() => openCommandPalette()}
              onOpenShortcutsModal={() => openShortcutsModal()}
              onOpenConsultation={() => openConsultation()}
              onOpenProjectPdfReport={openPdfReport}
              onOpenTour={openTour}
            />

            {/* Main Hero Section with interactive before/after slider */}
            <ErrorBoundary sectionName="Hero Section">
              <Hero
                onOpenSimulator={openSimulator}
                onOpenProjectLookup={() => openProjectLookup()}
                onExploreProjects={handleExploreProjects}
              />
            </ErrorBoundary>

            {/* Value Proposition Badges */}
            <ValueProps />

            {/* Video Showroom & Interactive Player */}
            <ErrorBoundary sectionName="Video Showroom">
              <VideoShowroom
                onOpenSimulator={openSimulator}
              />
            </ErrorBoundary>

            {/* Nossas Soluções Grid */}
            <ErrorBoundary sectionName="Catálogo de Soluções">
              <SolutionsGrid
                onSelectSolution={(title) => openQuote(`Linha de Solução: ${title}`)}
                onOpenQuote={() => openQuote('Solicitação Geral de Soluções')}
              />
            </ErrorBoundary>

            {/* Busca Inteligente All Green */}
            <ErrorBoundary sectionName="Busca Inteligente">
              <SmartSearchHub
                initialSearchQuery={searchQuery}
                onOpenQuoteForProduct={(productName) => openQuote(`Produto do Catálogo: ${productName}`)}
              />
            </ErrorBoundary>

            {/* Metodologia Turnkey em 4 passos */}
            <MethodologySteps
              onOpenSimulator={openSimulator}
              onOpenQuote={() => openQuote('Interesse em Metodologia Turnkey')}
            />

            {/* Curadoria Botânica & Ficha Técnica */}
            <ErrorBoundary sectionName="Catálogo Botânico & Ficha Técnica">
              <BotanicalCatalog
                onSimulateSpecies={() => openSimulator()}
                onOpenQuote={() => openQuote('Solicitação de Amostras Botânicas')}
              />
            </ErrorBoundary>

            {/* Diagnóstico Interativo de Perfil Biofílico (Quiz 5 Perguntas) */}
            <ErrorBoundary sectionName="Diagnóstico de Perfil Biofílico">
              <BiophilicQuiz
                onOpenSimulator={openSimulator}
                onOpenQuote={(ctx) => openQuote(ctx || 'Diagnóstico de Perfil Biofílico')}
                onOpenPdfReport={openPdfReport}
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
                onOpenSimulator={openSimulator}
                onOpenQuote={(ctx) => openQuote(ctx || 'Matriz Comparativa das Tecnologias Verticais')}
                onOpenPdfReport={openPdfReport}
              />
            </ErrorBoundary>

            {/* Calculadora de Impacto & ROI Biofílico (Retorno Financeiro, Acústica, WELL & LEED) */}
            <div id="leed-calculator" className="sr-only" aria-hidden="true" />
            <ErrorBoundary sectionName="Calculadora de Impacto & ROI Biofílico">
              <BiophilicRoiCalculator
                onOpenQuote={(ctx) => openQuote(ctx || 'Estudo de Impacto & ROI Biofílico')}
              />
            </ErrorBoundary>

            {/* Galeria Interativa Antes & Depois */}
            <ErrorBoundary sectionName="Galeria Antes & Depois">
              <BeforeAfterGallery
                onOpenProjectDetail={(project) => openProjectLookup(project)}
              />
            </ErrorBoundary>

            {/* Depoimentos de Clientes & Impacto Biofílico (Carrossel) */}
            <ErrorBoundary sectionName="Depoimentos de Clientes">
              <CustomerTestimonials
                onOpenConsultation={() => openConsultation()}
                onOpenSimulator={openSimulator}
                onOpenProjectDetail={(projectCode) => openProjectLookup()}
              />
            </ErrorBoundary>

            {/* Newsletter & Footer */}
            <NewsletterAndFooter
              onOpenSimulator={openSimulator}
              onOpenProjectLookup={() => openProjectLookup()}
              onOpenQuote={() => openQuote('Solicitação via Rodapé')}
              onOpenLogin={handleOpenLogin}
              onOpenShortcutsModal={() => openShortcutsModal()}
              onOpenConsultation={() => openConsultation()}
              onOpenProjectPdfReport={openPdfReport}
              onOpenTour={openTour}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Modals with Error Boundaries */}
      <ErrorBoundary sectionName="Simulador IA Modal">
        <SimulatorModal
          isOpen={isSimulatorOpen}
          onClose={closeSimulator}
          onOpenQuoteWithData={handleOpenQuoteFromSimulation}
        />
      </ErrorBoundary>

      <ErrorBoundary sectionName="Consulta de Projeto Modal">
        <ProjectLookupModal
          isOpen={isProjectLookupOpen}
          onClose={closeProjectLookup}
          initialProject={selectedProjectForLookup}
          onOpenQuoteForCode={(code) => openQuote(`Projeto Referência Código: ${code}`)}
        />
      </ErrorBoundary>

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={closeQuote}
        prefilledContext={quoteContext}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Agendamento de Consultoria Técnica Modal (Calendly / Meet) */}
      <ErrorBoundary sectionName="Agendamento de Consultoria Técnica">
        <ConsultationBookingModal
          isOpen={isConsultationModalOpen}
          onClose={closeConsultation}
          prefilledType={consultationPrefillType}
          prefilledProjectCode={consultationPrefillProjectCode}
        />
      </ErrorBoundary>

      {/* Gerador de Laudo & Relatório Consolidado do Projeto em PDF */}
      <ErrorBoundary sectionName="Gerador de Relatório PDF">
        <ProjectPdfReportModal
          isOpen={isPdfReportModalOpen}
          onClose={closePdfReport}
        />
      </ErrorBoundary>

      {/* Real-time Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={closeNotificationCenter}
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
        onClose={closeCommandPalette}
        onOpenSimulator={() => openSimulator()}
        onOpenProjectLookup={() => openProjectLookup()}
        onOpenQuote={(ctx) => openQuote(ctx)}
        onTogglePortal={() => handleOpenLogin()}
        onOpenNotifications={() => openNotificationCenter()}
        onOpenShortcutsModal={() => openShortcutsModal()}
        onOpenConsultation={() => openConsultation()}
        onOpenProjectPdfReport={openPdfReport}
        onOpenTour={openTour}
      />

      {/* Global Keyboard Shortcuts Cheatsheet Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={closeShortcutsModal}
        onExecuteShortcut={handleExecuteShortcut}
      />

      {/* Guided Tour (Onboarding) */}
      <ErrorBoundary sectionName="Tour Guiado de Onboarding">
        <GuidedTour
          isOpen={isTourOpen}
          onClose={closeTour}
          onOpenSimulator={openSimulator}
          onScrollToQuiz={handleScrollToQuiz}
          onOpenPortal={handleOpenLogin}
        />
      </ErrorBoundary>

      {/* Floating Widgets */}
      <LgpdBanner />

    </div>
  );
}

export function App() {
  return (
    <AccessibilityProvider>
      <ConfirmationDialogProvider>
        <CloudStorageProvider>
          <ModalProvider>
            <AppContent />
          </ModalProvider>
        </CloudStorageProvider>
      </ConfirmationDialogProvider>
    </AccessibilityProvider>
  );
}

export default App;

