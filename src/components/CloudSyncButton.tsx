import React from 'react';
import { Cloud, CloudCheck, RefreshCw } from 'lucide-react';
import { useCloudStorage } from '../context/CloudStorageContext';

interface CloudSyncButtonProps {
  onClick: () => void;
  variant?: 'navbar' | 'portal' | 'compact';
}

export const CloudSyncButton: React.FC<CloudSyncButtonProps> = ({
  onClick,
  variant = 'navbar',
}) => {
  const { isConnected, isSyncing, lastSyncedAt } = useCloudStorage();

  const formattedTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center min-w-[38px] min-h-[38px] ${
          isConnected
            ? 'bg-emerald-50 text-[#072a1a] border-emerald-300 hover:bg-emerald-100 shadow-2xs'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        }`}
        title={
          isConnected
            ? `Google Drive Conectado • Última sincronização: ${formattedTime || 'Recente'}`
            : 'Conectar Google Drive para salvar na nuvem'
        }
        aria-label="Armazenamento em Nuvem Google Drive"
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin" />
        ) : isConnected ? (
          <>
            <CloudCheck className="w-4 h-4 text-[#15803d]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </>
        ) : (
          <Cloud className="w-4 h-4 text-gray-500" />
        )}
      </button>
    );
  }

  if (variant === 'portal') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
          isConnected
            ? 'bg-emerald-50 hover:bg-emerald-100 text-[#072a1a] border-emerald-300'
            : 'bg-white hover:bg-emerald-50 text-gray-700 border-gray-300'
        }`}
        title={
          isConnected
            ? `Google Drive Ativo • Sincronizado ${formattedTime ? `às ${formattedTime}` : ''}`
            : 'Conectar armazenamento em nuvem do Google Drive'
        }
      >
        {isSyncing ? (
          <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
        ) : isConnected ? (
          <CloudCheck className="w-3.5 h-3.5 text-[#15803d]" />
        ) : (
          <Cloud className="w-3.5 h-3.5 text-gray-500" />
        )}

        <span className="hidden md:inline">
          {isSyncing ? 'Sincronizando...' : isConnected ? 'Nuvem Drive' : 'Conectar Nuvem'}
        </span>

        {isConnected && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </button>
    );
  }

  // Default navbar variant
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-9 sm:h-10 rounded-full border text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs ${
        isConnected
          ? 'bg-emerald-50/90 text-[#072a1a] border-emerald-300 hover:bg-emerald-100'
          : 'bg-white hover:bg-emerald-50/80 text-gray-700 border-gray-300/80'
      }`}
      title={
        isConnected
          ? `Google Drive Ativo • Sincronizado (${formattedTime || 'OK'})`
          : 'Conectar Google Drive para salvar na nuvem'
      }
      aria-label="Gerenciar armazenamento na nuvem e Google Drive"
    >
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
      ) : isConnected ? (
        <CloudCheck className="w-3.5 h-3.5 text-[#15803d]" />
      ) : (
        <Cloud className="w-3.5 h-3.5 text-gray-500" />
      )}

      <span className="hidden lg:inline leading-none">
        {isSyncing ? 'Sincronizando...' : isConnected ? 'Nuvem' : 'Salvar na Nuvem'}
      </span>

      {isConnected && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      )}
    </button>
  );
};
