import React, { useState } from 'react';
import { Calculator, Award, Volume2, HeartPulse, Download, Building, Sliders, TrendingUp, ArrowDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ScrollReveal } from './ScrollReveal';

export const LeedCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(24);
  const [buildingType, setBuildingType] = useState<'corporativo' | 'varejo' | 'residencial'>('corporativo');
  const [style, setStyle] = useState<'preservado' | 'permanente' | 'misto'>('preservado');

  // Dynamic calculations based on inputs
  const wellPoints = Math.min(18, Math.round(6 + (area / 10) * (buildingType === 'corporativo' ? 1.4 : 1.1)));
  const leedCredits = Math.min(12, Math.round(4 + (area / 12) * (buildingType === 'corporativo' ? 1.3 : 1.0)));
  const acousticDb = Math.min(16, Math.round(6 + (area / 8) * (style === 'preservado' ? 1.2 : 0.9)));
  const stressReduction = Math.min(35, Math.round(15 + (area / 15) * 2.5));

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Document Header
      doc.setFillColor(7, 42, 26); // #072a1a
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('ALL GREEN DECOR & BIOPHILIA', 15, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatorio Tecnico de Certificacao WELL v2 & LEED v4', 15, 26);
      
      // Date & Code
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Data de Emissao: ${new Date().toLocaleDateString('pt-BR')}`, 15, 45);
      doc.text(`Codigo de Referencia: AG-CALC-${Math.floor(1000 + Math.random() * 9000)}`, 15, 52);
      
      // Section 1: Inputs
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('1. PARAMETROS DO PROJETO', 15, 65);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`- Area Prevista do Jardim Vertical: ${area} m²`, 20, 75);
      doc.text(`- Tipo de Edificacao: ${buildingType.toUpperCase()}`, 20, 82);
      doc.text(`- Estilo Biofilico Selecionado: ${style.toUpperCase()}`, 20, 89);
      
      // Section 2: Metrics Output
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(7, 42, 26);
      doc.text('2. ESTIMATIVA DE IMPACTO AMBIENTAL & ACUSTICO', 15, 105);
      
      doc.setFillColor(243, 247, 244);
      doc.roundedRect(15, 112, 180, 55, 3, 3, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 128, 61);
      doc.text(`+${wellPoints} PONTOS WELL v2 ESTIMADOS`, 22, 124);
      doc.text(`+${leedCredits} CREDITOS LEED v4 APLICAVEIS`, 22, 134);
      doc.text(`-${acousticDb} dB DE REDUCAO DE REVERBERACAO ACUSTICA`, 22, 144);
      doc.text(`-${stressReduction}% DE REDUCAO DE ESTRESSE PERCEBIDO`, 22, 154);
      
      // Notes
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('Nota: As estimativas sao baseadas nos criterios das normas internacionais IWBI (WELL) e USGBC (LEED).', 15, 180);
      doc.text('Para atendimento comercial e amostras fisicas: sac@allgreendecor.com.br | +55 11 5096-3047', 15, 188);

      doc.save(`relatorio-well-leed-allgreen-${area}m2.pdf`);
    } catch (e) {
      console.error('PDF error:', e);
    }
  };

  return (
    <section id="leed-calculator" className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>MÉTRICAS & CERTIFICAÇÕES INTERNACIONAIS</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              Calculadora de Créditos <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">WELL & LEED para Projetos</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Estime instantaneamente o impacto da inserção de vegetação biofílica na pontuação dos selos ambientais e na eficiência acústica do seu imóvel.
            </p>

            <div className="pt-1">
              <a
                href="#biophilic-roi-calculator"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-xs font-bold text-[#15803d] border border-emerald-300 shadow-2xs transition-all hover:scale-102 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Calcular também: ROI Financeiro & Redução de Absenteísmo</span>
                <ArrowDown className="w-3 h-3" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Calculator Main Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12">
          
          {/* Left Controls Box */}
          <ScrollReveal animation="fade-right" delay={0.1} distance={25} className="lg:col-span-5 h-full">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Sliders className="w-5 h-5 text-[#15803d]" />
                  <h3 className="font-serif font-bold text-gray-900 text-lg">
                    Parâmetros da Sua Parede
                  </h3>
                </div>

                {/* Area Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-800">
                    <span>Área Prevista da Parede Verde:</span>
                    <span className="text-lg font-bold font-mono text-[#15803d] bg-emerald-50 px-3 py-1 rounded-lg">
                      {area} m²
                    </span>
                  </div>

                  <input
                    type="range"
                    min={5}
                    max={150}
                    step={1}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#072a1a]"
                  />

                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>5 m²</span>
                    <span>75 m²</span>
                    <span>150 m²</span>
                  </div>
                </div>

                {/* Building Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Tipo de Edificação:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setBuildingType('corporativo')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        buildingType === 'corporativo'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Corporativo
                    </button>

                    <button
                      onClick={() => setBuildingType('varejo')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        buildingType === 'varejo'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Varejo
                    </button>

                    <button
                      onClick={() => setBuildingType('residencial')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        buildingType === 'residencial'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Residencial
                    </button>
                  </div>
                </div>

                {/* Style Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Estilo Biofílico Previsto:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setStyle('preservado')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        style === 'preservado'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Preservado
                    </button>

                    <button
                      onClick={() => setStyle('permanente')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        style === 'permanente'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Permanente
                    </button>

                    <button
                      onClick={() => setStyle('misto')}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        style === 'misto'
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      Misto
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom PDF Download Button */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full py-3.5 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#86efac]" />
                  <span>Baixar Relatório em PDF para Projeto</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Metrics Output Grid (4 Cards) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: WELL */}
            <ScrollReveal animation="fade-up" delay={0.1} distance={20} className="h-full">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col justify-between hover:border-emerald-500 hover:-translate-y-1 transition-all h-full">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    PONTUAÇÃO WELL v2
                  </span>
                  <p className="text-3xl font-serif font-extrabold text-[#072a1a]">
                    +{wellPoints} PONTOS
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Índices de Conforto Térmico, Acústico e Conexão com a Natureza (Cálculo IWBI).
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: LEED */}
            <ScrollReveal animation="fade-up" delay={0.15} distance={20} className="h-full">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col justify-between hover:border-emerald-500 hover:-translate-y-1 transition-all h-full">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    CRÉDITOS LEED v4
                  </span>
                  <p className="text-3xl font-serif font-extrabold text-[#072a1a]">
                    +{leedCredits} CRÉDITOS
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pontos em Qualidade do Ambiente Interno (EQc2) e Materiais de Baixa Emissão.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Acoustic */}
            <ScrollReveal animation="fade-up" delay={0.2} distance={20} className="h-full">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col justify-between hover:border-emerald-500 hover:-translate-y-1 transition-all h-full">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    ATENUAÇÃO ACÚSTICA
                  </span>
                  <p className="text-3xl font-serif font-extrabold text-[#072a1a]">
                    -{acousticDb} dB
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Absorção eficaz de ruídos de alta frequência e redução de eco em salas de reunião.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4: Stress Reduction */}
            <ScrollReveal animation="fade-up" delay={0.25} distance={20} className="h-full">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col justify-between hover:border-emerald-500 hover:-translate-y-1 transition-all h-full">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#15803d] flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    REDUÇÃO DE ESTRESSE
                  </span>
                  <p className="text-3xl font-serif font-extrabold text-[#072a1a]">
                    -{stressReduction}%
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Impacto comprovado do Design Biofílico no bem-estar e foco da equipe.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
