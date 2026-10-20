import { BiophilicProfileResult, UserProfile } from '../types';
import { botanicalAudio } from './botanicalAudio';

export interface NatureNotificationSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 30, 45, 60, 120
  soundEnabled: boolean;
  lastTriggered?: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // '20:00'
  quietHoursEnd: string; // '08:00'
  totalRemindersSent: number;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NatureNotificationSettings = {
  enabled: false,
  intervalMinutes: 60,
  soundEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '20:00',
  quietHoursEnd: '08:00',
  totalRemindersSent: 0,
};

const STORAGE_KEY = 'allgreen_nature_notifications_settings_v1';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
};

export const loadNatureNotificationSettings = (): NatureNotificationSettings => {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load notification settings:', e);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
};

export const saveNatureNotificationSettings = (
  settings: Partial<NatureNotificationSettings>
): NatureNotificationSettings => {
  const current = loadNatureNotificationSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save notification settings:', e);
  }
  return updated;
};

export interface NatureReminderContent {
  title: string;
  body: string;
  icon: string;
  archetypeBadge: string;
  archetypeTitle: string;
  suggestedAction: string;
  technique: string;
}

/**
 * Returns tailored nature pause text based on the user's saved biophilic profile
 */
export const getProfileBasedReminderContent = (
  profile?: BiophilicProfileResult | null
): NatureReminderContent => {
  // If no profile passed, try reading from saved user profile
  let activeProfile = profile;
  if (!activeProfile && typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem('allgreen_user_profile');
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        activeProfile = parsed.savedBiophilicProfile;
      }
    } catch {}
  }

  const archetypeId = activeProfile?.archetypeId || 'default';
  const archetypeTitle = activeProfile?.archetypeTitle || 'Biofilia & Conexão Natural';

  switch (archetypeId) {
    case 'sanctuary_acoustic_focus':
      return {
        title: '🌿 Pausa Regenerativa • Santuário Acústico',
        body: 'Momento de foco & alívio acústico: feche os olhos por 2 minutos, sinta a calma do verde preservado e reduza a fadiga auditiva para recarregar sua concentração.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Atenuação Sonora & Foco',
        archetypeTitle,
        suggestedAction: '2 min de olhos fechados + respiração diafragmática profunda',
        technique: 'Recuperação de atenção (Harvard COGfx model)',
      };

    case 'luxury_wellness_oasis':
      return {
        title: '🍃 Momento Natureza • Oásis Bio-Restaurativo',
        body: 'Pausa multissensorial: respire profundamente, expire devagar e imagine a brisa fresca entre as folhagens. Seu momento de desaceleração para reduzir o cortisol.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Alívio de Estresse & Bem-Estar',
        archetypeTitle,
        suggestedAction: 'Alongamento suave de ombros e pescoço olhando para uma planta',
        technique: 'Redução de estresse neurobiológico (-38% cortisol)',
      };

    case 'biophilic_urban_jungle':
      return {
        title: '🌱 Conexão Botânica • Selva Tropical',
        body: 'Hora de reconectar com a vida: afaste o olhar da tela por 3 minutos, observe elementos de vegetação viva e renove a circulação de oxigênio.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Biodiversidade & Vitalidade',
        archetypeTitle,
        suggestedAction: 'Regra 20-20-20: olhe para longe e hidrate-se com um copo d\'água',
        technique: 'Estímulo biofílico visual de alta escala',
      };

    case 'modern_sculptural_minimalist':
      return {
        title: '🌿 Inspiração Biofílica • Clareza & Design',
        body: 'Pausa estética consciente: aprecie as formas orgânicas, padrões geométricos naturais e texturas para clarear os pensamentos e ativar a criatividade.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Geometria Natural & Criatividade',
        archetypeTitle,
        suggestedAction: 'Pausa de 3 minutos sem estímulos digitais',
        technique: 'Restauração de capacidade criativa e clareza visual',
      };

    case 'sunlit_uv_terrace':
      return {
        title: '☀️ Momento Circadiano • Luz & Natureza',
        body: 'Sincronização circadiana: aproxime-se de uma janela ou área iluminada por 3 minutos, expire o cansaço e recarregue sua vitalidade sob a luz diurna.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Ritmo Circadiano & Energia',
        archetypeTitle,
        suggestedAction: 'Exposição a luz natural difusa e respiração consciente',
        technique: 'Estabilização de ritmo circadiano e ciclo de sono',
      };

    default:
      return {
        title: '🌿 Momento de Natureza • All Green',
        body: 'Faça uma pausa regenerativa: respire fundo, descanse a visão de telas digitais e conecte-se com o verde ao seu redor por 2 minutos.',
        icon: '/pwa-192x192.png',
        archetypeBadge: 'Biofilia Geral',
        archetypeTitle,
        suggestedAction: 'Pausa respiratória de 2 minutos e hidratação',
        technique: 'Hábito de micro-pausas restaurativas',
      };
  }
};

