import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Camera,
  Leaf,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenSimulator: () => void;
  onOpenProjectLookup?: () => void;
  onExploreProjects?: () => void;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  spec: string;
  description: string;
  botanicalSpecs?: string[];
}

const HERO_HOTSPOTS: Hotspot[] = [
  {
    id: 'vertical-garden',
    x: 63,
    y: 28,
    title: 'Parede Viva Preservada • 14.8m',
    spec: 'NRC 0.89 IPT • 0L água/ano',
    description: 'Substituição celular com glicerina vegetal pura. Folhagem natural de toque real sem necessidade de rega ou tubulação hidráulica.',
    botanicalSpecs: [
      '60% Samambaia Americana (Nephrolepis)',
      '25% Ficus Pumila Preservado',
      '15% Musgo Polar Escandinavo',
      'Fixação modular oculta'
    ]
  },
  {
    id: 'stair-leds',
    x: 52,
    y: 84,
    title: 'Luminotécnica Rasante 2700K',
    spec: 'IP68 • IRC 96 • 2700K',
    description: 'Fitas LED embutidas nos degraus de microcimento, valorizando o relevo tridimensional da vegetação sem emissão térmica.',
    botanicalSpecs: [
      'Temperatura de cor quente: 2700K',
      'Índice de reprodução de cor: IRC 96',
      'Vida útil: 50.000 horas'
    ]
  },
  {
    id: 'infinity-pool',
    x: 23,
    y: 72,
    title: 'Espelho d\'Água Infinity',
    spec: 'Atenuação Térmica -3.4°C',
    description: 'Lâmina d\'água reflexiva que reduz o calor radiante na fachada e compõe a integração visual biofílica céu-água-mata.',
    botanicalSpecs: [
      'Atenuação da radiação direta: -3.4°C',
      'Conexão biofílica de horizonte visual'
    ]
  },
  {
    id: 'olive-tree',
    x: 88,
    y: 38,
    title: 'Oliva Centenária Aclimatada',
    spec: 'Spot Uplight 15W • Olea europaea',
    description: 'Elemento escultural botânico no terraço superior, criando contraste orgânico com os planos retos da arquitetura.',
    botanicalSpecs: [
      'Espécie: Olea europaea centenária',
      'Iluminação direcional de realce'
    ]
  },
  {
    id: 'living-room',
    x: 44,
    y: 56,
    title: 'Living Integrado Indoor-Outdoor',
    spec: 'Neuroarquitetura WELL • Low-E',
    description: 'Grandes vãos envidraçados que conectam o espaço de convivência à parede viva, promovendo redução de cortisol e foco.',
    botanicalSpecs: [
      'Vidros Low-E com conforto solar',
      'Isolamento acústico integrado'
    ]
  }
];

