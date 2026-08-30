import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Bug,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
  Layers,
  MessageSquareHeart,
  FileText,
  Trash2,
  Copy,
  Check,
  Clock,
  Send
} from 'lucide-react';
import { StoredFeedbackItem } from './ErrorFeedbackModal';

export type BreakableSectionKey = 
  | 'botanical' 
  | 'leed' 
  | 'roi' 
  | 'hero' 
  | 'gallery' 
  | 'solutions'
  | 'sandbox';

interface DevToolsWidgetProps {
  brokenSections: Record<string, boolean>;
  onBreakSection: (sectionKey: BreakableSectionKey) => void;
  onResetSection: (sectionKey: BreakableSectionKey) => void;
  onResetAllSections: () => void;
}

const SECTION_OPTIONS: { key: BreakableSectionKey; label: string; description: string }[] = [
  {
    key: 'botanical',
    label: 'Catálogo Botânico & Cuidados',
    description: 'Seção principal com grid de espécies e cartões inteligentes',
  },
  {
    key: 'leed',
    label: 'Calculadora LEED & WELL',
    description: 'Calculadora interativa de selos de sustentabilidade',
  },
  {
    key: 'roi',
    label: 'Calculadora de ROI Biofílico',
    description: 'Simulador de retorno sobre investimento e absenteísmo',
  },
  {
    key: 'solutions',
    label: 'Grid de Soluções & Produtos',
    description: 'Catálogo de linhas de produtos e acabamentos',
  },
  {
    key: 'gallery',
    label: 'Galeria Antes & Depois',
    description: 'Slider interativo de transformações de ambientes',
  },
  {
    key: 'hero',
    label: 'Hero Section Principal',
    description: 'Cabeçalho e hero interativo da página inicial',
  },
  {
    key: 'sandbox',
    label: 'Módulo de Teste Dedicado (Sandbox)',
    description: 'Componente isolado exclusivo para testes rápidos',
  },
];

