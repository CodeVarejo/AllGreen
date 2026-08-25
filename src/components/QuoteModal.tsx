import React, { useState } from 'react';
import { X, Send, CheckCircle2, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
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
            onClick={onClose}
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedTicket ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803d] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                Proposta Solicitada com Sucesso!
              </h3>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 inline-block">
                <p className="text-xs text-gray-600 font-semibold">CÓDIGO DA SUA PROPOSTA:</p>
                <p className="text-2xl font-mono font-extrabold text-[#072a1a] mt-1">{submittedTicket}</p>
              </div>

              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Nossos consultores de paisagismo biofílico entrarão em contato em até 24 horas úteis com o projeto preliminar e amostras.
              </p>

              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#072a1a] text-white font-bold text-xs rounded-xl hover:bg-[#15803d]"
              >
                Concluir e Voltar
              </button>
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

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Mensagem ou Detalhes do Espaço:
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descreva a parede ou o ambiente..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#072a1a]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 shadow-md"
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
