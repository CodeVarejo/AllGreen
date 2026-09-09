import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Leaf,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { BiophilicChatMessage } from '../types';

interface BiophilicChatWidgetProps {
  onOpenSimulator?: () => void;
  onOpenQuote?: () => void;
}

const FAQ_SUGGESTIONS = [
  {
    id: 'faq-diff',
    label: 'Preservado vs Permanente',
    question: 'Qual a diferença entre jardim vertical preservado e jardim permanente anti-UV?'
  },
  {
    id: 'faq-maintenance',
    label: 'Manutenção & Irrigação',
    question: 'Como funciona a manutenção e por que as paredes verdes All Green não precisam de irrigação?'
  },
  {
    id: 'faq-leed',
    label: 'Créditos LEED & WELL',
    question: 'Como os jardins verticais All Green ajudam a pontuar em certificações LEED e WELL?'
  },
  {
    id: 'faq-plugplay',
    label: 'Módulos Plug & Play',
    question: 'Como funciona o sistema modular Plug & Play 100x50cm e como é feita a instalação?'
  },
  {
    id: 'faq-acoustics',
    label: 'Absorção Acústica',
    question: 'Qual o ganho de conforto acústico e redução de decibéis em ambientes corporativos?'
  }
];

const INITIAL_MESSAGE: BiophilicChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: 'Olá! Sou o Assistente Especialista da **All Green Decor & Biophilia**.\n\nEstou à disposição para responder dúvidas técnicas e arquitetônicas sobre nossas **metodologias de biofilia**, incluindo:\n• Jardins verticais preservados (100% naturais com estabilização ecológica)\n• Jardins permanentes com proteção anti-UVA/UVB\n• Sistema construtivo modular Plug & Play 100x50cm\n• Desempenho acústico (NRC até 0.89) e pontuação em certificações LEED & WELL\n\nComo posso orientar seu projeto hoje?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const BiophilicChatWidget: React.FC<BiophilicChatWidgetProps> = ({
  onOpenSimulator,
  onOpenQuote
}) => {
  const [messages, setMessages] = useState<BiophilicChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isExpanded]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: BiophilicChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history format for API
      const historyPayload = newMessages
        .filter(m => m.id !== 'msg-welcome')
        .slice(-6)
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          text: m.text
        }));

      const res = await fetch('/api/biophilic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const assistantReply: BiophilicChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantReply]);
      } else {
        throw new Error(data.message || 'Falha ao obter resposta do assistente.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorReply: BiophilicChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Desculpe, ocorreu uma oscilação na conexão com a IA. As metodologias da All Green destacam-se pelo design biofílico sustentável, 100% livre de rega, com painéis modulares Plug & Play e garantia de fábrica de 5 anos. Por favor, tente novamente ou fale com nossos consultores no WhatsApp.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputText('');
  };

  // Helper to format bold markdown and bullet points cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Format bold text (**bold**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-[#86efac]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-emerald-400 mt-0.5">•</span>
            <span className="leading-relaxed">{renderedParts.slice(1)}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="leading-relaxed my-1">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div
      id="allgreen-biophilic-chat-widget"
      className="w-full bg-[#072a1a] rounded-3xl border border-emerald-800/80 shadow-2xl overflow-hidden transition-all duration-300"
    >
      {/* Header Bar */}
      <div className="bg-[#051f13] px-5 py-4 border-b border-emerald-800/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-serif font-bold text-white tracking-wide">
                Assistente Biofílico All Green
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-[#86efac] border border-emerald-700/80 rounded-full">
                <Bot className="w-2.5 h-2.5 text-[#86efac]" />
                Gemini 3.8 IA
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Dúvidas frequentes sobre metodologias, espécies e certificações
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="biophilic-chat-reset-btn"
            onClick={handleResetChat}
            className="p-1.5 text-gray-400 hover:text-white bg-emerald-900/50 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar conversa"
            aria-label="Reiniciar conversa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id="biophilic-chat-toggle-collapse-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-gray-400 hover:text-white bg-emerald-900/50 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title={isExpanded ? 'Recolher chat' : 'Expandir chat'}
            aria-label={isExpanded ? 'Recolher chat' : 'Expandir chat'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-emerald-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-emerald-300" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Quick FAQ Suggestion Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Perguntas Frequentes Rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FAQ_SUGGESTIONS.map(faq => (
                <button
                  key={faq.id}
                  id={`faq-btn-${faq.id}`}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(faq.question)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-800/80 transition-all cursor-pointer disabled:opacity-50 text-left"
                >
                  {faq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Feed */}
          <div
            id="biophilic-chat-feed"
            className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent rounded-xl bg-emerald-950/50 p-3 sm:p-4 border border-emerald-900/60"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-900 border border-emerald-700 text-[#86efac] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Leaf className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-[#15803d] text-white rounded-br-none'
                      : 'bg-[#062416] text-gray-200 border border-emerald-800/80 rounded-tl-none'
                  }`}
                >
                  <div>{renderFormattedContent(msg.text)}</div>
                  <span
                    className={`block text-[9px] mt-1.5 text-right font-mono ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-emerald-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-in fade-in">
                <div className="w-7 h-7 rounded-lg bg-emerald-900 border border-emerald-700 text-[#86efac] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-[#062416] border border-emerald-800/80 rounded-2xl rounded-tl-none p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#86efac]" />
                  <span>Consultando base técnica da All Green com Gemini...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-300">
            <div className="flex items-center gap-3">
              {onOpenSimulator && (
                <button
                  type="button"
                  id="chat-quick-sim-btn"
                  onClick={onOpenSimulator}
                  className="text-emerald-300 hover:text-white font-semibold cursor-pointer underline underline-offset-2 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#86efac]" />
                  <span>Testar no Simulador IA</span>
                </button>
              )}
              {onOpenQuote && (
                <button
                  type="button"
                  id="chat-quick-quote-btn"
                  onClick={onOpenQuote}
                  className="text-emerald-300 hover:text-white font-semibold cursor-pointer underline underline-offset-2"
                >
                  Solicitar Proposta Comercial
                </button>
              )}
            </div>

            <a
              href="https://wa.me/5511912720799?text=Ol%C3%A1%2C%20estava%20conversando%20com%20o%20assistente%20da%20All%20Green%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20t%C3%A9cnica."
              target="_blank"
              rel="noopener noreferrer"
              id="chat-quick-whatsapp-link"
              className="text-emerald-300 hover:text-[#86efac] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Falar com consultor humano</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                id="biophilic-chat-input"
                type="text"
                value={inputText}
                disabled={isLoading}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pergunte sobre manutenção, espécies, certificação LEED, módulos..."
                className="w-full pl-4 pr-4 py-2.5 bg-emerald-950/90 rounded-xl border border-emerald-700/80 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#86efac] focus:ring-1 focus:ring-[#86efac] disabled:opacity-50"
              />
            </div>

            <button
              id="biophilic-chat-send-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-[#86efac] text-[#072a1a] font-bold rounded-xl text-xs hover:bg-emerald-300 transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              title="Enviar pergunta"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
