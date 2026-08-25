import React, { useMemo } from 'react';
import {
  Keyboard,
  X,
  Sparkles,
  Search,
  Layers,
  Clock,
  PhoneCall,
  Leaf,
  Bell,
  Contrast,
  HelpCircle,
  CornerDownLeft,
  CheckCircle2
} from 'lucide-react';
import { isMacUser } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteShortcut?: (shortcutId: string) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onExecuteShortcut,
}) => {
  const isMac = useMemo(() => isMacUser(), []);
  const modKey = isMac ? '⌘' : 'Ctrl + ';

  if (!isOpen) return null;

  const shortcutSections = [
    {
      category: 'Navegação & Busca Inteligente',
      items: [
        {
          id: 'search',
          title: 'Busca Global & Paleta de Comandos',
          description: 'Abre a central de busca rápida por produtos, laudos e ferramentas',
          keys: [isMac ? '⌘' : 'Ctrl', 'K'],
          icon: Search,
        },
        {
          id: 'simulator',
          title: 'Simulador IA de Ambientes Biofílicos',
          description: 'Abre a ferramenta de cálculo botânico, acústico e investimento',
          keys: [isMac ? '⌘' : 'Ctrl', 'M'],
          icon: Sparkles,
        },
        {
          id: 'portal',
          title: 'Portal do Arquiteto & Especificador',
          description: 'Acessa área restrita de projetos, arquivos BIM/CAD e memoriais',
          keys: [isMac ? '⌘' : 'Ctrl', 'P'],
          icon: Layers,
        },
        {
          id: 'lookup',
          title: 'Rastrear Obra / Status de Projeto',
          description: 'Consulta o status de fabricação e montagem pelo código',
          keys: [isMac ? '⌘' : 'Ctrl', 'L'],
          icon: Clock,
        },
      ],
    },
    {
      category: 'Ações Técnicas & Catálogo',
      items: [
        {
          id: 'quote',
          title: 'Solicitar Orçamento Express',
          description: 'Abre o formulário de proposta técnica com suporte consultivo',
          keys: [isMac ? '⌘' : 'Ctrl', 'Q'],
          icon: PhoneCall,
        },
        {
          id: 'botanical',
          title: 'Catálogo Botânico & Laudos IPT',
          description: 'Navega instantaneamente para as espécies vegetais e laudos',
          keys: [isMac ? '⌘' : 'Ctrl', 'B'],
          icon: Leaf,
        },
        {
          id: 'notifications',
          title: 'Central de Notificações',
          description: 'Visualiza alertas de projetos, mensagens da IA e avisos',
          keys: [isMac ? '⌘' : 'Ctrl', 'N'],
          icon: Bell,
        },
      ],
    },
    {
      category: 'Acessibilidade & Controle de Telas',
      items: [
        {
          id: 'contrast',
          title: 'Modo Alto Contraste (WCAG AA)',
          description: 'Alterna tema de alto contraste para máxima legibilidade',
          keys: [isMac ? '⌘' : 'Ctrl', 'H'],
          icon: Contrast,
        },
        {
          id: 'shortcuts_help',
          title: 'Guia de Atalhos de Teclado',
          description: 'Exibe esta tela com a listagem completa de comandos',
          keys: ['?'],
          icon: HelpCircle,
        },
        {
          id: 'escape',
          title: 'Fechar Janela Aberta',
          description: 'Fecha qualquer modal, menu suspenso ou central de avisos',
          keys: ['Esc'],
          icon: CornerDownLeft,
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#072a1a]/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#f8faf9] border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#072a1a] text-[#86efac] flex items-center justify-center shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="shortcuts-title" className="text-lg sm:text-xl font-serif font-bold text-gray-900 leading-tight">
                Atalhos de Teclado Globais
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Navegação ultrarrápida e acessibilidade para usuários avançados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {shortcutSections.map((section) => (
            <div key={section.category} className="space-y-3">
              <h4 className="text-xs font-bold text-[#15803d] uppercase tracking-wider px-1">
                {section.category}
              </h4>

              <div className="bg-gray-50/80 rounded-2xl border border-gray-200/70 divide-y divide-gray-200/50 overflow-hidden">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-emerald-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white text-gray-700 border border-gray-200 flex items-center justify-center shrink-0 shadow-2xs">
                          <Icon className="w-4 h-4 text-[#15803d]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Key Badges & Optional Execute Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          {item.keys.map((k, kIdx) => (
                            <React.Fragment key={k}>
                              {kIdx > 0 && <span className="text-gray-400 text-xs font-bold">+</span>}
                              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800 shadow-2xs">
                                {k}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>

                        {onExecuteShortcut && item.id !== 'escape' && item.id !== 'shortcuts_help' && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onExecuteShortcut(item.id);
                            }}
                            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#072a1a] bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-md border border-emerald-300 transition-colors cursor-pointer ml-1"
                            title="Executar este comando agora"
                          >
                            <span>Testar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8faf9] border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
            <span>Pressione <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono font-bold">?</kbd> a qualquer momento para abrir esta janela</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#072a1a] text-[#86efac] font-bold hover:bg-[#0c3f27] transition-colors cursor-pointer text-xs"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
