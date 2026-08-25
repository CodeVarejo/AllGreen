import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge' | 'huge';

interface AccessibilityContextType {
  isHighContrast: boolean;
  fontSize: FontSizeOption;
  isWcagTableMode: boolean;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSizeOption) => void;
  toggleWcagTableMode: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    localStorage.setItem('ag_high_contrast', String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem('ag_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ag_wcag_table', String(isWcagTableMode));
  }, [isWcagTableMode]);

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
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        fontSize,
        isWcagTableMode,
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
