import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'drawer' | 'footer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'drawer') {
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <Globe className="w-4 h-4 text-[#15803d]" />
          <span>{language === 'pt' ? 'Idioma do Sistema' : 'System Language'}</span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage('pt')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              language === 'pt'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            aria-pressed={language === 'pt'}
          >
            Português
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            aria-pressed={language === 'en'}
          >
            English
          </button>
        </div>
      </div>
    );
  }

  // Navbar variant:
  // On mobile (< sm): compact circular 36px toggle button showing current lang ("PT" or "EN")
  // On desktop (sm+): sleek segmented pill with PT and EN buttons
  return (
    <div className={`shrink-0 ${className}`}>
      {/* Mobile Single Toggle Button (< sm) */}
      <button
        type="button"
        id="header-language-toggle-mobile"
        onClick={toggleLanguage}
        className="flex sm:hidden w-9 h-9 rounded-full bg-white hover:bg-emerald-50 text-[#0d3822] border border-gray-300/80 hover:border-emerald-400 shadow-2xs transition-all cursor-pointer active:scale-95 items-center justify-center font-mono text-[11px] font-extrabold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d3822]"
        title={language === 'pt' ? 'Mudar para Inglês (Switch to English)' : 'Switch to Portuguese (Mudar para Português)'}
        aria-label={language === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
      >
        <span className="text-[#15803d]">{language.toUpperCase()}</span>
      </button>

      {/* Desktop / Tablet Segmented Pill (>= sm) */}
      <div
        className="hidden sm:inline-flex items-center rounded-full bg-white hover:bg-white border border-gray-300/80 hover:border-emerald-400 p-0.5 shadow-2xs transition-all"
        role="group"
        aria-label="Selecionar Idioma / Language Selector"
      >
        <button
          type="button"
          id="btn-lang-pt"
          onClick={() => setLanguage('pt')}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
            language === 'pt'
              ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
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
              : 'text-gray-500 hover:text-gray-900'
          }`}
          title="English (US)"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
      </div>
    </div>
  );
};
