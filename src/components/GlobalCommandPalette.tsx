import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Camera,
  Award,
  Layers,
  FileText,
  Calculator,
  Leaf,
  PhoneCall,
  Clock,
  Bell,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  X,
  Keyboard,
  Check,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Contrast,
  Zap,
  TrendingUp,
  ArrowLeftRight
} from 'lucide-react';
import { isMacUser } from '../hooks/useKeyboardShortcuts';
import { BOTANICAL_SPECIES, SEARCH_RESULTS } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';

export interface CommandItem {
  id: string;
  category: 'Ações Rápidas' | 'Espécies Botânicas' | 'Soluções & Produtos' | 'Laudos & Ferramentas' | 'Acessibilidade' | 'Desenvolvedor & QA';
  title: string;
  subtitle?: string;
  badge?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator: () => void;
  onOpenProjectLookup: () => void;
  onOpenQuote: (context?: string) => void;
  onTogglePortal: () => void;
  onOpenNotifications: () => void;
  onOpenShortcutsModal: () => void;
  onOpenConsultation?: () => void;
  onOpenProjectPdfReport?: () => void;
  onTriggerBreakTest?: () => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenSimulator,
  onOpenProjectLookup,
  onOpenQuote,
  onTogglePortal,
  onOpenNotifications,
  onOpenShortcutsModal,
  onOpenConsultation,
  onOpenProjectPdfReport,
  onTriggerBreakTest,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isMac = useMemo(() => isMacUser(), []);
  const modKey = isMac ? '⌘' : 'Ctrl+';

  const { isHighContrast, toggleHighContrast } = useAccessibility();

