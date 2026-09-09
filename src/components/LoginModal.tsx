import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Building,
  Leaf,
  ShieldCheck,
  Check,
  Zap,
  Layers,
  FileCode,
  Award
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_USER } from '../data/portalData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'arquiteto' | 'cliente'>('arquiteto');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        ...DEFAULT_USER,
        role: userRole,
        email: email || DEFAULT_USER.email,
      };
      onLoginSuccess(user);
      onClose();
    }, 400);
  };

  const handleQuickLogin = (role: 'arquiteto' | 'cliente') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = role === 'arquiteto' ? DEFAULT_USER : {
        id: 'usr_cli_108',
        name: 'Carlos Eduardo Fonseca',
        email: 'carlos.fonseca@construtoravita.com.br',
        role: 'cliente',
        company: 'Vita Empreendimentos Imobiliários',
        phone: '(11) 97120-4050',
        city: 'São Paulo, SP',
        points: 1200,
        tier: 'Gold',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      };
      onLoginSuccess(user);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-[#f3f7f4] rounded-3xl max-w-lg w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Dark Green Luxury Accent */}
        <div className="bg-[#062316] text-white p-6 sm:p-7 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#86efac]/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-emerald-950/80 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-emerald-800/60"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-[#86efac] to-emerald-500 text-[#062316] flex items-center justify-center font-bold shadow-md">
              <Leaf className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#86efac] uppercase">
              PORTAL DO ARQUITETO & CLIENTE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Área de Acesso Técnico
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-md">
            Compatibilização BIM 3D, especificações sustentáveis LEED/WELL e gestão em tempo real de obras.
          </p>
        </div>

        {/* Demo Fast Access Section */}
        <div className="p-6 sm:p-7 space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-700" />
                <span>Acesso Rápido de Teste (1 Clique):</span>
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Sem senha necessária
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin('arquiteto')}
                className="p-4 rounded-2xl border-2 border-emerald-800/40 bg-white hover:bg-emerald-50/80 text-left transition-all group cursor-pointer shadow-sm hover:shadow-md hover:border-emerald-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#062316] flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4 text-[#15803d]" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#062316] text-[#86efac] px-2 py-0.5 rounded-md">
                    Pro
                  </span>
                </div>
                <span className="text-xs font-bold text-[#062316] block">Arquiteto / Especificador</span>
                <span className="text-[11px] text-gray-600 block mt-1 leading-snug">
                  Blocos Revit/DWG, Maleta de Amostras e Matriz LEED
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('cliente')}
                className="p-4 rounded-2xl border-2 border-teal-800/30 bg-white hover:bg-teal-50/80 text-left transition-all group cursor-pointer shadow-sm hover:shadow-md hover:border-teal-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                    <Building className="w-4 h-4 text-teal-700" />
                  </div>
                  <span className="text-[10px] font-bold bg-teal-900 text-teal-200 px-2 py-0.5 rounded-md">
                    Corporativo
                  </span>
                </div>
                <span className="text-xs font-bold text-teal-950 block">Cliente / Construtora</span>
                <span className="text-[11px] text-gray-600 block mt-1 leading-snug">
                  Cronograma de Obra, Galeria Antes/Depois e Laudos
                </span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 w-full" />
            <span className="bg-[#f3f7f4] px-3 text-[11px] text-gray-500 uppercase font-semibold">ou entre com e-mail</span>
          </div>

          {/* Form for custom access */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: seu.nome@escritorio.arq.br"
                  className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-950 focus:outline-none focus:border-[#062316] focus:ring-1 focus:ring-[#062316] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800">Senha de Acesso</label>
                <button
                  type="button"
                  onClick={() => setRecoveryMessage('Link de recuperação enviado para o e-mail cadastrado.')}
                  className="text-[10px] text-[#15803d] hover:underline font-bold cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-gray-300 text-xs text-gray-950 focus:outline-none focus:border-[#062316] focus:ring-1 focus:ring-[#062316] shadow-2xs"
                />
              </div>
            </div>

            {recoveryMessage && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-semibold border border-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-[#15803d] shrink-0" />
                <span>{recoveryMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#062316] hover:bg-[#15803d] text-[#86efac] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Carregando ambiente...</span>
              ) : (
                <>
                  <span>Acessar Portal All Green</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
