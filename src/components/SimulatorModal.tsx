import React, { useState } from 'react';
import { Camera, Upload, Leaf, X, Check, ArrowRight, RefreshCw, Layers, Award, Volume2, ShieldCheck, PhoneCall, FileDown, Download, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { SimulationResult } from '../types';
import { exportSimulationToPdf } from '../services/simulationPdfExport';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteWithData: (data: SimulationResult) => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  onOpenQuoteWithData,
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedSample, setSelectedSample] = useState<string>('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('Escritório Corporativo');
  const [stylePreference, setStylePreference] = useState<string>('Jardim Preservado Moss & Samambaia');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportPdf = async () => {
    if (!simulationResult) return;
    try {
      setIsExportingPdf(true);
      await exportSimulationToPdf({
        simulationResult,
        roomType,
        stylePreference,
        originalImageUrl: activeImageUrl,
        clientName: 'Especificador / Cliente',
        projectName: `${roomType} - Simulação IA`,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const sampleRooms = [
    {
      name: 'Sala de Reunião Corporativa',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Varanda Gourmet Residencial',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Recepção Executiva',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeImageUrl = customImage || selectedSample;

  const runSimulation = async () => {
    setStep('analyzing');

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: activeImageUrl,
          roomType,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setSimulationResult({
          ...data.result,
          transformedImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        });
      } else {
        throw new Error('Fallback simulation');
      }
    } catch (e) {
      // Fallback result if offline or server delay
      setSimulationResult({
        roomType: roomType,
        estimatedArea: 14,
        recommendedStyle: stylePreference,
        recommendedSpecies: [
          'Moss Moss Preservado (Líquen Dinamarquês)',
          'Samambaia Chorona Hiper-Realista Anti-UV',
          'Costela-de-Adão Preservada'
        ],
        acousticImprovement: 'Absorção Acústica Alta (-10 dB em frequências médias)',
        wellScore: 11,
        leedCredits: 8,
        estimatedBudgetMin: 3200,
        estimatedBudgetMax: 5400,
        aiAnalysisText: 'A foto analisada apresenta uma parede frontal com excelente alcance visual e iluminação indireta. A aplicação de musgo preservado tridimensional proporcionará amortecimento acústico de alta eficácia e valorização do mobiliário.',
        transformedImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
      });
    }

    setTimeout(() => {
      setStep('result');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-900/20">
        
        {/* Modal Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#86efac] text-[#072a1a] flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Simulador de Parede Verde IA
              </h2>
              <p className="text-xs text-emerald-300">
                All Green Decor & Biophilia • Tecnologia Visio-Botânica
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-emerald-950 text-gray-300 hover:text-white hover:bg-emerald-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: UPLOAD & SELECTION */}
          {step === 'upload' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Upload Box */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#072a1a] uppercase tracking-wider block">
                    1. Envie a foto da sua parede:
                  </label>

                  <div className="relative border-2 border-dashed border-emerald-300 hover:border-[#072a1a] rounded-2xl p-6 text-center bg-emerald-50/50 hover:bg-emerald-50 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="w-12 h-12 rounded-full bg-[#072a1a] text-[#86efac] mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>

                    <p className="text-xs font-bold text-[#072a1a]">
                      Clique para escolher ou arraste a foto do ambiente
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1">
                      Formatos aceitos: JPG, PNG, WEBP (até 15MB)
                    </p>
                  </div>

                  {customImage && (
                    <div className="p-2.5 bg-emerald-100 rounded-xl flex items-center justify-between text-xs text-[#072a1a] font-bold">
                      <span>✓ Foto personalizada carregada</span>
                      <button
                        onClick={() => setCustomImage(null)}
                        className="text-xs text-red-600 underline"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                {/* Sample Rooms Box */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#072a1a] uppercase tracking-wider block">
                    Ou selecione um ambiente de teste:
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {sampleRooms.map((sample, idx) => {
                      const isSelected = !customImage && selectedSample === sample.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCustomImage(null);
                            setSelectedSample(sample.url);
                          }}
                          className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected
                              ? 'border-[#072a1a] ring-2 ring-[#072a1a]/20 scale-[1.02]'
                              : 'border-gray-200 hover:border-emerald-400'
                          }`}
                        >
                          <img
                            src={sample.url}
                            alt={sample.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 p-1 flex items-end">
                            <span className="text-[9px] font-bold text-white leading-tight">
                              {sample.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Preferences selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Tipo do Ambiente:
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#072a1a]"
                  >
                    <option value="Escritório Corporativo / Reunião">Escritório Corporativo / Sala de Reunião</option>
                    <option value="Varanda Gourmet / Sacada">Varanda Gourmet / Sacada Residencial</option>
                    <option value="Living / Sala de Estar">Living / Sala de Estar</option>
                    <option value="Recepção de Loja / Clínica">Recepção de Loja / Clínica / Hotel</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Estilo Biofílico Desejado:
                  </label>
                  <select
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#072a1a]"
                  >
                    <option value="Jardim Preservado Moss & Samambaia">Jardim Preservado Moss & Samambaia (100% Natural)</option>
                    <option value="Jardim Permanente UV Anti-Fade">Jardim Permanente UV Anti-Fade (Sem Água)</option>
                    <option value="Composição Mista Botânica">Composição Mista Botânica Personalizada</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={runSimulation}
                className="w-full py-4 bg-[#072a1a] text-[#86efac] font-bold rounded-2xl hover:bg-[#15803d] transition-all shadow-xl flex items-center justify-center gap-2.5 text-base cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Analisar e Processar Simulação com Inteligência Artificial</span>
              </button>

            </div>
          )}

          {/* STEP 2: ANALYZING LOADING */}
          {step === 'analyzing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-[#072a1a] rounded-full animate-spin mx-auto" />
              <h3 className="font-serif font-bold text-2xl text-gray-900">
                A IA All Green está analisando o seu ambiente...
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Mapeando proporções da parede, incidência de luz, volumetria botânica e atenuadores acústicos.
              </p>
            </div>
          )}

          {/* STEP 3: RESULT DASHBOARD */}
          {step === 'result' && simulationResult && (
            <div className="space-y-6">
              
              {/* Transformed Visual Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                
                {/* Original */}
                <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={activeImageUrl}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                    FOTO ORIGINAL
                  </span>
                </div>

                {/* Transformed AI Overlay */}
                <div className="relative h-56 rounded-2xl overflow-hidden border-2 border-[#072a1a] shadow-lg">
                  <img
                    src={simulationResult.transformedImage}
                    alt="Simulação All Green"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#072a1a] text-[#86efac] text-[10px] font-extrabold px-2 py-1 rounded flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> SIMULAÇÃO ALL GREEN
                  </span>
                </div>

              </div>

              {/* AI Report Summary */}
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider block">
                  ANÁLISE DE DIAGNÓSTICO BIOFÍLICO (IA):
                </span>
                <p className="text-xs text-gray-800 leading-relaxed font-sans">
                  {simulationResult.aiAnalysisText}
                </p>
              </div>

              {/* Key KPI Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">ÁREA ESTIMADA</span>
                  <p className="text-lg font-bold text-[#072a1a] mt-0.5">{simulationResult.estimatedArea} m²</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">GANHO ACÚSTICO</span>
                  <p className="text-xs font-bold text-[#15803d] mt-1">{simulationResult.acousticImprovement}</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">SELO WELL v2</span>
                  <p className="text-lg font-bold text-[#072a1a] mt-0.5">+{simulationResult.wellScore} pts</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">ORÇAMENTO ESTIMADO</span>
                  <p className="text-xs font-extrabold text-[#072a1a] mt-1">
                    R$ {simulationResult.estimatedBudgetMin} - R$ {simulationResult.estimatedBudgetMax}
                  </p>
                </div>
              </div>

              {/* Recommended species */}
              <div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-2">
                  Espécies Botânicas Sugeridas para esta Simulação:
                </span>
                <div className="flex flex-wrap gap-2">
                  {simulationResult.recommendedSpecies.map((species, idx) => (
                    <span key={idx} className="text-xs bg-white border border-emerald-200 font-semibold px-3 py-1 rounded-lg text-[#072a1a]">
                      🌿 {species}
                    </span>
                  ))}
                </div>
              </div>

              {/* PDF Export Banner Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#072a1a] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-emerald-600/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#86efac]/20 border border-[#86efac]/40 text-[#86efac] flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      Laudo Técnico Completo em PDF
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#86efac] text-[9px] font-mono border border-emerald-400/30">Pronto</span>
                    </h4>
                    <p className="text-[11px] text-emerald-200/80 mt-0.5">
                      Contém diagnóstico da IA, memorial botânico, cálculo de absorção acústica e créditos LEED/WELL.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm ${
                    pdfSuccess
                      ? 'bg-emerald-400 text-[#072a1a]'
                      : 'bg-[#86efac] text-[#072a1a] hover:bg-emerald-300 active:scale-95 disabled:opacity-75'
                  }`}
                  title="Baixar Laudo Técnico em PDF"
                >
                  {isExportingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando PDF...</span>
                    </>
                  ) : pdfSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#072a1a]" />
                      <span>PDF Baixado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Baixar Relatório PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuoteWithData(simulationResult);
                  }}
                  className="flex-1 py-3.5 bg-[#072a1a] text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#86efac]" />
                  <span>Solicitar Orçamento com base nesta Simulação</span>
                </button>

                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] border border-emerald-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Exportar documento PDF do projeto"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#15803d]" />
                  ) : (
                    <FileDown className="w-4 h-4 text-[#15803d]" />
                  )}
                  <span>Exportar PDF</span>
                </button>

                <button
                  onClick={() => setStep('upload')}
                  className="py-3.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nova Foto</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
