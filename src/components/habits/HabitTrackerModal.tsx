import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  TrendingUp,
  BarChart3,
  Calendar,
  Leaf,
  Droplet,
  Sun,
  Eye,
  Wind,
  Heart,
  Brain,
  Activity,
  ShieldCheck,
  Sparkles,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Award,
  SlidersHorizontal
} from 'lucide-react';
import { Habit, HabitCategory, HabitLogsMap } from '../../types';
import {
  loadHabits,
  saveHabits,
  loadHabitLogs,
  saveHabitLogs,
  toggleHabitLog,
  calculateHabitStats,
  getPastDatesList,
  formatDateKey,
  getIndividualHabitStats,
  INITIAL_HABITS,
  HABIT_SUGGESTIONS,
} from '../../utils/habitStorage';
import { botanicalAudio } from '../../utils/botanicalAudio';

interface HabitTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CONFIG: Record<HabitCategory, { label: string; bg: string; text: string; border: string }> = {
  biofilia: {
    label: 'Biofilia & Natureza',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  ergonomia: {
    label: 'Ergonomia & Foco',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
  },
  cuidado: {
    label: 'Cuidado Botânico',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
  },
  sustentabilidade: {
    label: 'Sustentabilidade',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  'bem-estar': {
    label: 'Bem-Estar Geral',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
  },
};

const COLOR_ACCENTS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-400/40', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-400/40', text: 'text-teal-700', dot: 'bg-teal-500' },
  sky: { bg: 'bg-sky-500/10', border: 'border-sky-400/40', text: 'text-sky-700', dot: 'bg-sky-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-400/40', text: 'text-amber-700', dot: 'bg-amber-500' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-400/40', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-400/40', text: 'text-rose-700', dot: 'bg-rose-500' },
};

