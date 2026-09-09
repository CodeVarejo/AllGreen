import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';
import { seedProjectHistory } from '../../utils/versionControl';
import { useUnsavedChangesGuard } from '../../hooks/useUnsavedChangesGuard';

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

  const isDirty = useMemo(() => {
    return title.trim() !== '' || client.trim() !== '' || notes.trim() !== '' || area !== 18.5;
  }, [title, client, notes, area]);

  const { confirmDiscard } = useUnsavedChangesGuard({
    isDirty,
    title: 'Descartar cadastro de nova obra?',
    description: 'Você preencheu informações para o cadastro deste projeto. Se sair agora, todos os dados informados serão descartados.',
    confirmText: 'Descartar Cadastro',
    cancelText: 'Continuar Preenchendo',
    variant: 'warning',
    enabled: isOpen,
    interceptEscapeKey: true,
    onDiscard: onClose,
  });

  const handleRequestClose = () => {
    confirmDiscard(onClose);
  };

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

      const finalProj = seedProjectHistory(newProj);
      onAddProject(finalProj);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
        <div 
          className="fixed inset-0"
          onClick={handleRequestClose}
          aria-hidden="true"
        />

        <div className="bg-white rounded-3xl max-w-lg w-full my-auto overflow-hidden shadow-2xl relative border border-emerald-950/20 z-10 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#072a1a] text-white p-6 relative">
            <button
              type="button"
              onClick={handleRequestClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/30 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar cadastro"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
              <span>Portal</span>
              <ChevronRight className="w-3 h-3 text-emerald-400" />
              <span>Obras</span>
              <ChevronRight className="w-3 h-3 text-emerald-400" />
              <span className="text-[#86efac] font-bold">Novo Cadastro</span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>Cadastrar Nova Obra</span>
            </h2>
            <p className="text-xs text-emerald-200 mt-1">
              Registre a obra para gerar memorial descritivo automático, quantitativo e cálculo LEED.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Nome do Projeto / Espaço *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Foyer Principal Sede XP ou Varanda Gourmet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
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
                  placeholder="ex: BTG Pactual ou Família Ribeiro"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Cidade / UF
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Tipologia
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                >
                  <option value="Corporativo">Corporativo</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Hospitalar">Hospitalar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Estilo All Green
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                >
                  <option value="Jardim Preservado">Preservado</option>
                  <option value="Musgo Polar Moss">Polar Moss</option>
                  <option value="Jardim Permanente Hiper-Realista">Permanente Anti-UV</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Área (m²) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="1000"
                  required
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Observações Técnicas e Diretrizes de Projeto
              </label>
              <textarea
                rows={3}
                placeholder="Indique pé-direito, tipo de fixação na alvenaria, restrições de peso ou iluminação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#072a1a]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleRequestClose}
                className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Cadastrando...' : 'Cadastrar Obra no Portal'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
};
