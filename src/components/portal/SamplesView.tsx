import React, { useState } from 'react';
import {
  Package,
  Check,
  Truck,
  ShieldCheck,
  Leaf,
  MapPin,
  Clock,
  PhoneCall,
  ArrowLeft
} from 'lucide-react';
import { UserProfile } from '../../types';
import { PageHeader } from '../PageHeader';

interface SamplesViewProps {
  user: UserProfile;
  onBackToDashboard?: () => void;
}

export const SamplesView: React.FC<SamplesViewProps> = ({ 
  user,
  onBackToDashboard,
}) => {
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = `AG-KIT-${Math.floor(10000 + Math.random() * 90000)}`;
    setTrackingCode(randomCode);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setAddress('');
    setNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        align="center"
        badge="Exclusivo para Escritórios de Arquitetura & Interiores"
        badgeIcon={Package}
        title="Maleta de Amostras Físicas & Mostruário Tátil"
        description="Receba em seu escritório uma maleta completa para apresentação ao cliente final com amostras reais de musgo moss escandinavo, folhagens estabilizadas e peças modulares de fixação oculta."
      />

      {/* Kit Features Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center font-bold border border-emerald-100">
            <Leaf className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wide">Espécies Preservadas</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Musgo polar moss, samambaias estabilizadas e eucalipto com maciez 100% natural.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wide">Permanente Anti-UV</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Folhagens em silicone Real Touch com proteção solar e retardante de chamas Classe II-A.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
            <Package className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wide">Gabarito Plug & Play</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Amostra em escala 1:1 do chassi modular em MDF Ultra Naval com encaixe macho-fêmea.
          </p>
        </div>

      </div>

      {/* Form or Confirmation Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {isSuccess ? (
          <div className="py-10 text-center space-y-4 bg-emerald-50 rounded-3xl border border-emerald-200 p-6">
            <div className="w-16 h-16 rounded-full bg-[#15803d] text-white flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                Código de Rastreio: {trackingCode}
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#072a1a]">
                Maleta de Amostras Despachada com Sucesso!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                O kit foi enviado para separação técnica na fábrica All Green e será entregue sem custos em seu escritório via Sedex Express.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
              >
                Solicitar Outro Endereço
              </button>

              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-gray-800 font-bold rounded-xl text-xs border border-gray-200 transition-all cursor-pointer min-h-[44px]"
                >
                  Voltar à Visão Geral
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Arquiteto Solicitante
                </label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-xs text-gray-700 border border-gray-200 cursor-not-allowed font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Escritório / Studio
                </label>
                <input
                  type="text"
                  disabled
                  value={user.company}
                  className="w-full px-3.5 py-2.5 bg-gray-100 rounded-xl text-xs text-gray-700 border border-gray-200 cursor-not-allowed font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Endereço Completo de Entrega do Escritório *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, Número, Conjunto/Sala, Bairro, Cidade, UF e CEP..."
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Espécies ou Tecnologias de Maior Interesse na Especificação
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Gostaria de testar musgo moss verde floresta, samambaia preservada e acabamento anti-chamas para hall de entrada..."
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
              />
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-950">
              <Truck className="w-5 h-5 text-[#15803d] shrink-0" />
              <span>
                <strong>Frete Grátis Cortesia All Green:</strong> Envio expresso para qualquer capital ou região metropolitana do Brasil em até 48 horas úteis.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[44px]"
            >
              <Package className="w-4 h-4" />
              <span>Confirmar Envio Gratuito da Maleta de Amostras</span>
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