export const Hero: React.FC<HeroProps> = ({
  onOpenSimulator,
  onOpenProjectLookup,
  onExploreProjects,
}) => {
  const { t, language } = useLanguage();
  const [sliderPos, setSliderPos] = useState(100);
  const [isComparing, setIsComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Lighting preset
  const [lightingMode, setLightingMode] = useState<'sunset' | 'twilight' | 'tropical'>('sunset');

  // 3D Parallax Mouse Tracking
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [enable3D, setEnable3D] = useState(true);

  // Hotspots
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Nature Soundscape
  const [isSoundActive, setIsSoundActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const villaImgSrc = '/hero_sunset_villa.jpg';
  const bareWallImgSrc = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';

  // Floating pollen particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
  }, []);

  const toggleSoundscape = useCallback(() => {
    if (isSoundActive) {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.setTargetAtTime(0.001, audioCtxRef.current.currentTime, 0.4);
          setTimeout(() => {
            audioCtxRef.current?.close();
            audioCtxRef.current = null;
            setIsSoundActive(false);
          }, 450);
        } catch {
          setIsSoundActive(false);
        }
      } else {
        setIsSoundActive(false);
      }
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          data[i] = (b0 + b1 + b2 + b3) * 0.35;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 380;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.18;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 140;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.005, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
        gainNodeRef.current = gainNode;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        lfo.start();
        setIsSoundActive(true);
      } catch (err) {
        console.warn('Audio requires gesture', err);
        setIsSoundActive(false);
      }
    }
  }, [isSoundActive]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleCardMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleTouchOrMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleSliderMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.touches[0].clientX, rect);
  };

  return (
    <section id="hero-section" className="hero-component bg-[#051c11] text-white py-12 md:py-18 relative overflow-hidden border-b border-emerald-900/40">
      
      {/* Ambient background glow */}
      <div className={`absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000 ${
        lightingMode === 'sunset'
          ? 'bg-amber-500/15'
          : lightingMode === 'twilight'
          ? 'bg-indigo-600/15'
          : 'bg-emerald-500/15'
      }`} />
      <div className="absolute -bottom-32 -left-32 w-[460px] h-[460px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clear, High-Impact Editorial Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Main Headline - Clear Value Proposition in 5s */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-5.5xl font-normal tracking-tight text-white leading-[1.08]">
              {t('hero.headlinePart1', 'Jardins Verticais Preservados.')} <br />
              <span className="font-light text-[#86efac]">
                {t('hero.headlinePart2', 'Folhagem natural com')}{' '}
                <span className="italic">{t('hero.headlineEterno', 'zero irrigação.')}</span>
              </span>
            </h1>

            {/* Concise Subtitle without semantic redundancies */}
            <p className="text-emerald-100/80 text-base sm:text-lg font-sans leading-relaxed font-light max-w-xl">
              {t('hero.subtitle', 'Substituição celular com glicerina vegetal pura: conforto acústico homologado e vegetação de toque vivo para interiores corporativos e residenciais.')}
            </p>

            {/* Single Clear Primary Action CTA */}
            <div className="pt-1">
              <button
                id="hero-simulator-cta-btn"
                onClick={onOpenSimulator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#86efac] text-[#051c11] font-bold rounded-full hover:bg-emerald-300 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm sm:text-base shadow-xl shadow-emerald-950/50"
              >
                <Camera className="w-5 h-5 text-[#051c11]" />
                <span>{t('hero.simulateCta', 'Simular ambiente com IA')}</span>
              </button>
            </div>

            {/* Essential Numeric Proofs */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-900/50">
              <div>
                <span className="font-serif text-2xl font-bold text-white block">0 L</span>
                <span className="text-xs text-emerald-300/80">{t('hero.waterLabel', 'Água por ano')}</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#86efac] block">0.89</span>
                <span className="text-xs text-emerald-300/80">{t('hero.acousticLabel', 'NRC acústico IPT')}</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-amber-300 block">{language === 'pt' ? '10 Anos' : '10 Years'}</span>
                <span className="text-xs text-emerald-300/80">{t('hero.durabilityLabel', 'Durabilidade')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Living Villa Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="relative bg-[#062013]/90 p-2.5 sm:p-3 rounded-3xl border border-emerald-700/50 shadow-2xl backdrop-blur-xl">
              
              {/* Compact Unified Control Bar */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-emerald-800/50 px-1 text-xs">
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-black/40 rounded-full p-0.5 border border-emerald-800/40">
                  <button
                    type="button"
                    onClick={() => {
                      setIsComparing(false);
                      setSliderPos(100);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      !isComparing
                        ? 'bg-[#86efac] text-[#072a1a]'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {t('hero.villaViva', 'Villa Viva 3D')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsComparing(true);
                      setSliderPos(50);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isComparing
                        ? 'bg-[#86efac] text-[#072a1a]'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{t('hero.beforeAfter', 'Antes / Depois')}</span>
                  </button>
                </div>

                {/* Lighting Modes + Sound */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSoundscape}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      isSoundActive
                        ? 'bg-amber-400 text-[#072a1a] border-amber-300'
                        : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/80'
                    }`}
                    title={isSoundActive ? (language === 'pt' ? 'Desativar som do ambiente' : 'Mute ambience') : (language === 'pt' ? 'Ouvir brisa e água' : 'Play breeze & foliage sound')}
                  >
                    {isSoundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-60" />}
                    <span className="hidden sm:inline">{isSoundActive ? t('hero.soundOn', 'Brisa Ativa') : t('hero.soundOff', 'Som Natural')}</span>
                  </button>

                  <div className="flex items-center bg-black/40 rounded-full p-0.5 border border-emerald-800/40 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLightingMode('sunset')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        lightingMode === 'sunset' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t('hero.sunset', 'Pôr do Sol')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightingMode('twilight')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        lightingMode === 'twilight' ? 'bg-indigo-700 text-white font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t('hero.twilight', 'Noite LED')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightingMode('tropical')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        lightingMode === 'tropical' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t('hero.tropical', 'Dia')}
                    </button>
                  </div>
                </div>

              </div>

              {/* Main Interactive Viewport */}
              <div
                className="relative h-[360px] sm:h-[440px] md:h-[480px] w-full rounded-2xl overflow-hidden select-none cursor-pointer group shadow-2xl"
                onMouseMove={isComparing ? handleSliderMouseMove : handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onTouchMove={handleTouchMove}
                onMouseDown={() => isComparing && setIsDragging(true)}
                onMouseUp={() => isComparing && setIsDragging(false)}
                style={{ perspective: 1100 }}
              >
                <div
                  className="w-full h-full relative transition-transform duration-200 ease-out"
                  style={{
                    transform: enable3D && !isComparing
                      ? `rotateX(${-mouseOffset.y * 9}deg) rotateY(${mouseOffset.x * 10}deg) scale3d(1.01, 1.01, 1.01)`
                      : 'none',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Sunset Villa Image */}
                  <img
                    src={villaImgSrc}
                    alt="Residência All Green com Jardim Vertical Preservado e Piscina"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                    style={{
                      filter: lightingMode === 'sunset'
                        ? 'brightness(1.04) contrast(1.08) saturate(1.15)'
                        : lightingMode === 'twilight'
                        ? 'brightness(0.85) contrast(1.2) saturate(1.25) hue-rotate(-15deg)'
                        : 'brightness(1.1) contrast(1.1) saturate(1.25)',
                    }}
                  />

                  {/* Comparison Slider Overlay */}
                  {isComparing && (
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src={bareWallImgSrc}
                        alt="Alvenaria Desnuda sem Biofilia"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: '100%', height: '100%', filter: 'grayscale(0.65) contrast(1.1)' }}
                      />
                      <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-md border border-white/20">
                        Antes: Alvenaria Convencional
                      </div>
                    </div>
                  )}

                  {/* Water Specular Ripple */}
                  <div
                    className="absolute pointer-events-none overflow-hidden"
                    style={{
                      left: '4%',
                      bottom: '12%',
                      width: '38%',
                      height: '24%',
                      background: 'radial-gradient(ellipse at 50% 50%, rgba(253, 230, 138, 0.22) 0%, transparent 80%)',
                      mixBlendMode: 'overlay',
                      animation: 'pulse 3.5s ease-in-out infinite alternate',
                    }}
                  />

                  {/* Floating spores */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {particles.map((p) => (
                      <span
                        key={p.id}
                        className="absolute rounded-full bg-amber-300/75 shadow-[0_0_5px_#fde047]"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          animation: `floatParticle ${p.duration}s ease-in-out infinite alternate`,
                          animationDelay: `${p.delay}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Interactive Hotspots */}
                  {showHotspots && !isComparing && HERO_HOTSPOTS.map((spot) => {
                    const isActive = activeHotspot?.id === spot.id;
                    return (
                      <div
                        key={spot.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(isActive ? null : spot);
                        }}
                      >
                        <div className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all shadow-md ${
                          isActive
                            ? 'bg-[#86efac] text-[#072a1a] border-white scale-110'
                            : 'bg-[#072a1a]/90 text-[#86efac] border-[#86efac] hover:scale-110 hover:bg-[#86efac] hover:text-[#072a1a]'
                        }`}>
                          <Leaf className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}

                  {/* Hotspot Inspection Popover */}
                  <AnimatePresence>
                    {activeHotspot && !isComparing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute bottom-3 left-3 right-3 z-30 bg-[#051c11]/95 text-white p-3.5 sm:p-4 rounded-xl border border-emerald-500/50 shadow-2xl backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-medium text-emerald-400">
                              {activeHotspot.spec}
                            </span>
                            <h3 className="font-serif text-sm sm:text-base font-bold text-white">
                              {activeHotspot.title}
                            </h3>
                            <p className="text-xs text-emerald-100/85 leading-relaxed max-w-xl">
                              {activeHotspot.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveHotspot(null)}
                            className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer shrink-0"
                            aria-label="Fechar detalhes"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {activeHotspot.botanicalSpecs && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 mt-2 border-t border-emerald-800/50">
                            {activeHotspot.botanicalSpecs.map((spec, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-200/90">
                                <CheckCircle2 className="w-3 h-3 text-[#86efac] shrink-0" />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Drag Handle in Comparison Mode */}
                  {isComparing && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#051c11] border-2 border-[#86efac] shadow-2xl flex items-center justify-center text-[#86efac] pointer-events-auto cursor-ew-resize">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Minimal Helper Line */}
              <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-emerald-300/70 font-sans">
                <span>Toque nos pontos verdes para detalhes técnicos</span>
                <button
                  type="button"
                  onClick={() => setEnable3D(!enable3D)}
                  className="hover:text-white transition-colors cursor-pointer text-[10px] font-mono"
                >
                  {enable3D ? 'Desativar 3D' : 'Ativar 3D'}
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(8px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-40px) translateX(-6px);
            opacity: 0.1;
          }
        }
      `}</style>
    </section>
  );
};