  // Reset query and focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Master commands registry
  const allCommands: CommandItem[] = useMemo(() => {
    const staticCommands: CommandItem[] = [
      {
        id: 'cmd-sim',
        category: 'Ações Rápidas',
        title: 'Abrir Simulador IA de Ambientes Biofílicos',
        subtitle: 'Calcule espécies, acústica e orçamento com inteligência artificial',
        badge: 'IA Exclusiva',
        icon: Camera,
        shortcut: `${modKey}M`,
        action: () => {
          onClose();
          onOpenSimulator();
        },
        keywords: ['simulador', 'ia', 'inteligencia', 'ambiente', 'reforma', 'orçamento', 'calculo', 'foto'],
      },
      {
        id: 'cmd-quiz',
        category: 'Ações Rápidas',
        title: 'Fazer Quiz de Diagnóstico de Perfil Biofílico (5 Perguntas)',
        subtitle: 'Descubra a combinação botânica e estilo arquitetônico ideal para seu escritório',
        badge: '5 Perguntas',
        icon: Leaf,
        action: () => {
          onClose();
          const elem = document.getElementById('biophilic-quiz');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['quiz', 'perfil', 'diagnostico', 'perguntas', 'ambiente', 'estilo', 'biofilico', 'escritorio', 'especies', 'recomendacao'],
      },
      {
        id: 'cmd-portal',
        category: 'Ações Rápidas',
        title: 'Acessar Portal do Arquiteto & Especificador',
        subtitle: 'Baixe arquivos BIM/CAD, memoriais e gerencie projetos técnicos',
        badge: 'Área Técnica',
        icon: Layers,
        shortcut: `${modKey}P`,
        action: () => {
          onClose();
          onTogglePortal();
        },
        keywords: ['portal', 'arquiteto', 'especificador', 'login', 'autenticação', 'projetos', 'bim', 'cad', 'revit'],
      },
      {
        id: 'cmd-lookup',
        category: 'Ações Rápidas',
        title: 'Consultar Status de Obra & Rastrear Pedido',
        subtitle: 'Acompanhe cronograma fabril e montagem com o código do projeto',
        badge: 'Rastreio',
        icon: Clock,
        shortcut: `${modKey}L`,
        action: () => {
          onClose();
          onOpenProjectLookup();
        },
        keywords: ['rastrear', 'obra', 'status', 'projeto', 'acompanhar', 'codigo', 'cronograma'],
      },
      {
        id: 'cmd-quote',
        category: 'Ações Rápidas',
        title: 'Solicitar Orçamento Personalizado & Amostras',
        subtitle: 'Receba proposta técnica comercial e maleta física para seu escritório',
        badge: 'Express',
        icon: PhoneCall,
        shortcut: `${modKey}Q`,
        action: () => {
          onClose();
          onOpenQuote('Solicitação via Busca Global');
        },
        keywords: ['orçamento', 'proposta', 'preço', 'amostra', 'contato', 'comercial', 'maleta'],
      },
      {
        id: 'cmd-consultation',
        category: 'Ações Rápidas',
        title: 'Agendar Consultoria Técnica com Engenharia (Calendly / Meet)',
        subtitle: 'Marque reunião de especificação, laudos ou compatibilização DWG/BIM',
        badge: 'Calendly & Meet',
        icon: Clock,
        action: () => {
          onClose();
          if (onOpenConsultation) {
            onOpenConsultation();
          }
        },
        keywords: ['agendar', 'consultoria', 'calendly', 'reuniao', 'meet', 'engenharia', 'compatibilizacao', 'visita', 'horario'],
      },
      {
        id: 'cmd-pdf-report',
        category: 'Laudos & Ferramentas',
        title: 'Gerar Laudo & Relatório Consolidado do Projeto em PDF',
        subtitle: 'Exportação executiva com dados da simulação, WELL/LEED e laudos IPT',
        badge: 'Download PDF',
        icon: FileText,
        action: () => {
          onClose();
          if (onOpenProjectPdfReport) {
            onOpenProjectPdfReport();
          }
        },
        keywords: ['pdf', 'laudo', 'relatorio', 'gerar', 'download', 'consolidado', 'leed', 'well', 'imprimir', 'exportar'],
      },
      {
        id: 'cmd-testimonials',
        category: 'Laudos & Ferramentas',
        title: 'Ver Depoimentos & Resultados de Impacto Biofílico',
        subtitle: 'Casos reais com dados de produtividade, acústica e certificações de clientes',
        badge: '5.0 ★ Avaliações',
        icon: Award,
        action: () => {
          onClose();
          const elem = document.getElementById('customer-testimonials');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['depoimentos', 'avaliacoes', 'cases', 'clientes', 'carrossel', 'impacto', 'produtividade', 'well'],
      },
      {
        id: 'cmd-notif',
        category: 'Ações Rápidas',
        title: 'Central de Notificações & Avisos em Tempo Real',
        subtitle: 'Alertas de status fabril, laudos e mensagens do assistente',
        icon: Bell,
        shortcut: `${modKey}N`,
        action: () => {
          onClose();
          onOpenNotifications();
        },
        keywords: ['notificações', 'alertas', 'avisos', 'mensagens', 'sino', 'novidades'],
      },
      {
        id: 'cmd-botanical-section',
        category: 'Laudos & Ferramentas',
        title: 'Ver Catálogo Botânico Completo & Laudos IPT',
        subtitle: 'Navegue pelas fichas técnicas de preservados, permanentes e musgos',
        icon: Leaf,
        shortcut: `${modKey}B`,
        action: () => {
          onClose();
          const elem = document.getElementById('botanical-catalog');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['botanica', 'plantas', 'especies', 'laudos', 'folhagens', 'ipt', 'acústica'],
      },
      {
        id: 'cmd-heatmap',
        category: 'Laudos & Ferramentas',
        title: 'Heatmap de Energia & Desempenho Acústico das Obras',
        subtitle: 'Matriz visual e gráficos Recharts com dados térmicos e NRC de todos os projetos',
        badge: 'Recharts IA',
        icon: Zap,
        action: () => {
          onClose();
          onTogglePortal();
        },
        keywords: ['heatmap', 'recharts', 'energia', 'acustica', 'nrc', 'hvac', 'grafico', 'dispersão', 'frequencias', 'desempenho'],
      },
      {
        id: 'cmd-leed-section',
        category: 'Laudos & Ferramentas',
        title: 'Calculadora de Créditos Sustentáveis LEED v4.1 & WELL v2',
        subtitle: 'Simule pontuação ambiental, economia de água e conforto acústico',
        badge: 'Green Building',
        icon: Calculator,
        action: () => {
          onClose();
          const elem = document.getElementById('leed-calculator');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['leed', 'well', 'sustentabilidade', 'creditos', 'pontos', 'agua', 'energia', 'green building'],
      },
      {
        id: 'cmd-roi-section',
        category: 'Laudos & Ferramentas',
        title: 'Calculadora de ROI Biofílico & Redução de Absenteísmo',
        subtitle: 'Projeção financeira Harvard COGfx, ganhos de produtividade e payback',
        badge: 'Novo ROI',
        icon: TrendingUp,
        action: () => {
          onClose();
          const elem = document.getElementById('biophilic-roi-calculator');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['roi', 'retorno', 'investimento', 'absenteismo', 'produtividade', 'harvard', 'financeiro', 'payback', 'economia', 'colaboradores'],
      },
      {
        id: 'cmd-matrix-section',
        category: 'Laudos & Ferramentas',
        title: 'Matriz Comparativa das Tecnologias Verticais (Modo Lado a Lado 1x1)',
        subtitle: 'Compare Preservado vs. Permanente vs. Natural Vivo com cálculo de Capex, Opex e TCO',
        badge: 'Lado a Lado',
        icon: ArrowLeftRight,
        action: () => {
          onClose();
          const elem = document.getElementById('comparison-matrix');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['matriz', 'comparativo', 'preservado', 'permanente', 'vivo', 'diferença', 'vantagens', 'lado a lado', 'tco', 'capex', 'opex', 'custo'],
      },
      {
        id: 'cmd-gallery-section',
        category: 'Laudos & Ferramentas',
        title: 'Galeria Interativa Antes & Depois',
        subtitle: 'Veja transformações reais em ambientes corporativos e residenciais',
        icon: Eye,
        action: () => {
          onClose();
          const elem = document.getElementById('before-after-gallery');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        },
        keywords: ['galeria', 'fotos', 'antes e depois', 'cases', 'projetos reais', 'slider'],
      },
      {
        id: 'cmd-contrast',
        category: 'Acessibilidade',
        title: isHighContrast ? 'Desativar Modo Alto Contraste' : 'Ativar Modo Alto Contraste (WCAG AA)',
        subtitle: 'Otimiza contraste visual para maior legibilidade e conforto óptico',
        icon: Contrast,
        shortcut: `${modKey}H`,
        action: () => {
          toggleHighContrast();
        },
        keywords: ['acessibilidade', 'alto contraste', 'preto e branco', 'wcag', 'visao', 'leitura'],
      },
      {
        id: 'cmd-shortcuts',
        category: 'Acessibilidade',
        title: 'Ver Guia Completo de Atalhos de Teclado',
        subtitle: 'Explore todas as teclas de atalho disponíveis para navegação rápida',
        badge: 'Ajuda',
        icon: Keyboard,
        shortcut: '?',
        action: () => {
          onClose();
          onOpenShortcutsModal();
        },
        keywords: ['atalhos', 'teclado', 'shortcuts', 'ajuda', 'comandos', 'hotkeys'],
      },
      {
        id: 'cmd-dev-break',
        category: 'Desenvolvedor & QA',
        title: '💥 Break Component (Simular Erro no ErrorBoundary)',
        subtitle: 'Provoca uma falha proposital no Catálogo para testar a tela Oops! e o botão Reload',
        badge: 'QA Teste',
        icon: Zap,
        action: () => {
          onClose();
          if (onTriggerBreakTest) {
            onTriggerBreakTest();
          }
        },
        keywords: ['break', 'quebrar', 'erro', 'crash', 'errorboundary', 'oops', 'reload', 'qa', 'dev', 'teste'],
      },
    ];

    // Dynamic botanical items
    const botanicalCommands: CommandItem[] = BOTANICAL_SPECIES.map((specie) => ({
      id: `specie-${specie.id}`,
      category: 'Espécies Botânicas',
      title: specie.name,
      subtitle: `${specie.line} • ${specie.acousticAbsorption}`,
      badge: specie.category === 'preservado' ? '100% Natural' : 'Anti-UV',
      icon: Leaf,
      action: () => {
        onClose();
        const elem = document.getElementById('botanical-catalog');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      },
      keywords: [
        specie.name.toLowerCase(),
        specie.scientificName.toLowerCase(),
        specie.category,
        specie.tactileFeel.toLowerCase(),
        ...specie.idealEnvironments.map((e) => e.toLowerCase()),
      ],
    }));

    // Dynamic search catalog products
    const productCommands: CommandItem[] = SEARCH_RESULTS.map((prod) => ({
      id: `prod-${prod.id}`,
      category: 'Soluções & Produtos',
      title: prod.title,
      subtitle: `${prod.code} • ${prod.description}`,
      badge: prod.badge,
      icon: Layers,
      action: () => {
        onClose();
        onOpenQuote(`Interesse em ${prod.title} (${prod.code})`);
      },
      keywords: [prod.title.toLowerCase(), prod.code.toLowerCase(), prod.category.toLowerCase(), ...prod.tags],
    }));

    return [...staticCommands, ...botanicalCommands, ...productCommands];
  }, [
    isMac,
    modKey,
    isHighContrast,
    onClose,
    onOpenSimulator,
    onTogglePortal,
    onOpenProjectLookup,
    onOpenQuote,
    onOpenNotifications,
    onOpenShortcutsModal,
    toggleHighContrast,
  ]);

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return allCommands;

    return allCommands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(cleanQuery);
      const matchSubtitle = cmd.subtitle?.toLowerCase().includes(cleanQuery) || false;
      const matchCategory = cmd.category.toLowerCase().includes(cleanQuery);
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(cleanQuery)) || false;
      return matchTitle || matchSubtitle || matchCategory || matchKeywords;
    });
  }, [allCommands, query]);

  // Ensure selected index is within bounds
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  // Handle keyboard navigation inside the command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      scrollSelectedIntoView((selectedIndex + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
      scrollSelectedIntoView((selectedIndex - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredCommands[selectedIndex];
      if (current) {
        current.action();
      }
    }
  };

  const scrollSelectedIntoView = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const item = list.children[index] as HTMLElement | undefined;
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      {/* Dark Translucent Backdrop */}
      <div
        className="fixed inset-0 bg-[#072a1a]/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden z-10 flex flex-col my-auto transition-all animate-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Header Search Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-[#f8faf9] flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0 border border-emerald-300">
            <Search className="w-5 h-5 text-[#15803d]" />
          </div>

          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              id="command-palette-title"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Digite um comando, produto, laudo ou atalho..."
              className="w-full bg-transparent border-none text-base sm:text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-md cursor-pointer"
            >
              Limpar
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            title="Fechar busca rápida (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100 p-2 sm:p-3 space-y-1 focus:outline-none"
          role="listbox"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-700">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Tente buscar por termos como "Simulador", "Musgo", "LEED", "Orçamento" ou "Arquiteto".
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-emerald-50 text-[#072a1a] shadow-xs ring-1 ring-emerald-300'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#072a1a] text-[#86efac]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm truncate text-gray-900">
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-[#072a1a] border border-emerald-200">
                            {cmd.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-gray-600 hidden md:inline">
                          • {cmd.category}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Shortcut / Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.shortcut ? (
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-white text-gray-700 border border-gray-300 shadow-2xs">
                        {cmd.shortcut}
                      </kbd>
                    ) : (
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSelected ? 'translate-x-0.5 text-emerald-700' : ''}`} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Keyboard Hints */}
        <div className="p-3 sm:p-4 bg-[#f8faf9] border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold shadow-2xs">
                ↓
              </kbd>
              <span>Navegar</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold shadow-2xs">
                ↵
              </kbd>
              <span>Selecionar</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono font-bold shadow-2xs">
                ESC
              </kbd>
              <span>Fechar</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenShortcutsModal();
            }}
            className="inline-flex items-center gap-1 font-bold text-[#15803d] hover:text-[#072a1a] transition-colors cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Todos os Atalhos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
