import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onDiscard: () => void;
  title?: string;
  description?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onStay,
  onDiscard,
  title = 'Alterações Não Salvas',
  description = 'Você possui modificações não salvas neste formulário. Se sair agora, todas as edições serão descartadas.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-0"
        onClick={onStay}
        aria-hidden="true"
      />
      
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-emerald-950/20 z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-gray-950 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 rounded-xl font-bold text-xs transition-all cursor-pointer active:scale-95"
          >
            Descartar Alterações
          </button>

          <button
            type="button"
            onClick={onStay}
            className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Continuar Editando
          </button>
        </div>
      </div>
    </div>
  );
};
