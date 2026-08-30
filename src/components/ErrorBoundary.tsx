import React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Bug,
  HelpCircle,
  Layers,
  MessageSquareHeart,
  Send,
  Clock,
  Check,
  X
} from 'lucide-react';
import { ErrorFeedbackModal, ErrorReportData } from './ErrorFeedbackModal';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  sectionName?: string;
  isRoot?: boolean;
  /**
   * Interval in seconds after which the periodic feedback prompt is triggered if error remains unresolved.
   * Defaults to 6 seconds for fast user-friendly assistance during testing/production.
   */
  periodicPromptThresholdSeconds?: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
  // Periodic check & feedback state
  errorActiveSeconds: number;
  showPeriodicFeedbackPrompt: boolean;
  isPeriodicPromptDismissed: boolean;
  isFeedbackModalOpen: boolean;
  submittedTicketId: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private timerId: ReturnType<typeof setInterval> | null = null;

  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    retryCount: 0,
    errorActiveSeconds: 0,
    showPeriodicFeedbackPrompt: false,
    isPeriodicPromptDismissed: false,
    isFeedbackModalOpen: false,
    submittedTicketId: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorActiveSeconds: 0,
      showPeriodicFeedbackPrompt: false,
      isPeriodicPromptDismissed: false,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error(
      `[ErrorBoundary${this.props.sectionName ? ` - ${this.props.sectionName}` : ''}] Uncaught error caught by boundary:`,
      error,
      errorInfo
    );

    // Start periodic check timer when an error occurs
    this.startPeriodicErrorCheck();
  }

  public override componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState): void {
    // If state just transitioned to error, ensure timer is started
    if (this.state.hasError && !prevState.hasError) {
      this.startPeriodicErrorCheck();
    }
    // If state recovered from error, stop timer
    if (!this.state.hasError && prevState.hasError) {
      this.stopPeriodicErrorCheck();
    }
  }

  public override componentWillUnmount(): void {
    this.stopPeriodicErrorCheck();
  }

  /**
   * Starts a 1-second interval to periodically monitor whether the error state is still active.
   * When the active duration exceeds the threshold, it surfaces the proactive "Send Feedback" prompt.
   */
  private startPeriodicErrorCheck = (): void => {
    this.stopPeriodicErrorCheck();

    const threshold = this.props.periodicPromptThresholdSeconds || 6;

    this.timerId = setInterval(() => {
      if (this.state.hasError) {
        this.setState((prev) => {
          const nextDuration = prev.errorActiveSeconds + 1;
          const shouldPrompt = 
            !prev.isPeriodicPromptDismissed &&
            !prev.submittedTicketId &&
            nextDuration >= threshold;

          return {
            errorActiveSeconds: nextDuration,
            showPeriodicFeedbackPrompt: shouldPrompt ? true : prev.showPeriodicFeedbackPrompt,
          };
        });
      }
    }, 1000);
  };

  private stopPeriodicErrorCheck = (): void => {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  public resetErrorBoundary = (): void => {
    this.stopPeriodicErrorCheck();

    if (this.props.onReset) {
      this.props.onReset();
    }

    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prev.retryCount + 1,
      errorActiveSeconds: 0,
      showPeriodicFeedbackPrompt: false,
      isPeriodicPromptDismissed: false,
      isFeedbackModalOpen: false,
    }));
  };

  public toggleDetails = (): void => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public handleOpenFeedbackModal = (): void => {
    this.setState({ isFeedbackModalOpen: true });
  };

  public handleCloseFeedbackModal = (): void => {
    this.setState({ isFeedbackModalOpen: false });
  };

  public handleDismissPeriodicPrompt = (): void => {
    this.setState({
      showPeriodicFeedbackPrompt: false,
      isPeriodicPromptDismissed: true,
    });
  };

  public handleFeedbackSuccess = (ticketId: string): void => {
    this.setState({
      submittedTicketId: ticketId,
      showPeriodicFeedbackPrompt: false,
      isPeriodicPromptDismissed: true,
    });
  };

  private getReportData = (): ErrorReportData => {
    const { error, errorInfo } = this.state;
    const { sectionName } = this.props;

    return {
      sectionName: sectionName || (this.props.isRoot ? 'Aplicação Raiz (Root)' : 'Componente'),
      errorName: error?.name || 'Error',
      errorMessage: error?.message || 'Erro desconhecido na renderização',
      componentStack: errorInfo?.componentStack || undefined,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A',
    };
  };

  public override render(): React.ReactNode {
    const {
      hasError,
      error,
      errorInfo,
      showDetails,
      retryCount,
      errorActiveSeconds,
      showPeriodicFeedbackPrompt,
      isFeedbackModalOpen,
      submittedTicketId,
    } = this.state;

    const { fallback, sectionName, isRoot, children } = this.props;

    if (hasError) {
      // Custom fallback function or node if provided
      if (typeof fallback === 'function' && error) {
        return fallback({ error, resetErrorBoundary: this.resetErrorBoundary });
      }
      if (fallback && typeof fallback !== 'function') {
        return fallback;
      }

      const formattedSectionName = sectionName || 'deste componente';
      const reportData = this.getReportData();

      // Root / Full Page 'Oops!' UI
      if (isRoot) {
        return (
          <div
            id="root-error-boundary"
            className="min-h-screen bg-[#f3f7f4] text-[#072a1a] flex items-center justify-center p-4 sm:p-6 select-none"
            role="alert"
            aria-live="assertive"
          >
            <div className="max-w-xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-emerald-900/10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              
              {/* Friendly 'Oops!' Visual Header */}
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl mx-auto flex items-center justify-center border-2 border-amber-200 shadow-inner">
                  <span className="text-4xl select-none" role="img" aria-label="Oops emoji">
                    🌿
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 text-xs font-extrabold uppercase tracking-wider rounded-full border border-amber-300/60">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Oops! Ocorreu um imprevisto</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-tight">
                  Oops! Algo não saiu como esperado.
                </h1>

                <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto font-sans">
                  A aplicação encontrou uma instabilidade inesperada na interface. Suas configurações e dados salvos permanecem protegidos.
                </p>

                {/* Periodic Active Error Duration Badge */}
                <div className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-mono pt-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Estado ativo há {errorActiveSeconds}s</span>
                </div>
              </div>

              {/* Periodic Check "Send Feedback to Developers" Prompt Banner */}
              {showPeriodicFeedbackPrompt && (
                <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300/80 text-left space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-[#072a1a]">
                      <Sparkles className="w-4 h-4 text-[#15803d]" />
                      <span>Ajude a aprimorar a estabilidade da plataforma</span>
                    </div>
                    <button
                      type="button"
                      onClick={this.handleDismissPeriodicPrompt}
                      className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer"
                      title="Dispensar sugestão"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Identificamos que a recuperação ainda não ocorreu. Gostaria de enviar um relatório de diagnóstico para nossos desenvolvedores analisarem a causa?
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      id="btn-root-periodic-send-feedback"
                      onClick={this.handleOpenFeedbackModal}
                      className="px-3.5 py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Send className="w-3 h-3 text-[#86efac]" />
                      <span>Enviar Feedback aos Desenvolvedores</span>
                    </button>
                    <button
                      type="button"
                      onClick={this.handleDismissPeriodicPrompt}
                      className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                    >
                      Lembrar depois
                    </button>
                  </div>
                </div>
              )}

              {/* Submitted Feedback Confirmation Alert */}
              {submittedTicketId && (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Feedback registrado com sucesso (Protocolo #{submittedTicketId})</span>
                </div>
              )}

              {/* Primary Action Buttons: Reload / Refresh / Feedback */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  id="btn-error-root-reload"
                  onClick={this.resetErrorBoundary}
                  className="px-6 py-3.5 bg-[#072a1a] hover:bg-[#15803d] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4 text-[#86efac] animate-spin-hover" />
                  <span>Recarregar Aplicação (Reload)</span>
                </button>

                <button
                  type="button"
                  id="btn-error-root-feedback"
                  onClick={this.handleOpenFeedbackModal}
                  className="px-4 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-sm rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="Enviar diagnóstico para os engenheiros"
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#15803d]" />
                  <span>Feedback aos Devs</span>
                </button>

                <button
                  type="button"
                  id="btn-error-root-refresh"
                  onClick={() => window.location.reload()}
                  className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl border border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>Atualizar Página</span>
                </button>
              </div>

              {/* Technical Stack Trace Collapse */}
              {error && (
                <div className="border-t border-gray-100 pt-4 text-left">
                  <button
                    type="button"
                    onClick={this.toggleDetails}
                    className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-gray-800 font-semibold py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5 text-gray-400" />
                      <span>Detalhes técnicos para suporte</span>
                    </span>
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showDetails && (
                    <div className="mt-2.5 p-4 bg-gray-900 text-gray-100 text-xs font-mono rounded-2xl overflow-x-auto max-h-44 custom-scrollbar border border-gray-800 shadow-inner">
                      <p className="text-red-400 font-bold mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{error.name}: {error.message}</span>
                      </p>
                      {errorInfo?.componentStack && (
                        <pre className="text-[11px] text-gray-400 whitespace-pre-wrap leading-relaxed">
                          {errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Feedback Modal */}
            <ErrorFeedbackModal
              isOpen={isFeedbackModalOpen}
              onClose={this.handleCloseFeedbackModal}
              reportData={reportData}
              onSuccessSubmit={this.handleFeedbackSuccess}
            />
          </div>
        );
      }

      // Section-level 'Oops!' UI State (Component Crash Isolation)
      const elementIdSuffix = sectionName ? sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'section';

      return (
        <div
          id={`error-boundary-${elementIdSuffix}`}
          className="my-6 p-6 sm:p-8 bg-gradient-to-br from-white via-amber-50/30 to-emerald-50/20 rounded-3xl border-2 border-amber-200/80 shadow-md text-left relative overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
          role="alert"
          aria-live="polite"
        >
          {/* Top Decorative Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-[#072a1a]" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left: Friendly 'Oops!' Icon & Explanation */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300 shadow-xs mt-0.5">
                <span className="text-2xl select-none" role="img" aria-label="Oops">
                  ⚠️
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-amber-200/80 text-amber-950 font-mono font-extrabold text-[10px] rounded-md tracking-wider uppercase border border-amber-300">
                    Oops! Falha Isolada
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-[#072a1a] font-semibold text-[11px] rounded-full border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#15803d]" />
                    <span>Restante da página 100% ativo</span>
                  </span>
                  {retryCount > 0 && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      (Tentativas: {retryCount})
                    </span>
                  )}
                  {errorActiveSeconds > 0 && (
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{errorActiveSeconds}s</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-gray-900">
                  Oops! Ocorreu uma instabilidade em "{formattedSectionName}"
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl font-sans">
                  O sistema de proteção isolou este módulo para evitar que a página inteira ficasse em branco. Você pode restaurá-lo instantaneamente clicando em <strong>Recarregar (Reload)</strong>.
                </p>
              </div>
            </div>

            {/* Right: Primary Reload Action Button & Feedback Button */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                id={`btn-feedback-${elementIdSuffix}`}
                onClick={this.handleOpenFeedbackModal}
                className="w-full sm:w-auto px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs sm:text-sm rounded-xl border border-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                title="Enviar relatório de diagnóstico aos desenvolvedores"
              >
                <MessageSquareHeart className="w-4 h-4 text-[#15803d]" />
                <span>Enviar Feedback</span>
              </button>

              <button
                type="button"
                id={`btn-reload-${elementIdSuffix}`}
                onClick={this.resetErrorBoundary}
                className="w-full sm:w-auto px-5 py-3 bg-[#072a1a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Restaurar e recarregar este componente sem atualizar a página"
              >
                <RefreshCw className="w-4 h-4 text-[#86efac]" />
                <span>Recarregar (Reload)</span>
              </button>
            </div>
          </div>

          {/* Periodic Check "Send Feedback to Developers" Prompt Banner for Component */}
          {showPeriodicFeedbackPrompt && (
            <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 rounded-2xl border border-emerald-300 text-xs text-left animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-200/80 text-[#072a1a] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-[#15803d]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#072a1a] text-xs flex items-center gap-1.5">
                      <span>Notamos que a recuperação ainda não ocorreu ({errorActiveSeconds}s)</span>
                      <span className="bg-emerald-200/70 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                        Monitor de Estabilidade
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      Deseja enviar um relatório anônimo aos desenvolvedores para priorizarmos a correção deste componente?
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    id={`btn-periodic-send-feedback-${elementIdSuffix}`}
                    onClick={this.handleOpenFeedbackModal}
                    className="px-3 py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-3 h-3 text-[#86efac]" />
                    <span>Enviar Feedback</span>
                  </button>

                  <button
                    type="button"
                    onClick={this.handleDismissPeriodicPrompt}
                    className="px-2 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold cursor-pointer rounded-lg hover:bg-black/5"
                  >
                    Dispensar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Success Notification */}
          {submittedTicketId && (
            <div className="mt-3 p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Feedback registrado com sucesso (Protocolo #{submittedTicketId})</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-mono">
                Obrigado por colaborar!
              </span>
            </div>
          )}

          {/* Technical Details Accordion */}
          {error && (
            <div className="mt-4 pt-3.5 border-t border-amber-200/50">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="text-xs text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-black/5 transition-colors"
                >
                  <Bug className="w-3.5 h-3.5 text-gray-400" />
                  <span>{showDetails ? 'Ocultar detalhes técnicos' : 'Ver detalhes do erro para diagnóstico'}</span>
                  {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={this.handleOpenFeedbackModal}
                    className="text-[11px] text-[#15803d] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reportar aos Devs</span>
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                    React ErrorBoundary v2.1 • Periodic Health Monitor
                  </span>
                </div>
              </div>

              {showDetails && (
                <div className="mt-2.5 p-3.5 bg-gray-900 text-gray-200 text-xs font-mono rounded-xl overflow-x-auto max-h-40 custom-scrollbar border border-gray-800">
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-800">
                    <span className="text-red-400 font-bold">{error.name}: {error.message}</span>
                  </div>
                  {errorInfo?.componentStack && (
                    <pre className="text-[10px] text-gray-400 whitespace-pre-wrap leading-relaxed">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Feedback Modal */}
          <ErrorFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={this.handleCloseFeedbackModal}
            reportData={reportData}
            onSuccessSubmit={this.handleFeedbackSuccess}
          />
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
