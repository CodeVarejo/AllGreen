import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Save,
  Building,
  MapPin,
  Layers,
  Leaf,
  FileText,
  Clock,
  Sliders,
  Check,
  Plus,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard';

interface EditProjectModalProps {
  project: PortalProject | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (updatedProject: PortalProject, changeSummary?: string) => void;
}

const AVAILABLE_SPECIES_OPTIONS = [
  'Moss Dinamarquês Verde Floresta',
  'Moss Polar Moss Bicolor',
  'Samambaia Americana Estabilizada',
  'Costela-de-Adão Preservada',
  'Eucalipto Baby Blue Preservado',
  'Samambaia Chorona Hiper-Realista',
  'Jiboia Rajada Real Touch',
  'Filodendro Ondulado Anti-UV',
  'Ficus Lyrata Permanente',
  'Musgo Fofura Esmeralda',
  'Palmeira Licuala Preservada',
  'Avenca Real Estabilizada',
  'Guaimbê Permanente',
];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  user,
  isOpen,
  onClose,
  onSaveProject,
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<PortalProject['category']>('Corporativo');
  const [style, setStyle] = useState<PortalProject['style']>('Jardim Preservado');
  const [area, setArea] = useState<number>(20);
  const [status, setStatus] = useState<PortalProject['status']>('orcamento_enviado');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [structureType, setStructureType] = useState('Painel Modular Plug & Play em MDF Ultra Naval');
  const [notes, setNotes] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setClient(project.client);
      setLocation(project.location);
      setCategory(project.category);
      setStyle(project.style);
      setArea(project.area);
      setStatus(project.status);
      setSelectedSpecies(project.speciesUsed || []);
      setStructureType(project.structureType || 'Painel Modular Plug & Play em MDF Ultra Naval');
      setNotes(project.notes || '');
      setCustomSummary('');
    }
  }, [project, isOpen]);

  // Check if form is dirty
  const isDirty = useMemo(() => {
    if (!project) return false;
    return (
      title !== project.title ||
      client !== project.client ||
      location !== project.location ||
      category !== project.category ||
      style !== project.style ||
      area !== project.area ||
      status !== project.status ||
      notes !== (project.notes || '') ||
      customSummary.trim() !== ''
    );
  }, [project, title, client, location, category, style, area, status, notes, customSummary]);

  const { confirmDiscard } = useUnsavedChangesGuard({
    isDirty,
    title: 'Descartar alterações da obra?',
    description: 'Você possui alterações não salvas nos parâmetros desta obra. Se fechar agora, as modificações de metragem, espécies e notas serão perdidas.',
    confirmText: 'Descartar Alterações',
    cancelText: 'Continuar Editando',
    variant: 'warning',
    enabled: isOpen && !!project,
    interceptEscapeKey: true,
    onDiscard: onClose,
  });

  const handleRequestClose = () => {
    confirmDiscard(onClose);
  };

  if (!isOpen || !project) return null;

  const toggleSpecies = (sp: string) => {
    if (selectedSpecies.includes(sp)) {
      setSelectedSpecies(selectedSpecies.filter((s) => s !== sp));
    } else {
      setSelectedSpecies([...selectedSpecies, sp]);
    }
  };

  const getStatusLabel = (s: PortalProject['status']): string => {
    switch (s) {
      case 'instalado':
        return 'Instalação Concluída & Homologada';
      case 'em_producao':
        return 'Em Produção (Módulos Plug & Play)';
      case 'enviado_transportadora':
        return 'Em Transporte para a Obra';
      case 'orcamento_enviado':
        return 'Proposta Comercial Emitida';
      default:
        return 'Estudo Técnico Cadastrado';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pricePerM2 =
      style === 'Musgo Polar Moss' ? 1800 : style === 'Jardim Preservado' ? 1500 : 1380;
    const newEstimatedTotal = Math.round(area * pricePerM2);
    const acousticNrc = style === 'Musgo Polar Moss' ? 0.89 : style === 'Jardim Preservado' ? 0.88 : 0.65;
    const leedPoints = style === 'Musgo Polar Moss' ? 14 : style === 'Jardim Preservado' ? 15 : 10;
    const wellScore = style === 'Musgo Polar Moss' ? 95 : style === 'Jardim Preservado' ? 90 : 75;

    const updated: PortalProject = {
      ...project,
      title: title.trim() || project.title,
      client: client.trim() || project.client,
      location: location.trim() || project.location,
      category,
      style,
      area: Number(area) || project.area,
      status,
      statusLabel: getStatusLabel(status),
      estimatedTotal: newEstimatedTotal,
      speciesUsed: selectedSpecies,
      structureType,
      notes: notes.trim(),
      acousticNrc,
      leedPointsTotal: leedPoints,
      wellScore,
      waterSavedLitersYear: Math.round(area * 1200),
    };

    onSaveProject(updated, customSummary.trim() || undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
        <div 
          className="fixed inset-0"
          onClick={handleRequestClose}
          aria-hidden="true"
        />

        <div className="bg-white rounded-3xl max-w-2xl w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#072a1a] text-white p-6 relative">
            <button
              type="button"
              onClick={handleRequestClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/30 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar edição"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Context Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-2 flex-wrap">
              <button
                type="button"
                onClick={handleRequestClose}
                className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#86efac]" />
                <span>Dashboard</span>
              </button>
              <ChevronRight className="w-3 h-3 text-emerald-500/80" />
              <button
                type="button"
                onClick={handleRequestClose}
                className="hover:text-white transition-colors cursor-pointer"
              >
                <span>Projetos</span>
              </button>
              <ChevronRight className="w-3 h-3 text-emerald-500/80" />
              <span className="font-mono font-bold text-[#86efac] bg-black/40 px-2 py-0.5 rounded border border-emerald-500/40">
                {project.code}
              </span>
              <ChevronRight className="w-3 h-3 text-emerald-500/80" />
              <span className="text-white font-bold bg-emerald-900/60 px-2 py-0.5 rounded">
                Edição
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-white">
              Revisar & Atualizar Obra
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Todas as modificações geram um novo snapshot auditável com laudos LEED, acústica e orçamentários recalculados.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nome do Projeto / Espaço *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Cliente / Empreendimento *
                </label>
                <input
                  type="text"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Tipologia
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                >
                  <option value="Corporativo">Corporativo</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Hospitalar">Hospitalar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Área Total (m²) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="1000"
                  required
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Estilo do Jardim All Green
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                >
                  <option value="Jardim Preservado">Jardim Preservado (Folhagens Estabilizadas)</option>
                  <option value="Musgo Polar Moss">Musgo Polar Moss (Alta Absorção Acústica)</option>
                  <option value="Jardim Permanente Hiper-Realista">Jardim Permanente Hiper-Realista (Anti-UV)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Fase do Cronograma / Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                >
                  <option value="estudo_ia">Estudo Técnico Cadastrado</option>
                  <option value="orcamento_enviado">Proposta Comercial Emitida</option>
                  <option value="em_producao">Em Produção Fabril (Plug & Play)</option>
                  <option value="enviado_transportadora">Em Transporte para a Obra</option>
                  <option value="instalado">Instalação Concluída & Homologada</option>
                </select>
              </div>
            </div>

            {/* Species Selector */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 flex items-center justify-between">
                <span>Composição Botânica Personalizada</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {selectedSpecies.length} espécies selecionadas
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200">
                {AVAILABLE_SPECIES_OPTIONS.map((sp) => {
                  const isSelected = selectedSpecies.includes(sp);
                  return (
                    <button
                      type="button"
                      key={sp}
                      onClick={() => toggleSpecies(sp)}
                      className={`text-left p-2 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#072a1a] text-[#86efac] border-emerald-900 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#86efac] shrink-0" />}
                      <span className="truncate">{sp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Structure & Substrate */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Substrato / Sistema Estrutural
              </label>
              <input
                type="text"
                value={structureType}
                onChange={(e) => setStructureType(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>

            {/* Notes & Audit Reason */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Notas do Arquiteto / Memorial Técnico
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva detalhes específicos de layout, fixação ou iluminação..."
                className="w-full px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center justify-between">
                <span>Motivo da Revisão (Opcional - registrado no histórico):</span>
                <span className="text-[10px] text-emerald-700 font-mono">Registro de Auditoria</span>
              </label>
              <input
                type="text"
                value={customSummary}
                onChange={(e) => setCustomSummary(e.target.value)}
                placeholder="ex: Adequação da metragem após medição in loco..."
                className="w-full px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleRequestClose}
                className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 min-h-[44px]"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Modificações & Criar Versão</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};
