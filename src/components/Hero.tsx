import React, { useState } from 'react';
import { Camera, ArrowRight, Search, Leaf, SlidersHorizontal, Sparkles, Volume2, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onOpenSimulator: () => void;
  onOpenProjectLookup: () => void;
  onExploreProjects: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenSimulator,
  onOpenProjectLookup,
  onExploreProjects,
}) => {
  // Before & After Interactive Slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchOrMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleTouchOrMove(e.touches[0].clientX, rect);
  };

  return (
    <section id="hero-section" className="bg-[#051c11] text-white py-14 md:py-24 relative overflow-hidden bg-grain-dark border-b border-emerald-900/40">
      {/* Subtle organic light reflections */}
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Archival grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#072a1a08_1px,transparent_1px),linear-gradient(to_bottom,#072a1a08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Archival metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-8 mb-8 border-b border-emerald-900/40 text-[10px] sm:text-xs font-mono tracking-widest text-emerald-300/80 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ATELIÊ DE BIOFILIA ARQUITETÔNICA • SÃO PAULO</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-400/80">
            <span>COLHEITA SUSTENTÁVEL ESCANDINÁVIA 64°N</span>
            <span>•</span>
            <span>MATA ATLÂNTICA BRASILEIRA</span>
            <span>•</span>
            <span className="text-amber-300/90 font-bold">100% PRESERVADO (ZERO ÁGUA)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column Editorial Narrative & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            
            {/* Stamp Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs font-medium tracking-wider backdrop-blur-md">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-serif italic text-emerald-200">Preservação por Seiva Vegetal</span>
              <span className="text-emerald-500">•</span>
              <span className="font-mono text-[10px] text-amber-300/90 font-bold">LAUDO IPT NRC 0.89</span>
            </div>

            {/* Main Headline with Cormorant Garamond / Serif Prestige */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-normal tracking-tight text-white leading-[1.08]">
              A natureza não espera. <br />
              Mas pode ser <span className="italic font-light text-[#86efac] underline decoration-[#86efac]/40 decoration-1 underline-offset-8">eterna.</span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-emerald-100/80 text-base sm:text-lg max-w-xl font-sans leading-relaxed font-light">
              Transformamos interiores corporativos e residências com jardins verticais preservados por substituição celular. Toque aveludado real, zero consumo de água e acústica superior certificada, sem reformas ou manutenções prediais.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-simulator-cta-btn"
                onClick={onOpenSimulator}
                className="flex items-center justify-center gap-2.5 px-7 py-4 bg-[#86efac] text-[#051c11] font-bold rounded-full hover:bg-emerald-300 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-sm sm:text-base group"
              >
                <Camera className="w-5 h-5 text-[#051c11] group-hover:rotate-6 transition-transform" />
                <span>Simular meu ambiente com IA</span>
              </button>

              <button
                onClick={onExploreProjects}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-100 font-medium rounded-full border border-emerald-700/60 transition-all text-sm sm:text-base cursor-pointer hover:border-emerald-400"
              >
                <span>Ver projetos executados</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Technical Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-900/50">
              <div className="space-y-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-white">0L</span>
                <p className="text-[11px] text-emerald-300/80 leading-tight">Consumo de água anual</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-400">0.89</span>
                <p className="text-[11px] text-emerald-300/80 leading-tight">NRC Acústico (Laudo IPT)</p>
              </div>
              <div className="space-y-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-amber-300">10 Anos+</span>
                <p className="text-[11px] text-emerald-300/80 leading-tight">Durabilidade comprovada</p>
              </div>
            </div>

            {/* Code lookup */}
            <div className="pt-1">
              <button
                onClick={onOpenProjectLookup}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-300/90 hover:text-white underline decoration-emerald-500/50 underline-offset-4 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Já possui código de especificação? Consultar memorial</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column Architectural Before/After Slider with Decibel & Material Metrology */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative bg-emerald-950/60 p-3 sm:p-4 rounded-3xl border border-emerald-800/80 shadow-2xl backdrop-blur-xl">
              
              {/* Corner Architectural Crop marks */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-500/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-500/60 pointer-events-none" />

              {/* Interactive Comparison Box */}
              <div
                className="relative h-[360px] sm:h-[430px] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize group"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* AFTER Image (Background full width) */}
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  alt="Ambiente com Jardim Vertical Preservado All Green"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE Image (Clipped overlay) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                    alt="Alvenaria Desnuda Original"
                    className="absolute inset-0 w-[#1000px] max-w-none h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Badge Overlay Left - BEFORE */}
                <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-md border border-white/20">
                  <span>ANTES: ALVENARIA CONVENCIONAL</span>
                  <div className="text-[9px] text-gray-300 font-sans mt-0.5">Reverberação 1.82s • Som ecoante</div>
                </div>

                {/* Badge Overlay Right - AFTER */}
                <div className="absolute top-3 right-3 bg-[#051c11]/90 text-emerald-300 border border-emerald-600/80 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Leaf className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>ALL GREEN: BIOFILIA PRESERVADA</span>
                </div>

                {/* Bottom Material Spec Tag (Dynamic according to slider) */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-[11px] text-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                    <span className="font-mono text-[10px] text-emerald-300">
                      {sliderPos > 50 ? 'ESPÉCIE: CLADONIA ESCANDINAVA + POLAR MOSS' : 'PAREDE EM CONCRETO DESNUDO'}
                    </span>
                  </div>
                  <span className="font-serif italic text-emerald-200 hidden sm:inline">
                    {sliderPos > 50 ? 'Isolamento acústico imediato (-18dB)' : 'Arraste para transformar'}
                  </span>
                </div>

                {/* Draggable Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#051c11] border-2 border-[#86efac] shadow-2xl flex items-center justify-center text-[#86efac]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

