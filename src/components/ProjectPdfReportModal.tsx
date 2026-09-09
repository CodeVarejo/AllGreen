import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  X,
  ShieldCheck,
  Building,
  Award,
  TrendingUp,
  Volume2,
  Droplets,
  Layers,
  Leaf,
  Eye,
  Sliders,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Lock,
  Plus,
  Trash2,
  FileCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  generateProjectReportPdf,
  ProjectReportPdfOptions,
  ProjectReportSectionToggles,
  DEFAULT_PDF_SECTIONS
} from '../utils/generateProjectReportPdf';
import confetti from 'canvas-confetti';

interface ProjectPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProjectReportPdfOptions>;
}

type ModalStep = 'form' | 'preview';

interface SectionMetadata {
  key: keyof ProjectReportSectionToggles;
  number: number;
  title: string;
  shortLabel: string;
  description: string;
  category: 'Cadastro' | 'ESG & Métricas' | 'Financeiro' | 'Técnico' | 'Legal';
  icon: React.ComponentType<{ className?: string }>;
}

const REPORT_SECTIONS: SectionMetadata[] = [
  {
    key: 'overview',
    number: 1,
    title: 'Dados Cadastrais & Tipologia do Projeto',
    shortLabel: 'Dados Cadastrais',
    description: 'Nome, arquiteto responsável, cliente, tipologia do ambiente, área vegetada total (m²) e orçamento estimado.',
    category: 'Cadastro',
    icon: Building,
  },
  {
    key: 'sustainability',
    number: 2,
    title: 'Metas de Sustentabilidade (WELL v2 & LEED v4.1)',
    shortLabel: 'Sustentabilidade (WELL/LEED)',
    description: 'Pontuação de certificação WELL (Mind & Sound), créditos LEED (Materiais e Água Zero) e laudo IPT de acústica.',
    category: 'ESG & Métricas',
    icon: Award,
  },
  {
    key: 'roi',
    number: 3,
    title: 'Impacto Financeiro & ROI Biofílico',
    shortLabel: 'ROI & Economia Financeira',
    description: 'Estimativas COGfx Harvard: ganho de produtividade (+12.5%), queda no absenteísmo (-28%) e retorno anual em reais.',
    category: 'Financeiro',
    icon: TrendingUp,
  },
  {
    key: 'botanical',
    number: 4,
    title: 'Especificação Botânica & Composição Vegetal',
    shortLabel: 'Especificação Botânica',
    description: 'Lista nominal de espécies preservadas selecionadas e tecnologia Plug & Play em módulos de rápida fixação.',
    category: 'Técnico',
    icon: Leaf,
  },
  {
    key: 'technicalCerts',
    number: 5,
    title: 'Laudos Técnicos & Conformidade Normativa (IPT/NBR)',
    shortLabel: 'Laudos IPT & NBR',
    description: 'Retardante a fogo NBR 9442 (Classe B), acústica ISO 354, isenção de pragas e garantia estrutural de 5 anos.',
    category: 'Técnico',
    icon: ShieldCheck,
  },
  {
    key: 'footerValidation',
    number: 6,
    title: 'Carimbo de Validação Digital & Assinatura',
    shortLabel: 'Validação & CNPJ',
    description: 'Código de autenticação criptográfico, CNPJ da engenharia, showroom e dados de responsabilidade técnica.',
    category: 'Legal',
    icon: FileCheck,
  },
];

