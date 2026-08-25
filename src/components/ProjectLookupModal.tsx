import React, { useState } from 'react';
import { Search, FileSearch, X, MapPin, Calendar, Layers, Check, PhoneCall } from 'lucide-react';
import { PROJECT_SAMPLES } from '../data/mockData';
import { ProjectSample } from '../types';

interface ProjectLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProject?: ProjectSample | null;
  onOpenQuoteForCode: (code: string) => void;
}

export const ProjectLookupModal: React.FC<ProjectLookupModalProps> = ({
  isOpen,
  onClose,
  initialProject,
  onOpenQuoteForCode,
}) => {
  const [inputCode, setInputCode] = useState(initialProject?.code || 'AG-4891');
  const [foundProject, setFoundProject] = useState<ProjectSample | null>(
    initialProject || PROJECT_SAMPLES[0]
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = inputCode.trim().toUpperCase();
    try {
      const res = await fetch(`/api/project-code/${clean}`);
      const data = await res.json();

      if (data.success && data.project) {
        setFoundProject(data.project);
      } else {
        setErrorMsg(data.message || `Código ${clean} não encontrado.`);
      }
    } catch (err) {
      // Local fallback lookup
      const local = PROJECT_SAMPLES.find((p) => p.code.toUpperCase() === clean);
      if (local) {
        setFoundProject(local);
      } else {
        setErrorMsg(`Código ${clean} não encontrado. Tente exemplos como AG-4891, AG-2024, AG-3090, AG-5112.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-emerald-900/20 my-auto">
        
        {/* Header */}
        <div className="bg-[#072a1a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSearch className="w-5 h-5 text-[#86efac]" />
            <h2 className="font-serif font-bold text-lg text-white">
              Consultar Ficha Técnica do Projeto por Código
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Lookup Input Form */}
          <form onSubmit={handleLookup} className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Digite o Código do Projeto All Green:
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Ex: AG-4891, AG-2024, AG-3090..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-900 focus:outline-none focus:border-[#072a1a]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors"
              >
                Buscar
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-semibold pt-1">{errorMsg}</p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-500">Exemplos rápidos:</span>
              {['AG-4891', 'AG-2024', 'AG-3090', 'AG-5112'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setInputCode(code);
                    const found = PROJECT_SAMPLES.find((p) => p.code === code);
                    if (found) setFoundProject(found);
                  }}
                  className="text-[11px] font-mono font-bold text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100"
                >
                  {code}
                </button>
              ))}
            </div>
          </form>

          {/* Project Details Display */}
          {foundProject && (
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-[#15803d] uppercase tracking-wider block">
                    CÓDIGO OFICIAL: {foundProject.code}
                  </span>
                  <h3 className="font-serif font-bold text-gray-900 text-lg mt-0.5">
                    {foundProject.title}
                  </h3>
                </div>

                <span className="px-3 py-1 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-full">
                  {foundProject.type}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold block">Cliente:</span>
                  <p className="font-bold text-gray-900">{foundProject.client}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">Localização:</span>
                  <p className="font-bold text-gray-900">{foundProject.location}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold block">Área Verde:</span>
                  <p className="font-bold text-gray-900">{foundProject.area} m²</p>
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed border-t border-emerald-200/60 pt-3">
                {foundProject.description}
              </p>

              <div>
                <span className="text-[10px] font-bold text-[#072a1a] uppercase tracking-wider block mb-1.5">
                  Espécies Botânicas Aplicadas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {foundProject.speciesUsed.map((s, idx) => (
                    <span key={idx} className="text-xs bg-white text-[#072a1a] font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                      🌿 {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Concluído em: {foundProject.completionDate}</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuoteForCode(foundProject.code);
                  }}
                  className="py-2.5 px-4 bg-[#072a1a] text-white font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Solicitar Projeto Similar a Este</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
