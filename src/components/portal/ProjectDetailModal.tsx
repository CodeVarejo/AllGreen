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
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';

interface ProjectDetailModalProps {
  project: PortalProject | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onDownloadSpecPdf: (project: PortalProject) => void;
  onCompareWithAnother: (projectId: string) => void;
  onStatusChange?: (projectId: string, newStatus: PortalProject['status']) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  user,
  isOpen,
  onClose,
  onDownloadSpecPdf,
  onCompareWithAnother,
  onStatusChange,
}) => {
  if (!isOpen || !project) return null;

  const getStatusBadge = (status: PortalProject['status']) => {
    switch (status) {
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Instalado & Homologado
          </span>
        );
      case 'em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-4 h-4 text-amber-700" /> Em Produção Plug & Play
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Truck className="w-4 h-4 text-blue-700" /> Em Trânsito p/ Obra
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <FileText className="w-4 h-4 text-purple-700" /> Proposta Emitida
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-900 border border-gray-300">
            <Camera className="w-4 h-4 text-gray-700" /> Estudo & Simulação IA
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Project Image & Code */}
        <div className="relative h-64 w-full bg-gray-900 overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#072a1a] via-[#072a1a]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges on Top */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#072a1a] text-[#86efac] font-mono text-xs font-extrabold shadow-md border border-emerald-700/60">
              {project.code}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-gray-900 text-xs font-bold shadow-sm">
              {project.category}
            </span>
          </div>

          {/* Title & Status on Bottom */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
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
        <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Área Projetada</span>
              <span className="text-lg font-serif font-bold text-[#072a1a]">{project.area} m²</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Tipologia</span>
              <span className="text-xs font-bold text-gray-800 block mt-1 line-clamp-1">{project.style}</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Investimento Estimado</span>
              <span className="text-sm font-bold text-emerald-900 block mt-1">
                R$ {project.estimatedTotal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Créditos LEED</span>
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

          {/* Technical Specs Accordion/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Structural & Acoustic */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
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
            <div className="bg-[#072a1a] text-white p-4 rounded-2xl border border-emerald-800 space-y-3">
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
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onCompareWithAnother(project.id);
                onClose();
              }}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#072a1a] border border-gray-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
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
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-200 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#15803d]" />
              <span>WhatsApp Obra</span>
            </a>

            <button
              onClick={() => onDownloadSpecPdf(project)}
              className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Memorial Descritivo (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
