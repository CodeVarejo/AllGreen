import { PortalProject } from '../types';
import { GoogleTokenResponse, TokenClient } from '../types/google';

export const GOOGLE_CLIENT_ID =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) ||
  '700194373575-r3ql1g8gtl7ji6vo42c48tun31rv5d9l.apps.googleusercontent.com';

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
export const APP_FOLDER_NAME = 'All Green Biofilia - Projetos & Arquivos';

export interface CloudFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  createdTime?: string;
  webViewLink?: string;
  description?: string;
  projectCode?: string;
  projectId?: string;
}

export interface GoogleDriveUserProfile {
  email: string;
  name: string;
  picture?: string;
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
  };
}

export interface SyncResult {
  success: boolean;
  syncedProjects: PortalProject[];
  uploadedCount: number;
  downloadedCount: number;
  lastSyncedAt: string;
  message: string;
}

// Storage keys
const TOKEN_KEY = 'allgreen_gdrive_access_token';
const EXPIRY_KEY = 'allgreen_gdrive_token_expires_at';
const USER_KEY = 'allgreen_gdrive_user';
const FOLDER_ID_KEY = 'allgreen_gdrive_folder_id';
const LAST_SYNC_KEY = 'allgreen_gdrive_last_sync';
const AUTO_SYNC_KEY = 'allgreen_gdrive_auto_sync';

/**
 * Checks if a valid token is cached in localStorage
 */
export function getStoredToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiresAt = localStorage.getItem(EXPIRY_KEY);
    if (!token || !expiresAt) return null;

    const expiryNumber = parseInt(expiresAt, 10);
    // Expired or within 60s of expiring
    if (Date.now() > expiryNumber - 60000) {
      return null;
    }
    return token;
  } catch (e) {
    console.error('Error reading stored token', e);
    return null;
  }
}

/**
 * Stores token and calculates expiration
 */
export function storeToken(token: string, expiresInSeconds: number): void {
  try {
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
  } catch (e) {
    console.error('Error saving token', e);
  }
}

/**
 * Clears Google Drive credentials from localStorage
 */
export function clearDriveAuth(): void {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(token, () => {
        console.log('Revoked Google OAuth token');
      });
    }
  } catch (e) {
    console.error('Error revoking token', e);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(FOLDER_ID_KEY);
  }
}

/**
 * Check if auto-sync is enabled
 */
export function isAutoSyncEnabled(): boolean {
  try {
    const val = localStorage.getItem(AUTO_SYNC_KEY);
    return val !== 'false'; // Default to true once connected
  } catch {
    return true;
  }
}

export function setAutoSyncEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_SYNC_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.error('Error setting auto-sync', e);
  }
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
}

export function setLastSyncTime(timestamp: string): void {
  try {
    localStorage.setItem(LAST_SYNC_KEY, timestamp);
  } catch (e) {
    console.error('Error setting last sync time', e);
  }
}

export function getStoredDriveUser(): GoogleDriveUserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Helper to ensure Google Identity Services script is loaded
 */
export function waitForGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve();
      } else if (retries > 50) {
        clearInterval(interval);
        reject(new Error('Google Identity Services script failed to load. Verifique sua conexão com a internet.'));
      }
    }, 100);
  });
}

/**
 * Request Access Token using Google Identity Services (Client-side Token Model)
 */
export async function requestGoogleDriveAccessToken(prompt: string = 'consent'): Promise<string> {
  await waitForGsiScript();

  return new Promise<string>((resolve, reject) => {
    try {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        prompt: prompt,
        callback: (response: GoogleTokenResponse) => {
          if (response.error) {
            console.error('Google OAuth error:', response);
            reject(new Error(response.error_description || response.error || 'Erro na autenticação do Google Drive.'));
            return;
          }
          if (response.access_token) {
            const expiresIn = response.expires_in || 3600;
            storeToken(response.access_token, expiresIn);
            resolve(response.access_token);
          } else {
            reject(new Error('Nenhum token de acesso foi retornado pelo Google.'));
          }
        },
        error_callback: (err: any) => {
          console.error('Token client error callback:', err);
          reject(new Error(err?.message || 'Falha na inicialização do fluxo OAuth do Google Drive.'));
        }
      });

      client.requestAccessToken({ prompt });
    } catch (err: any) {
      console.error('Error invoking initTokenClient:', err);
      reject(err);
    }
  });
}

