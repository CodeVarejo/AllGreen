import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertTriangle, AlertCircle, HelpCircle, X, ShieldAlert } from 'lucide-react';

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: React.ComponentType<{ className?: string }>;
}

interface ConfirmationDialogContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
  isOpen: boolean;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextType | undefined>(undefined);

export const ConfirmationDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts?: ConfirmOptions): Promise<boolean> => {
    setOptions(opts || {});
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolver) resolver(true);
    setResolver(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolver) resolver(false);
    setResolver(null);
  };

  const title = options.title || 'Descartar alterações não salvas?';
  const description =
    options.description ||
    'Você possui modificações em andamento que ainda não foram salvas. Se você sair agora, todos os dados preenchidos serão perdidos.';
  const confirmText = options.confirmText || 'Descartar e Sair';
  const cancelText = options.cancelText || 'Continuar Editando';
  const variant = options.variant || 'warning';

  return (
    <ConfirmationDialogContext.Provider value={{ confirm, isOpen }}>
      {children}

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-desc"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-emerald-950/20 z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  variant === 'danger'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : variant === 'info'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-amber-100 text-amber-700 border-amber-300'
                }`}
              >
                {options.icon ? (
                  <options.icon className="w-6 h-6" />
                ) : variant === 'danger' ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : variant === 'info' ? (
                  <HelpCircle className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1.5 flex-1 pr-2">
                <h3 id="confirm-dialog-title" className="text-lg font-serif font-bold text-gray-950 leading-snug">
                  {title}
                </h3>
                <p id="confirm-dialog-desc" className="text-xs text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Fechar diálogo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleConfirm}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[44px] active:scale-95 text-center ${
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    : 'bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200'
                }`}
              >
                {confirmText}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                autoFocus
                className="w-full sm:w-auto px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm min-h-[44px] active:scale-95 text-center"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmationDialog = () => {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error('useConfirmationDialog must be used within a ConfirmationDialogProvider');
  }
  return context;
};
