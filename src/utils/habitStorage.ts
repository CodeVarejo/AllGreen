import { Habit, HabitLogsMap, HabitStats, HabitCategory } from '../types';

export const HABIT_STORAGE_KEY = 'allgreen_habits_v2';
export const HABIT_LOGS_STORAGE_KEY = 'allgreen_habit_logs_v2';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit_bio_1',
    title: 'Pausa Visual Biofílica (20-20-20)',
    description: 'Fixar o olhar na vegetação natural ou parede viva por 20 segundos a cada 20 min para descanso ciliar e renovação do foco.',
    category: 'biofilia',
    icon: 'Eye',
    color: 'emerald',
    targetDaysPerWeek: 7,
    timeOfDay: 'qualquer',
    createdAt: '2026-09-01',
  },
  {
    id: 'habit_bio_2',
    title: 'Hidratação Consciente & Respiração',
    description: 'Ingerir água e realizar 3 ciclos de respiração diafragmática profunda em contato visual com o paisagismo.',
    category: 'bem-estar',
    icon: 'Droplet',
    color: 'sky',
    targetDaysPerWeek: 7,
    timeOfDay: 'manha',
    createdAt: '2026-09-01',
  },
  {
    id: 'habit_bio_3',
    title: 'Descompressão Acústica & Silêncio',
    description: 'Permanecer 5 minutos sem ruído mecânico ou fones de ouvido em área com atenuação acústica homologada.',
    category: 'ergonomia',
    icon: 'Wind',
    color: 'indigo',
    targetDaysPerWeek: 5,
    timeOfDay: 'tarde',
    createdAt: '2026-09-01',
  },
  {
    id: 'habit_bio_4',
    title: 'Ajuste Circadiano de Iluminação',
    description: 'Transicionar para iluminação quente 2700K ao entardecer para estimular a melatonina e sincronizar o ritmo biológico.',
    category: 'sustentabilidade',
    icon: 'Sun',
    color: 'amber',
    targetDaysPerWeek: 5,
    timeOfDay: 'noite',
    createdAt: '2026-09-01',
  },
  {
    id: 'habit_bio_5',
    title: 'Vistoria Semanal de Preservação',
    description: 'Verificar se não há incidência solar direta nem fontes de umidade excessiva sobre as folhagens estabilizadas.',
    category: 'cuidado',
    icon: 'Leaf',
    color: 'teal',
    targetDaysPerWeek: 2,
    timeOfDay: 'manha',
    createdAt: '2026-09-01',
  },
];

export const HABIT_SUGGESTIONS: Array<Omit<Habit, 'id' | 'createdAt'>> = [
  {
    title: 'Alongamento & Postura Biofílica',
    description: 'Alongar membros superiores e coluna alinhando a visão com a linha do horizonte verde.',
    category: 'ergonomia',
    icon: 'Heart',
    color: 'rose',
    targetDaysPerWeek: 5,
    timeOfDay: 'manha',
  },
  {
    title: 'Caminhada Regenerativa de 15 Min',
    description: 'Pausa ativa ao redor de áreas arborizadas para reduzir cortisol e oxigenar o córtex pré-frontal.',
    category: 'bem-estar',
    icon: 'Activity',
    color: 'emerald',
    targetDaysPerWeek: 4,
    timeOfDay: 'tarde',
  },
  {
    title: 'Espanador Eletrostático Suave',
    description: 'Passar espanador de penas ou microfibra leve nas folhas do jardim vertical preservado a cada 15 dias.',
    category: 'cuidado',
    icon: 'Sparkles',
    color: 'teal',
    targetDaysPerWeek: 1,
    timeOfDay: 'manha',
  },
  {
    title: 'Leitura de Padrões Biofílicos WELL',
    description: 'Estudar ou aplicar 1 diretriz do conceito WELL v2 Mind / Light no projeto arquitetônico.',
    category: 'biofilia',
    icon: 'Brain',
    color: 'indigo',
    targetDaysPerWeek: 3,
    timeOfDay: 'qualquer',
  },
];

// Helper to format Date to YYYY-MM-DD
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate an array of dates backwards from today
export function getPastDatesList(daysCount: number = 30): string[] {
  const list: string[] = [];
  const now = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    list.push(formatDateKey(d));
  }
  return list;
}

// Seed initial realistic history for demo if empty
function generateInitialLogs(): HabitLogsMap {
  const logs: HabitLogsMap = {};
  const pastDates = getPastDatesList(28);

  pastDates.forEach((dateStr, index) => {
    logs[dateStr] = {};
    // Give higher completion to recent dates for a good streak
    const isWeekend = (index % 7 === 5 || index % 7 === 6);
    
    // habit 1 (daily)
    if (index > 3 && (!isWeekend || index > 14)) {
      logs[dateStr]['habit_bio_1'] = true;
    }
    // habit 2 (daily)
    if (index > 4) {
      logs[dateStr]['habit_bio_2'] = true;
    }
    // habit 3 (weekdays)
    if (!isWeekend && index > 6) {
      logs[dateStr]['habit_bio_3'] = true;
    }
    // habit 4 (weekdays)
    if (!isWeekend && index % 2 === 0) {
      logs[dateStr]['habit_bio_4'] = true;
    }
    // habit 5 (weekly)
    if (index % 7 === 1) {
      logs[dateStr]['habit_bio_5'] = true;
    }
  });

  return logs;
}

