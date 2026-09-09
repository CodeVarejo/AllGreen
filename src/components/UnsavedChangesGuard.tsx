import React, { ReactNode } from 'react';
import { useUnsavedChangesGuard, UseUnsavedChangesGuardOptions, UseUnsavedChangesGuardReturn } from '../hooks/useUnsavedChangesGuard';

export interface UnsavedChangesGuardProps extends UseUnsavedChangesGuardOptions {
  children: ReactNode | ((guard: UseUnsavedChangesGuardReturn) => ReactNode);
}

/**
 * Wrapper component utilizing ConfirmationDialogProvider to guard forms and modals against accidental closure or navigation.
 */
export const UnsavedChangesGuard: React.FC<UnsavedChangesGuardProps> = ({
  children,
  isDirty,
  title,
  description,
  confirmText,
  cancelText,
  variant,
  icon,
  enabled,
  onDiscard,
  preventBrowserUnload,
  interceptEscapeKey,
}) => {
  const guard = useUnsavedChangesGuard({
    isDirty,
    title,
    description,
    confirmText,
    cancelText,
    variant,
    icon,
    enabled,
    onDiscard,
    preventBrowserUnload,
    interceptEscapeKey,
  });

  if (typeof children === 'function') {
    return <>{children(guard)}</>;
  }

  return <>{children}</>;
};

export default UnsavedChangesGuard;
