import React, { useState } from 'react';
import {
  Palette,
  Compass,
  Leaf,
  Sun,
  Volume2,
  TrendingUp,
  Layers,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  Camera,
  FileText,
  Send,
  Share2,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Info,
  ShieldCheck,
  Droplets,
  HeartHandshake,
  Download,
  BookmarkCheck,
  FileDown,
  UserCheck,
  Building,
  User,
  ExternalLink
} from 'lucide-react';
import { QUIZ_QUESTIONS, calculateBiophilicProfile } from '../data/quizData';
import { BiophilicProfileResult, QuizQuestion, UserProfile } from '../types';
import { BiophilicRadarChart } from './BiophilicRadarChart';
import { generateBiophilicGuidePdf } from '../utils/generateBiophilicGuidePdf';
import confetti from 'canvas-confetti';

interface BiophilicQuizProps {
  onOpenSimulator?: () => void;
  onOpenQuote?: (context?: string) => void;
  onOpenPdfReport?: () => void;
  onScrollToCatalog?: () => void;
  currentUser?: UserProfile | null;
  onSaveProfile?: (result: BiophilicProfileResult, userOverride?: Partial<UserProfile>, autoDownload?: boolean) => void;
  onOpenLogin?: () => void;
  onNavigateToPortal?: () => void;
}