export const DevToolsWidget: React.FC<DevToolsWidgetProps> = ({
  brokenSections,
  onBreakSection,
  onResetSection,
  onResetAllSections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'crash_test' | 'feedback_logs'>('crash_test');
  const [selectedSection, setSelectedSection] = useState<BreakableSectionKey>('botanical');
  const [feedbackLogs, setFeedbackLogs] = useState<StoredFeedbackItem[]>([]);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  const brokenCount = Object.values(brokenSections).filter(Boolean).length;

  const loadFeedbacks = () => {
    try {
      const stored = localStorage.getItem('allgreen_dev_feedbacks');
      if (stored) {
        setFeedbackLogs(JSON.parse(stored));
      } else {
        setFeedbackLogs([]);
      }
    } catch {
      setFeedbackLogs([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFeedbacks();
    }
  }, [isOpen]);

  const handleClearFeedbackLogs = () => {
    localStorage.removeItem('allgreen_dev_feedbacks');
    setFeedbackLogs([]);
  };

  const handleCopyLog = (item: StoredFeedbackItem) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopiedTicketId(item.id);
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  const handleTriggerBreak = () => {
    onBreakSection(selectedSection);
    // Scroll to the broken section if applicable so user can immediately see the ErrorBoundary
    setTimeout(() => {
      const sectionElementMap: Record<BreakableSectionKey, string> = {
        botanical: 'botanical-catalog',
        leed: 'leed-calculator',
        roi: 'biophilic-roi-calculator',
        solutions: 'solutions',
        gallery: 'before-after-gallery',
        hero: 'main-hero-section',
        sandbox: 'dev-sandbox-section',
      };
      const elementId = sectionElementMap[selectedSection];
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 150);
  };

  return (
    <>
      {/* Floating Trigger Pill (Fixed at Bottom-Right, above footer/banners) */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <button
          type="button"
          id="btn-open-dev-menu"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3.5 py-2.5 rounded-full text-xs font-bold shadow-xl border transition-all flex items-center gap-2 cursor-pointer ${
            brokenCount > 0
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 animate-pulse'
              : 'bg-[#072a1a]/95 hover:bg-[#15803d] text-[#86efac] border-emerald-500/30 backdrop-blur-md'
          }`}
          title="Abrir Menu de Desenvolvedor & Teste de Resiliência"
          aria-label="Abrir Menu de Desenvolvedor & Teste de Resiliência"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Dev Menu</span>
          {brokenCount > 0 ? (
            <span className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-mono font-extrabold">
              {brokenCount} crash{brokenCount > 1 ? 'es' : ''} ativo{brokenCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="px-1.5 py-0.2 bg-[#86efac]/20 text-[#86efac] text-[10px] rounded-full font-mono">
              QA & ErrorBoundary
            </span>
          )}
        </button>
      </div>

      {/* Developer Menu Modal / Drawer */}
      {isOpen && (
        <div
          id="dev-tools-overlay"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dev-menu-title"
        >
          <div
            id="dev-tools-modal-card"
            className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300 shrink-0">
                  <Bug className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h2 id="dev-menu-title" className="text-base sm:text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
                    Developer Menu & QA
                    <span className="text-[10px] bg-emerald-100 text-[#072a1a] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                      Periodic Health Monitor
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Simule falhas, valide o monitor periódico e inspecione feedbacks dos usuários.
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-dev-menu"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                title="Fechar Menu Dev"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Tabs: Test vs Feedback Logs */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('crash_test')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'crash_test'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simular Falhas (Break & Reload)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('feedback_logs');
                  loadFeedbacks();
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'feedback_logs'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Feedbacks Recebidos ({feedbackLogs.length})</span>
              </button>
            </div>

            {activeTab === 'crash_test' ? (
              <>
                {/* Explanatory Info Card */}
                <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#072a1a]">
                    <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                    <span>Monitor Periódico de Estabilidade Ativo:</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-emerald-800">
                    Ao quebrar um componente, o <strong>ErrorBoundary</strong> isola a falha e renderiza a tela <strong>'Oops!' com botão 'Reload'</strong>. Se o erro persistir por mais de 6 segundos, um lembrete periódico proativo oferece o formulário <strong>"Enviar Feedback aos Desenvolvedores"</strong> para reportar dados de diagnóstico.
                  </p>
                </div>

                {/* Section Selection */}
                <div className="space-y-2">
                  <label htmlFor="dev-section-select" className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    1. Selecione o Componente para quebrar:
                  </label>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {SECTION_OPTIONS.map((sec) => {
                      const isBroken = !!brokenSections[sec.key];
                      const isSelected = selectedSection === sec.key;

                      return (
                        <button
                          key={sec.key}
                          type="button"
                          onClick={() => setSelectedSection(sec.key)}
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#072a1a] bg-emerald-50/50 ring-2 ring-[#072a1a]/20'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-900">{sec.label}</span>
                              {isBroken && (
                                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] font-bold rounded-md border border-red-300">
                                  Oops! Ativo
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 truncate">{sec.description}</p>
                          </div>

                          <div className="shrink-0">
                            {isBroken ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onResetSection(sec.key);
                                }}
                                className="px-2 py-1 bg-white hover:bg-gray-100 text-xs text-[#072a1a] font-bold rounded-lg border border-gray-300 flex items-center gap-1 shadow-xs"
                                title="Restaurar individualmente"
                              >
                                <RefreshCw className="w-3 h-3 text-[#15803d]" />
                                <span>Reload</span>
                              </button>
                            ) : (
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#072a1a] bg-[#072a1a]' : 'border-gray-300'}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons: Break Component & Reset All */}
                <div className="pt-2 space-y-2.5 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    
                    {/* Break Component Button */}
                    <button
                      type="button"
                      id="btn-dev-break-component"
                      onClick={handleTriggerBreak}
                      className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>💥 Break Component (Simular Erro)</span>
                    </button>

                    {/* Reset All Button */}
                    <button
                      type="button"
                      id="btn-dev-reset-all"
                      onClick={onResetAllSections}
                      disabled={brokenCount === 0}
                      className={`px-4 py-3 font-bold text-xs sm:text-sm rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        brokenCount > 0
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] border-emerald-300'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4 text-[#15803d]" />
                      <span>Restaurar Todos</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center font-sans">
                    💡 Dica: Após provocar a falha, aguarde 6 segundos para testar a notificação periódica ou clique em <strong>"Enviar Feedback"</strong> diretamente no cartão do erro!
                  </p>
                </div>
              </>
            ) : (
              /* Feedback Logs Tab */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-semibold">
                    Relatórios enviados pelos usuários / desenvolvedores:
                  </span>
                  {feedbackLogs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearFeedbackLogs}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Histórico</span>
                    </button>
                  )}
                </div>

                {feedbackLogs.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <MessageSquareHeart className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-xs font-semibold text-gray-600">Nenhum feedback registrado ainda.</p>
                    <p className="text-[11px] text-gray-400">
                      Simule um erro na aba anterior e envie um feedback pelo ErrorBoundary para vê-lo listado aqui.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {feedbackLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 text-xs space-y-1.5 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[#072a1a] bg-emerald-100 px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                              #{log.id}
                            </span>
                            <span className="font-bold text-gray-900">{log.sectionName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-mono">
                              {new Date(log.createdAt).toLocaleTimeString('pt-BR')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyLog(log)}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200 cursor-pointer"
                              title="Copiar JSON"
                            >
                              {copiedTicketId === log.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-red-600 font-mono">
                          {log.errorName}: {log.errorMessage}
                        </p>

                        {log.userComment && (
                          <div className="p-2 bg-white rounded-lg border border-gray-100 text-[11px] text-gray-700 italic">
                            "{log.userComment}"
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-0.5">
                          <span>Impacto: <strong>{log.severity}</strong></span>
                          {log.userEmail && <span>E-mail: <strong>{log.userEmail}</strong></span>}
                          <span>Resolução: {log.viewport}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DevToolsWidget;
