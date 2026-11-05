import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { SimulationResult } from '../types';

export interface SimulatorProgressData {
  userId: string;
  step: 'upload' | 'analyzing' | 'result';
  roomType: string;
  stylePreference: string;
  wallWidth: number;
  wallHeight: number;
  activeArea: number;
  sliderPos?: number;
  viewMode?: 'slider' | 'side-by-side';
  selectedSample?: string;
  updatedAt?: string;
  createdAt?: string;
  // Local/extended preview metadata
  hasCustomImage?: boolean;
  simulationResultSummary?: {
    estimatedBudgetMin: number;
    estimatedBudgetMax: number;
    wellScore: number;
    leedCredits: number;
    recommendedSpeciesCount: number;
  };
}

const LOCAL_STORAGE_KEY_PREFIX = 'allgreen_sim_progress_';

/**
 * Saves the simulator progress to Firestore under /users/{userId}/simulator_progress/current
 */
export async function saveSimulatorProgress(
  userId: string,
  data: Omit<SimulatorProgressData, 'userId' | 'updatedAt'>
): Promise<{ success: boolean; savedAt: string }> {
  if (!userId) {
    throw new Error('UserId is required for Firestore synchronization');
  }

  const path = `users/${userId}/simulator_progress/current`;
  const nowIso = new Date().toISOString();

  const payload: SimulatorProgressData = {
    ...data,
    userId,
    updatedAt: nowIso,
    createdAt: data.createdAt || nowIso,
  };

  // Always back up to local storage first for instant responsiveness
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(payload));
  } catch (e) {
    console.warn('[Sync] Local storage fallback failed:', e);
  }

  try {
    const docRef = doc(db, 'users', userId, 'simulator_progress', 'current');
    await setDoc(docRef, {
      userId: payload.userId,
      step: payload.step,
      roomType: payload.roomType,
      stylePreference: payload.stylePreference,
      wallWidth: payload.wallWidth,
      wallHeight: payload.wallHeight,
      activeArea: payload.activeArea,
      sliderPos: payload.sliderPos ?? 50,
      viewMode: payload.viewMode ?? 'slider',
      selectedSample: payload.selectedSample ?? '',
      updatedAt: payload.updatedAt,
      createdAt: payload.createdAt,
    });

    return { success: true, savedAt: nowIso };
  } catch (error) {
    console.error('[Sync] Firestore auto-save failed:', error);
    // Return gracefully or throw with FirestoreErrorInfo
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch (e) {
      // If error is handled and thrown, we still allow client to know local save succeeded
      console.warn('[Sync] Firestore error handled, local cache intact.');
    }
    return { success: false, savedAt: nowIso };
  }
}

/**
 * Loads the user's latest simulator progress from Firestore or Local Cache
 */
export async function loadSimulatorProgress(
  userId: string
): Promise<SimulatorProgressData | null> {
  if (!userId) return null;

  const path = `users/${userId}/simulator_progress/current`;

  // First try local cache for speed
  let cachedData: SimulatorProgressData | null = null;
  try {
    const local = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (local) {
      cachedData = JSON.parse(local);
    }
  } catch (e) {
    // ignore
  }

  try {
    const docRef = doc(db, 'users', userId, 'simulator_progress', 'current');
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const firestoreData = snapshot.data() as SimulatorProgressData;
      return firestoreData;
    }
  } catch (error) {
    console.warn('[Sync] Could not fetch simulator progress from Firestore, falling back to local cache:', error);
  }

  return cachedData;
}
