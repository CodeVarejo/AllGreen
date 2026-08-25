import React, { useState } from 'react';
import { Search, ArrowRight, Tag, Filter } from 'lucide-react';
import { SEARCH_RESULTS } from '../data/mockData';
import { SearchResultItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface SmartSearchHubProps {
  initialSearchQuery?: string;
  onOpenQuoteForProduct: (productName: string) => void;
}

export const SmartSearchHub: React.FC<SmartSearchHubProps> = ({
  initialSearchQuery = '',
  onOpenQuoteForProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [activeTab, setActiveTab] = useState<string>('Todos os Resultados');

  const tabs = ['Todos os Resultados', 'Jardins Verticais', 'Módulos DIY', 'Vasos & Eventos', 'Catálogos'];

  const quickFilterPills = [
    'Permanente',
    'Preservado Moss',
    'DIY Placas 50x50',
    'Varanda Gourmet',
    'Escritórios',
    'Vasos Biofílicos',
    'Isolamento Acústico'
  ];

  // Filter items
  const filteredResults = SEARCH_RESULTS.filter((item) => {
    const matchesCategory = activeTab === 'Todos os Resultados' || item.category === activeTab;
    const matchesTerm =
      !searchTerm.trim() ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesTerm;
  });

  return (
    <section id="search-hub" className="bg-[#f3f7f4] py-16 md:py-24 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-up" distance={25}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#15803d] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>BUSCA INTELIGENTE ALL GREEN</span>
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-gray-900 leading-tight">
              Encontre a Solução de <br className="hidden sm:inline" />
              <span className="italic font-light text-[#15803d]">Paisagismo Perfeita</span>
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Digite o nome do produto, tipo de ambiente ou código do projeto para localizar instantaneamente.
            </p>
          </div>
        </ScrollReveal>

        {/* Large Search Box */}
        <ScrollReveal animation="fade-up" delay={0.1} distance={20}>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#15803d]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o que procura... Ex: 'Jardim Preservado', 'Placas DIY', 'Escritório', 'Varanda'..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-[#072a1a]/15 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#072a1a] focus:ring-4 focus:ring-[#072a1a]/10 shadow-md transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap justify-center mt-4">
              <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filtros rápidos:
              </span>
              {quickFilterPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSearchTerm(pill)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                    searchTerm === pill
                      ? 'bg-[#072a1a] text-white border-[#072a1a]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-600 hover:text-[#072a1a]'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-6 mt-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#072a1a] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-[#072a1a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Cards Result Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={idx * 0.08}
                distance={24}
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    {/* Image Box */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#072a1a] text-[#86efac] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#15803d]">
                          {item.code}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-gray-900 text-lg leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onOpenQuoteForProduct(item.title)}
                      className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-[#072a1a] text-[#072a1a] hover:text-white font-bold rounded-xl text-xs flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <span>Ver Solução Completa</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full py-12 text-center space-y-3">
              <p className="text-gray-500 text-base">Nenhum resultado encontrado para &quot;{searchTerm}&quot;.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('Todos os Resultados');
                }}
                className="px-4 py-2 bg-[#072a1a] text-white text-xs font-bold rounded-full cursor-pointer"
              >
                Limpar Busca
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
