import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Home,
  LayoutDashboard,
  FolderKanban,
  ArrowLeftRight,
  Leaf,
  Download,
  Package,
  Calculator,
  Building,
  Copy,
  Check,
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';
import { PortalTabKey } from './portal/PortalTabs';

export interface BreadcrumbItem {
  label: string;
  code?: string;
  subtitle?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  tabKey?: PortalTabKey;
  onClick?: () => void;
  active?: boolean;
  badge?: string;
  tooltip?: string;
  copyableCode?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  backAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  theme?: 'light' | 'dark' | 'emerald';
  compactOnMobile?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  backAction,
  className = '',
  theme = 'light',
  compactOnMobile = true,
}) => {
  const isDark = theme === 'dark';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2200);
  };

  // If there are 4+ items and compactOnMobile is true, intermediate items can be collapsed in a quick dropdown
  const hasCollapse = compactOnMobile && items.length > 3;
  const firstItem = items[0];
  const lastItem = items[items.length - 1];
  const intermediateItems = items.slice(1, items.length - 1);

  return (
    <nav
      aria-label="Trilha de Navegação (Breadcrumb)"
      className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1.5 px-1 text-xs select-none ${className}`}
    >
      {/* Left: Responsive Breadcrumbs Trail */}
      <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none py-0.5">
        <ol className="flex items-center gap-1.5 sm:gap-2 font-medium whitespace-nowrap min-w-max">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;
            const Icon = item.icon;
            const hasCode = Boolean(item.code);

            return (
              <li key={index} className="flex items-center gap-1.5 sm:gap-2">
                {/* Separator */}
                {index > 0 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isDark ? 'text-emerald-500/60' : 'text-emerald-800/40'
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Interactive Clickable Item (not the last active item) */}
                {item.onClick && !isLast ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    title={item.tooltip || item.label}
                    className={`group px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold active:scale-95 text-xs min-h-[36px] sm:min-h-0 ${
                      isDark
                        ? 'text-emerald-200 hover:text-white hover:bg-emerald-900/60 border border-transparent hover:border-emerald-700/50'
                        : 'text-gray-700 hover:text-[#072a1a] hover:bg-emerald-50/90 border border-transparent hover:border-emerald-200 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    {Icon ? (
                      <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                        isDark ? 'text-[#86efac]' : 'text-[#15803d]'
                      }`} />
                    ) : isFirst ? (
                      <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#86efac]' : 'text-[#15803d]'}`} />
                    ) : null}

                    <span className="truncate max-w-[140px] sm:max-w-[180px] md:max-w-[240px]">
                      {item.label}
                    </span>

                    {item.code && (
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-[#072a1a] border border-emerald-300">
                        {item.code}
                      </span>
                    )}

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-800 text-[#86efac] text-[9px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ) : (
                  /* Active / Current Page Item */
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all min-h-[36px] sm:min-h-0 ${
                      isLast
                        ? isDark
                          ? 'bg-gradient-to-r from-emerald-950 to-[#072a1a] text-[#86efac] font-bold border border-emerald-500/40 shadow-sm'
                          : 'bg-gradient-to-r from-emerald-50 via-emerald-100/70 to-emerald-50 text-[#072a1a] font-bold border border-emerald-300/80 shadow-2xs'
                        : isDark
                        ? 'text-emerald-300'
                        : 'text-gray-600'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                    title={item.tooltip || (item.subtitle ? `${item.label} • ${item.subtitle}` : item.label)}
                  >
                    {Icon && (
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#86efac]' : 'text-[#15803d]'}`} />
                    )}

                    {/* Dedicated Project Code Pill (e.g. AG-8492) */}
                    {hasCode ? (
                      <div className="flex items-center gap-1.5">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#072a1a] text-[#86efac] font-mono font-bold text-xs border border-emerald-600/60 shadow-xs">
                          <span>{item.code}</span>
                          {item.copyableCode !== false && (
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(e, item.code!)}
                              className="p-0.5 hover:text-white rounded transition-colors cursor-pointer"
                              title={copiedCode === item.code ? 'Código copiado!' : 'Copiar código da obra'}
                              aria-label={`Copiar código ${item.code}`}
                            >
                              {copiedCode === item.code ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-emerald-300/80 hover:text-white" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Subtitle / Title if present */}
                        {item.subtitle && (
                          <span className="hidden xs:inline-block sm:inline-block max-w-[130px] sm:max-w-[200px] md:max-w-[280px] truncate text-xs font-semibold text-gray-800">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="truncate max-w-[160px] sm:max-w-[240px] md:max-w-[340px]">
                        {item.label}
                      </span>
                    )}

                    {/* Copied Feedback Badge */}
                    {item.code && copiedCode === item.code && (
                      <span className="text-[10px] text-[#15803d] font-bold bg-emerald-100 px-1.5 py-0.5 rounded animate-pulse">
                        Copiado!
                      </span>
                    )}

                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[10px] font-mono font-bold border border-emerald-600/40">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Right: Contextual Back Button */}
      {backAction && (
        <button
          type="button"
          onClick={backAction.onClick}
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer group active:scale-95 shrink-0 min-h-[36px] sm:min-h-0 ${
            isDark
              ? 'bg-emerald-950/90 hover:bg-emerald-900 text-[#86efac] hover:text-white border border-emerald-700/60'
              : 'bg-white hover:bg-emerald-50/80 text-[#072a1a] hover:text-[#15803d] border border-gray-200/90 hover:border-emerald-300'
          }`}
          aria-label={backAction.label}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#15803d] group-hover:-translate-x-1 transition-transform" />
          <span>{backAction.label}</span>
        </button>
      )}
    </nav>
  );
};

export default Breadcrumbs;

