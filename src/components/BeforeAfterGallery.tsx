import React, { useState } from 'react';
import { PROJECT_SAMPLES } from '../data/mockData';
import { ProjectSample } from '../types';
import { SlidersHorizontal, MapPin, Layers, ArrowRight, Leaf } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

interface BeforeAfterGalleryProps {
  onOpenProjectDetail: (project: ProjectSample) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  onOpenProjectDetail,
}) => {
  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({});

  const categories = [
    { id: 'all', label: isPt ? 'Todos os Projetos' : 'All Projects', match: 'Todos os Projetos' },
    { id: 'corp', label: isPt ? 'Escritórios Corporativos' : 'Corporate Workplaces', match: 'Escritórios Corporativos' },
    { id: 'res', label: isPt ? 'Residencial & Living' : 'Residential & Living', match: 'Residencial & Living' },
    { id: 'balcony', label: isPt ? 'Varandas & Sacadas' : 'Balconies & Terraces', match: 'Varandas & Sacadas' },
    { id: 'retail', label: isPt ? 'Recepções & Lojas' : 'Retail & Receptions', match: 'Recepções & Lojas' },
  ];

  const currentMatch = categories.find(c => c.id === activeCategory)?.match || 'Todos os Projetos';

  const filteredProjects = PROJECT_SAMPLES.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === currentMatch;
  });

  const handleSliderMove = (id: string, clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPositions((prev) => ({ ...prev, [id]: percentage }));
  };

  return (
    <section id="before-after-gallery" className="bg-[#f9fbf9] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              {isPt ? (
                <>
                  Galeria de Projetos & <br className="hidden sm:inline" />
                  <span className="italic font-light text-[#15803d]">Transformações Reais</span>
                </>
              ) : (
                <>
                  Project Gallery & <br className="hidden sm:inline" />
                  <span className="italic font-light text-[#15803d]">Real Transformations</span>
                </>
              )}
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {isPt
                ? 'Arraste o divisor para comparar ambientes residenciais e corporativos antes e depois da instalação All Green.'
                : 'Drag the interactive slider to compare residential and commercial spaces before and after All Green installation.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal animation="fade-up" delay={0.1} distance={15}>
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-6 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#072a1a] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-[#072a1a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {filteredProjects.map((project, idx) => {
            const pos = sliderPositions[project.id] ?? 50;

            return (
              <ScrollReveal
                key={project.id}
                animation="fade-up"
                delay={idx * 0.1}
                distance={28}
                className="h-full"
              >
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg flex flex-col justify-between hover:shadow-2xl transition-all duration-300 h-full">
                  <div>
                    {/* Interactive Before & After Image Slider */}
                    <div
                      className="relative h-72 sm:h-80 w-full overflow-hidden select-none cursor-ew-resize group"
                      onMouseMove={(e) => {
                        if (e.buttons === 1) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          handleSliderMove(project.id, e.clientX, rect);
                        }
                      }}
                      onTouchMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        handleSliderMove(project.id, e.touches[0].clientX, rect);
                      }}
                    >
                      {/* AFTER Image (Full background) */}
                      <img
                        src={project.afterImage}
                        alt={`${project.title} - Depois`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* BEFORE Image (Clipped overlay) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${pos}%` }}
                      >
                        <img
                          src={project.beforeImage}
                          alt={`${project.title} - Antes`}
                          className="absolute inset-0 w-[#800px] max-w-none h-full object-cover"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>

                      {/* Split Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
                        style={{ left: `${pos}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#072a1a] border-2 border-white shadow-xl flex items-center justify-center text-[#86efac]">
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {isPt ? 'Antes' : 'Before'}
                      </div>
                      <div className="absolute top-4 right-4 bg-[#072a1a]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#86efac] uppercase tracking-wider">
                        {isPt ? 'Depois' : 'After'}
                      </div>
                    </div>

                    {/* Meta & Descriptions */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-mono font-bold text-[#15803d]">
                          {project.code}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {project.location}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-gray-900 text-xl leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {project.type}
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {project.area} {isPt ? 'm² de área verde' : 'm² of green area'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onOpenProjectDetail(project)}
                      className="w-full py-3 bg-emerald-50 hover:bg-[#072a1a] text-[#072a1a] hover:text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-between px-4 group cursor-pointer"
                    >
                      <span>
                        {isPt
                          ? `Consultar Ficha Técnica Deste Projeto (${project.code})`
                          : `View Technical Sheet for Project (${project.code})`}
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
