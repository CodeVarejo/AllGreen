import React, { useState, useEffect } from 'react';
import {
  Mail,
  X,
  Send,
  CheckCircle2,
  FileText,
  Building,
  User,
  ShieldCheck,
  Award,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BiophilicProfileResult, UserProfile } from '../types';
import { generateBiophilicGuidePdf } from '../utils/generateBiophilicGuidePdf';
import { sendBiophilicReportEmail, SendReportResponse } from '../services/messagingService';
import confetti from 'canvas-confetti';

interface SendBiophilicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: BiophilicProfileResult;
  currentUser?: UserProfile | null;
}

export const SendBiophilicReportModal: React.FC<SendBiophilicReportModalProps> = ({
  isOpen,
  onClose,
  result,
  currentUser,
}) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [attachPdf, setAttachPdf] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<SendReportResponse | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

  // Pre-fill fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setDeliveryResult(null);
      setCopiedProtocol(false);

      if (currentUser) {
        setEmail(currentUser.email || '');
        setName(currentUser.name || '');
        setCompany(currentUser.company || '');
      } else {
        const saved = localStorage.getItem('allgreen_user_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setEmail(parsed.email || '');
            setName(parsed.name || '');
            setCompany(parsed.company || '');
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMsg('Por favor, digite um endereço de e-mail válido para envio.');
      return;
    }

    setIsSubmitting(true);

    try {
      let pdfBase64: string | undefined = undefined;

      if (attachPdf) {
        // Generate PDF document in memory
        const doc = generateBiophilicGuidePdf(result, {
          user: {
            name: name.trim() || currentUser?.name || 'Especificador Homologado',
            email: email.trim(),
            company: company.trim() || currentUser?.company || 'Estúdio de Arquitetura',
            cau_rrt: currentUser?.cau_rrt,
            role: currentUser?.role || 'arquiteto',
          },
          downloadImmediately: false,
        });

        // Extract base64 data without datauri header
        const dataUri = doc.output('datauristring');
        if (dataUri && dataUri.includes(',')) {
          pdfBase64 = dataUri.split(',')[1];
        }
      }

      // Dispatch through messaging service
      const response = await sendBiophilicReportEmail({
        recipientEmail: email.trim(),
        recipientName: name.trim() || 'Especificador Homologado',
        recipientCompany: company.trim(),
        recipientRole: currentUser?.role || 'arquiteto',
        recipientCau: currentUser?.cau_rrt,
        archetypeTitle: result.archetypeTitle,
        archetypeTagline: result.archetypeTagline,
        badge: result.badge,
        recommendedSolutionCode: result.recommendedSolutionCode,
        recommendedSolutionName: result.designStyle?.title || result.archetypeTitle,
        scoreWell: result.scoreWell,
        scoreLeed: result.scoreLeed,
        acousticNRC: result.acousticNRC,
        productivityBoost: result.productivityBoost,
        stressReduction: result.stressReduction,
        recommendedSpecies: result.recommendedSpecies?.map((s) => `${s.name} (${s.scientificName})`) || [],
        pdfBase64,
        notes: notes.trim() || undefined,
      });

      setDeliveryResult(response);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#86efac', '#15803d', '#072a1a', '#22c55e'],
        });
      } catch (err) {
        // ignore
      }
    } catch (err: any) {
      console.error('Failed to dispatch biophilic report:', err);
      setErrorMsg(err.message || 'Falha na conexão com o serviço de mensageria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyProtocol = () => {
    if (!deliveryResult?.messageId) return;
    navigator.clipboard.writeText(deliveryResult.messageId);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-emerald-900/20 my-auto max-h-[92dvh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900/80 border border-emerald-700/60 text-[#86efac] flex items-center justify-center shadow-inner">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold block">
                SERVIÇO DE MENSAGERIA ALL GREEN
              </span>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
                Enviar Laudo Técnico para E-mail
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {deliveryResult ? (
            /* ================= SUCCESS DISPATCH RECEIPT ================= */
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803d] flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-2xl text-[#072a1a]">
                  Laudo Despachado com Sucesso!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  O laudo técnico do seu perfil biofílico foi transmitido via serviço de mensageria para{' '}
                  <strong className="text-emerald-900">{deliveryResult.recipient}</strong>.
                </p>
              </div>

              {/* Transaction Receipt Card */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="text-gray-600 font-mono text-[11px]">PROTOCOLO DE DESPACHO:</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="font-mono text-[#072a1a] text-xs font-bold">
                      {deliveryResult.messageId}
                    </strong>
                    <button
                      type="button"
                      onClick={handleCopyProtocol}
                      className="p-1 text-gray-500 hover:text-[#072a1a] rounded cursor-pointer transition-colors"
                      title="Copiar protocolo"
                    >
                      {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Diagnóstico:</span>
                  <strong className="text-[#072a1a]">{result.archetypeTitle}</strong>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Código Homologado:</span>
                  <strong className="font-mono text-emerald-800">{result.recommendedSolutionCode}</strong>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Gateway de Envio:</span>
                  <span className="text-[11px] font-mono text-emerald-700 truncate max-w-[200px]">
                    {deliveryResult.provider || 'AllGreen Gateway'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Anexo PDF Oficial:</span>
                  <span className="font-bold text-emerald-700">
                    {deliveryResult.pdfAttached ? 'Anexado (2 páginas)' : 'Link Direto'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryResult(null);
                  }}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Enviar para Outro E-mail
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          ) : (
            /* ================= DISPATCH FORM ================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Card Preview */}
              <div className="p-3.5 bg-emerald-950 text-white rounded-2xl flex items-center justify-between gap-3 shadow-sm border border-emerald-800">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-extrabold uppercase text-[#86efac] tracking-wider">
                    {result.badge || 'PERFIL HOMOLOGADO'} • {result.recommendedSolutionCode}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                    {result.archetypeTitle}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80">
                    WELL: {result.scoreWell} pts • LEED: {result.scoreLeed} cr • NRC {result.acousticNRC}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-900/90 text-[#86efac] flex items-center justify-center shrink-0 border border-emerald-700">
                  <FileText className="w-4.5 h-4.5" />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Seu Endereço de E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@arquitetura.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-xs text-gray-900 focus:outline-none focus:border-[#072a1a] focus:bg-white transition-colors"
                  />
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">
                  O laudo técnico com gráficos, índices e diretrizes será enviado para esta caixa de entrada.
                </span>
              </div>

              {/* Name & Company Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Seu Nome / Arquiteto
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dra. Camila Valença"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-xs text-gray-900 focus:outline-none focus:border-[#072a1a] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Escritório / Construtora
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: Valença Arquitetura"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-xs text-gray-900 focus:outline-none focus:border-[#072a1a] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Observações ou Nome do Projeto (Opcional):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Estudo para recepção corporativa da sede Paulista"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-xs text-gray-900 focus:outline-none focus:border-[#072a1a] focus:bg-white transition-colors"
                />
              </div>

              {/* Attach PDF Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={attachPdf}
                  onChange={(e) => setAttachPdf(e.target.checked)}
                  className="w-4 h-4 text-[#15803d] rounded-sm focus:ring-[#15803d] border-gray-300 cursor-pointer"
                />
                <div className="text-xs leading-snug">
                  <strong className="text-[#072a1a] block">Anexar Laudo Técnico Executivo em PDF</strong>
                  <span className="text-gray-600 text-[11px]">
                    Arquivo de 2 páginas diagramado em alta resolução com especificações botânicas e selo auditável.
                  </span>
                </div>
              </label>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#86efac]" />
                      <span>Despachando via Mensageria...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Laudo para Meu E-mail</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
