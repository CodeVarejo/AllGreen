import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge' | 'huge';
export type AppTheme = 'light' | 'dark';
export type ThemeMode = 'auto' | 'light' | 'dark';

/**
 * Returns 'light' from 06:00 to 17:59, and 'dark' from 18:00 to 05:59.
 */
export function getCircadianTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light';
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}

interface AccessibilityContextType {
  theme: AppTheme;
  themeMode: ThemeMode;
  isHighContrast: boolean;
  fontSize: FontSizeOption;
  isWcagTableMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSizeOption) => void;
  toggleWcagTableMode: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Mode: 'auto' (Circadian Solar 6h-18h), 'light' (manual), or 'dark' (manual)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('ag_theme_mode') as ThemeMode | null;
      if (savedMode === 'auto' || savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }
    }
    // Default strictly to automatic system / solar circadian schedule
    return 'auto';
  });

  // Active resolved theme: 'light' or 'dark'
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const savedMode = typeof window !== 'undefined' ? (localStorage.getItem('ag_theme_mode') as ThemeMode | null) : null;
    if (savedMode === 'light') return 'light';
    if (savedMode === 'dark') return 'dark';
    return getCircadianTheme();
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('ag_high_contrast') === 'true' : false;
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    return typeof window !== 'undefined' ? ((localStorage.getItem('ag_font_size') as FontSizeOption) || 'normal') : 'normal';
  });

  const [isWcagTableMode, setIsWcagTableMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('ag_wcag_table') === 'true' : false;
  });

  // When themeMode changes, synchronize active theme
  useEffect(() => {
    localStorage.setItem('ag_theme_mode', themeMode);
    if (themeMode === 'light') {
      setThemeState('light');
    } else if (themeMode === 'dark') {
      setThemeState('dark');
    } else {
      setThemeState(getCircadianTheme());
    }
  }, [themeMode]);

  // Periodic check for automatic solar schedule (every 30 seconds & on window focus)
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const checkSolarTime = () => {
      const expected = getCircadianTheme();
      setThemeState((current) => (current !== expected ? expected : current));
    };

    checkSolarTime();
    const intervalId = setInterval(checkSolarTime, 30000);
    window.addEventListener('focus', checkSolarTime);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkSolarTime);
    };
  }, [themeMode]);

  // Apply theme to document root
  useEffect(() => {
    localStorage.setItem('ag_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // High contrast styling
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

  // Explicitly set theme mode ('auto', 'light', or 'dark')
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === 'light' || mode === 'dark') {
      setThemeState(mode);
    } else {
      setThemeState(getCircadianTheme());
    }
  };

  // Direct manual setTheme
  const setTheme = (newTheme: AppTheme) => {
    setThemeModeState(newTheme);
    setThemeState(newTheme);
  };

  // Toggle theme manually (switches between light and dark)
  const toggleTheme = () => {
    const nextTheme: AppTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeModeState(nextTheme);
    setThemeState(nextTheme);
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
    setThemeModeState('auto');
    setThemeState(getCircadianTheme());
  };

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        themeMode,
        isHighContrast,
        fontSize,
        isWcagTableMode,
        toggleTheme,
        setTheme,
        setThemeMode,
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
