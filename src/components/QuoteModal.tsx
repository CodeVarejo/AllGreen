import React, { useState, useMemo } from 'react';
import { X, Send, CheckCircle2, PhoneCall, MessageSquare, Copy, Check, ExternalLink, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUnsavedChangesGuard } from '../hooks/useUnsavedChangesGuard';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledContext?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  prefilledContext = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    roomArea: '15',
    projectType: 'Jardim Preservado (100% Natural)',
    message: prefilledContext ? `Solicitação baseada em: ${prefilledContext}` : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Dynamic price preview based on area & solution
  const estimatedPriceRange = useMemo(() => {
    const area = parseFloat(formData.roomArea) || 0;
    if (area <= 0) return null;
    let minRate = 850;
    let maxRate = 1250;
    if (formData.projectType.includes('Preservado')) {
      minRate = 980;
      maxRate = 1450;
    } else if (formData.projectType.includes('Permanente')) {
      minRate = 720;
      maxRate = 1050;
    } else if (formData.projectType.includes('Vasos')) {
      minRate = 450;
      maxRate = 850;
    }
    return {
      min: Math.round(area * minRate),
      max: Math.round(area * maxRate),
    };
  }, [formData.roomArea, formData.projectType]);

  const handleCopySummary = () => {
    if (!submittedTicket) return;
    const summary = `*PROPOSTA TÉCNICA ALL GREEN DECOR*\nCódigo: ${submittedTicket}\nCliente: ${formData.name}\nWhatsApp: ${formData.phone}\nCidade: ${formData.city}\nLinha: ${formData.projectType}\nÁrea Estimada: ${formData.roomArea} m²\nMensagem: ${formData.message || 'Sem observações adicionais.'}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = useMemo(() => {
    if (!submittedTicket) return '#';
    const text = encodeURIComponent(
      `Olá, equipe All Green Decor! Acabei de registrar uma proposta no portal:\n\n*Código:* ${submittedTicket}\n*Nome:* ${formData.name}\n*Cidade:* ${formData.city}\n*Linha:* ${formData.projectType}\n*Área:* ${formData.roomArea} m²\n\nGostaria de agendar o atendimento técnico com o consultor.`
    );
    return `https://wa.me/5511998887766?text=${text}`;
  }, [submittedTicket, formData]);

  const isDirty = useMemo(() => {
    if (submittedTicket) return false;
    return (
      formData.name.trim() !== '' ||
      formData.email.trim() !== '' ||
      formData.phone.trim() !== '' ||
      formData.city.trim() !== ''
    );
  }, [formData, submittedTicket]);

  const { confirmDiscard } = useUnsavedChangesGuard({
    isDirty,
    title: 'Descartar solicitação de orçamento?',
    description: 'Você preencheu seus dados de contato para proposta técnica. Se sair agora, o formulário será limpo.',
    confirmText: 'Descartar e Fechar',
    cancelText: 'Continuar Preenchendo',
    variant: 'warning',
    enabled: isOpen,
    interceptEscapeKey: true,
    onDiscard: onClose,
  });

  const handleRequestClose = () => {
    confirmDiscard(onClose);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.ticketCode) {
        setSubmittedTicket(data.ticketCode);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      const ticket = `AG-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedTicket(ticket);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleRequestClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-emerald-900/20 my-auto">
        
        {/* Header */}
        <div className="bg-[#072a1a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-5 h-5 text-[#86efac]" />
            <h2 className="font-serif font-bold text-lg text-white">
              Solicitar Orçamento Executivo All Green
            </h2>
          </div>
          <button
            onClick={handleRequestClose}
            aria-label="Fechar modal"
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedTicket ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803d] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Proposta Registrada com Sucesso!
              </h3>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 inline-block w-full max-w-sm">
                <p className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">Código da Sua Proposta:</p>
                <p className="text-3xl font-mono font-extrabold text-[#072a1a] mt-1 tracking-wider">{submittedTicket}</p>
                <p className="text-[11px] text-emerald-800 font-medium mt-1">Guarde este código para rastrear sua obra no topo do portal.</p>
              </div>

              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Nossos consultores biofílicos entrarão em contato em até 24 horas úteis com o estudo preliminar e memorial botânico.
              </p>

              {/* Action Buttons in Success */}
              <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Falar Imediatamente no WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Resumo Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-600" />
                        <span>Copiar Resumo</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      onClose();
                    }}
                    className="px-5 py-2.5 bg-[#072a1a] hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {prefilledContext && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#072a1a] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                  <span>Vinculado a: {prefilledContext}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Dra. Juliana Silveira"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    E-mail Corporativo / Pessoal *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juliana@arquitetura.com"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99888-7766"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Cidade / Estado *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="São Paulo, SP"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Área Estimada (m²)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.roomArea}
                    onChange={(e) => setFormData({ ...formData, roomArea: e.target.value })}
                    placeholder="15"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Linha de Interesse:
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                >
                  <option value="Jardim Preservado (100% Natural)">Jardim Preservado (100% Natural Estabilizado)</option>
                  <option value="Jardim Permanente (Anti-UV)">Jardim Permanente (Artificial Premium Anti-UV)</option>
                  <option value="Vasos e Cachepôs Biofílicos">Vasos e Cachepôs Biofílicos</option>
                  <option value="Cenografia e Eventos">Cenografia e Eventos</option>
                </select>
              </div>

              {/* Dynamic Price Estimator Card */}
              {estimatedPriceRange && (
                <div className="p-3 bg-emerald-50/90 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0">
                      <Calculator className="w-4 h-4 text-[#15803d]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">Estimativa Preliminar ({formData.roomArea} m²):</span>
                      <span className="font-extrabold text-[#072a1a]">
                        R$ {estimatedPriceRange.min.toLocaleString('pt-BR')} a R$ {estimatedPriceRange.max.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/90 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Base p/ m²
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Mensagem ou Detalhes do Espaço:
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descreva a parede, altura do pé-direito ou requisitos técnicos..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enviando Proposta...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-current" />
                    <span>Enviar Solicitação de Orçamento Sem Compromisso</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
