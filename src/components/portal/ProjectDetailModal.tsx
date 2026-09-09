import React from 'react';
import {
  X,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Camera,
  Download,
  PhoneCall,
  Award,
  Layers,
  Leaf,
  Droplets,
  Volume2,
  ShieldCheck,
  Flame,
  Wrench,
  ArrowLeftRight,
  History,
  Edit3,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';

interface ProjectDetailModalProps {
  project: PortalProject | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onDownloadSpecPdf: (project: PortalProject) => void;
  onCompareWithAnother: (projectId: string) => void;
  onOpenVersionHistory: (project: PortalProject) => void;
  onOpenEditProject: (project: PortalProject) => void;
  onStatusChange?: (projectId: string, newStatus: PortalProject['status']) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  user,
  isOpen,
  onClose,
  onDownloadSpecPdf,
  onCompareWithAnother,
  onOpenVersionHistory,
  onOpenEditProject,
  onStatusChange,
}) => {
  if (!isOpen || !project) return null;

  const versionCount = project.versionHistory?.length || 1;
  const currentVersionNumber = versionCount;

  const getStatusBadge = (status: PortalProject['status']) => {
    switch (status) {
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/95 text-emerald-950 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#15803d]" /> Instalado & Homologado
          </span>
        );
      case 'em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/95 text-amber-950 border border-amber-300 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-700" /> Em Produção Plug & Play
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/95 text-blue-950 border border-blue-300 shadow-2xs">
            <Truck className="w-4 h-4 text-blue-700" /> Em Trânsito p/ Obra
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100/95 text-purple-950 border border-purple-300 shadow-2xs">
            <FileText className="w-4 h-4 text-purple-700" /> Proposta Emitida
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100/95 text-gray-950 border border-gray-300 shadow-2xs">
            <Camera className="w-4 h-4 text-gray-700" /> Estudo & Simulação IA
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Project Image & Code */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-900 overflow-hidden">
          <img
            src={project.afterImage || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#072a1a] via-[#072a1a]/50 to-black/30" />

          {/* Top Bar: Dynamic All Green Breadcrumb + Close / Back */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-[#072a1a]/85 text-xs text-white backdrop-blur-md border border-emerald-500/30 shadow-md">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                title="Voltar ao Painel"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#86efac]" />
                <span className="hidden xs:inline">Dashboard</span>
              </button>
              <ChevronRight className="w-3 h-3 text-emerald-500/80" />
              <button
                type="button"
                onClick={onClose}
                className="text-emerald-300 hover:text-white transition-colors cursor-pointer"
                title="Voltar para a lista de projetos"
              >
                <span>Projetos</span>
              </button>
              <ChevronRight className="w-3 h-3 text-emerald-500/80" />
              <span className="font-mono font-bold text-[#86efac] bg-black/40 px-2 py-0.5 rounded border border-emerald-500/40">
                {project.code}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs border border-white/20 active:scale-95 shadow-sm"
              aria-label="Voltar para a lista de obras"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#86efac]" />
              <span>Voltar</span>
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-16 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-lg bg-[#072a1a] text-[#86efac] font-mono text-xs font-extrabold shadow-md border border-emerald-700/60">
              {project.code}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-gray-900 text-xs font-bold shadow-sm">
              {project.category}
            </span>
            <button
              onClick={() => onOpenVersionHistory(project)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-[#86efac] border border-emerald-500/50 text-xs font-mono font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Abrir linha do tempo de versões"
            >
              <History className="w-3.5 h-3.5" />
              <span>v{currentVersionNumber}.0 ({versionCount} {versionCount === 1 ? 'versão' : 'versões'})</span>
            </button>
          </div>

          {/* Title & Status on Bottom */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {project.title}
              </h2>
              <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#86efac]" />
                <span>{project.location} • Cliente: {project.client}</span>
              </p>
            </div>
            <div>
              {getStatusBadge(project.status)}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Version Control & Audit Bar */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#072a1a] to-emerald-950 text-white p-4 sm:p-5 rounded-3xl border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-900 border border-emerald-700/60 flex items-center justify-center shrink-0">
                <History className="w-5 h-5 text-[#86efac]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">
                    Versão Ativa: v{currentVersionNumber}.0
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-[#86efac] text-[10px] font-mono font-bold">
                    {versionCount} {versionCount === 1 ? 'versão' : 'versões'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 mt-0.5">
                  Rastreabilidade técnica e auditoria de parâmetros botânicos, acústicos e LEED.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenVersionHistory(project)}
                className="px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-[#86efac] border border-emerald-700/80 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <History className="w-3.5 h-3.5" />
                <span>Ver Histórico</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenEditProject(project)}
                className="px-4 py-2 bg-[#86efac] hover:bg-white text-[#072a1a] font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#072a1a]" />
                <span>Editar Obra</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Área Projetada</span>
              <span className="text-lg font-serif font-bold text-[#072a1a]">{project.area} m²</span>
            </div>
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Tipologia</span>
              <span className="text-xs font-bold text-gray-800 block mt-1 line-clamp-1">{project.style}</span>
            </div>
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Investimento Estimado</span>
              <span className="text-sm font-bold text-emerald-950 block mt-1">
                R$ {project.estimatedTotal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Créditos LEED</span>
              <span className="text-lg font-serif font-bold text-[#15803d]">
                +{project.leedPointsTotal || 12} pts
              </span>
            </div>
          </div>

          {/* Botanical Species List */}
          {project.speciesUsed && project.speciesUsed.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#15803d]" />
                <span>Paleta Botânica & Espécies Homologadas</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.speciesUsed.map((sp, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-emerald-50 text-[#072a1a] text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Structural & Acoustic */}
            <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                <span>Engenharia & Conforto Acústico</span>
              </h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span className="font-semibold text-gray-700">Substrato / Fixação:</span>
                  <span className="text-right text-gray-900">{project.structureType || 'Modular Plug & Play'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-gray-700">Absorção Acústica:</span>
                  <span className="font-bold text-[#15803d]">NRC {project.acousticNrc || 0.88} (Laudo IPT)</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-gray-700">Carga Estrutural:</span>
                  <span className="text-gray-900">{project.weightPerM2 || 12} kg/m²</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold text-gray-700">Segurança ao Fogo:</span>
                  <span className="text-gray-900">{project.fireRating || 'Classe B-s1,d0 (Auto-extinguível)'}</span>
                </li>
              </ul>
            </div>

            {/* Sustainability & Maintenance */}
            <div className="bg-gradient-to-br from-[#072a1a] to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-800 space-y-3">
              <h4 className="text-xs font-bold text-[#86efac] uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Métricas LEED & WELL v2</span>
              </h4>
              <ul className="text-xs text-emerald-100 space-y-2">
                <li className="flex justify-between border-b border-emerald-900 pb-1">
                  <span>Economia de Água / Ano:</span>
                  <span className="font-bold text-[#86efac]">
                    {(project.waterSavedLitersYear || 32000).toLocaleString('pt-BR')} L/ano (Zero Rega)
                  </span>
                </li>
                <li className="flex justify-between border-b border-emerald-900 pb-1">
                  <span>WELL Mind Score:</span>
                  <span className="font-bold text-yellow-300">{project.wellScore || 88} Pontos</span>
                </li>
                <li className="flex justify-between border-b border-emerald-900 pb-1">
                  <span>Garantia de Fábrica:</span>
                  <span>{project.warrantyYears || 5} anos contra descoloração</span>
                </li>
                <li className="flex justify-between">
                  <span>Plano de Manutenção:</span>
                  <span className="text-[11px] text-emerald-300 text-right">{project.maintenanceFreq || 'Semestral / Ar Suave'}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Notes */}
          {project.notes && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-1">Notas do Arquiteto / Memorial Técnico:</span>
              <p className="leading-relaxed">{project.notes}</p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCompareWithAnother(project.id);
                onClose();
              }}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#072a1a] border border-gray-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 min-h-[44px]"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#15803d]" />
              <span>Comparar Especificações</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/5511912720799?text=Ol%C3%A1%2C%20estou%20analisando%20o%20projeto%20${project.code}%20(${encodeURIComponent(project.title)})%20no%20Portal%20e%20gostaria%20de%20suporte`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200 active:scale-95 min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4 text-[#15803d]" />
              <span className="hidden sm:inline">WhatsApp Obra</span>
              <span className="inline sm:hidden">WhatsApp</span>
            </a>

            <button
              onClick={() => onDownloadSpecPdf(project)}
              className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Memorial (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
