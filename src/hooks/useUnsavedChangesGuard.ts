import { useEffect, useCallback, useRef } from 'react';
import { useConfirmationDialog, ConfirmOptions } from '../context/ConfirmationDialogContext';

export interface UseUnsavedChangesGuardOptions {
  /**
   * Whether the current form/component has unsaved changes.
   */
  isDirty: boolean;

  /**
   * Title shown in the confirmation dialog.
   */
  title?: string;

  /**
   * Description or warning message shown in the confirmation dialog.
   */
  description?: string;

  /**
   * Text for the confirm/discard button.
   */
  confirmText?: string;

  /**
   * Text for the cancel/stay button.
   */
  cancelText?: string;

  /**
   * Visual style variant of the confirmation dialog.
   */
  variant?: 'warning' | 'danger' | 'info';

  /**
   * Custom icon component to render in the dialog.
   */
  icon?: ConfirmOptions['icon'];

  /**
   * Whether the guard is actively enabled. Defaults to true.
   */
  enabled?: boolean;

  /**
   * Callback executed when the user confirms discarding changes.
   */
  onDiscard?: () => void;

  /**
   * Whether to prompt the browser's native beforeunload dialog on tab close/refresh. Defaults to true.
   */
  preventBrowserUnload?: boolean;

  /**
   * Whether to intercept the ESC key when dirty and trigger the confirmation dialog. Defaults to false.
   */
  interceptEscapeKey?: boolean;
}

export interface UseUnsavedChangesGuardReturn {
  /**
   * Prompts confirmation if isDirty is true. If confirmed (or not dirty), calls proceedCallback and returns true.
   */
  confirmDiscard: (proceedCallback?: () => void) => Promise<boolean>;

  /**
   * Wraps an action function with the confirmation guard.
   */
  guardedAction: <Args extends unknown[]>(action: (...args: Args) => void) => (...args: Args) => Promise<void>;

  /**
   * Current dirty state.
   */
  isDirty: boolean;
}

/**
 * Custom hook to detect unsaved changes in forms/modals and trigger a confirmation dialog
 * before allowing navigation, tab switching, or modal closure.
 */
export function useUnsavedChangesGuard({
  isDirty,
  title = 'Descartar alterações não salvas?',
  description = 'Você possui modificações em andamento. Se sair agora, todos os dados preenchidos serão perdidos.',
  confirmText = 'Descartar e Sair',
  cancelText = 'Continuar Editando',
  variant = 'warning',
  icon,
  enabled = true,
  onDiscard,
  preventBrowserUnload = true,
  interceptEscapeKey = false,
}: UseUnsavedChangesGuardOptions): UseUnsavedChangesGuardReturn {
  const { confirm } = useConfirmationDialog();

  // Stable references for options
  const onDiscardRef = useRef(onDiscard);
  onDiscardRef.current = onDiscard;

  const confirmDiscard = useCallback(
    async (proceedCallback?: () => void): Promise<boolean> => {
      if (!enabled || !isDirty) {
        if (proceedCallback) {
          proceedCallback();
        }
        return true;
      }

      const shouldProceed = await confirm({
        title,
        description,
        confirmText,
        cancelText,
        variant,
        icon,
      });

      if (shouldProceed) {
        if (onDiscardRef.current) {
          onDiscardRef.current();
        }
        if (proceedCallback) {
          proceedCallback();
        }
        return true;
      }

      return false;
    },
    [enabled, isDirty, confirm, title, description, confirmText, cancelText, variant, icon]
  );

  const guardedAction = useCallback(
    <Args extends unknown[]>(action: (...args: Args) => void) => {
      return async (...args: Args) => {
        await confirmDiscard(() => {
          action(...args);
        });
      };
    },
    [confirmDiscard]
  );

  // Prevent accidental browser tab closure or refresh
  useEffect(() => {
    if (!enabled || !isDirty || !preventBrowserUnload) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, isDirty, preventBrowserUnload]);

  // Optional ESC key interception
  useEffect(() => {
    if (!enabled || !isDirty || !interceptEscapeKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        confirmDiscard();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [enabled, isDirty, interceptEscapeKey, confirmDiscard]);

  return {
    confirmDiscard,
    guardedAction,
    isDirty,
  };
}

export default useUnsavedChangesGuard;
