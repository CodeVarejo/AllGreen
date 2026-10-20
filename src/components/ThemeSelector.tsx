import React from 'react';
import { Sun, Moon, Clock, Sparkles } from 'lucide-react';
import { useAccessibility, ThemeMode } from '../context/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';

interface ThemeSelectorProps {
  variant?: 'drawer' | 'navbar' | 'compact' | 'footer';
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'drawer',
  className = '',
}) => {
  const { theme, themeMode, setThemeMode } = useAccessibility();
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const isEs = language === 'es';

  const currentHour = new Date().getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;

  const lightLabel = isPt ? 'Claro' : isEs ? 'Claro' : 'Light';
  const darkLabel = isPt ? 'Escuro' : isEs ? 'Oscuro' : 'Dark';
  const systemLabel = isPt ? 'Sistema (Auto)' : isEs ? 'Sistema (Auto)' : 'System (Auto)';
  const systemShortLabel = isPt ? 'Sistema' : isEs ? 'Sistema' : 'System';

  const lightTitle = isPt
    ? 'Modo Claro (manual)'
    : isEs
    ? 'Modo Claro (manual)'
    : 'Light mode (manual)';
  const darkTitle = isPt
    ? 'Modo Escuro (manual)'
    : isEs
    ? 'Modo Oscuro (manual)'
    : 'Dark mode (manual)';
  const systemTitle = isPt
    ? 'Tema do Sistema: Claro das 6h às 18h · Escuro das 18h às 6h'
    : isEs
    ? 'Tema del Sistema: Claro de 6h a 18h · Oscuro de 18h a 6h'
    : 'System Theme: Light 6am-6pm · Dark 6pm-6am';

  if (variant === 'compact' || variant === 'navbar') {
    return (
      <div
        className={`relative inline-flex items-center p-0.5 rounded-full bg-gray-100/90 dark:bg-emerald-950/80 border border-gray-300/80 dark:border-emerald-800 shadow-2xs ${className}`}
        role="group"
        aria-label={systemTitle}
      >
        {/* System (Auto Circadian: 6h-18h Light, 18h-6h Dark) */}
        <button
          type="button"
          onClick={() => setThemeMode('auto')}
          className={`flex items-center gap-1 px-2 h-7 rounded-full text-xs transition-all cursor-pointer ${
            themeMode === 'auto'
              ? 'bg-[#0d3822] text-[#86efac] shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
          title={systemTitle}
          aria-label={systemTitle}
          aria-pressed={themeMode === 'auto'}
        >
          <Clock className="w-3.5 h-3.5 text-[#86efac]" />
          <span className="text-[11px] font-semibold hidden md:inline">{systemShortLabel}</span>
        </button>

        {/* Manual Light */}
        <button
          type="button"
          onClick={() => setThemeMode('light')}
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-white text-amber-600 shadow-xs font-bold'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
          title={lightTitle}
          aria-label={lightLabel}
          aria-pressed={themeMode === 'light'}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>

        {/* Manual Dark */}
        <button
          type="button"
          onClick={() => setThemeMode('dark')}
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs transition-all cursor-pointer ${
            themeMode === 'dark'
              ? 'bg-emerald-800 text-[#86efac] shadow-xs font-bold'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
          title={darkTitle}
          aria-label={darkLabel}
          aria-pressed={themeMode === 'dark'}
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Variant "drawer" or full card
  return (
    <div
      className={`p-3.5 rounded-2xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200 dark:border-emerald-800/80 space-y-2.5 ${className}`}
      role="group"
      aria-label={isPt ? 'Seletor de Tema do Sistema e Manual' : isEs ? 'Selector de Tema del Sistema y Manual' : 'System and Manual Theme Selector'}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white dark:bg-emerald-900/60 text-[#0d3822] dark:text-[#86efac] flex items-center justify-center shadow-2xs">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900 dark:text-white block leading-tight">
              {isPt ? 'Tema Visual' : isEs ? 'Tema Visual' : 'Visual Theme'}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-medium">
              {themeMode === 'auto'
                ? isPt
                  ? `Sistema Ativo (${isDaytime ? 'Claro 6h-18h' : 'Escuro 18h-24h'})`
                  : isEs
                  ? `Sistema Activo (${isDaytime ? 'Claro 6h-18h' : 'Oscuro 18h-24h'})`
                  : `System Active (${isDaytime ? 'Light 6am-6pm' : 'Dark 6pm-6am'})`
                : themeMode === 'light'
                ? isPt ? 'Modo Claro Manual' : isEs ? 'Modo Claro Manual' : 'Light Mode Manual'
                : isPt ? 'Modo Escuro Manual' : isEs ? 'Modo Oscuro Manual' : 'Dark Mode Manual'}
            </span>
          </div>
        </div>

        {/* Small live badge */}
        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-emerald-900/80 text-gray-700 dark:text-emerald-200 border border-gray-200 dark:border-emerald-800">
          {theme === 'dark' ? darkLabel : lightLabel}
        </span>
      </div>

      {/* 3-way Segmented Control */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-emerald-900/50 rounded-xl border border-gray-200 dark:border-emerald-800/80 text-xs shadow-2xs">
        {/* System */}
        <button
          type="button"
          onClick={() => setThemeMode('auto')}
          className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'auto'
              ? 'bg-[#0d3822] text-[#86efac] shadow-xs font-bold'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-emerald-800/40'
          }`}
          title={systemTitle}
          aria-pressed={themeMode === 'auto'}
        >
          <Clock className="w-3.5 h-3.5 text-[#86efac]" />
          <span>{systemLabel}</span>
        </button>

        {/* Manual Light */}
        <button
          type="button"
          onClick={() => setThemeMode('light')}
          className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-[#0d3822] text-[#86efac] shadow-xs font-bold'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-emerald-800/40'
          }`}
          aria-pressed={themeMode === 'light'}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>{lightLabel}</span>
        </button>

        {/* Manual Dark */}
        <button
          type="button"
          onClick={() => setThemeMode('dark')}
          className={`py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'dark'
              ? 'bg-[#0d3822] text-[#86efac] shadow-xs font-bold'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-emerald-800/40'
          }`}
          aria-pressed={themeMode === 'dark'}
        >
          <Moon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{darkLabel}</span>
        </button>
      </div>

      {/* Helper text explaining the system schedule */}
      <div className="flex items-start gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 px-0.5">
        <Sparkles className="w-3 h-3 text-[#15803d] dark:text-[#86efac] shrink-0 mt-0.5" />
        {themeMode === 'auto' ? (
          <span>
            {isPt
              ? 'Sistema ativo: Claro das 6h às 18h · Escuro das 18h às 24h/6h automaticamente.'
              : isEs
              ? 'Sistema activo: Claro de 6h a 18h · Oscuro de 18h a 24h/6h automáticamente.'
              : 'System active: Light 6am-6pm · Dark 6pm-6am automatically.'}
          </span>
        ) : (
          <span>
            {isPt
              ? 'Tema manual ativo. Clique em "Sistema (Auto)" para sincronizar com o horário.'
              : isEs
              ? 'Tema manual activo. Haga clic en "Sistema (Auto)" para sincronizar con el horario.'
              : 'Manual theme active. Click "System (Auto)" to synchronize with time of day.'}
          </span>
        )}
      </div>
    </div>
  );
};
