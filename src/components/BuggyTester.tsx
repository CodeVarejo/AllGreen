import React from 'react';

export interface BuggyTesterProps {
  shouldThrow?: boolean;
  name: string;
  errorMessage?: string;
}

/**
 * BuggyTester component for Developer Menu / QA testing.
 * When `shouldThrow` is true, it throws an error during render,
 * allowing verification that the enclosing ErrorBoundary intercepts the crash
 * and renders the 'Oops!' UI state with the 'Reload' button.
 */
export const BuggyTester: React.FC<BuggyTesterProps> = ({
  shouldThrow = false,
  name,
  errorMessage,
}) => {
  if (shouldThrow) {
    throw new Error(
      errorMessage || `[Dev QA Simulation] Erro proposital de renderização em "${name}" disparado pelo botão 'Break Component'.`
    );
  }

  return null;
};

export default BuggyTester;
