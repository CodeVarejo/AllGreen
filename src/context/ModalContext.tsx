import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ProjectSample } from '../types';

interface ModalContextType {
  // Modal visibility states
  isSimulatorOpen: boolean;
  isProjectLookupOpen: boolean;
  isQuoteOpen: boolean;
  isLoginOpen: boolean;
  isConsultationModalOpen: boolean;
  isPdfReportModalOpen: boolean;
  isNotificationCenterOpen: boolean;
  isCommandPaletteOpen: boolean;
  isShortcutsModalOpen: boolean;
  isTourOpen: boolean;

  // Contextual modal data
  selectedProjectForLookup: ProjectSample | null;
  quoteContext: string;
  consultationPrefillType?: string;
  consultationPrefillProjectCode?: string;

  // Modal open / close actions
  openSimulator: () => void;
  closeSimulator: () => void;

  openProjectLookup: (project?: ProjectSample) => void;
  closeProjectLookup: () => void;

  openQuote: (context?: string) => void;
  closeQuote: () => void;

  openLogin: () => void;
  closeLogin: () => void;

  openConsultation: (type?: string, projectCode?: string) => void;
  closeConsultation: () => void;

  openPdfReport: () => void;
  closePdfReport: () => void;

  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;

  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  openShortcutsModal: () => void;
  closeShortcutsModal: () => void;

  openTour: () => void;
  closeTour: () => void;

  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isProjectLookupOpen, setIsProjectLookupOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isPdfReportModalOpen, setIsPdfReportModalOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const [selectedProjectForLookup, setSelectedProjectForLookup] = useState<ProjectSample | null>(null);
  const [quoteContext, setQuoteContext] = useState<string>('');
  const [consultationPrefillType, setConsultationPrefillType] = useState<string | undefined>();
  const [consultationPrefillProjectCode, setConsultationPrefillProjectCode] = useState<string | undefined>();

  const openSimulator = useCallback(() => setIsSimulatorOpen(true), []);
  const closeSimulator = useCallback(() => setIsSimulatorOpen(false), []);

  const openProjectLookup = useCallback((project?: ProjectSample) => {
    setSelectedProjectForLookup(project || null);
    setIsProjectLookupOpen(true);
  }, []);
  const closeProjectLookup = useCallback(() => {
    setIsProjectLookupOpen(false);
    setSelectedProjectForLookup(null);
  }, []);

  const openQuote = useCallback((context?: string) => {
    setQuoteContext(context || '');
    setIsQuoteOpen(true);
  }, []);
  const closeQuote = useCallback(() => {
    setIsQuoteOpen(false);
    setQuoteContext('');
  }, []);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const openConsultation = useCallback((type?: string, projectCode?: string) => {
    setConsultationPrefillType(type);
    setConsultationPrefillProjectCode(projectCode);
    setIsConsultationModalOpen(true);
  }, []);
  const closeConsultation = useCallback(() => {
    setIsConsultationModalOpen(false);
    setConsultationPrefillType(undefined);
    setConsultationPrefillProjectCode(undefined);
  }, []);

  const openPdfReport = useCallback(() => setIsPdfReportModalOpen(true), []);
  const closePdfReport = useCallback(() => setIsPdfReportModalOpen(false), []);

  const openNotificationCenter = useCallback(() => setIsNotificationCenterOpen(true), []);
  const closeNotificationCenter = useCallback(() => setIsNotificationCenterOpen(false), []);

  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);

  const openShortcutsModal = useCallback(() => setIsShortcutsModalOpen(true), []);
  const closeShortcutsModal = useCallback(() => setIsShortcutsModalOpen(false), []);

  const openTour = useCallback(() => setIsTourOpen(true), []);
  const closeTour = useCallback(() => setIsTourOpen(false), []);

  const closeAllModals = useCallback(() => {
    setIsSimulatorOpen(false);
    setIsProjectLookupOpen(false);
    setIsQuoteOpen(false);
    setIsLoginOpen(false);
    setIsConsultationModalOpen(false);
    setIsPdfReportModalOpen(false);
    setIsNotificationCenterOpen(false);
    setIsCommandPaletteOpen(false);
    setIsShortcutsModalOpen(false);
    setIsTourOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isSimulatorOpen,
        isProjectLookupOpen,
        isQuoteOpen,
        isLoginOpen,
        isConsultationModalOpen,
        isPdfReportModalOpen,
        isNotificationCenterOpen,
        isCommandPaletteOpen,
        isShortcutsModalOpen,
        isTourOpen,
        selectedProjectForLookup,
        quoteContext,
        consultationPrefillType,
        consultationPrefillProjectCode,
        openSimulator,
        closeSimulator,
        openProjectLookup,
        closeProjectLookup,
        openQuote,
        closeQuote,
        openLogin,
        closeLogin,
        openConsultation,
        closeConsultation,
        openPdfReport,
        closePdfReport,
        openNotificationCenter,
        closeNotificationCenter,
        openCommandPalette,
        closeCommandPalette,
        openShortcutsModal,
        closeShortcutsModal,
        openTour,
        closeTour,
        closeAllModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};
