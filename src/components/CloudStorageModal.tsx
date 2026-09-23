import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  FolderSync,
  HardDrive,
  ExternalLink,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Laptop,
  ShieldCheck,
  Sparkles,
  FileCode,
  FolderOpen
} from 'lucide-react';
import { useCloudStorage } from '../context/CloudStorageContext';
import { PortalProject } from '../types';

interface CloudStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjects: PortalProject[];
  onProjectsUpdated: (updatedProjects: PortalProject[]) => void;
}

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({
  isOpen,
  onClose,
  currentProjects,
  onProjectsUpdated,
}) => {
  const {
    isConnected,
    isSyncing,
    lastSyncedAt,
    cloudFiles,
    driveUser,
    autoSyncEnabled,
    error,
    folderName,
    connectDrive,
    disconnectDrive,
    syncNow,
    saveProject,
    deleteProject,
    downloadProject,
    toggleAutoSync,
    clearError,
  } = useCloudStorage();

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<string | null>(null);
  const [isUploadingAll, setIsUploadingAll] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setFeedbackMessage(null);
    const success = await connectDrive();
    if (success) {
      setFeedbackMessage('Google Drive conectado com sucesso! Seus projetos agora estão prontos para sincronizar.');
    }
  };

  const handleManualSync = async () => {
    setFeedbackMessage(null);
    const updated = await syncNow(currentProjects);
    onProjectsUpdated(updated);
    setFeedbackMessage('Sincronização concluída! Projetos atualizados entre este dispositivo e a nuvem.');
  };

  const handleUploadAll = async () => {
    setIsUploadingAll(true);
    setFeedbackMessage(null);
    let count = 0;
    for (const proj of currentProjects) {
      const ok = await saveProject(proj);
      if (ok) count++;
    }
    setIsUploadingAll(false);
    setFeedbackMessage(`${count} projetos enviados com sucesso para a pasta do Google Drive!`);
  };

  const handleDownloadSingle = async (fileId: string) => {
    setFeedbackMessage(null);
    const downloadedProj = await downloadProject(fileId);
    if (downloadedProj) {
      const index = currentProjects.findIndex(
        (p) => p.code === downloadedProj.code || p.id === downloadedProj.id
      );
      let newProjects: PortalProject[];
      if (index !== -1) {
        newProjects = [...currentProjects];
        newProjects[index] = downloadedProj;
      } else {
        newProjects = [downloadedProj, ...currentProjects];
      }
      onProjectsUpdated(newProjects);
      setFeedbackMessage(`Projeto "${downloadedProj.title}" (${downloadedProj.code}) restaurado com sucesso neste dispositivo!`);
    }
  };

  const handleDeleteCloudFile = async (fileId: string, name: string) => {
    if (window.confirm(`Deseja remover o arquivo "${name}" da sua nuvem no Google Drive?`)) {
      const ok = await deleteProject(fileId);
      if (ok) {
        setFeedbackMessage(`Arquivo removido do Google Drive.`);
      }
    }
  };

  const formattedLastSync = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#072a1a]/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cloud-storage-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-950/10 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#072a1a] via-[#0d3822] to-[#15803d] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal de nuvem"
            className="absolute right-4 top-4 sm:right-5 sm:top-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#86efac] shadow-xs">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="cloud-storage-title" className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  Armazenamento em Nuvem & Sincronização
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/40 text-[10px] font-mono font-bold uppercase">
                  Google Drive
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5 font-sans">
                Salve dossiês técnicos, simulações IA e especificações com sincronização multiplataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Aviso de Sincronização: </span>
                {error}
              </div>
              <button
                type="button"
                onClick={clearError}
                className="text-red-500 hover:text-red-800 text-xs font-bold"
              >
                Limpar
              </button>
            </div>
          )}

          {/* Success Banner */}
          {feedbackMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#072a1a] text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{feedbackMessage}</div>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* State 1: Disconnected */}
          {!isConnected ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100/80 text-[#0d3822] flex items-center justify-center mx-auto border border-emerald-300">
                  <CloudOff className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#072a1a] font-serif">
                    Conecte sua conta do Google Drive
                  </h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                    Armazene todos os seus projetos do ateliê na sua própria conta do Google Drive. Acesse os laudos,
                    especificações botânicas e simulações do desktop, celular ou tablet de forma segura.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 bg-[#0d3822] hover:bg-[#15803d] text-[#86efac] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#86efac]" />
                        <span>Conectando com o Google...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-4 h-4 text-[#86efac]" />
                        <span>Autorizar Google Drive com 1 Clique</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 flex flex-col items-center text-center">
                  <Smartphone className="w-5 h-5 text-emerald-700 mb-1.5" />
                  <span className="text-xs font-bold text-gray-900">Multi-dispositivo</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">Sincronização entre celular, tablet e computador</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 flex flex-col items-center text-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 mb-1.5" />
                  <span className="text-xs font-bold text-gray-900">100% Seguro</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">Salvo na sua própria pasta do Google Drive</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 flex flex-col items-center text-center">
                  <Sparkles className="w-5 h-5 text-emerald-700 mb-1.5" />
                  <span className="text-xs font-bold text-gray-900">Dossiês Completos</span>
                  <span className="text-[11px] text-gray-500 mt-0.5">Inclui laudos LEED/WELL e histórico de versões</span>
                </div>
              </div>
            </div>
          ) : (
            /* State 2: Connected */
            <div className="space-y-4">
              {/* Account Status Card */}
              <div className="p-4 rounded-2xl bg-[#0d3822]/5 border border-[#0d3822]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {driveUser?.picture ? (
                      <img
                        src={driveUser.picture}
                        alt={driveUser.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0d3822] text-[#86efac] flex items-center justify-center font-bold text-sm">
                        {driveUser?.name ? driveUser.name.charAt(0) : 'G'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-[#072a1a]">
                        {driveUser?.name || 'Conta Google Conectada'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CloudCheck className="w-3 h-3" /> Ativo
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block truncate max-w-xs">
                      {driveUser?.email}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-0.5">
                      <FolderOpen className="w-3 h-3 text-[#15803d]" />
                      <span className="font-mono text-[10px] font-semibold text-emerald-800 truncate">
                        {folderName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 bg-[#0d3822] hover:bg-[#15803d] text-[#86efac] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50"
                    title="Sincronizar dados com o Google Drive agora"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={disconnectDrive}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Desconectar do Google Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sync Controls & Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Auto-Sync Switch */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Sincronização Contínua
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Salva alterações automaticamente na nuvem
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => toggleAutoSync(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0d3822]"></div>
                  </label>
                </div>

                {/* Last Sync Timestamp */}
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 flex items-center gap-2.5">
                  <ClockIcon />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      Última Sincronização
                    </span>
                    <span className="text-[11px] text-emerald-800 font-mono font-medium block mt-0.5">
                      {formattedLastSync || 'Pendente de sincronização inicial'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar: Bulk Upload & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-bold text-[#072a1a]">{currentProjects.length}</span> projetos neste dispositivo •{' '}
                  <span className="font-bold text-[#15803d]">{cloudFiles.length}</span> arquivo(s) no Google Drive
                </div>

                <button
                  type="button"
                  onClick={handleUploadAll}
                  disabled={isUploadingAll || isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] border border-emerald-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
                  title="Fazer backup de todos os projetos locais para o Google Drive"
                >
                  <Upload className="w-3.5 h-3.5 text-[#15803d]" />
                  <span>{isUploadingAll ? 'Enviando...' : 'Backup de Todas as Obras'}</span>
                </button>
              </div>

              {/* Cloud Files List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">
                    Arquivos Salvos no Google Drive
                  </h4>
                  <span className="text-[11px] text-gray-400">
                    Pasta: {folderName}
                  </span>
                </div>

                {cloudFiles.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-500 text-xs space-y-1">
                    <Cloud className="w-6 h-6 text-gray-400 mx-auto" />
                    <p className="font-medium text-gray-700">Nenhum arquivo encontrado na pasta do Drive ainda.</p>
                    <p className="text-[11px]">Clique em "Backup de Todas as Obras" ou "Sincronizar" para salvar seus projetos.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl max-h-56 overflow-y-auto bg-white">
                    {cloudFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 sm:p-3 flex items-center justify-between gap-3 hover:bg-emerald-50/40 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                            <FileCode className="w-3.5 h-3.5 text-[#15803d]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 truncate">
                                {file.name.replace('.allgreen.json', '').replace('projeto_', '')}
                              </span>
                              {file.projectCode && (
                                <span className="px-1.5 py-0.2 rounded bg-[#0d3822] text-[#86efac] text-[9px] font-mono font-bold shrink-0">
                                  {file.projectCode}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                              <span>
                                {new Date(file.modifiedTime).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {file.size && (
                                <span>• {(file.size / 1024).toFixed(1)} KB</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Abrir no Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDownloadSingle(file.id)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#0d3822] hover:bg-emerald-100 transition-colors"
                            title="Restaurar / Baixar neste dispositivo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCloudFile(file.id, file.name)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Excluir da nuvem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
            Criptografia Google OAuth 2.0 • Protocolo drive.file
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ClockIcon = () => (
  <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-[#0d3822] flex items-center justify-center shrink-0">
    <FolderSync className="w-3.5 h-3.5 text-[#15803d]" />
  </div>
);