export const BiophilicQuiz: React.FC<BiophilicQuizProps> = ({
  onOpenSimulator,
  onOpenQuote,
  onOpenPdfReport,
  onScrollToCatalog,
  currentUser,
  onSaveProfile,
  onOpenLogin,
  onNavigateToPortal,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationStep, setCalculationStep] = useState<string>('');
  const [result, setResult] = useState<BiophilicProfileResult | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Profile Saving & Guide Download State
  const [autoDownloadGuide, setAutoDownloadGuide] = useState<boolean>(true);
  const [isSavedToProfile, setIsSavedToProfile] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showQuickSaveForm, setShowQuickSaveForm] = useState<boolean>(false);
  const [customUserName, setCustomUserName] = useState<string>('');
  const [customUserEmail, setCustomUserEmail] = useState<string>('');
  const [customUserCompany, setCustomUserCompany] = useState<string>('');
  const [customUserCau, setCustomUserCau] = useState<string>('');

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = Math.round(((currentQuestionIndex + (result ? 1 : 0)) / totalQuestions) * 100);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateResult = () => {
    setIsCalculating(true);
    setCalculationStep('Analisando índice de iluminância e radiação solar...');

    setTimeout(() => {
      setCalculationStep('Calculando atenuação acústica e frequências de voz (ISO 354)...');
    }, 450);

    setTimeout(() => {
      setCalculationStep('Cruzando dados com matriz WELL v2 e estudos Harvard COGfx...');
    }, 900);

    setTimeout(() => {
      setCalculationStep('Finalizando curadoria botânica e especificação de estilo...');
    }, 1350);

    setTimeout(() => {
      const calculatedProfile = calculateBiophilicProfile(answers);
      setResult(calculatedProfile);
      setIsCalculating(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#86efac', '#15803d', '#072a1a', '#22c55e', '#a7f3d0'],
        });
      } catch (e) {
        // ignore
      }
    }, 1750);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setCopiedSuccess(false);
    setIsSavedToProfile(false);
    setSaveSuccessMsg(null);
    setShowQuickSaveForm(false);
  };

  const handleDownloadGuidePdf = () => {
    if (!result) return;
    generateBiophilicGuidePdf(result, {
      user: currentUser || {
        name: customUserName || 'Especificador / Cliente Homologado',
        email: customUserEmail || undefined,
        company: customUserCompany || 'Estúdio de Arquitetura & Interiores',
        cau_rrt: customUserCau || undefined,
        role: 'arquiteto',
      },
      downloadImmediately: true,
    });
  };

  const handleSaveToProfile = (overrideUser?: Partial<UserProfile>) => {
    if (!result) return;
    const userToSave: Partial<UserProfile> = overrideUser || {
      name: customUserName || currentUser?.name || 'Especificador Homologado',
      email: customUserEmail || currentUser?.email || 'especificador@allgreen.com.br',
      company: customUserCompany || currentUser?.company || 'Estúdio de Arquitetura & Interiores',
      cau_rrt: customUserCau || currentUser?.cau_rrt,
      role: currentUser?.role || 'arquiteto',
    };

    if (onSaveProfile) {
      onSaveProfile(result, userToSave, autoDownloadGuide);
    } else {
      try {
        const existing = localStorage.getItem('allgreen_user_profile');
        const parsed = existing ? JSON.parse(existing) : {};
        const updated = {
          ...parsed,
          ...userToSave,
          savedBiophilicProfile: result,
          savedBiophilicProfileDate: new Date().toLocaleDateString('pt-BR'),
        };
        localStorage.setItem('allgreen_user_profile', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      if (autoDownloadGuide) {
        generateBiophilicGuidePdf(result, {
          user: userToSave,
          downloadImmediately: true,
        });
      }
    }

    setIsSavedToProfile(true);
    setSaveSuccessMsg(`Perfil "${result.archetypeTitle}" salvo com sucesso no seu perfil!`);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#86efac', '#15803d', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleApplyPreset = (presetType: 'corporate_open_space' | 'reception_executive' | 'spa_wellness') => {
    let presetAnswers: Record<string, string> = {};
    if (presetType === 'corporate_open_space') {
      presetAnswers = {
        lighting: 'indirect_moderate',
        acoustics: 'high_reverberation',
        wellness_goal: 'focus_productivity',
        spatial_layout: 'full_accent_wall',
        aesthetic_style: 'tropical_urban_jungle',
      };
    } else if (presetType === 'reception_executive') {
      presetAnswers = {
        lighting: 'artificial_only',
        acoustics: 'high_traffic_reception',
        wellness_goal: 'esg_certification',
        spatial_layout: 'framed_acoustic_panels',
        aesthetic_style: 'nordic_minimalist',
      };
    } else {
      presetAnswers = {
        lighting: 'indirect_moderate',
        acoustics: 'sterile_quiet',
        wellness_goal: 'stress_reduction',
        spatial_layout: 'green_dividers',
        aesthetic_style: 'luxury_restorative_spa',
      };
    }

    setAnswers(presetAnswers);
    setCurrentQuestionIndex(totalQuestions - 1);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `🌿 MEU PERFIL BIOFÍLICO ALL GREEN:
🏆 Arquétipo: ${result.archetypeTitle} (${result.badge})
📐 Estilo: ${result.designStyle.title}
✨ Pontuação WELL: ${result.scoreWell} pts | LEED: ${result.scoreLeed} créditos
🔇 Acústica: NRC ${result.acousticNRC} | Produtividade: +${result.productivityBoost}%
🌿 Espécies Recomendadas: ${result.recommendedSpecies.map((s) => s.name).join(', ')}
💡 Código da Solução: ${result.recommendedSolutionCode}
Saiba mais em: allgreendecor.com.br`;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  const handleRequestQuoteWithProfile = () => {
    if (!result) return;
    const summary = `Perfil Biofílico do Quiz: ${result.archetypeTitle} (${result.recommendedSolutionCode}). Espécies: ${result.recommendedSpecies.map((s) => s.name).join(', ')}. Estilo: ${result.designStyle.title}.`;
    if (onOpenQuote) {
      onOpenQuote(summary);
    }
  };

  const getQuestionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-emerald-600" />;
      default:
        return <Leaf className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section
      id="biophilic-quiz"
      aria-label="Diagnóstico de Perfil Biofílico para Espaços de Trabalho"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#f3f7f4] via-white to-[#f3f7f4] border-t border-emerald-900/10 relative overflow-hidden"
    >
      {/* Background Decorative Ambient Blurs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-[#072a1a] border border-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-[#15803d]" />
            <span>Diagnóstico Interativo de Biofilia Corporativa</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#072a1a] tracking-tight">
            Descubra o Perfil Biofílico Ideal para seu Espaço
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Responda a 5 perguntas estratégicas sobre iluminação, acústica e metas do seu ambiente. 
            Nosso algoritmo sugerirá as espécies botânicas preservadas e o estilo arquitetônico perfeito para seu projeto.
          </p>
        </div>

        {/* Main Quiz Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden transition-all">
          
          {/* Top Progress & Step Bar (Visible during questions) */}
          {!result && !isCalculating && (
            <div className="bg-[#072a1a] text-white px-5 py-4 sm:px-8 sm:py-5 border-b border-emerald-800/80">
              <div className="flex items-center justify-between gap-4 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#86efac] border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                    {currentQuestionIndex + 1}/{totalQuestions}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                      {currentQuestion.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      Etapa {currentQuestionIndex + 1} de {totalQuestions}
                    </h3>
                  </div>
                </div>

                {/* Quick Preset Buttons on Desktop */}
                <div className="hidden md:flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-emerald-300/80 mr-1">Exemplos rápidos:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('corporate_open_space')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                  >
                    🏢 Open Space
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('reception_executive')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                  >
                    🏛️ Recepção
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('spa_wellness')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                  >
                    🌿 Spa/Saúde
                  </button>
                </div>
              </div>

              {/* Visual Progress Line */}
              <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden border border-emerald-900">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-[#86efac] h-full rounded-full transition-all duration-300 ease-out shadow-xs"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ================= STATE 1: QUESTION VIEW ================= */}
          {!result && !isCalculating && (
            <div className="p-5 sm:p-8 md:p-10 space-y-6">
              
              {/* Question Title & Subtitle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    {getQuestionIcon(currentQuestion.iconName)}
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-[#072a1a] leading-tight">
                    {currentQuestion.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 pl-10.5 leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      id={`quiz-opt-${currentQuestion.id}-${option.id}`}
                      onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                      className={`p-4 sm:p-5 rounded-2xl text-left border transition-all relative flex flex-col justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/30 shadow-sm'
                          : 'bg-gray-50/60 hover:bg-emerald-50/30 border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div>
                        {/* Top Header of Card */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-emerald-200 text-[#072a1a]'
                              : 'bg-gray-200/80 text-gray-700'
                          }`}>
                            {option.tag}
                          </span>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                            isSelected
                              ? 'bg-[#15803d] border-[#15803d] text-white'
                              : 'border-gray-300 bg-white group-hover:border-emerald-400'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Option Label */}
                        <h4 className={`text-xs sm:text-sm font-bold leading-snug mb-1.5 ${
                          isSelected ? 'text-[#072a1a]' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </h4>

                        {/* Option Description */}
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Bottom Stat Note / Badge */}
                      {option.statsNote && (
                        <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-medium truncate flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-[#15803d] shrink-0" />
                            <span className="truncate">{option.statsNote}</span>
                          </span>
                          {option.badge && (
                            <span className="shrink-0 text-[10px] font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                              {option.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentQuestionIndex === 0
                      ? 'opacity-40 cursor-not-allowed text-gray-400'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                    Pergunta {currentQuestionIndex + 1} de {totalQuestions}
                  </span>

                  <button
                    type="button"
                    id="quiz-next-btn"
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id]}
                    className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                      answers[currentQuestion.id]
                        ? 'bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:scale-[1.02]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>
                      {currentQuestionIndex === totalQuestions - 1
                        ? 'Calcular Perfil Biofílico'
                        : 'Próxima Pergunta'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= STATE 2: CALCULATING LOADER ================= */}
          {isCalculating && (
            <div className="p-12 sm:p-16 text-center space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-[#15803d] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-[#15803d] animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-[#072a1a]">
                  Processando Diagnóstico Biofílico...
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-mono animate-pulse">
                  {calculationStep}
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#15803d] h-full w-3/4 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* ================= STATE 3: FINAL PROFILE RESULT ================= */}
          {result && !isCalculating && (
            <div className="animate-in fade-in duration-300">
              
              {/* Result Top Hero Banner */}
              <div className="bg-[#072a1a] text-white p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#86efac] text-[#072a1a] text-[11px] font-mono font-extrabold uppercase">
                      <Award className="w-3.5 h-3.5" />
                      <span>{result.badge}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {result.archetypeTitle}
                    </h3>

                    <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
                      {result.archetypeTagline}
                    </p>
                  </div>

                  {/* Code & Actions */}
                  <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-300 block">CÓDIGO DE HOMOLOGAÇÃO:</span>
                      <strong className="text-sm font-mono text-white tracking-wider">{result.recommendedSolutionCode}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-700/60 flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Copiar resumo do diagnóstico"
                      >
                        {copiedSuccess ? <Check className="w-3.5 h-3.5 text-[#86efac]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSuccess ? 'Copiado!' : 'Copiar Resumo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-700/60 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Refazer</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5 Key Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mt-6 pt-6 border-t border-emerald-800/80">
                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60 text-center">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold block">PONTUAÇÃO WELL</span>
                    <strong className="text-lg font-bold text-[#86efac]">{result.scoreWell} pts</strong>
                    <span className="text-[9px] text-emerald-400 block">Classificação Platinum</span>
                  </div>

                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60 text-center">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold block">CRÉDITOS LEED</span>
                    <strong className="text-lg font-bold text-[#86efac]">{result.scoreLeed} cr</strong>
                    <span className="text-[9px] text-emerald-400 block">v4.1 BD+C / ID+C</span>
                  </div>

                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60 text-center">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold block">ABSORÇÃO ACÚSTICA</span>
                    <strong className="text-lg font-bold text-[#86efac]">NRC {result.acousticNRC}</strong>
                    <span className="text-[9px] text-emerald-400 block">Laudo IPT ISO 354</span>
                  </div>

                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60 text-center">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold block">GANHO PRODUTIVIDADE</span>
                    <strong className="text-lg font-bold text-emerald-200">+{result.productivityBoost}%</strong>
                    <span className="text-[9px] text-emerald-400 block">Harvard COGfx</span>
                  </div>

                  <div className="p-3 bg-emerald-950/70 rounded-2xl border border-emerald-800/60 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold block">QUEDA DE ESTRESSE</span>
                    <strong className="text-lg font-bold text-emerald-200">-{result.stressReduction}%</strong>
                    <span className="text-[9px] text-emerald-400 block">Menos Cortisol</span>
                  </div>
                </div>
              </div>

              {/* Main Result Body Details */}
              <div className="p-5 sm:p-8 space-y-8">

                {/* 0. Dedicated Save to User Profile & Auto-Download Guide Card */}
                <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl border-2 border-emerald-500/40 p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#072a1a] text-[#86efac] flex items-center justify-center shrink-0 shadow-xs">
                        <BookmarkCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-bold text-[#072a1a]">
                            Salvar Resultado no Perfil & Baixar Guia Personalizado
                          </h4>
                          {isSavedToProfile && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d]" /> Salvo no Perfil
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-0.5">
                          Vincule este diagnóstico ({result.archetypeTitle}) à sua conta e baixe o laudo executivo em PDF de 2 páginas com diretrizes botânicas, paleta cromática e coeficientes acústicos IPT.
                        </p>
                      </div>
                    </div>

                    {/* Auto-Download Toggle */}
                    <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 cursor-pointer text-xs font-semibold text-gray-700 hover:border-emerald-500 shrink-0 select-none shadow-2xs">
                      <input
                        type="checkbox"
                        checked={autoDownloadGuide}
                        onChange={(e) => setAutoDownloadGuide(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 border-gray-300 cursor-pointer"
                      />
                      <span>Download automático do Guia ao salvar</span>
                    </label>
                  </div>

                  {/* Feedback Toast if Saved */}
                  {saveSuccessMsg && (
                    <div className="p-3.5 bg-emerald-100/90 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                        <span>{saveSuccessMsg} {autoDownloadGuide && 'O download do seu Guia Personalizado em PDF foi iniciado.'}</span>
                      </div>
                      {onNavigateToPortal && (
                        <button
                          type="button"
                          onClick={onNavigateToPortal}
                          className="text-xs font-bold text-[#072a1a] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>Ir para Meu Painel</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Actions Bar inside Card */}
                  <div className="pt-2 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Left: User context & quick toggle */}
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      {currentUser ? (
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#15803d]" />
                          <span>Perfil Ativo: <strong>{currentUser.name}</strong> ({currentUser.company})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>Usuário Visitante • Salve para sincronizar no Painel</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Main Action Buttons */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Direct PDF Download Button (Always accessible) */}
                      <button
                        type="button"
                        id="btn-download-biophilic-guide"
                        onClick={handleDownloadGuidePdf}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 text-[#072a1a] border border-[#072a1a]/20 hover:border-[#15803d] font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        title="Baixar Guia Técnico Personalizado em PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Baixar Guia Personalizado (PDF)</span>
                      </button>

                      {/* Save to Profile Button */}
                      {currentUser ? (
                        <button
                          type="button"
                          id="btn-save-to-user-profile"
                          onClick={() => handleSaveToProfile()}
                          className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Salvar este perfil no seu usuário autenticado"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>{isSavedToProfile ? 'Atualizar no Meu Perfil' : 'Salvar no Meu Perfil'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowQuickSaveForm(!showQuickSaveForm)}
                            className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>Salvar no Meu Perfil</span>
                          </button>
                          {onOpenLogin && (
                            <button
                              type="button"
                              onClick={onOpenLogin}
                              className="text-xs text-gray-500 hover:text-[#072a1a] underline cursor-pointer"
                            >
                              Fazer Login
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Quick Save Inline Form for Visitors */}
                  {showQuickSaveForm && !currentUser && (
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 mt-2 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-[#072a1a] flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-[#15803d]" />
                          <span>Identificação para o Laudo & Perfil de Usuário</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setShowQuickSaveForm(false)}
                          className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-600 uppercase mb-1">Seu Nome / Arquiteto</label>
                          <input
                            type="text"
                            placeholder="Ex: Arq. Camila Valença"
                            value={customUserName}
                            onChange={(e) => setCustomUserName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-gray-600 uppercase mb-1">E-mail Profissional</label>
                          <input
                            type="email"
                            placeholder="Ex: camila@estudio.com.br"
                            value={customUserEmail}
                            onChange={(e) => setCustomUserEmail(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-gray-600 uppercase mb-1">Empresa / Estúdio</label>
                          <input
                            type="text"
                            placeholder="Ex: Valença Arquitetura & Interiores"
                            value={customUserCompany}
                            onChange={(e) => setCustomUserCompany(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-gray-600 uppercase mb-1">CAU / RRT (Opcional)</label>
                          <input
                            type="text"
                            placeholder="Ex: CAU A194829-4"
                            value={customUserCau}
                            onChange={(e) => setCustomUserCau(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveToProfile({
                              name: customUserName || 'Especificador Homologado',
                              email: customUserEmail || 'especificador@allgreen.com.br',
                              company: customUserCompany || 'Estúdio de Arquitetura',
                              cau_rrt: customUserCau,
                              role: 'arquiteto',
                            });
                            setShowQuickSaveForm(false);
                          }}
                          className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Confirmar & Salvar no Perfil
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1. Multidimensional Personality & Biophilic Radar Chart (Recharts) */}
                <BiophilicRadarChart result={result} />

                {/* 2. Recommended Design Style Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center">
                        <Palette className="w-4 h-4 text-[#15803d]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">Estilo & Diretriz Arquitetônica</span>
                        <h4 className="text-sm sm:text-base font-bold text-gray-900">{result.designStyle.title}</h4>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-emerald-100 text-[#072a1a] text-xs font-bold rounded-lg">
                      100% Personalizado
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {result.designStyle.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                      <span className="text-gray-400 font-semibold block text-[10px] uppercase">Paleta de Cores Recomendada</span>
                      <div className="flex items-center gap-1.5 pt-1">
                        {result.designStyle.colorPalette.map((col) => (
                          <div
                            key={col.name}
                            className="w-6 h-6 rounded-full border border-gray-300 shadow-2xs cursor-help"
                            style={{ backgroundColor: col.hex }}
                            title={`${col.name} (${col.hex})`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                      <span className="text-gray-400 font-semibold block text-[10px] uppercase">Acabamento & Molduras</span>
                      <p className="text-gray-800 font-medium text-[11px] leading-tight">
                        {result.designStyle.framing}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                      <span className="text-gray-400 font-semibold block text-[10px] uppercase">Diretriz de Iluminação</span>
                      <p className="text-gray-800 font-medium text-[11px] leading-tight">
                        {result.designStyle.lightingRec}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Recommended Botanical Species */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#072a1a] flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-[#15803d]" />
                        <span>Espécies Botânicas Sugeridas para o seu Perfil</span>
                      </h4>
                      <p className="text-xs text-gray-500">
                        Espécies selecionadas com base no seu nível de luz e necessidade acústica.
                      </p>
                    </div>

                    {onScrollToCatalog && (
                      <button
                        type="button"
                        onClick={onScrollToCatalog}
                        className="text-xs font-bold text-[#15803d] hover:underline cursor-pointer hidden sm:block"
                      >
                        Ver Todas as Espécies do Catálogo →
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.recommendedSpecies.map((specie) => (
                      <div
                        key={specie.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          {/* Species Image */}
                          <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img
                              src={specie.image}
                              alt={specie.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#072a1a]/90 text-[#86efac] backdrop-blur-xs">
                                {specie.category === 'preservado' ? '100% Preservado Natural' : 'Linha UV Permanente'}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-2">
                            <h5 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                              {specie.name}
                            </h5>
                            <span className="text-[10px] font-mono text-gray-400 italic block">
                              {specie.scientificName}
                            </span>

                            <p className="text-xs text-gray-600 leading-relaxed pt-1">
                              <strong>Por que foi recomendada:</strong> {specie.matchReason}
                            </p>
                          </div>
                        </div>

                        {/* Species Badges */}
                        <div className="p-4 pt-0">
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                            {specie.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[9px] font-semibold border border-emerald-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Why it matches highlights */}
                <div className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-5 space-y-2.5">
                  <h5 className="text-xs sm:text-sm font-bold text-[#072a1a] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15803d]" />
                    <span>Conformidade & Benefícios Chave do seu Diagnóstico:</span>
                  </h5>

                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {result.whyItMatches.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Action Callouts Bar */}
                <div className="p-6 bg-gradient-to-r from-[#072a1a] to-[#0d4a2d] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Pronto para ver este perfil aplicado no seu espaço?
                    </h4>
                    <p className="text-xs text-emerald-200">
                      Simule agora via IA, solicite uma proposta orçamentária ou emita um laudo técnico executivo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap justify-center">
                    <button
                      type="button"
                      id="quiz-cta-download-guide"
                      onClick={handleDownloadGuidePdf}
                      className="px-4 py-2.5 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Baixar Guia Técnico Personalizado (PDF)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Guia Personalizado</span>
                    </button>

                    {onOpenSimulator && (
                      <button
                        type="button"
                        id="quiz-cta-simulator"
                        onClick={onOpenSimulator}
                        className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl border border-emerald-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#86efac]" />
                        <span>Simular com IA</span>
                      </button>
                    )}

                    {onOpenPdfReport && (
                      <button
                        type="button"
                        id="quiz-cta-pdf"
                        onClick={onOpenPdfReport}
                        className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl border border-emerald-700/80 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#86efac]" />
                        <span>Gerar Laudo Geral</span>
                      </button>
                    )}

                    {onOpenQuote && (
                      <button
                        type="button"
                        id="quiz-cta-quote"
                        onClick={handleRequestQuoteWithProfile}
                        className="px-4 py-2.5 bg-white hover:bg-gray-100 text-[#072a1a] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-[#15803d]" />
                        <span>Solicitar Orçamento</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
