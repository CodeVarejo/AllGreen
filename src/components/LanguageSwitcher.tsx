import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'drawer' | 'footer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
      case 'pt':
        return 'Português';
      case 'en':
        return 'English';
      case 'es':
        return 'Español';
    }
  };

  if (variant === 'drawer') {
    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-emerald-950/40 border border-gray-200/80 dark:border-emerald-800/80 gap-2 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
          <Globe className="w-4 h-4 text-[#15803d] dark:text-[#86efac]" />
          <span>
            {language === 'pt' ? 'Idioma da Plataforma' : language === 'es' ? 'Idioma del Sistema' : 'System Language'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-emerald-900/50 p-1 rounded-lg border border-gray-200 dark:border-emerald-800 shadow-2xs">
          {(['pt', 'en', 'es'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-initial text-center ${
                language === lang
                  ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              aria-pressed={language === lang}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Navbar variant:
  // On mobile (< sm): compact circular 36px toggle button showing current lang ("PT", "EN" or "ES")
  // On desktop (sm+): sleek segmented pill with PT, EN and ES buttons
  return (
    <div className={`shrink-0 ${className}`}>
      {/* Mobile Single Toggle Button (< sm) */}
      <button
        type="button"
        id="header-language-toggle-mobile"
        onClick={toggleLanguage}
        className="flex sm:hidden w-9 h-9 rounded-full bg-white dark:bg-emerald-950/80 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-[#0d3822] dark:text-[#86efac] border border-gray-300/80 dark:border-emerald-800 shadow-2xs transition-all cursor-pointer active:scale-95 items-center justify-center font-mono text-[11px] font-extrabold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
        title={
          language === 'pt'
            ? 'Mudar para Inglês'
            : language === 'en'
            ? 'Cambiar a Español'
            : 'Mudar para Português'
        }
        aria-label="Alternar Idioma"
      >
        <span className="text-[#15803d] dark:text-[#86efac]">{language.toUpperCase()}</span>
      </button>

      {/* Desktop / Tablet Segmented Pill (>= sm) */}
      <div
        className="hidden sm:inline-flex items-center rounded-full bg-white dark:bg-emerald-950/80 hover:bg-white border border-gray-300/80 dark:border-emerald-800 p-0.5 shadow-2xs transition-all"
        role="group"
        aria-label="Selecionar Idioma / Language / Idioma"
      >
        <button
          type="button"
          id="btn-lang-pt"
          onClick={() => setLanguage('pt')}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            language === 'pt'
              ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title="Português (Brasil)"
          aria-pressed={language === 'pt'}
        >
          PT
        </button>
        <button
          type="button"
          id="btn-lang-en"
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title="English (US)"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
        <button
          type="button"
          id="btn-lang-es"
          onClick={() => setLanguage('es')}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            language === 'es'
              ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          title="Español"
          aria-pressed={language === 'es'}
        >
          ES
        </button>
      </div>
    </div>
  );
};
