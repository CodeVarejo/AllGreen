import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge' | 'huge';
export type AppTheme = 'light' | 'dark';

interface AccessibilityContextType {
  theme: AppTheme;
  isHighContrast: boolean;
  fontSize: FontSizeOption;
  isWcagTableMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSizeOption) => void;
  toggleWcagTableMode: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('ag_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('ag_high_contrast') === 'true';
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('ag_font_size') as FontSizeOption) || 'normal';
  });

  const [isWcagTableMode, setIsWcagTableMode] = useState<boolean>(() => {
    return localStorage.getItem('ag_wcag_table') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ag_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ag_high_contrast', String(isHighContrast));
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem('ag_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ag_wcag_table', String(isWcagTableMode));
  }, [isWcagTableMode]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
  };

  const toggleWcagTableMode = () => {
    setIsWcagTableMode((prev) => !prev);
  };

  const resetAccessibility = () => {
    setIsHighContrast(false);
    setFontSizeState('normal');
    setIsWcagTableMode(false);
    setThemeState('light');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        isHighContrast,
        fontSize,
        isWcagTableMode,
        toggleTheme,
        setTheme,
        toggleHighContrast,
        setFontSize,
        toggleWcagTableMode,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