export function loadHabits(): Habit[] {
  try {
    const saved = localStorage.getItem(HABIT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading habits', e);
  }
  return INITIAL_HABITS;
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.warn('Error saving habits', e);
  }
}

export function loadHabitLogs(): HabitLogsMap {
  try {
    const saved = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading habit logs', e);
  }
  const seeded = generateInitialLogs();
  saveHabitLogs(seeded);
  return seeded;
}

export function saveHabitLogs(logs: HabitLogsMap): void {
  try {
    localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn('Error saving habit logs', e);
  }
}

export function toggleHabitLog(
  habitId: string,
  dateKey: string,
  currentLogs: HabitLogsMap
): { isCompleted: boolean; updatedLogs: HabitLogsMap } {
  const updated = { ...currentLogs };
  const dayLogs = { ...(updated[dateKey] || {}) };
  const nextStatus = !dayLogs[habitId];

  if (nextStatus) {
    dayLogs[habitId] = true;
  } else {
    delete dayLogs[habitId];
  }

  updated[dateKey] = dayLogs;
  saveHabitLogs(updated);

  return { isCompleted: nextStatus, updatedLogs: updated };
}

// Calculate streaks and completion rates
export function calculateHabitStats(habits: Habit[], logs: HabitLogsMap): HabitStats {
  const todayKey = formatDateKey(new Date());
  const todayLogs = logs[todayKey] || {};
  const totalHabits = habits.length;

  const todayCompletedCount = habits.filter(h => !!todayLogs[h.id]).length;
  const todayRate = totalHabits > 0 ? Math.round((todayCompletedCount / totalHabits) * 100) : 0;

  // Total completions across all dates
  let totalCompletions = 0;
  Object.values(logs).forEach(dayObj => {
    Object.keys(dayObj).forEach(hId => {
      if (dayObj[hId]) totalCompletions++;
    });
  });

  // Last 7 days rate
  const last7Days = getPastDatesList(7);
  let completionsLast7 = 0;
  const maxPossibleLast7 = totalHabits * 7;
  last7Days.forEach(dateStr => {
    const day = logs[dateStr] || {};
    habits.forEach(h => {
      if (day[h.id]) completionsLast7++;
    });
  });
  const weeklyRate = maxPossibleLast7 > 0 ? Math.round((completionsLast7 / maxPossibleLast7) * 100) : 0;

  // Last 30 days rate
  const last30Days = getPastDatesList(30);
  let completionsLast30 = 0;
  const maxPossibleLast30 = totalHabits * 30;
  last30Days.forEach(dateStr => {
    const day = logs[dateStr] || {};
    habits.forEach(h => {
      if (day[h.id]) completionsLast30++;
    });
  });
  const monthlyRate = maxPossibleLast30 > 0 ? Math.round((completionsLast30 / maxPossibleLast30) * 100) : 0;

  // Current Streak Calculation:
  // Count consecutive days going backwards from today or yesterday with at least 1 habit completed
  let currentStreak = 0;
  let cursor = new Date();
  
  // If today has completion, start counting from today. If not, check yesterday.
  const todayHasAny = habits.some(h => !!todayLogs[h.id]);
  if (!todayHasAny) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const day = logs[key] || {};
    const hasAny = habits.some(h => !!day[h.id]);
    if (hasAny) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (currentStreak > 365) break; // safety cap
  }

  // Best streak over past 60 days
  const last60 = getPastDatesList(60);
  let bestStreak = 0;
  let tempStreak = 0;
  last60.forEach(key => {
    const day = logs[key] || {};
    const hasAny = habits.some(h => !!day[h.id]);
    if (hasAny) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalCompletions,
    weeklyRate,
    monthlyRate,
    todayRate,
    todayCompletedCount,
    totalHabitsCount: totalHabits,
  };
}

// Calculate individual habit stats
export function getIndividualHabitStats(habitId: string, logs: HabitLogsMap) {
  let totalCompletions = 0;
  const last7 = getPastDatesList(7);
  let completedLast7 = 0;

  last7.forEach(dateStr => {
    if (logs[dateStr]?.[habitId]) {
      completedLast7++;
    }
  });

  Object.values(logs).forEach(day => {
    if (day[habitId]) totalCompletions++;
  });

  // Habit Streak
  let streak = 0;
  const cursor = new Date();
  const todayKey = formatDateKey(cursor);
  if (!logs[todayKey]?.[habitId]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const k = formatDateKey(cursor);
    if (logs[k]?.[habitId]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
    if (streak > 365) break;
  }

  return {
    totalCompletions,
    completedLast7,
    streak,
  };
}
