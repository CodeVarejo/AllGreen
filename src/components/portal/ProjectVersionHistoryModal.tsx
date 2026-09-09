import React, { useState } from 'react';
import {
  History,
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  FilePlus,
  Layers,
  FileText,
  Sliders,
  Leaf,
  Award,
  Volume2,
  AlertCircle,
  Eye,
  ArrowLeftRight,
  ShieldCheck,
  Calendar,
  Check,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { PortalProject, ProjectVersion, UserProfile, ProjectDiffItem } from '../../types';

interface ProjectVersionHistoryModalProps {
  project: PortalProject | null;
  currentUser?: UserProfile;
  user?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onRevertToVersion: (targetVersion: ProjectVersion) => void;
  onDownloadVersionPdf?: (projectSnapshot: Omit<PortalProject, 'versionHistory'>) => void;
  onOpenEditModal?: (project: PortalProject) => void;
}

export const ProjectVersionHistoryModal: React.FC<ProjectVersionHistoryModalProps> = ({
  project,
  currentUser,
  user,
  isOpen,
  onClose,
  onRevertToVersion,
  onDownloadVersionPdf,
  onOpenEditModal,
}) => {
  const activeUser = currentUser || user;
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmRevertVersion, setConfirmRevertVersion] = useState<ProjectVersion | null>(null);
  const [compareMode, setCompareMode] = useState<'diff' | 'side_by_side'>('diff');

  if (!isOpen || !project) return null;

  const versions = (project.versionHistory || []).slice().reverse(); // Most recent first
  const latestVersion = versions[0];
  const activeVersion = versions.find((v) => v.id === selectedVersionId) || latestVersion || null;

  const filteredVersions = versions.filter((v) => {
    if (filterType === 'all') return true;
    return v.changeType === filterType;
  });

  const getChangeTypeBadge = (type: ProjectVersion['changeType']) => {
    switch (type) {
      case 'created':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <FilePlus className="w-3 h-3 text-emerald-700" /> Criação Inicial
          </span>
        );
      case 'dimensions_edit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Sliders className="w-3 h-3 text-blue-700" /> Redimensionamento
          </span>
        );
      case 'status_change':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <Clock className="w-3 h-3 text-purple-700" /> Mudança de Status
          </span>
        );
      case 'botanical_edit':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Leaf className="w-3 h-3 text-amber-700" /> Paleta Botânica
          </span>
        );
      case 'reverted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <RotateCcw className="w-3 h-3 text-rose-700" /> Versão Restaurada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-900 border border-gray-300">
            <FileText className="w-3 h-3 text-gray-700" /> Revisão de Memorial
          </span>
        );
    }
  };

  const handleExecuteRevert = (ver: ProjectVersion) => {
    onRevertToVersion(ver);
    setConfirmRevertVersion(null);
    setSelectedVersionId(null);
  };

  const isCurrentActiveVersion = activeVersion?.id === latestVersion?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-3xl max-w-5xl w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 relative shrink-0 border-b border-emerald-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-black/40 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Context Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-2 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#86efac]" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-3 h-3 text-emerald-500/80" />
            <button
              type="button"
              onClick={onClose}
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
              Histórico
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold uppercase tracking-wide">
              Auditoria de Projeto & Versionamento
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 text-[10px] font-mono font-bold">
              {project.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 text-[10px] font-bold">
              {versions.length} {versions.length === 1 ? 'Versão Registrada' : 'Versões Registradas'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#86efac]" />
            <span>Histórico de Versões: {project.title}</span>
          </h2>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
            Visualize o histórico de alterações técnicas, compare especificações botânicas e reverta para qualquer snapshot anterior com 1 clique.
          </p>
        </div>

        {/* Modal Main Content: Split View (Timeline Sidebar + Version Inspector) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden bg-gray-50">
          
          {/* Left Column: Timeline List (5 cols) */}
          <div className="md:col-span-5 border-r border-gray-200 bg-white flex flex-col min-h-0">
            
            {/* Timeline Filter Controls */}
            <div className="p-3 border-b border-gray-100 flex items-center justify-between gap-2 bg-gray-50/70">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Linha do Tempo
              </span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">Todas ({versions.length})</option>
                <option value="created">Criação</option>
                <option value="dimensions_edit">Dimensões</option>
                <option value="botanical_edit">Botânica</option>
                <option value="status_change">Status</option>
                <option value="reverted">Reversões</option>
              </select>
            </div>

            {/* Versions Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-gray-100">
              {filteredVersions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">
                  Nenhuma versão encontrada para este filtro.
                </div>
              ) : (
                filteredVersions.map((v, idx) => {
                  const isSelected = activeVersion?.id === v.id;
                  const isLatest = v.id === latestVersion?.id;

                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVersionId(v.id)}
                      className={`pt-2.5 first:pt-0 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50/80 -mx-3 px-3 py-2.5 rounded-xl border border-emerald-200 shadow-2xs'
                          : 'hover:bg-gray-50/80 -mx-1 px-2 py-2 rounded-lg'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#072a1a]' : 'text-gray-900'}`}>
                            v{v.versionNumber}.0
                          </span>
                          {isLatest && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold tracking-tight">
                              Atual
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {v.timestamp}
                        </span>
                      </div>

                      <div className="mb-1.5 flex items-center gap-1">
                        {getChangeTypeBadge(v.changeType)}
                      </div>

                      <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed mb-2">
                        {v.changeSummary}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                        <span className="flex items-center gap-1 truncate text-gray-600">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{v.author}</span>
                        </span>
                        {v.diffs && v.diffs.length > 0 && (
                          <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-semibold">
                            {v.diffs.length} {v.diffs.length === 1 ? 'modificação' : 'modificações'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Version Inspector & Diff Viewer (7 cols) */}
          <div className="md:col-span-7 p-4 sm:p-6 flex flex-col min-h-0 overflow-y-auto bg-gray-50/40">
            {activeVersion ? (
              <div className="space-y-5">
                
                {/* Active Version Top Banner */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#072a1a]">
                          Versão v{activeVersion.versionNumber}.0
                        </span>
                        {isCurrentActiveVersion ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Versão Ativa no Projeto
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                            Versão Histórica
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Gravado em <strong>{activeVersion.timestamp}</strong> por {activeVersion.author} ({activeVersion.authorRole})
                      </p>
                    </div>

                    {/* Revert Action Button */}
                    {!isCurrentActiveVersion && (
                      <button
                        onClick={() => setConfirmRevertVersion(activeVersion)}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar esta Versão</span>
                      </button>
                    )}
                  </div>

                  {/* Summary & Note */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-700 space-y-1">
                    <span className="font-bold text-gray-900 block">Resumo Técnico desta Alteração:</span>
                    <p className="leading-relaxed">{activeVersion.changeSummary}</p>
                  </div>
                </div>

                {/* View Mode Toggle: Diff vs Side-by-Side */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {compareMode === 'diff' ? 'Diferenças & Alterações Registradas' : 'Comparativo com a Versão Atual'}
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 text-xs">
                    <button
                      onClick={() => setCompareMode('diff')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        compareMode === 'diff'
                          ? 'bg-[#072a1a] text-[#86efac]'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Modificações (Diff)
                    </button>
                    <button
                      onClick={() => setCompareMode('side_by_side')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        compareMode === 'side_by_side'
                          ? 'bg-[#072a1a] text-[#86efac]'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Lado a Lado
                    </button>
                  </div>
                </div>

                {/* Diff Viewer Mode */}
                {compareMode === 'diff' && (
                  <div className="space-y-2.5">
                    {activeVersion.diffs && activeVersion.diffs.length > 0 ? (
                      <div className="space-y-2">
                        {activeVersion.diffs.map((diff: ProjectDiffItem, dIdx: number) => (
                          <div
                            key={dIdx}
                            className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-800">
                                {diff.label}
                              </span>
                              <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {diff.field}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-900">
                                <span className="text-[10px] uppercase font-bold text-rose-700 block mb-0.5">
                                  Valor Anterior
                                </span>
                                <span className="font-medium line-through">{String(diff.oldValue)}</span>
                              </div>
                              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-0.5">
                                  Novo Valor Homologado
                                </span>
                                <span className="font-bold">{String(diff.newValue)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="text-sm font-bold text-gray-900">
                          Versão de Concepção Base
                        </h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          Esta versão marca a criação inicial das especificações da obra, estabelecendo os parâmetros de referência.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Side-by-Side Comparison Mode */}
                {compareMode === 'side_by_side' && (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="grid grid-cols-2 bg-gray-100 p-3 border-b border-gray-200 text-xs font-bold text-gray-700">
                      <div>Versão v{activeVersion.versionNumber}.0 (Gravada)</div>
                      <div className="text-emerald-900">Versão Atual do Projeto (v{latestVersion?.versionNumber}.0)</div>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs p-3 space-y-2">
                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Tipologia</span>
                          <span className="font-semibold text-gray-800">{activeVersion.snapshot.style}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Tipologia</span>
                          <span className="font-bold text-emerald-900">{project.style}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Área Projetada</span>
                          <span className="font-semibold text-gray-800">{activeVersion.snapshot.area} m²</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Área Projetada</span>
                          <span className="font-bold text-emerald-900">{project.area} m²</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Investimento Total</span>
                          <span className="font-semibold text-gray-800">
                            R$ {activeVersion.snapshot.estimatedTotal.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Investimento Total</span>
                          <span className="font-bold text-emerald-900">
                            R$ {project.estimatedTotal.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Status da Obra</span>
                          <span className="font-semibold text-gray-800">{activeVersion.snapshot.statusLabel}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Status da Obra</span>
                          <span className="font-bold text-emerald-900">{project.statusLabel}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Absorção Acústica</span>
                          <span className="font-semibold text-gray-800">NRC {activeVersion.snapshot.acousticNrc || 0.88}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Absorção Acústica</span>
                          <span className="font-bold text-emerald-900">NRC {project.acousticNrc || 0.88}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 py-1.5">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Pontuação LEED</span>
                          <span className="font-semibold text-gray-800">+{activeVersion.snapshot.leedPointsTotal || 12} pts</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Pontuação LEED</span>
                          <span className="font-bold text-emerald-900">+{project.leedPointsTotal || 12} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Snapshot Botanical & Structural Specs */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-[#15803d]" />
                    <span>Paleta Botânica Homologada nesta Versão</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVersion.snapshot.speciesUsed && activeVersion.snapshot.speciesUsed.length > 0 ? (
                      activeVersion.snapshot.speciesUsed.map((sp, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 bg-emerald-50 text-[#072a1a] text-xs font-medium rounded-lg border border-emerald-200 flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                          {sp}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">Nenhuma espécie customizada.</span>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-gray-400 text-xs">
                Selecione uma versão na barra lateral para inspecionar os detalhes.
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Registro imutável com garantia de rastreabilidade para auditorias LEED / WELL.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Fechar Histórico
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Reverting */}
      {confirmRevertVersion && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                Restaurar Projeto para a Versão v{confirmRevertVersion.versionNumber}.0?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                As especificações atuais da obra serão substituídas pelo snapshot gravado em <strong>{confirmRevertVersion.timestamp}</strong>. Esta restauração será gravada como uma nova versão no histórico, mantendo a integridade da auditoria.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Tipologia:</span>
                <span className="font-bold">{confirmRevertVersion.snapshot.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Área:</span>
                <span className="font-bold">{confirmRevertVersion.snapshot.area} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold">{confirmRevertVersion.snapshot.statusLabel}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRevertVersion(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleExecuteRevert(confirmRevertVersion)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sim, Restaurar Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