/**
 * Checks if current time is within quiet hours (e.g. 20:00 to 08:00)
 */
export const isWithinQuietHours = (start: string = '20:00', end: string = '08:00'): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Crosses midnight, e.g. 20:00 to 08:00
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

/**
 * Dispatches a native browser notification reminding user to take a nature moment
 */
export const sendNatureReminderNotification = (
  profile?: BiophilicProfileResult | null,
  isTest: boolean = false
): boolean => {
  if (!isNotificationSupported()) {
    console.warn('Notifications API is not supported on this device/browser.');
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission is not granted.');
    return false;
  }

  const settings = loadNatureNotificationSettings();

  // If not a manual test, check quiet hours
  if (!isTest && settings.quietHoursEnabled && isWithinQuietHours(settings.quietHoursStart, settings.quietHoursEnd)) {
    console.info('Skipping nature notification: currently in quiet hours.');
    return false;
  }

  const content = getProfileBasedReminderContent(profile);

  try {
    const notification = new Notification(content.title, {
      body: content.body,
      icon: content.icon,
      badge: '/icon.svg',
      tag: 'allgreen-nature-moment',
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Play gentle nature sound chime if enabled
    if (settings.soundEnabled) {
      try {
        botanicalAudio.playChime();
      } catch (e) {
        // audio might require interaction
      }
    }

    // Update settings timestamp and stats
    saveNatureNotificationSettings({
      lastTriggered: Date.now(),
      totalRemindersSent: (settings.totalRemindersSent || 0) + 1,
    });

    return true;
  } catch (err) {
    console.error('Failed to trigger native Notification:', err);
    return false;
  }
};

// Scheduler singleton reference
let schedulerIntervalId: number | null = null;

export const startNatureNotificationScheduler = (
  onReminderTriggered?: (content: NatureReminderContent) => void
): void => {
  if (typeof window === 'undefined') return;

  if (schedulerIntervalId !== null) {
    clearInterval(schedulerIntervalId);
  }

  // Check every 60 seconds
  schedulerIntervalId = window.setInterval(() => {
    const settings = loadNatureNotificationSettings();
    if (!settings.enabled || Notification.permission !== 'granted') return;

    const now = Date.now();
    const intervalMs = (settings.intervalMinutes || 60) * 60 * 1000;
    const lastTriggered = settings.lastTriggered || 0;

    if (now - lastTriggered >= intervalMs) {
      const content = getProfileBasedReminderContent();
      const sent = sendNatureReminderNotification(null, false);
      if (sent && onReminderTriggered) {
        onReminderTriggered(content);
      }
    }
  }, 60000);
};

export const stopNatureNotificationScheduler = (): void => {
  if (schedulerIntervalId !== null) {
    clearInterval(schedulerIntervalId);
    schedulerIntervalId = null;
  }
};
