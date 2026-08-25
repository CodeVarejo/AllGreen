import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onOpenSearch?: () => void;
  onOpenSimulator?: () => void;
  onTogglePortal?: () => void;
  onOpenProjectLookup?: () => void;
  onOpenQuote?: () => void;
  onOpenBotanical?: () => void;
  onOpenNotifications?: () => void;
  onToggleHighContrast?: () => void;
  onOpenShortcutsModal?: () => void;
  onCloseAllModals?: () => void;
}

export function isMacUser(): boolean {
  if (typeof window === 'undefined') return false;
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent || '');
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const isInputField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      const key = event.key.toLowerCase();

      // 1. ESC: Close all active modals / overlays (always works)
      if (event.key === 'Escape') {
        if (handlers.onCloseAllModals) {
          event.preventDefault();
          handlers.onCloseAllModals();
        }
        return;
      }

      // 2. Modifier Combinations (Ctrl + Key / Cmd + Key)
      if (isModifierPressed) {
        // Ctrl/Cmd + K: Open Global Search / Command Palette
        if (key === 'k') {
          event.preventDefault();
          handlers.onOpenSearch?.();
          return;
        }

        // Ctrl/Cmd + M: Open AI Biophilic Simulator
        if (key === 'm') {
          event.preventDefault();
          handlers.onOpenSimulator?.();
          return;
        }

        // Ctrl/Cmd + P: Access Architect Portal / Login
        if (key === 'p') {
          event.preventDefault();
          handlers.onTogglePortal?.();
          return;
        }

        // Ctrl/Cmd + L: Track / Lookup Project Status
        if (key === 'l') {
          event.preventDefault();
          handlers.onOpenProjectLookup?.();
          return;
        }

        // Ctrl/Cmd + Q: Open Express Quote Modal
        if (key === 'q') {
          event.preventDefault();
          handlers.onOpenQuote?.();
          return;
        }

        // Ctrl/Cmd + B: Jump to Botanical Catalog & Reports
        if (key === 'b') {
          event.preventDefault();
          handlers.onOpenBotanical?.();
          return;
        }

        // Ctrl/Cmd + N: Open Real-Time Notifications Center
        if (key === 'n') {
          event.preventDefault();
          handlers.onOpenNotifications?.();
          return;
        }

        // Ctrl/Cmd + H: Toggle High Contrast Accessibility Mode
        if (key === 'h') {
          event.preventDefault();
          handlers.onToggleHighContrast?.();
          return;
        }

        // Ctrl/Cmd + /: Open Shortcuts Help Modal
        if (event.key === '/' || event.key === '?') {
          event.preventDefault();
          handlers.onOpenShortcutsModal?.();
          return;
        }
      }

      // 3. Single Key Shortcuts (when NOT typing in an input field)
      if (!isInputField && !isModifierPressed) {
        // '?' or Shift + '/' opens keyboard shortcuts cheatsheet
        if (event.key === '?') {
          event.preventDefault();
          handlers.onOpenShortcutsModal?.();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
