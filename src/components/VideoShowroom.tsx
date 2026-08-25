import React, { useState } from 'react';
import { Play, Check, X, Volume2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface VideoShowroomProps {
  onOpenSimulator: () => void;
}

export const VideoShowroom: React.FC<VideoShowroomProps> = ({ onOpenSimulator }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="bg-[#f3f7f4] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Box with Dark Forest Green Background and ScrollReveal */}
        <ScrollReveal animation="fade-up" distance={30}>
          <div className="bg-[#072a1a] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden border border-emerald-800/60">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column Description */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>Showroom em Vídeo & Projetos em Movimento</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
                  Sinta o toque natural e o <br className="hidden sm:inline" />
                  <span className="italic font-light text-emerald-300">hiper-realismo</span> em cada detalhe.
                </h2>

                {/* Paragraph */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Confira como os nossos jardins verticais permanentes e preservados transformam a acústica, o aconchego e a estética de residências, escritórios e estabelecimentos comerciais.
                </p>

                {/* Checklist */}
                <ul className="space-y-2.5 text-sm text-emerald-100">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Alta densidade foliar realista sem falhas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Facilidade de limpeza e poeira zero</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Compatível com qualquer tipo de estrutura ou parede</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    onClick={onOpenSimulator}
                    className="px-6 py-3 bg-[#86efac] text-[#072a1a] font-bold rounded-full hover:bg-emerald-300 transition-all shadow-md text-sm sm:text-base cursor-pointer hover:scale-105 active:scale-95"
                  >
                    ✨ Simular na Minha Parede
                  </button>
                </div>
              </div>

              {/* Right Column Video Player Thumbnail */}
              <div className="lg:col-span-6">
                <div
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative h-72 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border-2 border-emerald-700/60"
                >
                  {/* Background Video Poster Image */}
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"
                    alt="Showroom All Green"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                  {/* Big Center Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-[#86efac] text-[#072a1a] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-9 h-9 fill-current ml-1" />
                    </div>
                    <span className="mt-4 px-4 py-1.5 rounded-full bg-black/70 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs border border-white/20">
                      CLIQUE PARA ASSISTIR
                    </span>
                  </div>

                  {/* Bottom Video Label Bar */}
                  <div className="absolute bottom-3 inset-x-3 bg-black/80 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between text-gray-200 backdrop-blur-xs border border-white/10">
                    <span className="font-semibold text-emerald-300">Vídeo Demonstrativo All Green</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold">
                      HD 1080p
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>
      </div>

      {/* Video Popup Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-emerald-950">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
              <Volume2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white font-serif">Showroom Virtual All Green</h3>
              <p className="text-gray-400 text-sm max-w-md mt-2">
                Demonstração de alta fidelidade botânica, texturas táteis e isolamento acústico em tempo real.
              </p>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="mt-6 px-6 py-2.5 bg-emerald-400 text-[#072a1a] font-bold rounded-full text-sm hover:bg-emerald-300 cursor-pointer"
              >
                Fechar Vídeo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
