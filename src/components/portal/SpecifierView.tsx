import React, { useState } from 'react';
import {
  Award,
  Check,
  Send,
  PhoneCall,
  Volume2,
  Droplets,
  ShieldCheck,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { BiophilicRoiCalculator } from '../BiophilicRoiCalculator';

interface SpecifierViewProps {
  onOpenQuote: (context: string) => void;
  onToggleLeedParam: (paramName: string, stateSetter: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => void;
  leedWaterEfficiency: boolean;
  setLeedWaterEfficiency: React.Dispatch<React.SetStateAction<boolean>>;
  leedAirQuality: boolean;
  setLeedAirQuality: React.Dispatch<React.SetStateAction<boolean>>;
  leedAcousticPanel: boolean;
  setLeedAcousticPanel: React.Dispatch<React.SetStateAction<boolean>>;
  wellNatureAccess: boolean;
  setWellNatureAccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SpecifierView: React.FC<SpecifierViewProps> = ({
  onOpenQuote,
  onToggleLeedParam,
  leedWaterEfficiency,
  setLeedWaterEfficiency,
  leedAirQuality,
  setLeedAirQuality,
  leedAcousticPanel,
  setLeedAcousticPanel,
  wellNatureAccess,
  setWellNatureAccess,
}) => {
  const [calculatorMode, setCalculatorMode] = useState<'leed' | 'roi'>('leed');
  const [calcArea, setCalcArea] = useState<number>(24);
  const [calcStyle, setCalcStyle] = useState<'preservado' | 'permanente' | 'moss'>('preservado');
  const [calcStructure, setCalcStructure] = useState<'drywall' | 'alvenaria' | 'madeira'>('alvenaria');

  const calcUnitPrice = calcStyle === 'preservado' ? 1450 : calcStyle === 'moss' ? 1750 : 1350;
  const calcSubtotal = calcArea * calcUnitPrice;
  const calcPartnerDiscount = calcSubtotal * 0.10;
  const calcFinal = calcSubtotal - calcPartnerDiscount;

  // Calculate live LEED & WELL points
  let currentLeedPoints = 6;
  if (leedWaterEfficiency) currentLeedPoints += 4;
  if (leedAirQuality) currentLeedPoints += 3;
  if (leedAcousticPanel) currentLeedPoints += 3;

  let currentWellScore = 65;
  if (wellNatureAccess) currentWellScore += 15;
  if (leedAcousticPanel) currentWellScore += 10;
  if (leedAirQuality) currentWellScore += 10;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Sub-mode switch pills */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm gap-1">
          <button
            type="button"
            onClick={() => setCalculatorMode('leed')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculatorMode === 'leed'
                ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Matriz LEED/WELL & Orçamento</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorMode('roi')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              calculatorMode === 'roi'
                ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Calculadora de ROI Biofílico</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-[#15803d] rounded text-[10px] font-bold">
              Novo
            </span>
          </button>
        </div>
      </div>

      {calculatorMode === 'roi' ? (
        <BiophilicRoiCalculator onOpenQuote={onOpenQuote} />
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#072a1a] border border-emerald-200 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#15803d]" />
              <span>Dimensionamento Técnico & Créditos Sustentáveis</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-950 tracking-tight">
              Especificador de Orçamento & Matriz LEED/WELL
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Simule investimentos instantâneos com tabela de desconto de arquiteto e parametrize a conformidade com as certificações ambientais LEED v4.1 e WELL v2.
            </p>
          </div>

          {/* Live LEED & WELL Environmental Matrix Box */}
          <div className="bg-[#072a1a] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4 relative z-10">
          <div>
            <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400 fill-current" />
              <span>Conformidade com Certificações Sustentáveis</span>
            </h3>
            <p className="text-xs text-emerald-200/90 mt-1">
              Ative ou desative critérios para recalcular créditos e laudos ambientais em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-2xl border border-emerald-700/60 text-center shadow-md">
              <span className="text-[10px] text-emerald-300 block uppercase font-extrabold tracking-wider">LEED v4.1</span>
              <span className="text-lg font-serif font-bold text-[#86efac]">+{currentLeedPoints} Créditos</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs px-4 py-2 rounded-2xl border border-emerald-700/60 text-center shadow-md">
              <span className="text-[10px] text-emerald-300 block uppercase font-extrabold tracking-wider">WELL v2 Score</span>
              <span className="text-lg font-serif font-bold text-yellow-300">{currentWellScore} Pts</span>
            </div>
          </div>
        </div>

        {/* Environmental Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
          
          <button
            type="button"
            onClick={() => onToggleLeedParam('Isenção Total de Irrigação (WEc1)', setLeedWaterEfficiency, leedWaterEfficiency)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              leedWaterEfficiency
                ? 'bg-emerald-900/90 border-[#86efac] shadow-md ring-1 ring-[#86efac]/40'
                : 'bg-emerald-950/60 border-emerald-900 opacity-60 hover:opacity-80'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              leedWaterEfficiency ? 'bg-[#86efac] text-[#072a1a]' : 'border border-gray-500'
            }`}>
              {leedWaterEfficiency && <Check className="w-3.5 h-3.5 font-bold" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Eficiência Hídrica Total (LEED WEc1)</span>
              <span className="text-[11px] text-emerald-200 block mt-0.5">Dispensa 100% de pontos de água e esgoto (+4 créditos LEED)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onToggleLeedParam('Absorção Acústica Máxima (NRC 0.88 / WELL S04)', setLeedAcousticPanel, leedAcousticPanel)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              leedAcousticPanel
                ? 'bg-emerald-900/90 border-[#86efac] shadow-md ring-1 ring-[#86efac]/40'
                : 'bg-emerald-950/60 border-emerald-900 opacity-60 hover:opacity-80'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              leedAcousticPanel ? 'bg-[#86efac] text-[#072a1a]' : 'border border-gray-500'
            }`}>
              {leedAcousticPanel && <Check className="w-3.5 h-3.5 font-bold" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Conforto Acústico (WELL S04 & LEED EQc9)</span>
              <span className="text-[11px] text-emerald-200 block mt-0.5">Laudo IPT NRC 0.88 (+3 créditos / +10 pts WELL)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onToggleLeedParam('Qualidade do Ar Interno (Baixo COV / LEED EQc4)', setLeedAirQuality, leedAirQuality)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              leedAirQuality
                ? 'bg-emerald-900/90 border-[#86efac] shadow-md ring-1 ring-[#86efac]/40'
                : 'bg-emerald-950/60 border-emerald-900 opacity-60 hover:opacity-80'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              leedAirQuality ? 'bg-[#86efac] text-[#072a1a]' : 'border border-gray-500'
            }`}>
              {leedAirQuality && <Check className="w-3.5 h-3.5 font-bold" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Ausência de COV & Purificação (LEED EQc4)</span>
              <span className="text-[11px] text-emerald-200 block mt-0.5">Vegetação estabilizada com glicerina vegetal sem toxinas</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onToggleLeedParam('Biofilia & Acesso à Natureza (WELL M02)', setWellNatureAccess, wellNatureAccess)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              wellNatureAccess
                ? 'bg-emerald-900/90 border-[#86efac] shadow-md ring-1 ring-[#86efac]/40'
                : 'bg-emerald-950/60 border-emerald-900 opacity-60 hover:opacity-80'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              wellNatureAccess ? 'bg-[#86efac] text-[#072a1a]' : 'border border-gray-500'
            }`}>
              {wellNatureAccess && <Check className="w-3.5 h-3.5 font-bold" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Conexão Biofílica Ocupacional (WELL M02)</span>
              <span className="text-[11px] text-emerald-200 block mt-0.5">Redução de estresse cognitivo e bem-estar (+15 pts WELL Mind)</span>
            </div>
          </button>

        </div>

      </div>

      {/* Dimension Controls & Pricing Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        
        <div className="space-y-5">
          
          {/* Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Área Total da Parede / Espaço
              </label>
              <span className="text-xl font-serif font-bold text-[#072a1a]">{calcArea} m²</span>
            </div>
            <input
              type="range"
              min={2}
              max={100}
              step={1}
              value={calcArea}
              onChange={(e) => setCalcArea(Number(e.target.value))}
              className="w-full accent-[#072a1a] cursor-pointer h-2.5 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>2 m² (Quadro/Nicho)</span>
              <span>25 m² (Painel Médio)</span>
              <span>100 m² (Átrio Corporativo)</span>
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-xs font-extrabold text-gray-700 uppercase tracking-wider block mb-2">
              Tipologia Biofílica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCalcStyle('preservado')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  calcStyle === 'preservado'
                    ? 'border-[#072a1a] bg-emerald-50 shadow-xs ring-1 ring-[#072a1a]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-[#072a1a] block">Preservado Natural</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">R$ 1.450 / m² • 100% natural sem rega</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcStyle('moss')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  calcStyle === 'moss'
                    ? 'border-[#072a1a] bg-emerald-50 shadow-xs ring-1 ring-[#072a1a]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-[#072a1a] block">Musgo Polar Moss</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">R$ 1.750 / m² • Máxima absorção acústica</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcStyle('permanente')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  calcStyle === 'permanente'
                    ? 'border-[#072a1a] bg-emerald-50 shadow-xs ring-1 ring-[#072a1a]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-bold text-[#072a1a] block">Permanente Anti-UV</span>
                <span className="text-[10px] text-gray-600 block mt-0.5">R$ 1.350 / m² • Real Touch p/ varandas</span>
              </button>
            </div>
          </div>

        </div>

        {/* Financial Summary Card */}
        <div className="bg-[#072a1a] text-white p-6 sm:p-7 rounded-2xl space-y-4 shadow-lg border border-emerald-800">
          <div className="flex justify-between items-center text-xs text-emerald-200 border-b border-emerald-800/80 pb-3">
            <span>Valor de Tabela ({calcArea} m²):</span>
            <span className="font-mono font-bold">R$ {calcSubtotal.toLocaleString('pt-BR')}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#86efac] border-b border-emerald-800/80 pb-3 font-semibold">
            <span>Desconto Exclusivo Parceiro All Green (10%):</span>
            <span className="font-mono font-bold">- R$ {calcPartnerDiscount.toLocaleString('pt-BR')}</span>
          </div>

          <div className="flex justify-between items-center font-serif text-xl sm:text-2xl font-bold text-white pt-1">
            <span>Investimento Estimado:</span>
            <span className="text-[#86efac] font-mono">R$ {calcFinal.toLocaleString('pt-BR')}</span>
          </div>

          <p className="text-[11px] text-emerald-200/80">
            * Inclui estrutura modular Plug & Play, fixação oculta, conformidade LEED (+{currentLeedPoints} créditos) e 5 anos de garantia de fábrica All Green.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() =>
              onOpenQuote(
                `Especificação Técnica Portal: ${calcArea}m² de ${calcStyle.toUpperCase()} - Total R$ ${calcFinal.toLocaleString(
                  'pt-BR'
                )} (LEED: +${currentLeedPoints} créditos / WELL: ${currentWellScore} pts)`
              )
            }
            className="flex-1 py-3.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Emitir Proposta Comercial com Desconto Parceiro</span>
          </button>

          <a
            href={`https://wa.me/5511912720799?text=Ol%C3%A1%2C%20calculei%20no%20portal%20um%20jardim%20de%20${calcArea}m2%20estilo%20${calcStyle}%20com%20${currentLeedPoints}%20cr%C3%A9ditos%20LEED%20estimado%20em%20R$%20${calcFinal.toLocaleString(
              'pt-BR'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-200 active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-[#15803d]" />
            <span>Enviar ao WhatsApp</span>
          </a>
        </div>

      </div>
        </div>
      )}

    </div>
  );
};
