import React from 'react';
import { LucideIcon, ArrowRight, ExternalLink } from 'lucide-react';

export interface PageHeaderAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  variant?: 'primary' | 'secondary' | 'emerald' | 'white' | 'outline' | 'ghost';
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}

export interface PageHeaderProps {
  badge?: string | React.ReactNode;
  badgeIcon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  primaryAction?: PageHeaderAction | React.ReactNode;
  secondaryAction?: PageHeaderAction | React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  align?: 'center' | 'left' | 'split';
  theme?: 'light' | 'dark' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  subtitle,
  primaryAction,
  secondaryAction,
  actions,
  breadcrumbs,
  align = 'center',
  theme = 'light',
  size = 'md',
  className = '',
  children,
}) => {
  const isDark = theme === 'dark' || theme === 'emerald';
  const descText = description || subtitle;

  const renderAction = (action: PageHeaderAction | React.ReactNode, isPrimary: boolean) => {
    if (!action) return null;
    if (React.isValidElement(action)) return action;

    const act = action as PageHeaderAction;
    const Icon = act.icon;
    const variant = act.variant || (isPrimary ? (isDark ? 'emerald' : 'primary') : 'secondary');

    let btnClasses = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[44px] active:scale-95 whitespace-nowrap shadow-xs ';

    if (variant === 'primary') {
      btnClasses += 'bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white border border-emerald-950/30 shadow-sm';
    } else if (variant === 'emerald') {
      btnClasses += 'bg-[#15803d] hover:bg-emerald-600 text-white shadow-sm';
    } else if (variant === 'white') {
      btnClasses += 'bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-200 shadow-sm';
    } else if (variant === 'outline') {
      btnClasses += isDark
        ? 'bg-transparent hover:bg-emerald-900/60 text-[#86efac] border border-emerald-500/60'
        : 'bg-transparent hover:bg-emerald-50 text-[#072a1a] border border-emerald-800/30';
    } else if (variant === 'ghost') {
      btnClasses += isDark
        ? 'bg-transparent hover:bg-emerald-900/40 text-emerald-200'
        : 'bg-transparent hover:bg-gray-100 text-gray-700';
    } else {
      // secondary default
      btnClasses += isDark
        ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-700/60'
        : 'bg-white hover:bg-emerald-50/80 text-gray-800 border border-gray-300 hover:border-emerald-600';
    }

    if (act.disabled) {
      btnClasses += ' opacity-50 cursor-not-allowed pointer-events-none';
    }

    if (act.href) {
      return (
        <a
          id={act.id}
          href={act.href}
          target={act.href.startsWith('http') ? '_blank' : undefined}
          rel={act.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={btnClasses}
          aria-label={act.ariaLabel || act.label}
        >
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{act.label}</span>
          {act.href.startsWith('http') && <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />}
        </a>
      );
    }

    return (
      <button
        id={act.id}
        type="button"
        onClick={act.onClick}
        disabled={act.disabled}
        className={btnClasses}
        aria-label={act.ariaLabel || act.label}
      >
        {Icon && <Icon className="w-4 h-4 shrink-0" />}
        <span>{act.label}</span>
      </button>
    );
  };

  // Size styling
  const titleSizeClass =
    size === 'lg'
      ? 'text-3xl sm:text-4xl lg:text-5xl'
      : size === 'sm'
      ? 'text-xl sm:text-2xl'
      : 'text-2xl sm:text-3xl lg:text-4xl';

  const descSizeClass =
    size === 'lg' ? 'text-sm sm:text-base' : size === 'sm' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm';

  // Align styling
  const isCenter = align === 'center';
  const isSplit = align === 'split';

  const hasActionButtons = primaryAction || secondaryAction || actions;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Optional Breadcrumbs */}
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

      <div
        className={`flex flex-col ${
          isSplit
            ? 'md:flex-row md:items-end justify-between gap-6'
            : isCenter
            ? 'items-center text-center max-w-3xl mx-auto space-y-3'
            : 'items-start text-left space-y-3'
        }`}
      >
        {/* Text Container */}
        <div className={`space-y-2.5 ${isCenter ? 'w-full' : isSplit ? 'max-w-2xl' : 'w-full'}`}>
          {/* Badge / Eyebrow */}
          {badge && (
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              isDark
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-2xs'
                : 'bg-emerald-100/90 text-[#15803d] border border-emerald-200 shadow-2xs'
            }`}>
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-[#15803d] dark:text-emerald-400 shrink-0" />}
              {typeof badge === 'string' ? <span>{badge}</span> : badge}
            </div>
          )}

          {/* Title */}
          <h2
            className={`font-serif font-bold tracking-tight leading-tight ${
              isDark ? 'text-white' : 'text-gray-950'
            } ${titleSizeClass}`}
          >
            {title}
          </h2>

          {/* Description */}
          {descText && (
            <div
              className={`leading-relaxed ${
                isDark ? 'text-emerald-100/85' : 'text-gray-600'
              } ${descSizeClass} ${isCenter ? 'max-w-2xl mx-auto' : ''}`}
            >
              {typeof descText === 'string' ? <p>{descText}</p> : descText}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {hasActionButtons && (
          <div
            className={`flex flex-wrap items-center gap-3 shrink-0 ${
              isCenter ? 'justify-center pt-2' : isSplit ? 'justify-end' : 'justify-start pt-1'
            }`}
          >
            {secondaryAction && renderAction(secondaryAction, false)}
            {primaryAction && renderAction(primaryAction, true)}
            {actions}
          </div>
        )}
      </div>

      {/* Optional Children (Filter tabs, search bars, extra widgets) */}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
