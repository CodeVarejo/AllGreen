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
  Sparkles,
  SlidersHorizontal,
  Eye,
  ChevronRight
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
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  user,
  onOpenSimulator,
  onOpenNewProjectModal,
  onOpenProjectDetail,
  onDownloadSpecPdf,
  onSelectForComparison,
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
            Visualização interativa Antes/Depois, compatibilização técnica e download de memoriais descritivos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Obra</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold rounded-full text-xs border border-emerald-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4 text-[#15803d]" />
            <span>Simulador IA</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar - Clean Card Container */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código, cliente ou local..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Categories Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
              Tipologia:
            </span>
            {['todos', 'corporativo', 'residencial', 'hotelaria', 'saúde', 'acústico'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#072a1a] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-[#072a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Status Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-100">
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
            Status da Obra:
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
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto border border-emerald-100">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900">
            Nenhuma obra encontrada para esta busca
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Tente alterar os termos da busca ou os filtros de tipologia e status.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('todos'); setSelectedStatus('todos'); }}
            className="px-4 py-2 bg-[#072a1a] text-[#86efac] font-bold text-xs rounded-xl hover:bg-[#15803d] transition-all cursor-pointer"
          >
            Limpar Filtros
          </button>
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
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                      title="Arraste para comparar Antes e Depois"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-[#072a1a]/90 text-[#86efac] text-[10px] font-mono font-extrabold shadow-md border border-emerald-500/50 backdrop-blur-xs">
                        {proj.code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/75 text-white text-[10px] font-bold backdrop-blur-xs">
                        {proj.category}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none">
                      {getStatusBadge(proj.status)}
                    </div>

                    {/* Bottom Indicator Tags */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 z-30 flex justify-between items-center pointer-events-none text-[10px] font-bold">
                      <span className="bg-black/75 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                        Antes (Obra)
                      </span>
                      <span className="bg-[#072a1a]/90 text-[#86efac] px-2 py-0.5 rounded border border-emerald-500/50 backdrop-blur-xs">
                        Depois (All Green)
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-950 leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>{proj.location} • Cliente: {proj.client}</span>
                      </p>
                    </div>

                    {/* Tech specs pill grid */}
                    <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                      <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-center">
                        <span className="text-[10px] text-gray-500 block uppercase font-bold">Área</span>
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
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onDownloadSpecPdf(proj)}
                      className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Memorial PDF</span>
                    </button>

                    <button
                      onClick={() => onSelectForComparison(proj.id)}
                      className="py-2.5 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#072a1a] font-bold text-xs rounded-xl border border-gray-200 hover:border-[#15803d] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#15803d]" />
                      <span>Comparar</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenProjectDetail(proj)}
                    className="w-full py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
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
