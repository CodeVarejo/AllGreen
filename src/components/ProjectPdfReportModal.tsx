import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Building,
  Award,
  TrendingUp,
  Volume2,
  Droplets,
  Layers,
  Leaf
} from 'lucide-react';
import { generateProjectReportPdf, ProjectReportPdfOptions } from '../utils/generateProjectReportPdf';
import confetti from 'canvas-confetti';

interface ProjectPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProjectReportPdfOptions>;
}

export const ProjectPdfReportModal: React.FC<ProjectPdfReportModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}: ProjectPdfReportModalProps) => {
  const data: Partial<ProjectReportPdfOptions> = initialData;
  const [projectName, setProjectName] = useState(data.projectName || 'Projeto Biofílico Executivo Paulista');
  const [clientName, setClientName] = useState(data.clientName || 'Sede Corporativa & Hub de Inovação');
  const [architectName, setArchitectName] = useState(data.architectName || 'Albuquerque & Associados Arquitetura');
  const [projectCode, setProjectCode] = useState(data.projectCode || `AG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [roomType, setRoomType] = useState(data.roomType || 'Living Corporativo & Salas de Reunião');
  const [totalAreaM2, setTotalAreaM2] = useState<number>(data.totalAreaM2 || 28.5);
  const [wellScore, setWellScore] = useState<number>(data.wellScore || 88);
  const [leedCredits, setLeedCredits] = useState<number>(data.leedCredits || 15);
  const [productivityGain, setProductivityGain] = useState<number>(data.productivityGainPercent || 14);
  const [absenteeismReduction, setAbsenteeismReduction] = useState<number>(data.absenteeismReductionPercent || 30);
  const [annualSavings, setAnnualSavings] = useState(data.annualSavingsFormatted || 'R$ 54.200 / ano');

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      generateProjectReportPdf({
        projectName,
        clientName,
        architectName,
        projectCode,
        roomType,
        totalAreaM2,
        wellScore,
        leedCredits,
        productivityGainPercent: productivityGain,
        absenteeismReductionPercent: absenteeismReduction,
        annualSavingsFormatted: annualSavings,
        acousticNrc: 0.89,
      });

      setIsGenerating(false);
      setDownloadSuccess(true);

      try {
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#86efac', '#15803d', '#072a1a'],
        });
      } catch (e) {
        // ignore
      }
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      id="project-pdf-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Modal Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-[#86efac] border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  Gerador de Laudo & Relatório Executivo PDF
                </span>
                <span className="px-2 py-0.5 bg-[#86efac] text-[#072a1a] rounded text-[10px] font-bold">
                  PDF Oficial
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                Consolidação técnica com simulação biofílica, laudos IPT e metas de sustentabilidade (WELL & LEED)
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-pdf-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            aria-label="Fechar modal de geração de PDF"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 bg-[#f9fbf9] space-y-5">
          
          {/* Summary Preview Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Leaf className="w-4 h-4 text-[#15803d]" />
                <span>Pré-visualização do Laudo Consolidado All Green</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {projectCode}
              </span>
            </div>

            {/* Quick Metrics Badges in Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold block">PONTOS WELL</span>
                <strong className="text-base text-[#072a1a] font-bold">{wellScore} pts</strong>
                <span className="text-[9px] text-[#15803d] block font-semibold">Platinum S04/M02</span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold block">CRÉDITOS LEED</span>
                <strong className="text-base text-[#072a1a] font-bold">{leedCredits} cr</strong>
                <span className="text-[9px] text-[#15803d] block font-semibold">Materiais Regionais</span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold block">ABSORÇÃO IPT</span>
                <strong className="text-base text-[#072a1a] font-bold">NRC 0.89</strong>
                <span className="text-[9px] text-[#15803d] block font-semibold">ISO 354 Homologado</span>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-gray-500 font-bold block">CONSUMO ÁGUA</span>
                <strong className="text-base text-sky-700 font-bold">0 Litros/ano</strong>
                <span className="text-[9px] text-sky-600 block font-semibold">100% Preservado</span>
              </div>
            </div>
          </div>

          {/* Form to Customize PDF Metadata */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">
              Parâmetros do Documento
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Cliente / Empresa
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Arquiteto / Escritório Especificador
                </label>
                <input
                  type="text"
                  value={architectName}
                  onChange={(e) => setArchitectName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Área Vegetada do Projeto (m²)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={totalAreaM2}
                  onChange={(e) => setTotalAreaM2(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>
            </div>

            {/* Inclusions checklist */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Laudo IPT de Fogo NBR 9442</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Memorial de Economia Hídrica (0L/ano)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Metas de Produtividade & Bem-estar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Garantia Estrutural All Green de 5 Anos</span>
              </div>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803d]" />
                <span>
                  <strong>PDF baixado com sucesso!</strong> Arquivo salvo em seus Downloads.
                </span>
              </div>
              <button
                type="button"
                onClick={handleGeneratePdf}
                className="text-[#15803d] font-bold hover:underline cursor-pointer"
              >
                Gerar novamente
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-gray-50 p-4 sm:p-5 border-t border-gray-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            id="download-project-pdf-confirm-btn"
            disabled={isGenerating}
            onClick={handleGeneratePdf}
            className="px-6 py-3 bg-[#072a1a] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <span>Compilando Laudo PDF...</span>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#86efac]" />
                <span>Baixar Relatório Consolidado (PDF)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
