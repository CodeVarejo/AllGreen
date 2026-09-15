import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  BrainCircuit,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  HelpCircle,
  Volume2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface TourStep {
  id: string;
  targetId: string;
  mobileTargetId?: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  actionHint?: string;
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator: () => void;
  onScrollToQuiz: () => void;
  onOpenPortal: () => void;
}

const STORAGE_KEY = 'allgreen_onboarding_completed_v1';

export const GuidedTour: React.FC<GuidedTourProps> = ({
  isOpen,
  onClose,
  onOpenSimulator,
  onScrollToQuiz,
  onOpenPortal,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = useMemo(
    () => [
      {
        id: 'welcome',
        targetId: 'header-brand-logo',
        title: 'Bem-vindo à All Green Decor',
        tagline: 'Biofilia Digital & Paisagismo Turnkey',
        description:
          'Transforme seu ambiente corporativo ou residencial com jardins verticais preservados e permanentes de alta fidelidade. Preparamos um breve tour para apresentar as ferramentas mais inovadoras da plataforma.',
        icon: Sparkles,
        primaryActionLabel: 'Começar Tour Guiado',
        actionHint: 'Apenas 3 passos rápidos',
      },
      {
        id: 'simulator',
        targetId: 'header-simulator-cta-btn',
        mobileTargetId: 'header-simulator-cta-btn',
        title: '1. Simulador de Ambientes por IA',
        tagline: 'Visualize antes mesmo de instalar',
        description:
          'Envie uma foto da sua parede e veja a inteligência artificial projetar uma composição botânica realista com cálculo paramétrico de m², absorção acústica e estimativa de investimento.',
        icon: Camera,
        primaryActionLabel: 'Abrir Simulador Agora',
        onPrimaryAction: () => {
          onClose();
          onOpenSimulator();
        },
        actionHint: 'Disponível também via atalho ⌘+M',
      },
      {
        id: 'quiz',
        targetId: 'nav-link-quiz',
        mobileTargetId: 'biophilic-quiz',
        title: '2. Quiz de Diagnóstico Biofílico',
        tagline: 'Descubra o arquétipo ideal para o seu espaço',
        description:
          'Em 5 perguntas técnicas sobre luminosidade, acústica e bem-estar, receba uma curadoria vegetal personalizada com créditos LEED/WELL e laudo técnico para download em PDF.',
        icon: BrainCircuit,
        primaryActionLabel: 'Ir para o Quiz Biofílico',
        onPrimaryAction: () => {
          onClose();
          onScrollToQuiz();
        },
        actionHint: 'Gera Guia Botânico Oficial em PDF',
      },
      {
        id: 'portal',
        targetId: 'header-portal-cta-btn',
        mobileTargetId: 'footer-portal-link',
        title: '3. Portal do Arquiteto & Especificador',
        tagline: 'BIM, CAD, Laudos e Dossiês Técnicos',
        description:
          'Área restrita para profissionais de arquitetura e design com biblioteca de famílias Revit (.rfa), blocos SketchUp, ensaios de flamabilidade NBR 16626 e solicitação de maleta de amostras físicas.',
        icon: UserCheck,
        primaryActionLabel: 'Conhecer o Portal',
        onPrimaryAction: () => {
          onClose();
          onOpenPortal();
        },
        actionHint: 'Acesso imediato para especificadores',
      },
    ],
    [onClose, onOpenSimulator, onScrollToQuiz, onOpenPortal]
  );

  const currentStep = steps[currentStepIndex];

  // Calculate target element rect for spotlight highlight
  const updateTargetRect = useCallback(() => {
    if (!isOpen || !currentStep) return;

    let targetEl: HTMLElement | null = null;
    const isMobile = window.innerWidth < 1024;

    if (isMobile && currentStep.mobileTargetId) {
      targetEl = document.getElementById(currentStep.mobileTargetId);
    }
    if (!targetEl && currentStep.targetId) {
      targetEl = document.getElementById(currentStep.targetId);
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      // If target is off-screen, gently scroll into view
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (targetEl) {
            setTargetRect(targetEl.getBoundingClientRect());
          }
        }, 300);
      } else {
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#86efac', '#15803d', '#072a1a', '#22c55e'],
      });
    } catch (e) {}

    onClose();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
  };

  if (!isOpen) return null;

  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      <div
        id="guided-tour-overlay"
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Tour Guiado de Recursos All Green"
      >
        {/* Semi-transparent Dimmed Backdrop with SVG Hole Spotlight if target exists */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#051f13]/80 backdrop-blur-xs transition-opacity duration-300"
          onClick={handleSkip}
        />

        {/* Dynamic Spotlight Glow Ring over target element if visible on viewport */}
        {targetRect && (
          <div
            className="fixed pointer-events-none transition-all duration-300 z-[111] rounded-2xl ring-4 ring-[#86efac] ring-offset-4 ring-offset-[#072a1a]/80 shadow-[0_0_35px_rgba(134,239,172,0.6)]"
            style={{
              top: Math.max(8, targetRect.top - 6),
              left: Math.max(8, targetRect.left - 6),
              width: targetRect.width + 12,
              height: targetRect.height + 12,
            }}
          />
        )}

        {/* Guided Tour Modal Card */}
        <motion.div
          id="guided-tour-card"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[112] w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Gradient Ribbon */}
          <div className="h-2 bg-gradient-to-r from-[#072a1a] via-[#15803d] to-[#86efac]" />

          {/* Modal Header */}
          <div className="p-6 sm:p-7 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#072a1a] text-[#86efac] flex items-center justify-center shadow-md shrink-0">
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803d] bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {currentStep.tagline}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#072a1a] leading-tight">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-tour"
                onClick={handleSkip}
                aria-label="Pular e fechar tour guiado"
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-4 font-normal">
              {currentStep.description}
            </p>

            {/* Action Hint / Shortcut */}
            {currentStep.actionHint && (
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-[11px] font-semibold text-[#072a1a] border border-emerald-200/60">
                <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
                <span>{currentStep.actionHint}</span>
              </div>
            )}
          </div>

          {/* Progress Indicators & Quick Nav */}
          <div className="px-6 sm:px-7 py-2 flex items-center justify-between border-t border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center gap-2">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  id={`tour-dot-${s.id}`}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-7 bg-[#072a1a]'
                      : idx < currentStepIndex
                      ? 'w-2.5 bg-[#15803d]'
                      : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para etapa ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-bold text-gray-500 font-mono">
              Etapa {currentStepIndex + 1} de {steps.length}
            </span>
          </div>

          {/* Action Footer */}
          <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  id="btn-tour-prev"
                  onClick={handlePrev}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-tour-skip"
                  onClick={handleSkip}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors py-2 px-2 cursor-pointer"
                >
                  Pular introdução
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStep.onPrimaryAction && (
                <button
                  type="button"
                  id="btn-tour-primary-action"
                  onClick={currentStep.onPrimaryAction}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-[#072a1a] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{currentStep.primaryActionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                id="btn-tour-next"
                onClick={handleNext}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {currentStepIndex === steps.length - 1 ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#86efac]" />
                    <span>Concluir Tour</span>
                  </>
                ) : (
                  <>
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
