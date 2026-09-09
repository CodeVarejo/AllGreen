import React, { useState } from 'react';
import {
  Plus,
  ArrowLeftRight,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  Camera,
  Download,
  PhoneCall,
  Layers,
  Award,
  Leaf,
  Filter,
  X,
  SlidersHorizontal,
  Eye,
  ChevronRight,
  History,
  Edit3,
  SearchX,
  RotateCcw
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';

interface ProjectsViewProps {
  projects: PortalProject[];
  user: UserProfile;
  onOpenSimulator: () => void;
  onOpenNewProjectModal: () => void;
  onOpenProjectDetail: (project: PortalProject) => void;
  onDownloadSpecPdf: (project: PortalProject) => void;
  onSelectForComparison: (projectId: string) => void;
  onOpenVersionHistory?: (project: PortalProject) => void;
  onOpenEditProject?: (project: PortalProject) => void;
  onBackToDashboard?: () => void;
  onRestoreDemoProjects?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  user,
  onOpenSimulator,
  onOpenNewProjectModal,
  onOpenProjectDetail,
  onDownloadSpecPdf,
  onSelectForComparison,
  onOpenVersionHistory,
  onOpenEditProject,
  onBackToDashboard,
  onRestoreDemoProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [activeBeforeAfterMap, setActiveBeforeAfterMap] = useState<Record<string, number>>({});

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'todos' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === 'todos' ||
      p.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.style.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSliderChange = (projectId: string, val: number) => {
    setActiveBeforeAfterMap(prev => ({ ...prev, [projectId]: val }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('todos');
    setSelectedStatus('todos');
  };

  const getStatusBadge = (status: PortalProject['status']) => {
    switch (status) {
      case 'instalado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/95 text-emerald-950 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" /> Instalado & Homologado
          </span>
        );
      case 'em_producao':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/95 text-amber-950 border border-amber-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" /> Em Produção Plug & Play
          </span>
        );
      case 'enviado_transportadora':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/95 text-blue-950 border border-blue-300 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-blue-700" /> Em Transporte
          </span>
        );
      case 'orcamento_enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100/95 text-purple-950 border border-purple-300 shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-purple-700" /> Proposta Comercial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100/95 text-gray-900 border border-gray-300 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-gray-700" /> Estudo IA
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 tracking-tight">
            Gestão de Obras & Ambientes Biofílicos
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Visualização interativa Antes/Depois, compatibilização técnica, controle de versões e download de memoriais descritivos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="px-4 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>

          <button
            type="button"
            onClick={onOpenSimulator}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold rounded-full text-xs border border-emerald-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
          >
            <Camera className="w-4 h-4 text-[#15803d]" />
            <span>Simular Nova Foto IA</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (ex: AG-8492), cliente, local..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Pill Selector */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
              Tipologia:
            </span>
            {['todos', 'corporativo', 'residencial', 'comercial'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-[#072a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Status Filter Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 overflow-x-auto pb-1">
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {[
            { key: 'todos', label: 'Todos os Status' },
            { key: 'instalado', label: 'Instalado' },
            { key: 'em_producao', label: 'Em Produção' },
            { key: 'enviado_transportadora', label: 'Em Transporte' },
            { key: 'orcamento_enviado', label: 'Proposta' },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => setSelectedStatus(st.key)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                selectedStatus === st.key
                  ? 'bg-[#072a1a] text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Projects List/Grid with Interactive Before & After Control */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-200 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <Layers className="w-8 h-8 text-[#15803d]" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-serif font-bold text-2xl text-gray-950">
              Nenhuma obra cadastrada ainda
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Cadastre sua primeira obra ou ambiente biofílico para gerar memoriais descritivos em PDF, laudos de absorção acústica e acompanhamento técnico plug & play.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="px-6 py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeira Obra</span>
            </button>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs sm:text-sm rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95 flex items-center gap-2 min-h-[44px]"
            >
              <Camera className="w-4 h-4 text-[#15803d]" />
              <span>Simular com IA</span>
            </button>
            {onRestoreDemoProjects && (
              <button
                type="button"
                onClick={onRestoreDemoProjects}
                className="px-5 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm rounded-xl border border-gray-300 transition-all cursor-pointer active:scale-95 flex items-center gap-2 min-h-[44px]"
                title="Carregar obras de demonstração para testes"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
                <span>Carregar Projetos de Demonstração</span>
              </button>
            )}
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
            <SearchX className="w-7 h-7 text-[#15803d]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-gray-950">
              Nenhuma obra encontrada para esta busca
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Não encontramos projetos com os filtros de tipologia, status ou termo de busca atuais.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
            >
              Limpar Todos os Filtros
            </button>

            <button
              type="button"
              onClick={onOpenNewProjectModal}
              className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95 min-h-[44px]"
            >
              Cadastrar Nova Obra
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const sliderVal = activeBeforeAfterMap[proj.id] ?? 50;

            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Interactive Before & After Visual Canvas */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gray-950 select-none">
                    {/* After image */}
                    <img
                      src={proj.afterImage || proj.thumbnail}
                      alt={`Depois - ${proj.title}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Before image overlay */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderVal}%` }}
                    >
                      <img
                        src={proj.beforeImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'}
                        alt={`Antes - ${proj.title}`}
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%' }}
                      />
                      <div className="absolute inset-0 bg-black/25" />
                    </div>

                    {/* Divider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl z-20"
                      style={{ left: `${sliderVal}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#072a1a] text-[#86efac] border border-white shadow-md flex items-center justify-center pointer-events-none">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Slider Range Input Overlay */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderVal}
                      onChange={(e) => handleSliderChange(proj.id, Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                      title="Arraste para comparar Antes e Depois"
                      aria-label={`Comparar Antes e Depois de ${proj.title}`}
                    />

                    {/* Badges on Visual Canvas */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-20 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-[#072a1a]/95 text-[#86efac] text-xs font-mono font-extrabold shadow-md border border-emerald-500/50 backdrop-blur-xs">
                        {proj.code}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-black/70 text-white text-[11px] font-bold backdrop-blur-xs">
                        {proj.category}
                      </span>
                      {proj.versionHistory && proj.versionHistory.length > 1 && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 text-[#86efac] text-[10px] font-mono font-bold border border-emerald-500/40">
                          v{proj.versionHistory.length}.0
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 text-gray-900 text-[11px] font-bold shadow-md">
                        {proj.style}
                      </span>
                    </div>

                    {/* Label markers */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-extrabold uppercase tracking-widest text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs pointer-events-none z-20">
                      Antes (Espaço Vazio)
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-extrabold uppercase tracking-widest text-[#86efac] bg-[#072a1a]/85 px-2 py-0.5 rounded-md backdrop-blur-xs pointer-events-none z-20">
                      Depois (All Green)
                    </div>
                  </div>

                  {/* Project Summary Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-950 group-hover:text-[#15803d] transition-colors leading-snug">
                          {proj.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-gray-800">{proj.client}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {proj.location}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {getStatusBadge(proj.status)}
                      </div>
                    </div>

                    {/* Key Technical Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-xs">
                      <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[10px] text-emerald-800 block uppercase font-bold">Área Total</span>
                        <span className="font-bold text-gray-900">{proj.area} m²</span>
                      </div>

                      <div className="bg-purple-50/80 p-2.5 rounded-xl border border-purple-100 text-center">
                        <span className="text-[10px] text-purple-700 block uppercase font-bold">Acústica</span>
                        <span className="font-bold text-purple-950">NRC {proj.acousticNrc || 0.88}</span>
                      </div>

                      <div className="bg-teal-50/80 p-2.5 rounded-xl border border-teal-100 text-center">
                        <span className="text-[10px] text-teal-700 block uppercase font-bold">LEED v4.1</span>
                        <span className="font-bold text-teal-950">+{proj.leedPointsTotal || 14} pts</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 sm:p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDownloadSpecPdf(proj)}
                      className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95 min-h-[44px]"
                      title="Baixar Memorial Descritivo em PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="truncate">PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectForComparison(proj.id)}
                      className="py-2.5 px-2 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#072a1a] font-bold text-xs rounded-xl border border-gray-200 hover:border-[#15803d] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95 min-h-[44px]"
                      title="Comparar com outro projeto"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="truncate">Comparar</span>
                    </button>

                    {onOpenVersionHistory && (
                      <button
                        type="button"
                        onClick={() => onOpenVersionHistory(proj)}
                        className="py-2.5 px-2 bg-emerald-950/90 hover:bg-[#072a1a] text-[#86efac] font-bold text-xs rounded-xl border border-emerald-800 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-95 min-h-[44px]"
                        title="Ver histórico de alterações e snapshots"
                      >
                        <History className="w-3.5 h-3.5 text-[#86efac]" />
                        <span className="truncate">Versões ({proj.versionHistory?.length || 1})</span>
                      </button>
                    )}

                    {onOpenEditProject && (
                      <button
                        type="button"
                        onClick={() => onOpenEditProject(proj)}
                        className="py-2.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 min-h-[44px]"
                        title="Editar especificações"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                        <span className="truncate">Editar</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenProjectDetail(proj)}
                    className="w-full py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 min-h-[44px]"
                  >
                    <span>Abrir Memorial Completo & Cronograma</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
