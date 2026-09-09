import React, { useState } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  FileCode,
  Box,
  Layers,
  ExternalLink,
  ShieldCheck,
  X,
  SearchX
} from 'lucide-react';
import { TechnicalAsset } from '../../types';
import { TECHNICAL_ASSETS } from '../../data/portalData';
import { PageHeader } from '../PageHeader';

interface BimCadViewProps {
  onDownloadAsset: (asset: TechnicalAsset) => void;
  onBackToDashboard?: () => void;
}

export const BimCadView: React.FC<BimCadViewProps> = ({ 
  onDownloadAsset,
  onBackToDashboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAssets = TECHNICAL_ASSETS.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'todos' ||
      asset.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.fileFormat.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        align="split"
        badge="Biblioteca Técnica Oficial"
        badgeIcon={Box}
        title="Biblioteca Técnica BIM, 3D & Texturas PBR 4K"
        description="Arquivos paramétricos oficiais para Revit, SketchUp, detalhamento em DWG e blocos para renderizadores."
        primaryAction={{
          label: 'Compatibilidade Revit 2020-2026',
          icon: CheckCircle2,
          variant: 'outline',
        }}
      />

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por software, formato ou tipologia..."
            className="w-full pl-9 pr-8 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
            Software:
          </span>
          {['todos', 'revit', 'sketchup', 'autocad', 'texturas', 'especificação'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-[#072a1a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-gray-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
            <SearchX className="w-7 h-7 text-[#15803d]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-gray-950">
              Nenhum arquivo BIM/CAD encontrado
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Tente buscar por outro software (ex: Revit, SketchUp) ou limpe os filtros de busca.
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Ver Todos os Arquivos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-gray-950">
                  <img
                    src={asset.thumbnail}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-[#072a1a]/90 text-[#86efac] text-[10px] font-extrabold shadow-md border border-emerald-500/50 backdrop-blur-xs">
                    {asset.category}
                  </span>
                  
                  <span className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                    {asset.fileSize}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-base text-gray-950 leading-snug">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {asset.description}
                  </p>
                  <div className="text-[11px] text-emerald-950 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span>Formato: {asset.fileFormat}</span>
                    <span className="text-gray-500 font-medium">{asset.downloadsCount} downloads</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onDownloadAsset(asset)}
                  className="w-full py-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo ({asset.fileFormat.split(' ')[0]})</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* BIM Support Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#072a1a] text-[#86efac] flex items-center justify-center shrink-0 shadow-sm">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#072a1a]">
              Precisa de uma família personalizada com dimensões específicas do seu projeto?
            </h4>
            <p className="text-xs text-gray-600">
              Nossa equipe de modelagem BIM desenvolve blocos paramétricos sob medida para seu pranchamento executivo.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/5511912720799?text=Ol%C3%A1%2C%20preciso%20de%20um%20bloco%20BIM%20personalizado%20All%20Green"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 min-h-[44px]"
        >
          <span>Solicitar Bloco Especial</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
