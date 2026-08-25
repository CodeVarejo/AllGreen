import React, { useState } from 'react';
import { Camera, ArrowRight, Search, Leaf, SlidersHorizontal } from 'lucide-react';
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
    <section className="bg-[#072a1a] text-white py-12 md:py-20 relative overflow-hidden">
      {/* Subtle background ambient leaf gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column Text & CTAs with motion */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>SIMULADOR ALL GREEN • BIOFILIA DIGITAL</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.12]">
              Sua parede verde <br className="hidden sm:inline" />
              começa com <span className="italic font-light text-emerald-300">uma foto.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-base sm:text-lg max-w-xl font-sans leading-relaxed font-normal">
              Envie uma imagem do seu ambiente e visualize como uma composição All Green pode transformar o espaço antes mesmo da instalação.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenSimulator}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#86efac] text-[#072a1a] font-bold rounded-full hover:bg-emerald-300 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Camera className="w-5 h-5 text-[#072a1a]" />
                <span className="text-sm sm:text-base">Simular meu ambiente grátis</span>
              </button>

              <button
                onClick={onExploreProjects}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-white font-semibold rounded-full border border-emerald-800/80 transition-all text-sm sm:text-base cursor-pointer"
              >
                <span>Explorar projetos reais</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

            {/* Footer notes */}
            <div className="pt-3 text-xs text-emerald-200/80 flex flex-wrap items-center gap-2 sm:gap-4 font-sans">
              <span>Sem cadastro para começar</span>
              <span>•</span>
              <span>Resultado ilustrativo</span>
              <span>•</span>
              <span>Atendimento humano no orçamento</span>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenProjectLookup}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white underline decoration-emerald-500/50 underline-offset-4 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Já possui código? Consultar projeto</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column Interactive Before/After Widget with motion */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="bg-emerald-950/40 p-3 sm:p-4 rounded-3xl border border-emerald-800/50 shadow-2xl backdrop-blur-md">
              
              {/* Interactive Comparison Box */}
              <div
                className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize group"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* AFTER Image (Background full width) */}
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  alt="Ambiente com Jardim All Green"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE Image (Clipped overlay) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                    alt="Ambiente Original"
                    className="absolute inset-0 w-[#1000px] max-w-none h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                {/* Badge Overlay Left - BEFORE */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-xs">
                  AMBIENTE ORIGINAL
                </div>

                {/* Badge Overlay Right - AFTER */}
                <div className="absolute top-3 right-3 bg-[#072a1a]/90 text-emerald-300 border border-emerald-700/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md backdrop-blur-xs flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>AMBIENTE COM JARDIM ALL GREEN</span>
                </div>

                {/* Draggable Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#072a1a] border-2 border-white shadow-xl flex items-center justify-center text-white">
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
