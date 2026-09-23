import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PortalProject } from '../types';
import {
  CloudFileItem,
  GoogleDriveUserProfile,
  getStoredToken,
  getValidAccessToken,
  clearDriveAuth,
  fetchDriveUserInfo,
  listDriveProjects,
  saveProjectToDrive,
  downloadProjectFromDrive,
  deleteDriveFile,
  syncProjectsWithDrive,
  isAutoSyncEnabled,
  setAutoSyncEnabled as setStoredAutoSync,
  getLastSyncTime,
  getStoredDriveUser,
  APP_FOLDER_NAME,
} from '../services/googleDrive';

interface CloudStorageContextType {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  cloudFiles: CloudFileItem[];
  driveUser: GoogleDriveUserProfile | null;
  autoSyncEnabled: boolean;
  error: string | null;
  folderName: string;
  connectDrive: () => Promise<boolean>;
  disconnectDrive: () => void;
  syncNow: (currentProjects: PortalProject[]) => Promise<PortalProject[]>;
  saveProject: (project: PortalProject) => Promise<boolean>;
  deleteProject: (fileId: string) => Promise<boolean>;
  downloadProject: (fileId: string) => Promise<PortalProject | null>;
  toggleAutoSync: (enabled: boolean) => void;
  refreshCloudFiles: () => Promise<void>;
  clearError: () => void;
}

const CloudStorageContext = createContext<CloudStorageContextType | undefined>(undefined);

export const CloudStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(() => !!getStoredToken());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => getLastSyncTime());
  const [cloudFiles, setCloudFiles] = useState<CloudFileItem[]>([]);
  const [driveUser, setDriveUser] = useState<GoogleDriveUserProfile | null>(() => getStoredDriveUser());
  const [autoSyncEnabled, setAutoSyncEnabledState] = useState<boolean>(() => isAutoSyncEnabled());
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Refresh files list
  const refreshCloudFiles = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const files = await listDriveProjects(token);
      setCloudFiles(files);
    } catch (err: any) {
      console.warn('Error refreshing cloud files:', err);
    }
  }, []);

  // Initialize status and user info on mount if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setIsConnected(true);
      fetchDriveUserInfo(token)
        .then((profile) => setDriveUser(profile))
        .catch(() => {});
      refreshCloudFiles();
    }
  }, [refreshCloudFiles]);

  const connectDrive = async (): Promise<boolean> => {
    setIsSyncing(true);
    setError(null);
    try {
      const token = await getValidAccessToken(true);
      setIsConnected(true);
      const userProfile = await fetchDriveUserInfo(token);
      setDriveUser(userProfile);
      const files = await listDriveProjects(token);
      setCloudFiles(files);
      setIsSyncing(false);
      return true;
    } catch (err: any) {
      console.error('Error connecting Google Drive:', err);
      setError(err?.message || 'Falha ao conectar com o Google Drive.');
      setIsSyncing(false);
      return false;
    }
  };

  const disconnectDrive = () => {
    clearDriveAuth();
    setIsConnected(false);
    setDriveUser(null);
    setCloudFiles([]);
    setLastSyncedAt(null);
    setError(null);
  };

  const syncNow = async (currentProjects: PortalProject[]): Promise<PortalProject[]> => {
    const token = getStoredToken();
    if (!token) {
      const connected = await connectDrive();
      if (!connected) return currentProjects;
    }

    setIsSyncing(true);
    setError(null);

    try {
      const activeToken = await getValidAccessToken();
      const result = await syncProjectsWithDrive(activeToken, currentProjects);
      setLastSyncedAt(result.lastSyncedAt);
      await refreshCloudFiles();
      setIsSyncing(false);
      return result.syncedProjects;
    } catch (err: any) {
      console.error('Error synchronizing with Google Drive:', err);
      setError(err?.message || 'Erro durante a sincronização na nuvem.');
      setIsSyncing(false);
      return currentProjects;
    }
  };

  const saveProject = async (project: PortalProject): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      await saveProjectToDrive(token, project);
      await refreshCloudFiles();
      return true;
    } catch (err: any) {
      console.error('Error saving project to cloud:', err);
      setError(err?.message || 'Falha ao salvar projeto na nuvem.');
      return false;
    }
  };

  const deleteProject = async (fileId: string): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      await deleteDriveFile(token, fileId);
      setCloudFiles((prev) => prev.filter((f) => f.id !== fileId));
      return true;
    } catch (err: any) {
      console.error('Error deleting project from cloud:', err);
      setError(err?.message || 'Falha ao remover arquivo do Google Drive.');
      return false;
    }
  };

  const downloadProject = async (fileId: string): Promise<PortalProject | null> => {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const project = await downloadProjectFromDrive(token, fileId);
      return project;
    } catch (err: any) {
      console.error('Error downloading project:', err);
      setError(err?.message || 'Falha ao baixar projeto da nuvem.');
      return null;
    }
  };

  const toggleAutoSync = (enabled: boolean) => {
    setAutoSyncEnabledState(enabled);
    setStoredAutoSync(enabled);
  };

  return (
    <CloudStorageContext.Provider
      value={{
        isConnected,
        isSyncing,
        lastSyncedAt,
        cloudFiles,
        driveUser,
        autoSyncEnabled,
        error,
        folderName: APP_FOLDER_NAME,
        connectDrive,
        disconnectDrive,
        syncNow,
        saveProject,
        deleteProject,
        downloadProject,
        toggleAutoSync,
        refreshCloudFiles,
        clearError,
      }}
    >
      {children}
    </CloudStorageContext.Provider>
  );
};

export const useCloudStorage = () => {
  const context = useContext(CloudStorageContext);
  if (!context) {
    throw new Error('useCloudStorage must be used within a CloudStorageProvider');
  }
  return context;
};
