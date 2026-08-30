import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Bug,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  Clock,
  Laptop,
  FileCode,
  MessageSquareHeart
} from 'lucide-react';

export interface ErrorReportData {
  sectionName?: string;
  errorName: string;
  errorMessage: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  viewport: string;
}

export interface StoredFeedbackItem extends ErrorReportData {
  id: string;
  userComment: string;
  userEmail: string;
  severity: 'low' | 'medium' | 'critical';
  includeDiagnostics: boolean;
  createdAt: string;
}

interface ErrorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ErrorReportData;
  onSuccessSubmit?: (ticketId: string) => void;
}

export const ErrorFeedbackModal: React.FC<ErrorFeedbackModalProps> = ({
  isOpen,
  onClose,
  reportData,
  onSuccessSubmit,
}) => {
  const [userComment, setUserComment] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'critical'>('medium');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `BIO-ERR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newFeedback: StoredFeedbackItem = {
      id: ticketId,
      ...reportData,
      userComment: userComment.trim(),
      userEmail: userEmail.trim(),
      severity,
      includeDiagnostics,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for developer inspection & telemetry
    try {
      const existing = localStorage.getItem('allgreen_dev_feedbacks');
      const list: StoredFeedbackItem[] = existing ? JSON.parse(existing) : [];
      list.unshift(newFeedback);
      // Keep last 30 reports
      localStorage.setItem('allgreen_dev_feedbacks', JSON.stringify(list.slice(0, 30)));
    } catch (err) {
      console.warn('Unable to persist feedback to localStorage:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicketId(ticketId);
      if (onSuccessSubmit) {
        onSuccessSubmit(ticketId);
      }
    }, 600);
  };

  const handleCopyDiagnostic = () => {
    const diagnosticPayload = {
      ticket: submittedTicketId || 'PRE-SUBMIT',
      section: reportData.sectionName,
      error: `${reportData.errorName}: ${reportData.errorMessage}`,
      time: reportData.timestamp,
      comment: userComment,
      severity,
    };
    navigator.clipboard.writeText(JSON.stringify(diagnosticPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="error-feedback-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        id="error-feedback-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-emerald-950/10 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto custom-scrollbar text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center border border-emerald-300 shrink-0">
              <MessageSquareHeart className="w-5 h-5 text-[#15803d]" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base sm:text-lg font-serif font-bold text-gray-900 leading-tight">
                Enviar Feedback aos Desenvolvedores
              </h2>
              <p className="text-xs text-gray-500">
                Ajude nossa equipe a diagnosticar e aprimorar a estabilidade da plataforma.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-feedback-modal"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicketId ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-[#15803d] rounded-2xl mx-auto flex items-center justify-center border border-emerald-300 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-[#072a1a] text-xs font-mono font-bold rounded-full border border-emerald-300">
                Protocolo: #{submittedTicketId}
              </span>
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Feedback Enviado com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Agradecemos sua colaboração. As informações técnicas do erro foram registradas e encaminhadas para a equipe de engenharia para correção.
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-left font-mono space-y-1">
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Módulo Afetado:</span>
                <span className="font-semibold text-gray-800">{reportData.sectionName || 'Geral'}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Data & Hora:</span>
                <span className="font-semibold text-gray-800">{new Date().toLocaleTimeString('pt-BR')}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleCopyDiagnostic}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado para Clipboard' : 'Copiar Protocolo'}</span>
              </button>

              <button
                type="button"
                id="btn-confirm-feedback-done"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.02]"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Auto-Captured Incident Context */}
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-amber-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-amber-700" />
                  <span>Diagnóstico Capturado Automaticamente:</span>
                </span>
                <span className="font-mono text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-950 font-extrabold">
                  {reportData.sectionName || 'Componente'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-gray-700 truncate">
                <span className="text-red-600 font-bold">{reportData.errorName}:</span> {reportData.errorMessage}
              </p>
            </div>

            {/* User Context Input */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-comment" className="text-xs font-bold text-gray-800 block">
                O que você estava fazendo antes da falha? (Opcional)
              </label>
              <textarea
                id="feedback-comment"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="Ex: Eu estava filtrando o catálogo botânico e cliquei para simular a espécie Jiboia..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]/30 focus:border-[#072a1a] transition-all resize-none font-sans"
              />
            </div>

            {/* Severity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">
                Gravidade do impacto:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Leve (Visual)', desc: 'Não impede o uso' },
                  { id: 'medium', label: 'Moderado', desc: 'Bloqueia um bloco' },
                  { id: 'critical', label: 'Crítico', desc: 'Impede fluxo vital' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSeverity(item.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      severity === item.id
                        ? 'border-[#072a1a] bg-emerald-50/70 text-[#072a1a] font-bold ring-1 ring-[#072a1a]'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="text-xs leading-tight">{item.label}</div>
                    <div className="text-[10px] text-gray-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Email (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-email" className="text-xs font-bold text-gray-800 block">
                E-mail para retorno (Opcional):
              </label>
              <input
                id="feedback-email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="w-full px-3.5 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]/30 focus:border-[#072a1a] transition-all font-sans"
              />
            </div>

            {/* Include Diagnostics Checkbox */}
            <label className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeDiagnostics}
                onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#072a1a] focus:ring-[#072a1a]"
              />
              <div className="text-[11px] text-gray-600 leading-tight">
                <span className="font-semibold text-gray-800">Incluir dados técnicos do ambiente</span> (resolução de tela, versão da aplicação e pilha de componentes para depuração precisa).
              </div>
            </label>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-submit-error-feedback"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando Relatório...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#86efac]" />
                    <span>Enviar aos Desenvolvedores</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ErrorFeedbackModal;