function renderHabitIcon(iconName: string, className: string = 'w-4 h-4') {
  switch (iconName.toLowerCase()) {
    case 'eye':
      return <Eye className={className} />;
    case 'droplet':
    case 'droplets':
      return <Droplet className={className} />;
    case 'wind':
      return <Wind className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'leaf':
      return <Leaf className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'brain':
      return <Brain className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'shieldcheck':
      return <ShieldCheck className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export const HabitTrackerModal: React.FC<HabitTrackerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'new'>('today');
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [logs, setLogs] = useState<HabitLogsMap>(() => loadHabitLogs());
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Form State for creating a habit
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('biofilia');
  const [newTargetDays, setNewTargetDays] = useState(7);
  const [newIcon, setNewIcon] = useState('Leaf');
  const [newColor, setNewColor] = useState('emerald');
  const [newTimeOfDay, setNewTimeOfDay] = useState<'manha' | 'tarde' | 'noite' | 'qualquer'>('qualquer');

  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const stats = useMemo(() => calculateHabitStats(habits, logs), [habits, logs]);

  // List of 7 days around today for ribbon
  const ribbonDays = useMemo(() => {
    const dates: { dateKey: string; dayName: string; dayNumber: number; isToday: boolean }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      dates.push({
        dateKey: key,
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        isToday: key === todayKey,
      });
    }
    return dates;
  }, [todayKey]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    if (categoryFilter === 'todos') return habits;
    return habits.filter(h => h.category === categoryFilter);
  }, [habits, categoryFilter]);

  // Heatmap 35 days (5 weeks)
  const heatmapDates = useMemo(() => {
    return getPastDatesList(35);
  }, []);

  // Completion calculation for selected date
  const selectedDateLogs = logs[selectedDate] || {};
  const selectedDayCompletedCount = habits.filter(h => !!selectedDateLogs[h.id]).length;
  const selectedDayTotal = habits.length;
  const selectedDayPercentage = selectedDayTotal > 0 ? Math.round((selectedDayCompletedCount / selectedDayTotal) * 100) : 0;

  // Handler to toggle completion
  const handleToggle = (habitId: string) => {
    const { isCompleted, updatedLogs } = toggleHabitLog(habitId, selectedDate, logs);
    setLogs(updatedLogs);

    if (isCompleted) {
      try {
        botanicalAudio.playChime();
      } catch (e) {}
    }
  };

  // Handler to add a habit
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const habit: Habit = {
      id: `habit_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Hábito biofílico personalizado de alta consistência.',
      category: newCategory,
      icon: newIcon,
      color: newColor,
      targetDaysPerWeek: newTargetDays,
      timeOfDay: newTimeOfDay,
      createdAt: formatDateKey(new Date()),
    };

    const updated = [habit, ...habits];
    setHabits(updated);
    saveHabits(updated);

    // Reset form & navigate to today
    setNewTitle('');
    setNewDescription('');
    setActiveTab('today');
  };

  // Handler to add a suggestion preset
  const handleAddSuggestion = (preset: Omit<Habit, 'id' | 'createdAt'>) => {
    const habit: Habit = {
      ...preset,
      id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: formatDateKey(new Date()),
    };
    const updated = [habit, ...habits];
    setHabits(updated);
    saveHabits(updated);
    setActiveTab('today');
  };

  // Handler to delete a habit
  const handleDeleteHabit = (habitId: string) => {
    const updated = habits.filter(h => h.id !== habitId);
    setHabits(updated);
    saveHabits(updated);
  };

  // Restore defaults
  const handleResetDefaults = () => {
    setHabits(INITIAL_HABITS);
    saveHabits(INITIAL_HABITS);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-tracker-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#072a1a] via-[#0d3822] to-[#072a1a] text-white p-5 sm:p-6 border-b border-emerald-900/50 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
            aria-label="Fechar rastreador de hábitos"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#86efac]/20 text-[#86efac] border border-[#86efac]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  WELL Mind & Comfort
                </span>
                <span className="text-xs text-emerald-200/80">
                  Rotina Regenerativa
                </span>
              </div>
              <h2 id="habit-tracker-title" className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Rastreador de Hábitos Biofílicos
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl font-light">
                Defina hábitos regenerativos, registre sua conclusão diária e acompanhe a consistência do seu bem-estar ao longo do tempo.
              </p>
            </div>

            {/* Quick Streak Card in Header */}
            <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-xs shrink-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-sm">
                <Flame className="w-6 h-6 fill-amber-950 stroke-amber-950 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">
                  Sequência Ativa
                </span>
                <span className="text-lg font-serif font-bold text-white">
                  {stats.currentStreak} {stats.currentStreak === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-emerald-800/60 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'today'
                  ? 'bg-[#86efac] text-[#072a1a] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Hoje & Registro Diário</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'today' ? 'bg-[#072a1a] text-[#86efac]' : 'bg-white/20 text-white'
              }`}>
                {selectedDayCompletedCount}/{selectedDayTotal}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'bg-[#86efac] text-[#072a1a] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Estatísticas de Progresso</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                {stats.monthlyRate}% taxa
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-[#86efac] text-[#072a1a] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Definir Hábito</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/70 space-y-6">

          {/* TAB 1: DAILY CHECKLIST & CALENDAR RIBBON */}
          {activeTab === 'today' && (
            <div className="space-y-6">
              
              {/* Day Selector Ribbon */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <Calendar className="w-4 h-4 text-[#15803d]" />
                    <span>Selecione o Dia para Registro:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayKey)}
                    className="text-xs font-bold text-[#15803d] hover:text-[#072a1a] cursor-pointer"
                  >
                    Voltar para Hoje
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {ribbonDays.map((d) => {
                    const isSelected = d.dateKey === selectedDate;
                    const dayLogsMap = logs[d.dateKey] || {};
                    const completedOnDay = habits.filter(h => !!dayLogsMap[h.id]).length;
                    const isFullyDone = habits.length > 0 && completedOnDay === habits.length;

                    return (
                      <button
                        key={d.dateKey}
                        type="button"
                        onClick={() => setSelectedDate(d.dateKey)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#072a1a] text-white border-[#072a1a] shadow-sm scale-102'
                            : 'bg-gray-50 hover:bg-emerald-50/60 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-300' : 'text-gray-500'}`}>
                          {d.dayName}
                        </span>
                        <span className="text-sm sm:text-base font-bold my-0.5">
                          {d.dayNumber}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          {isFullyDone ? (
                            <span className="w-2 h-2 rounded-full bg-[#86efac]" title="Todos hábitos concluídos" />
                          ) : completedOnDay > 0 ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title={`${completedOnDay} concluído(s)`} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Summary Progress Header */}
              <div className="bg-gradient-to-br from-emerald-900 to-[#072a1a] text-white p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider block">
                      {selectedDate === todayKey ? 'Rotina de Hoje' : `Data Selecionada: ${selectedDate}`}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {selectedDayCompletedCount} de {selectedDayTotal} hábitos concluídos
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-serif font-bold text-[#86efac]">
                        {selectedDayPercentage}%
                      </span>
                      <span className="text-[10px] text-emerald-200 block">taxa do dia</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-[#86efac] transition-all duration-500"
                    style={{ width: `${selectedDayPercentage}%` }}
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('todos')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'todos'
                      ? 'bg-[#072a1a] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Todos ({habits.length})
                </button>
                {(['biofilia', 'ergonomia', 'cuidado', 'sustentabilidade', 'bem-estar'] as HabitCategory[]).map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const count = habits.filter(h => h.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        categoryFilter === cat
                          ? 'bg-[#072a1a] text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cfg.label} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Habits Checklist */}
              {filteredHabits.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 space-y-3">
                  <Leaf className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">Nenhum hábito nesta categoria.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('new')}
                    className="px-4 py-2 bg-[#072a1a] text-[#86efac] rounded-xl text-xs font-bold hover:bg-[#15803d] transition-colors cursor-pointer"
                  >
                    Adicionar Hábito
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHabits.map((habit) => {
                    const isDone = !!selectedDateLogs[habit.id];
                    const catCfg = CATEGORY_CONFIG[habit.category] || CATEGORY_CONFIG['biofilia'];
                    const colorCfg = COLOR_ACCENTS[habit.color] || COLOR_ACCENTS['emerald'];
                    const habitStats = getIndividualHabitStats(habit.id, logs);

                    return (
                      <div
                        key={habit.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex items-start sm:items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
                            : 'bg-white border-gray-200 hover:border-emerald-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                          {/* Toggle Checkbox Button */}
                          <button
                            type="button"
                            onClick={() => handleToggle(habit.id)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 sm:mt-0 ${
                              isDone
                                ? 'bg-[#15803d] text-white shadow-sm scale-105'
                                : 'bg-gray-100 hover:bg-emerald-100 text-gray-400 hover:text-emerald-700 border border-gray-300'
                            }`}
                            title={isDone ? 'Concluído hoje! Clique para desmarcar' : 'Clique para marcar como concluído'}
                            aria-label={`Concluir hábito ${habit.title}`}
                          >
                            {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Circle className="w-4 h-4" />}
                          </button>

                          {/* Habit Info */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${catCfg.bg} ${catCfg.text} border ${catCfg.border}`}>
                                {catCfg.label}
                              </span>
                              {habit.timeOfDay && habit.timeOfDay !== 'qualquer' && (
                                <span className="text-[10px] text-gray-500 font-medium capitalize">
                                  • {habit.timeOfDay}
                                </span>
                              )}
                              {habitStats.streak > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{habitStats.streak}d seguidos</span>
                                </span>
                              )}
                            </div>

                            <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'text-emerald-950 line-through opacity-85' : 'text-gray-900'}`}>
                              {habit.title}
                            </h4>

                            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                              {habit.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Action Menu */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="p-1.5 text-gray-300 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Remover hábito"
                            aria-label="Excluir hábito"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Quick Presets Banner */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-[#072a1a] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Deseja adicionar hábitos da neuroarquitetura biofílica?</span>
                  </h5>
                  <p className="text-xs text-emerald-800/80">
                    Explore sugestões pré-configuradas para pausas ativas e conservação dos jardins verticais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('new')}
                  className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  Ver Sugestões
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PROGRESS STATISTICS OVER TIME */}
          {activeTab === 'stats' && (
            <div className="space-y-6">

              {/* Top 4 Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Sequência Atual
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">
                      {stats.currentStreak}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">dias</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block">Melhor: {stats.bestStreak} dias</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Total Concluído
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#072a1a]">
                      {stats.totalCompletions}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">registros</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 block">Histórico acumulado</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Consistência 7d
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#15803d]">
                      {stats.weeklyRate}%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block">Últimos 7 dias</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Consistência 30d
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800">
                      {stats.monthlyRate}%
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block">Últimos 30 dias</span>
                </div>
              </div>

              {/* 35-Day Consistency Heatmap Grid */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#15803d]" />
                      <span>Mapa de Consistência (Últimas 5 Semanas)</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Cada quadrado representa um dia. Cores mais escuras indicam maior porcentagem de hábitos concluídos.
                    </p>
                  </div>

                  {/* Heatmap Legend */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span>Menos</span>
                    <span className="w-3 h-3 rounded-xs bg-gray-100 border border-gray-200" />
                    <span className="w-3 h-3 rounded-xs bg-emerald-200" />
                    <span className="w-3 h-3 rounded-xs bg-emerald-400" />
                    <span className="w-3 h-3 rounded-xs bg-[#15803d]" />
                    <span className="w-3 h-3 rounded-xs bg-[#072a1a]" />
                    <span>Mais</span>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="grid grid-cols-7 sm:grid-cols-7 gap-1.5 pt-2">
                  {heatmapDates.map((dateStr) => {
                    const dayLogsMap = logs[dateStr] || {};
                    const completed = habits.filter(h => !!dayLogsMap[h.id]).length;
                    const ratio = habits.length > 0 ? completed / habits.length : 0;

                    let bgClass = 'bg-gray-100 hover:border-gray-400';
                    if (ratio >= 0.8) bgClass = 'bg-[#072a1a] text-white';
                    else if (ratio >= 0.5) bgClass = 'bg-[#15803d] text-white';
                    else if (ratio >= 0.25) bgClass = 'bg-emerald-400 text-[#072a1a]';
                    else if (ratio > 0) bgClass = 'bg-emerald-200 text-[#072a1a]';

                    const isCurrentDay = dateStr === todayKey;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setActiveTab('today');
                        }}
                        className={`h-9 sm:h-10 rounded-lg flex flex-col items-center justify-center border text-[10px] font-bold transition-all cursor-pointer ${bgClass} ${
                          isCurrentDay ? 'ring-2 ring-amber-400 border-amber-500' : 'border-black/5'
                        }`}
                        title={`${dateStr}: ${completed} de ${habits.length} hábitos (${Math.round(ratio * 100)}%)`}
                      >
                        <span>{dateStr.split('-')[2]}</span>
                        <span className="text-[8px] opacity-75 font-mono">{Math.round(ratio * 100)}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Performance Per Habit */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#15803d]" />
                  <span>Desempenho Individual por Hábito</span>
                </h4>

                <div className="space-y-3">
                  {habits.map((h) => {
                    const habitStats = getIndividualHabitStats(h.id, logs);
                    const targetDays = h.targetDaysPerWeek || 7;
                    const completionRate = Math.min(100, Math.round((habitStats.completedLast7 / targetDays) * 100));

                    return (
                      <div key={h.id} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-gray-900">
                              {h.title}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              ({CATEGORY_CONFIG[h.category]?.label || h.category})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-600">
                              Meta: <strong>{habitStats.completedLast7}/{targetDays} dias</strong>
                            </span>
                            <span className="font-bold text-[#15803d]">
                              {completionRate}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-[#15803d] transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset to Default Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar hábitos padrão de biofilia</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: CREATE NEW HABIT & PRESETS */}
          {activeTab === 'new' && (
            <div className="space-y-6">

              {/* Preset Suggestions Library */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#15803d]" />
                    <span>Adicionar a Partir de Sugestões Biofílicas Homologadas</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Selecione um hábito validado por diretrizes de bem-estar ambiental para adicionar em 1 clique:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {HABIT_SUGGESTIONS.map((preset, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-gray-200 hover:border-emerald-300 bg-gray-50/60 hover:bg-emerald-50/30 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                            {CATEGORY_CONFIG[preset.category]?.label || preset.category}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Meta: {preset.targetDaysPerWeek}x/sem
                          </span>
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-gray-900">
                          {preset.title}
                        </h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddSuggestion(preset)}
                        className="w-full py-1.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar este Hábito</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Habit Form */}
              <form onSubmit={handleCreateHabit} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="text-sm font-bold text-gray-900">
                    Criar Hábito Personalizado
                  </h4>
                  <p className="text-xs text-gray-500">
                    Defina o nome, categoria e frequência desejada para a sua rotina.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Título do Hábito *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Pausa de 10 min para relaxamento visual"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Descrição ou Racional *
                    </label>
                    <textarea
                      rows={2}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Ex: Contemplar a parede verde preservada para diminuir a fadiga ocular..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Categoria
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as HabitCategory)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                      >
                        <option value="biofilia">Biofilia & Natureza</option>
                        <option value="ergonomia">Ergonomia & Foco</option>
                        <option value="cuidado">Cuidado Botânico</option>
                        <option value="sustentabilidade">Sustentabilidade</option>
                        <option value="bem-estar">Bem-Estar Geral</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Meta Semanal
                      </label>
                      <select
                        value={newTargetDays}
                        onChange={(e) => setNewTargetDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                      >
                        <option value={7}>Todos os dias (7x/sem)</option>
                        <option value={5}>Dias úteis (5x/sem)</option>
                        <option value={3}>3x por semana</option>
                        <option value={2}>2x por semana</option>
                        <option value={1}>1x por semana</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Período Sugerido
                      </label>
                      <select
                        value={newTimeOfDay}
                        onChange={(e) => setNewTimeOfDay(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                      >
                        <option value="qualquer">Qualquer horário</option>
                        <option value="manha">Manhã</option>
                        <option value="tarde">Tarde</option>
                        <option value="noite">Noite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('today')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Salvar Hábito
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#15803d]" />
            <span>Dados salvos localmente e sincronizados automaticamente</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
