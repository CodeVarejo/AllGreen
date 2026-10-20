import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  ShieldCheck,
  Bell,
  Cloud,
  Save,
  CheckCircle2,
  FileText,
  Award,
  Sparkles,
  Sliders,
  Palette,
  Eye,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { UserProfile } from '../../types';
import { PageHeader } from '../PageHeader';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useCloudStorage } from '../../context/CloudStorageContext';
import { loadNatureNotificationSettings, saveNatureNotificationSettings } from '../../utils/natureNotificationService';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBackToDashboard?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onBackToDashboard,
}) => {
  const { fontSize, setFontSize, isHighContrast, toggleHighContrast } = useAccessibility();
  const { isConnected, cloudFiles } = useCloudStorage();

  // Form states initialized with current user
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [cauRrt, setCauRrt] = useState(user.cau_rrt || 'CAU A84920-1 (Homologado)');
  const [phone, setPhone] = useState(user.phone || '(11) 98450-2030');
  const [city, setCity] = useState(user.city || 'São Paulo, SP');
  const [role, setRole] = useState<UserProfile['role']>(user.role);

  // Technical & Sustainable Preferences
  const [targetLeedTier, setTargetLeedTier] = useState<'Gold' | 'Platinum' | 'Certified'>('Platinum');
  const [defaultNrcTarget, setDefaultNrcTarget] = useState<'0.85' | '0.88' | '0.90'>('0.88');
  const [includeIptReportInPdf, setIncludeIptReportInPdf] = useState(true);
  const [include3DTexturesInExport, setInclude3DTexturesInExport] = useState(true);

  // Notifications & Nature Habits
  const [natureNotifSettings, setNatureNotifSettings] = useState(() => loadNatureNotificationSettings());
  const [natureRemindersEnabled, setNatureRemindersEnabled] = useState(natureNotifSettings.enabled);
  const [reminderInterval, setReminderInterval] = useState(natureNotifSettings.intervalMinutes || 60);
  const [natureSoundEnabled, setNatureSoundEnabled] = useState(natureNotifSettings.soundEnabled);

  // Feedback state
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserProfile = {
      ...user,
      name,
      email,
      company,
      cau_rrt: cauRrt,
      phone,
      city,
      role,
    };

    // Save nature notification preferences
    saveNatureNotificationSettings({
      enabled: natureRemindersEnabled,
      intervalMinutes: reminderInterval,
      soundEnabled: natureSoundEnabled,
    });

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header aligned with landing page styling */}
      <PageHeader
        align="split"
        badge="Configurações & Governança do Escritório"
        badgeIcon={Settings}
        title="Perfil Técnico & Preferências de Especificação"
        description="Gerencie os dados cadastrais do seu escritório, parâmetros de homologação técnica LEED/WELL e preferências de automação biofílica."
        primaryAction={{
          label: savedSuccess ? 'Alterações Salvas!' : 'Salvar Alterações',
          icon: savedSuccess ? CheckCircle2 : Save,
          onClick: () => {
            const formElem = document.getElementById('settings-form') as HTMLFormElement;
            if (formElem) formElem.requestSubmit();
          },
          variant: savedSuccess ? 'emerald' : 'primary',
        }}
      />

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Professional & Studio Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[#072a1a] text-[#86efac] flex items-center justify-center font-bold shadow-xs">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
                Dados do Escritório & Especificador
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Informações impressas automaticamente no cabeçalho dos memoriais descritivos e laudos técnicos em PDF.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nome do Responsável Técnico
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
                placeholder="Ex: Arq. Mariana Albuquerque"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nome do Escritório / Empresa
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
                placeholder="Ex: Studio Vanguarda Arquitetura"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Registro Profissional (CAU / CREA)
              </label>
              <input
                type="text"
                value={cauRrt}
                onChange={(e) => setCauRrt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all font-mono"
                placeholder="Ex: CAU A84920-1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Perfil de Acesso
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all cursor-pointer"
              >
                <option value="arquiteto">Arquiteto / Designer de Interiores</option>
                <option value="especificador">Especificador Sustentável / Consultor LEED</option>
                <option value="cliente">Cliente Corporativo / Incorporadora</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                E-mail Profissional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all"
                placeholder="contato@escritorio.com.br"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Telefone / WhatsApp para Suporte Fabril
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all font-mono"
                placeholder="(11) 98450-2030"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Technical & Sustainable Standards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#15803d] flex items-center justify-center font-bold shadow-xs border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
                Padrões de Certificação & Engenharia
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Critérios técnicos pré-configurados para a geração automática de laudos e compatibilização BIM.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Alvo de Certificação LEED v4.1 Padrão
              </label>
              <select
                value={targetLeedTier}
                onChange={(e) => setTargetLeedTier(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all cursor-pointer"
              >
                <option value="Platinum">LEED Platinum (80+ pontos / Máxima Eficiência)</option>
                <option value="Gold">LEED Gold (60-79 pontos)</option>
                <option value="Certified">LEED Certified (40-49 pontos)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Coeficiente Acústico Mínimo Exigido (NRC)
              </label>
              <select
                value={defaultNrcTarget}
                onChange={(e) => setDefaultNrcTarget(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] focus:bg-white transition-all cursor-pointer font-mono"
              >
                <option value="0.88">NRC 0.88 (Padrão All Green Polar Moss 60mm)</option>
                <option value="0.85">NRC 0.85 (NBR 10152 Escritórios de Alta Concentração)</option>
                <option value="0.90">NRC 0.90 (Painéis Acústicos Especiais para Auditórios)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeIptReportInPdf}
                  onChange={(e) => setIncludeIptReportInPdf(e.target.checked)}
                  className="w-4 h-4 rounded text-[#15803d] focus:ring-[#072a1a] border-gray-300"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#15803d] transition-colors block">
                    Anexar Laudo Laboratorial IPT (ISO 354) aos Memoriais
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Gera anexo comprobatório de ensaio de câmara reverberante em todos os downloads de PDF.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={include3DTexturesInExport}
                  onChange={(e) => setInclude3DTexturesInExport(e.target.checked)}
                  className="w-4 h-4 rounded text-[#15803d] focus:ring-[#072a1a] border-gray-300"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#15803d] transition-colors block">
                    Empacotar Texturas PBR 4K no Download de Arquivos BIM/CAD
                  </span>
                  <span className="text-[11px] text-gray-500 block">
                    Inclui mapas de Albedo, Normal, Roughness e Displacement nos pacotes de download.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Notifications & Wellness Automations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/10 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-xs border border-amber-100">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
                Notificações & Lembretes Biofílicos
              </h3>
              <p className="text-xs text-gray-500 font-sans">
                Controle os avisos periódicos de "Momento de Natureza" calibrados pelo seu perfil biofílico.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={natureRemindersEnabled}
                onChange={(e) => setNatureRemindersEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#15803d] focus:ring-[#072a1a] border-gray-300"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 group-hover:text-[#15803d] transition-colors block">
                  Lembretes Periódicos de Pausa Regenerativa ("Momento de Natureza")
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Envia notificações nativas de descanso sensorial com base no arquétipo do seu espaço.
                </span>
              </div>
            </label>

            {natureRemindersEnabled && (
              <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Frequência do Lembrete
                  </label>
                  <select
                    value={reminderInterval}
                    onChange={(e) => setReminderInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#072a1a] cursor-pointer"
                  >
                    <option value={30}>A cada 30 minutos (Foco Intenso)</option>
                    <option value={45}>A cada 45 minutos (Técnica Pomodoro Biofílica)</option>
                    <option value={60}>A cada 60 minutos (Recomendado)</option>
                    <option value={120}>A cada 2 horas (Micro-pausas espaçadas)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={natureSoundEnabled}
                      onChange={(e) => setNatureSoundEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-[#15803d] focus:ring-[#072a1a] border-gray-300"
                    />
                    <span className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                      <Volume2 className="w-3.5 h-3.5 text-[#15803d]" />
                      Sinal sonoro suave (Campânula de vento vegetal)
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: Cloud Sync & Storage Status */}
        <div className="bg-gradient-to-br from-[#062316] via-[#072a1a] to-[#041a10] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#86efac]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#86efac] uppercase tracking-wider font-mono">
                <Cloud className="w-4 h-4" />
                <span>Sincronização em Nuvem (Google Drive & Local Storage)</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isConnected ? 'Escritório Conectado à Nuvem Segura' : 'Armazenamento Local Ativo'}
              </h3>
              <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
                Todos os seus projetos, revisões históricas e relatórios gerados ficam salvos com criptografia local e sincronização instantânea com a nuvem segura.
              </p>
              <div className="text-[11px] text-emerald-300/80 pt-1 font-mono">
                {cloudFiles.length} arquivos técnicos e snapshots sincronizados
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#86efac] hover:bg-emerald-300 text-[#072a1a] font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Todas as Configurações</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
