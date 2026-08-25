import React, { useState } from 'react';
import {
  X,
  Plus,
  Building,
  MapPin,
  Layers,
  Leaf,
  FileText,
  Camera,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';

interface NewProjectModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: PortalProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  user,
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('São Paulo, SP');
  const [category, setCategory] = useState<PortalProject['category']>('Corporativo');
  const [style, setStyle] = useState<PortalProject['style']>('Jardim Preservado');
  const [area, setArea] = useState<number>(18.5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedCode = `AG-${Math.floor(1000 + Math.random() * 9000)}`;
      const pricePerM2 = style === 'Musgo Polar Moss' ? 1750 : style === 'Jardim Preservado' ? 1450 : 1350;
      const estimatedTotal = area * pricePerM2;

      const newProj: PortalProject = {
        id: `proj_${Date.now()}`,
        code: generatedCode,
        title: title || 'Novo Espaço Biofílico',
        client: client || user.company || 'Cliente Corporativo',
        location: location || 'São Paulo, SP',
        category,
        style,
        area,
        status: 'estudo_ia',
        statusLabel: 'Estudo Técnico Cadastrado',
        dateCreated: new Date().toLocaleDateString('pt-BR'),
        estimatedTotal,
        thumbnail: style === 'Musgo Polar Moss'
          ? 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'
          : style === 'Jardim Permanente Hiper-Realista'
          ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        notes: notes || 'Projeto cadastrado diretamente no Portal All Green para dimensionamento e compatibilização.',
        speciesUsed: [
          'Moss Dinamarquês Verde Floresta',
          'Samambaia Americana Preservada',
          'Costela de Adão Estabilizada'
        ],
        structureType: 'Painel Modular Plug & Play All Green',
        acousticNrc: 0.88,
        acousticDamping: 'Atenuação acústica para ambientes de trabalho e living',
        waterSavedLitersYear: Math.round(area * 1200),
        leedPointsTotal: 14,
        wellScore: 88,
        warrantyYears: 5,
        fireRating: 'Classe B-s1,d0 (Laudo IPT)',
        weightPerM2: 12.0,
      };

      onAddProject(newProj);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div 
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="bg-white rounded-3xl max-w-lg w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#072a1a] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/30 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#86efac] text-[#072a1a] text-[10px] font-extrabold uppercase">
              Nova Obra / Especificação
            </span>
          </div>

          <h2 className="text-2xl font-serif font-bold text-white">
            Cadastrar Novo Projeto
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Cadastre as diretrizes do seu projeto para emissão de memorial técnico e compatibilização BIM.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Nome do Projeto / Espaço *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Lounge Corporativo Paulista, Recepção Sede..."
              className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Cliente / Empreendimento *
              </label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="ex: Banco Alfa, Família Silva..."
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Localização (Cidade, UF)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="São Paulo, SP"
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Segmento / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              >
                <option value="Corporativo">Corporativo & Escritórios</option>
                <option value="Residencial">Residencial & Living</option>
                <option value="Comercial">Comercial & Varejo</option>
                <option value="Eventos">Eventos & Stands</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Tipologia Biofílica
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              >
                <option value="Jardim Preservado">Jardim Preservado Natural</option>
                <option value="Musgo Polar Moss">Musgo Polar Moss Acústico</option>
                <option value="Jardim Permanente Hiper-Realista">Permanente Hiper-Realista Anti-UV</option>
                <option value="Misto Biofílico">Misto Biofílico Custom</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Área Estimada da Parede</label>
              <span className="text-xs font-bold text-[#072a1a]">{area} m²</span>
            </div>
            <input
              type="range"
              min={2}
              max={100}
              step={0.5}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-[#072a1a] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Notas Técnicas de Projeto (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Parede com pé direito de 3.2m, substrato alvenaria, iluminação com trilho spot 3000K..."
              className="w-full px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
          >
            {isSubmitting ? (
              <span>Processando cadastro...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Salvar Projeto & Abrir Ficha Técnica</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