/**
 * Get active token or prompt user
 */
export async function getValidAccessToken(forcePrompt: boolean = false): Promise<string> {
  if (!forcePrompt) {
    const stored = getStoredToken();
    if (stored) return stored;
  }
  return await requestGoogleDriveAccessToken(forcePrompt ? 'consent' : '');
}

/**
 * Fetch Google User Info and Drive Storage Info
 */
export async function fetchDriveUserInfo(token: string): Promise<GoogleDriveUserProfile> {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Drive about: ${res.statusText}`);
    }

    const data = await res.json();
    const profile: GoogleDriveUserProfile = {
      email: data.user?.emailAddress || 'usuario@google.com',
      name: data.user?.displayName || 'Arquiteto / Especificador',
      picture: data.user?.photoLink,
      storageQuota: {
        limit: data.storageQuota?.limit,
        usage: data.storageQuota?.usage,
        usageInDrive: data.storageQuota?.usageInDrive,
      }
    };

    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.warn('Could not fetch Drive user info, attempting userinfo fallback', error);
    const fallback: GoogleDriveUserProfile = {
      email: 'Conta Google Conectada',
      name: 'Google Drive User',
    };
    return fallback;
  }
}

/**
 * Finds or creates the dedicated All Green app folder in Google Drive
 */
export async function ensureAppFolder(token: string): Promise<string> {
  const cachedFolderId = localStorage.getItem(FOLDER_ID_KEY);
  if (cachedFolderId) {
    // Verify it still exists
    try {
      const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files/${cachedFolderId}?fields=id,trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (!checkData.trashed) {
          return cachedFolderId;
        }
      }
    } catch {
      // Ignore and recreate/search
    }
  }

  // Search by name
  const query = `name = '${APP_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const folderId = data.files[0].id;
      localStorage.setItem(FOLDER_ID_KEY, folderId);
      return folderId;
    }
  }

  // Create new folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Pasta do Ateliê All Green com dossiês biofílicos, simulações IA e especificações técnicas salvas na nuvem.',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Não foi possível criar a pasta no Google Drive.');
  }

  const folderData = await createRes.json();
  localStorage.setItem(FOLDER_ID_KEY, folderData.id);
  return folderData.id;
}

/**
 * List all project files in the All Green Google Drive folder
 */
export async function listDriveProjects(token: string): Promise<CloudFileItem[]> {
  const folderId = await ensureAppFolder(token);
  const query = `'${folderId}' in parents and trashed = false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,modifiedTime,createdTime,description,webViewLink,properties)&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao listar arquivos do Google Drive.');
  }

  const data = await res.json();
  const files: CloudFileItem[] = (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: f.size ? parseInt(f.size, 10) : undefined,
    modifiedTime: f.modifiedTime,
    createdTime: f.createdTime,
    webViewLink: f.webViewLink,
    description: f.description,
    projectCode: f.properties?.projectCode,
    projectId: f.properties?.projectId,
  }));

  return files;
}

/**
 * Save or update a project dossier in Google Drive (Multipart Upload)
 */
export async function saveProjectToDrive(
  token: string,
  project: PortalProject
): Promise<{ fileId: string; webViewLink?: string; timestamp: string }> {
  const folderId = await ensureAppFolder(token);

  // Clean filename: projeto_AG-2024_Escritorio_Boutique.allgreen.json
  const safeTitle = (project.title || 'Projeto')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `projeto_${project.code}_${safeTitle}.allgreen.json`;

  // Search if a file with this project code already exists in the folder
  let existingFileId: string | null = null;
  try {
    const query = `'${folderId}' in parents and (properties has { key='projectCode' and value='${project.code}' } or name = '${fileName}') and trashed = false`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        existingFileId = data.files[0].id;
      }
    }
  } catch (e) {
    console.warn('Error checking existing file in Drive', e);
  }

  const now = new Date().toISOString();
  const projectPayload = {
    ...project,
    cloudSync: {
      syncedAt: now,
      source: 'All Green Web Applet',
      version: 1,
    }
  };

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: existingFileId ? undefined : [folderId],
    description: `Dossiê Técnico Biofílico All Green - ${project.code} (${project.client})`,
    properties: {
      app: 'allgreen',
      projectCode: project.code,
      projectId: project.id,
      client: project.client || '',
      category: project.category || '',
      style: project.style || '',
      lastModified: now,
    }
  };

  const boundary = '-------AllGreenDriveBoundary' + Date.now();
  const delimiter = '\r\n--' + boundary + '\r\n';
  const closeDelim = '\r\n--' + boundary + '--';

  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(projectPayload, null, 2) +
    closeDelim;

  const uploadUrl = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart&fields=id,name,webViewLink,modifiedTime`
    : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,modifiedTime`;

  const res = await fetch(uploadUrl, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao salvar projeto no Google Drive.');
  }

  const result = await res.json();
  return {
    fileId: result.id,
    webViewLink: result.webViewLink,
    timestamp: result.modifiedTime || now,
  };
}

/**
 * Download and parse a project file from Google Drive
 */
export async function downloadProjectFromDrive(token: string, fileId: string): Promise<PortalProject> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Falha ao carregar conteúdo do projeto: ${res.statusText}`);
  }

  const data = await res.json();
  return data as PortalProject;
}

