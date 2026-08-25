import React, { useState } from 'react';
import { BOTANICAL_SPECIES } from '../data/mockData';
import { BotanicalSpecies } from '../types';
import { Leaf, Volume2, Sun, Camera, Check, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface BotanicalCatalogProps {
  onSimulateSpecies: (speciesName: string) => void;
  onOpenQuote: () => void;
}

export const BotanicalCatalog: React.FC<BotanicalCatalogProps> = ({
  onSimulateSpecies,
  onOpenQuote,
}) => {
  const [filter, setFilter] = useState<'all' | 'preservado' | 'permanente'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<BotanicalSpecies>(BOTANICAL_SPECIES[0]);

  const filteredList = BOTANICAL_SPECIES.filter((s) => {
    if (filter === 'preservado') return s.category === 'preservado';
    if (filter === 'permanente') return s.category === 'permanente';
    return true;
  });

  return (
    <section id="botanical-catalog" className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                <span>CATÁLOGO DE ESPÉCIES & TEXTURAS BOTÂNICAS</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 leading-tight">
                Curadoria Botânica <span className="italic font-light text-[#15803d]">All Green</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                Explore a riqueza tátil, os índices de absorção acústica e o nível de proteção UV de cada espécie botânica disponível para composições sob medida.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shrink-0 self-start md:self-auto shadow-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === 'all' ? 'bg-[#072a1a] text-white shadow-xs' : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Todas ({BOTANICAL_SPECIES.length})
              </button>
              <button
                onClick={() => setFilter('preservado')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === 'preservado' ? 'bg-[#072a1a] text-white shadow-xs' : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Preservadas Naturais
              </button>
              <button
                onClick={() => setFilter('permanente')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === 'permanente' ? 'bg-[#072a1a] text-white shadow-xs' : 'text-gray-600 hover:text-[#072a1a]'
                }`}
              >
                Permanentes Anti-UV
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Species List */}
          <ScrollReveal animation="fade-right" delay={0.1} distance={25} className="lg:col-span-5">
            <div 
              className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar"
              role="listbox"
              aria-label="Lista de espécies botânicas disponíveis"
            >
              {filteredList.map((item) => {
                const isSelected = selectedSpecies.id === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedSpecies(item)}
                    role="option"
                    aria-selected={isSelected}
                    className={`w-full p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-[#072a1a] ${
                      isSelected
                        ? 'bg-white border-[#072a1a] shadow-md ring-2 ring-[#072a1a]/20 font-bold'
                        : 'bg-white/90 border-gray-200 hover:bg-white hover:border-emerald-400'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={`Espécie botânica: ${item.name}`}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-wider">
                          {item.category === 'preservado' ? 'PRESERVADO 100% NATURAL' : 'PERMANENTE UV PREMIUM'}
                        </span>
                        {item.uvProtection && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                            UV Anti-Fade
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-serif font-bold text-gray-900 text-sm truncate">
                        {item.name}
                      </h3>

                      <p className="text-xs text-gray-600 italic truncate font-sans">
                        {item.scientificName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Right Detail Card - FICHA TÉCNICA DE ESPECIFICAÇÃO */}
          <ScrollReveal animation="fade-left" delay={0.15} distance={25} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-widest">
                    FICHA TÉCNICA DE ESPECIFICAÇÃO
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                    {selectedSpecies.name}
                  </h3>
                  <p className="text-xs text-gray-500 italic font-mono mt-0.5">
                    Nome Científico: {selectedSpecies.scientificName}
                  </p>
                </div>

                <span className="px-3 py-1 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-full shrink-0">
                  {selectedSpecies.line}
                </span>
              </div>

              {/* Image & Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Species Preview Image */}
                <div className="sm:col-span-5 h-56 rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={selectedSpecies.image}
                    alt={selectedSpecies.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Metrics */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80">
                    <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider block">
                      SENSAÇÃO TÁTIL & TEXTURA
                    </span>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {selectedSpecies.tactileFeel}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider">
                        ÍNDICE DE ABSORÇÃO ACÚSTICA
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {selectedSpecies.acousticAbsorption}
                    </p>
                  </div>

                  <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100/80">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-[#15803d]" />
                      <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider">
                        ILUMINAÇÃO RECOMENDADA
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">
                      {selectedSpecies.recommendedLighting}
                    </p>
                  </div>
                </div>

              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {selectedSpecies.description}
              </p>

              {/* Ideal Environments */}
              <div>
                <span className="text-[11px] font-bold text-[#072a1a] uppercase tracking-wider block mb-2">
                  AMBIENTES IDEAIS DE APLICAÇÃO:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecies.idealEnvironments.map((env, idx) => (
                    <span key={idx} className="text-xs bg-emerald-100/80 text-[#072a1a] font-semibold px-3 py-1 rounded-full">
                      ✓ {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onSimulateSpecies(selectedSpecies.name)}
                  className="w-full sm:flex-1 py-3 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#86efac]" />
                  <span>Simular Esta Folhagem</span>
                </button>

                <button
                  onClick={onOpenQuote}
                  className="w-full sm:w-auto py-3 px-6 bg-emerald-50 text-[#072a1a] hover:bg-emerald-100 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Incluir na Amostra
                </button>
              </div>

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