export const ProjectPdfReportModal: React.FC<ProjectPdfReportModalProps> = ({
  isOpen,
  onClose,
  initialData = {},
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('preview');

  // Form State
  const [projectName, setProjectName] = useState(initialData.projectName || 'Projeto Biofílico Executivo Paulista');
  const [clientName, setClientName] = useState(initialData.clientName || 'Sede Corporativa & Hub de Inovação');
  const [architectName, setArchitectName] = useState(initialData.architectName || 'Albuquerque & Associados Arquitetura');
  const [projectCode, setProjectCode] = useState(initialData.projectCode || `AG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [roomType, setRoomType] = useState(initialData.roomType || 'Living Corporativo & Salas de Reunião');
  const [totalAreaM2, setTotalAreaM2] = useState<number>(initialData.totalAreaM2 || 28.5);
  const [estimatedBudget, setEstimatedBudget] = useState(initialData.estimatedBudget || 'R$ 38.500 - R$ 44.000');
  const [wellScore, setWellScore] = useState<number>(initialData.wellScore || 88);
  const [leedCredits, setLeedCredits] = useState<number>(initialData.leedCredits || 15);
  const [acousticNrc, setAcousticNrc] = useState<number>(initialData.acousticNrc || 0.89);
  const [productivityGain, setProductivityGain] = useState<number>(initialData.productivityGainPercent || 14);
  const [absenteeismReduction, setAbsenteeismReduction] = useState<number>(initialData.absenteeismReductionPercent || 30);
  const [annualSavings, setAnnualSavings] = useState(initialData.annualSavingsFormatted || 'R$ 54.200 / ano');
  const [solutionType, setSolutionType] = useState(initialData.solutionType || 'Jardim Vertical Preservado Plug & Play (Módulos 100x50cm)');
  
  const [speciesList, setSpeciesList] = useState<string[]>(
    initialData.speciesSelected || ['Musgo Polar Moss Escandinavo', 'Eucalipto Preservado', 'Samambaia Real Touch', 'Herderas']
  );
  const [newSpeciesInput, setNewSpeciesInput] = useState('');

  // Section Toggles State for PDF Preview
  const [sectionToggles, setSectionToggles] = useState<ProjectReportSectionToggles>({
    ...DEFAULT_PDF_SECTIONS,
    ...(initialData.sections || {}),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<'fit' | '100%'>('100%');

  if (!isOpen) return null;

  const activeSectionCount = Object.values(sectionToggles).filter(Boolean).length;

  const handleToggleSection = (key: keyof ProjectReportSectionToggles) => {
    setSectionToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setDownloadSuccess(false);
  };

  const handleSetAllSections = (enable: boolean) => {
    setSectionToggles({
      overview: enable,
      sustainability: enable,
      roi: enable,
      botanical: enable,
      technicalCerts: enable,
      footerValidation: enable,
    });
    setDownloadSuccess(false);
  };

  // Presets
  const handleApplyPreset = (presetType: 'all' | 'esg' | 'commercial' | 'technical') => {
    switch (presetType) {
      case 'all':
        handleSetAllSections(true);
        break;
      case 'esg':
        setSectionToggles({
          overview: true,
          sustainability: true,
          roi: false,
          botanical: true,
          technicalCerts: true,
          footerValidation: true,
        });
        break;
      case 'commercial':
        setSectionToggles({
          overview: true,
          sustainability: false,
          roi: true,
          botanical: false,
          technicalCerts: true,
          footerValidation: true,
        });
        break;
      case 'technical':
        setSectionToggles({
          overview: true,
          sustainability: true,
          roi: false,
          botanical: true,
          technicalCerts: true,
          footerValidation: true,
        });
        break;
    }
    setDownloadSuccess(false);
  };

  const handleAddSpecies = () => {
    if (newSpeciesInput.trim() && !speciesList.includes(newSpeciesInput.trim())) {
      setSpeciesList([...speciesList, newSpeciesInput.trim()]);
      setNewSpeciesInput('');
    }
  };

  const handleRemoveSpecies = (item: string) => {
    setSpeciesList(speciesList.filter((s) => s !== item));
  };

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
        estimatedBudget,
        wellScore,
        leedCredits,
        acousticNrc,
        productivityGainPercent: productivityGain,
        absenteeismReductionPercent: absenteeismReduction,
        annualSavingsFormatted: annualSavings,
        solutionType,
        speciesSelected: speciesList,
        sections: sectionToggles,
      });

      setIsGenerating(false);
      setDownloadSuccess(true);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#86efac', '#15803d', '#072a1a', '#22c55e'],
        });
      } catch (e) {
        // ignore
      }
    }, 450);
  };

  return (
    <div
      id="project-pdf-report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Modal Top Header */}
        <div className="bg-[#072a1a] text-white px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between shrink-0 border-b border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-[#86efac] border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-white">
                  Gerador & Pré-visualizador de Laudo Técnico PDF
                </h2>
                <span className="px-2 py-0.5 bg-[#86efac] text-[#072a1a] rounded-full text-[10px] font-mono font-extrabold uppercase">
                  A4 Oficial • v2.4
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                Personalize, selecione as seções desejadas e visualize o documento antes de gerar o download.
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-pdf-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Wizard Bar */}
        <div className="bg-emerald-950/40 px-5 py-2.5 sm:px-6 border-b border-emerald-900/40 flex items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2">
            {/* Step 1 Tab Button */}
            <button
              type="button"
              id="tab-btn-parameters"
              onClick={() => setCurrentStep('form')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === 'form'
                  ? 'bg-white text-[#072a1a] shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Parâmetros & Dados</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />

            {/* Step 2 Tab Button (Preview) */}
            <button
              type="button"
              id="tab-btn-preview"
              onClick={() => setCurrentStep('preview')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === 'preview'
                  ? 'bg-[#86efac] text-[#072a1a] shadow-sm font-extrabold'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>2. Pré-visualização & Seletor de Seções</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#072a1a]/20 text-[#072a1a] rounded text-[10px] font-mono">
                {activeSectionCount}/6
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Código: {projectCode}</span>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-[#f3f7f4]">

          {/* ================= STEP 1: FORM PARAMETERS ================= */}
          {currentStep === 'form' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Quick Info Box */}
              <div className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4 text-[#15803d]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      Configure os Dados e Métricas do Projeto
                    </h3>
                    <p className="text-xs text-gray-500">
                      Estes dados preencherão automaticamente o laudo técnico e os cálculos executivos.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('preview')}
                  className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-all"
                >
                  <span>Avançar para Pré-visualização</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#86efac]" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h4 className="font-bold text-xs text-[#072a1a] uppercase tracking-wider flex items-center gap-2">
                  <span>1. Identificação do Projeto & Responsabilidade Técnica</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
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
                      Cliente / Organização
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
                      Arquiteto / Especificador
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
                      Tipologia / Ambiente
                    </label>
                    <input
                      type="text"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Área Vegetada (m²)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={totalAreaM2}
                      onChange={(e) => setTotalAreaM2(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Investimento Estimado
                    </label>
                    <input
                      type="text"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>
                </div>

                <h4 className="font-bold text-xs text-[#072a1a] uppercase tracking-wider pt-3 border-t border-gray-100 flex items-center gap-2">
                  <span>2. Métricas de Sustentabilidade & Desempenho Biofílico</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Pontos WELL v2 (pts)
                    </label>
                    <input
                      type="number"
                      value={wellScore}
                      onChange={(e) => setWellScore(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Créditos LEED v4.1 (cr)
                    </label>
                    <input
                      type="number"
                      value={leedCredits}
                      onChange={(e) => setLeedCredits(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Ganho Produtividade (%)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={productivityGain}
                      onChange={(e) => setProductivityGain(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Economia Anual
                    </label>
                    <input
                      type="text"
                      value={annualSavings}
                      onChange={(e) => setAnnualSavings(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>
                </div>

                <h4 className="font-bold text-xs text-[#072a1a] uppercase tracking-wider pt-3 border-t border-gray-100 flex items-center gap-2">
                  <span>3. Espécies Botânicas Especificadas</span>
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Adicionar espécie botânica (ex: Musgo Fofão, Avenca...)"
                      value={newSpeciesInput}
                      onChange={(e) => setNewSpeciesInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSpecies();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-300 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecies}
                      className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {speciesList.map((species) => (
                      <span
                        key={species}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#072a1a] border border-emerald-200 rounded-lg text-xs font-medium"
                      >
                        <Leaf className="w-3 h-3 text-[#15803d]" />
                        <span>{species}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecies(species)}
                          className="text-gray-400 hover:text-red-600 ml-0.5 cursor-pointer"
                          title="Remover espécie"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Next Step Bar */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep('preview')}
                  className="px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span>Ir para a Pré-visualização & Seleção de Seções</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ================= STEP 2: INTERACTIVE PREVIEW & SECTION TOGGLES ================= */}
          {currentStep === 'preview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Presets & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#072a1a] flex items-center justify-center shrink-0">
                      <Sliders className="w-3.5 h-3.5 text-[#15803d]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">
                        Filtro e Seleção Rápida de Seções
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Marque ou desmarque as seções que farão parte da composição final do documento PDF.
                      </p>
                    </div>
                  </div>

                  {/* Quick Preset Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-1">
                      Presets:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('all')}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        activeSectionCount === 6
                          ? 'bg-[#072a1a] text-white border-[#072a1a]'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      🌟 Completo (6)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('esg')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 transition-all cursor-pointer"
                    >
                      🌿 Foco ESG
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('commercial')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 transition-all cursor-pointer"
                    >
                      📈 Foco Comercial
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('technical')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 transition-all cursor-pointer"
                    >
                      📐 Arquitetônico
                    </button>
                  </div>
                </div>

                {/* Section Toggle Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100">
                  {REPORT_SECTIONS.map((sec) => {
                    const isChecked = !!sectionToggles[sec.key];
                    const IconComp不易 = sec.icon;

                    return (
                      <button
                        key={sec.key}
                        type="button"
                        id={`toggle-section-${sec.key}`}
                        onClick={() => handleToggleSection(sec.key)}
                        className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-400/80 ring-1 ring-emerald-500/20 text-[#072a1a]'
                            : 'bg-gray-50/60 border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#15803d]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-300" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold truncate ${isChecked ? 'text-gray-900' : 'text-gray-400'}`}>
                              {sec.number}. {sec.shortLabel}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              isChecked ? 'bg-emerald-200 text-[#072a1a]' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {isChecked ? 'Incluído' : 'Oculto'}
                            </span>
                          </div>
                          <p className={`text-[10px] line-clamp-2 mt-0.5 leading-tight ${isChecked ? 'text-gray-600' : 'text-gray-400'}`}>
                            {sec.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live PDF Document Preview Canvas (Styled as Realistic A4 Page) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#15803d]" />
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Pré-visualização do Documento A4 (Em Tempo Real)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[11px] text-gray-500">
                      {activeSectionCount} de 6 seções ativas no documento
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('form')}
                      className="text-[11px] text-[#15803d] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Editar Dados</span>
                    </button>
                  </div>
                </div>

                {/* Simulated A4 Document Container */}
                <div className="bg-gray-300/80 p-3 sm:p-5 rounded-2xl border border-gray-300 flex justify-center shadow-inner overflow-x-auto">
                  
                  <div className="w-full max-w-2xl bg-[#f8faf8] rounded-xl shadow-xl border border-gray-300 text-gray-900 overflow-hidden font-sans text-xs transition-all">
                    
                    {/* Simulated PDF Header */}
                    <div className="bg-[#072a1a] text-white p-4 sm:p-5 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#86efac]">
                            ALL GREEN DECOR & BIOPHILIA
                          </h1>
                          <p className="text-[9px] sm:text-[10px] text-emerald-200 uppercase tracking-wider mt-0.5">
                            Laudo Técnico Executivo & Metas de Sustentabilidade (WELL / LEED / ROI)
                          </p>
                          <p className="text-[8px] text-emerald-300/80">
                            Tecnologia Preservada Plug & Play • Zero Irrigação • Homologação IPT
                          </p>
                        </div>

                        <div className="text-right text-[8px] font-mono text-emerald-200">
                          <div className="font-bold text-white text-[9px]">CÓDIGO: {projectCode}</div>
                          <div>EMISSÃO: {new Date().toLocaleDateString('pt-BR')}</div>
                          <div className="text-[#86efac] font-bold">STATUS: HOMOLOGADO</div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated PDF Body Sections */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      
                      {/* Section 1: Overview */}
                      {sectionToggles.overview ? (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-[11px] text-[#072a1a] flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>1. DADOS CADASTRAIS DO PROJETO</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Seção Ativa
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-gray-400 font-semibold block">Nome do Projeto:</span>
                              <strong className="text-gray-800">{projectName}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold block">Ambiente / Tipologia:</span>
                              <strong className="text-gray-800">{roomType}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold block">Arquiteto / Especificador:</span>
                              <strong className="text-gray-800">{architectName}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold block">Área Vegetada Total:</span>
                              <strong className="text-[#072a1a] font-bold">{totalAreaM2} m² (Módulos Plug & Play)</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold block">Cliente / Empresa:</span>
                              <strong className="text-gray-800">{clientName}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold block">Investimento Estimado:</span>
                              <strong className="text-[#15803d] font-bold">{estimatedBudget}</strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 text-center text-[10px] text-gray-400 italic">
                          [Seção 1: Dados Cadastrais desmarcada - Não será impressa no PDF]
                        </div>
                      )}

                      {/* Section 2: Sustainability */}
                      {sectionToggles.sustainability ? (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2.5 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-[11px] text-[#072a1a] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>2. METAS DE SUSTENTABILIDADE & PONTUAÇÃO (WELL v2 / LEED v4.1)</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Seção Ativa
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            <div className="p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                              <span className="text-[8px] text-gray-500 font-bold block">PONTOS WELL</span>
                              <strong className="text-xs text-[#072a1a]">{wellScore} pts</strong>
                              <span className="text-[7px] text-[#15803d] block">Platinum S04</span>
                            </div>

                            <div className="p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                              <span className="text-[8px] text-gray-500 font-bold block">CRÉDITOS LEED</span>
                              <strong className="text-xs text-[#072a1a]">{leedCredits} cr</strong>
                              <span className="text-[7px] text-[#15803d] block">Materiais Reg.</span>
                            </div>

                            <div className="p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                              <span className="text-[8px] text-gray-500 font-bold block">ABSORÇÃO IPT</span>
                              <strong className="text-xs text-[#072a1a]">NRC {acousticNrc}</strong>
                              <span className="text-[7px] text-[#15803d] block">ISO 354</span>
                            </div>

                            <div className="p-1.5 bg-emerald-50/70 rounded-lg border border-emerald-100">
                              <span className="text-[8px] text-gray-500 font-bold block">CONSUMO ÁGUA</span>
                              <strong className="text-xs text-sky-700">0 L / ano</strong>
                              <span className="text-[7px] text-sky-600 block">100% Preservado</span>
                            </div>
                          </div>

                          <p className="text-[9px] text-gray-500 leading-snug">
                            • WELL Mind & Sound: Redução de estresse cortisol (-22%), atenuação acústica de reverberação em frequências de voz humana.<br />
                            • LEED v4.1 BD+C / ID+C: Créditos de Materiais Regionais, Avaliação de Ciclo de Vida (LCA) favorável e 0 litros de água.
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 text-center text-[10px] text-gray-400 italic">
                          [Seção 2: Metas de Sustentabilidade desmarcada - Não será impressa no PDF]
                        </div>
                      )}

                      {/* Section 3: ROI */}
                      {sectionToggles.roi ? (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-[11px] text-[#072a1a] flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>3. IMPACTO FINANCEIRO & ROI BIOFÍLICO (ESTUDOS HARVARD)</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Seção Ativa
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
                              <span className="text-[8px] text-[#15803d] font-bold block">PRODUTIVIDADE</span>
                              <strong className="text-xs text-[#072a1a]">+{productivityGain}%</strong>
                              <span className="text-[7px] text-gray-500 block">Foco & Tomada de Decisão</span>
                            </div>

                            <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
                              <span className="text-[8px] text-[#15803d] font-bold block">ABSENTEÍSMO</span>
                              <strong className="text-xs text-[#072a1a]">-{absenteeismReduction}%</strong>
                              <span className="text-[7px] text-gray-500 block">Menos Queixas de Estresse</span>
                            </div>

                            <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
                              <span className="text-[8px] text-[#15803d] font-bold block">RETORNO ANUAL</span>
                              <strong className="text-xs text-[#072a1a]">{annualSavings}</strong>
                              <span className="text-[7px] text-gray-500 block">Payback em ~7.2 meses</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 text-center text-[10px] text-gray-400 italic">
                          [Seção 3: Impacto Financeiro & ROI desmarcada - Não será impressa no PDF]
                        </div>
                      )}

                      {/* Section 4: Botanical Specs */}
                      {sectionToggles.botanical ? (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-[11px] text-[#072a1a] flex items-center gap-1.5">
                              <Leaf className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>4. ESPECIFICAÇÃO BOTÂNICA & COMPOSIÇÃO VEGETAL</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Seção Ativa
                            </span>
                          </div>

                          <div className="text-[10px] space-y-1">
                            <div>
                              <span className="text-gray-400 font-semibold">Espécies Selecionadas: </span>
                              <strong className="text-gray-800">{speciesList.join(', ')}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 font-semibold">Tecnologia Empregada: </span>
                              <span className="text-gray-700">{solutionType}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 text-center text-[10px] text-gray-400 italic">
                          [Seção 4: Especificação Botânica desmarcada - Não será impressa no PDF]
                        </div>
                      )}

                      {/* Section 5: Technical Certifications */}
                      {sectionToggles.technicalCerts ? (
                        <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <span className="font-bold text-[11px] text-[#072a1a] flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                              <span>5. LAUDOS TÉCNICOS & HOMOLOGAÇÃO NORMATIVA (IPT / NBR)</span>
                            </span>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                              Seção Ativa
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 text-[9px] text-[#15803d] font-bold">
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#15803d]" />
                              <span>Retardante a Fogo NBR 9442 (Classe B)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#15803d]" />
                              <span>Acústica ISO 354 (Laudo IPT nº 1.189.432)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#15803d]" />
                              <span>Isento de Pragas e Fungos (Glicerina)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#15803d]" />
                              <span>5 Anos de Garantia Estrutural Fabril</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100/70 rounded-lg border border-dashed border-gray-300 text-center text-[10px] text-gray-400 italic">
                          [Seção 5: Laudos Técnicos & NBR desmarcada - Não será impressa no PDF]
                        </div>
                      )}

                      {/* Empty warning if no sections selected */}
                      {activeSectionCount === 0 && (
                        <div className="p-6 bg-amber-50 rounded-xl border border-amber-300 text-center space-y-1.5 text-amber-900">
                          <p className="font-bold text-xs">Atenção: Nenhuma seção de conteúdo está marcada.</p>
                          <p className="text-[11px] text-amber-800">
                            Use os botões de seleção acima ou escolha um Preset para incluir módulos no documento.
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Simulated PDF Footer */}
                    {sectionToggles.footerValidation ? (
                      <div className="bg-[#072a1a] text-white p-3 text-[8px] flex items-center justify-between">
                        <div>
                          <div className="text-[#86efac] font-bold">ALL GREEN ENGENHARIA & BIOFILIA LTDA • CNPJ 38.412.980/0001-54</div>
                          <div className="text-emerald-200">Av. Faria Lima, Jardins - SP • allgreendecor.com.br</div>
                        </div>
                        <div className="text-right font-mono text-emerald-300">
                          VALIDAÇÃO DIGITAL #AG-EXEC
                        </div>
                      </div>
                    ) : (
                      <div className="p-1.5 bg-gray-200 text-center text-[9px] text-gray-500 italic">
                        [Rodapé de Validação Digital Oculto]
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* Download Success Confirmation Alert */}
              {downloadSuccess && (
                <div className="p-4 bg-emerald-100 rounded-2xl border border-emerald-300 flex items-center justify-between text-xs text-emerald-950 animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <strong className="block text-emerald-900">PDF Personalizado Gerado com Sucesso!</strong>
                      <span>O arquivo foi baixado com as {activeSectionCount} seções selecionadas.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGeneratePdf}
                    className="text-[#15803d] font-bold hover:underline cursor-pointer text-xs"
                  >
                    Baixar novamente
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-gray-50 p-4 sm:p-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-gray-600 hover:text-gray-900 font-semibold cursor-pointer rounded-xl hover:bg-gray-200/60 transition-colors"
            >
              Cancelar
            </button>

            {currentStep === 'preview' ? (
              <button
                type="button"
                onClick={() => setCurrentStep('form')}
                className="px-3.5 py-2.5 text-xs text-[#072a1a] hover:bg-emerald-100/60 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-gray-200 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Editar Parâmetros</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep('preview')}
                className="px-3.5 py-2.5 text-xs text-[#072a1a] hover:bg-emerald-100/60 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-gray-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Pré-visualização</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              id="download-project-pdf-confirm-btn"
              disabled={isGenerating || activeSectionCount === 0}
              onClick={handleGeneratePdf}
              className="w-full sm:w-auto px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#86efac] border-t-transparent rounded-full animate-spin" />
                  <span>Compilando Laudo PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#86efac]" />
                  <span>Baixar Relatório em PDF ({activeSectionCount} seções)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectPdfReportModal;