/**
 * Delete a file from Google Drive
 */
export async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Falha ao remover arquivo do Google Drive.');
  }
}

/**
 * Bidirectional Synchronization between Local Projects and Google Drive
 * Merges projects from cloud and uploads local modifications.
 */
export async function syncProjectsWithDrive(
  token: string,
  localProjects: PortalProject[]
): Promise<SyncResult> {
  const cloudFiles = await listDriveProjects(token);
  let uploadedCount = 0;
  let downloadedCount = 0;

  const mergedProjects: PortalProject[] = [...localProjects];

  // 1. Process files from cloud
  for (const cloudFile of cloudFiles) {
    if (!cloudFile.name.endsWith('.allgreen.json') && cloudFile.mimeType !== 'application/json') {
      continue;
    }

    try {
      const remoteProject = await downloadProjectFromDrive(token, cloudFile.id);
      if (!remoteProject || !remoteProject.code) continue;

      const localIndex = mergedProjects.findIndex(
        (p) => p.code === remoteProject.code || p.id === remoteProject.id
      );

      if (localIndex === -1) {
        // Project exists in cloud but not locally -> Download to this device
        mergedProjects.push(remoteProject);
        downloadedCount++;
      } else {
        const localProj = mergedProjects[localIndex];
        const remoteTime = new Date(cloudFile.modifiedTime).getTime();
        const localTime = new Date(localProj.dateCreated || 0).getTime();

        // If remote has higher version or is newer
        const remoteVersion = remoteProject.versionHistory?.length || 1;
        const localVersion = localProj.versionHistory?.length || 1;

        if (remoteVersion > localVersion || remoteTime > localTime + 5000) {
          mergedProjects[localIndex] = remoteProject;
          downloadedCount++;
        }
      }
    } catch (err) {
      console.warn(`Error synchronizing cloud file ${cloudFile.name}:`, err);
    }
  }

  // 2. Upload any local projects that don't exist in cloud or are newer
  for (const localProj of mergedProjects) {
    const existsInCloud = cloudFiles.some(
      (f) => f.projectCode === localProj.code || f.name.includes(localProj.code)
    );

    if (!existsInCloud) {
      try {
        await saveProjectToDrive(token, localProj);
        uploadedCount++;
      } catch (e) {
        console.warn(`Error uploading local project ${localProj.code} to Drive:`, e);
      }
    }
  }

  const now = new Date().toISOString();
  setLastSyncTime(now);

  return {
    success: true,
    syncedProjects: mergedProjects,
    uploadedCount,
    downloadedCount,
    lastSyncedAt: now,
    message: `Sincronização concluída com sucesso. ${downloadedCount} recebido(s) da nuvem, ${uploadedCount} enviado(s) ao Google Drive.`,
  };
}
