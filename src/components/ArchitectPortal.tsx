import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  UserProfile,
  PortalProject,
  TechnicalAsset,
  PortalNotification
} from '../types';
import {
  INITIAL_PORTAL_PROJECTS,
  TECHNICAL_ASSETS,
  INITIAL_PORTAL_NOTIFICATIONS
} from '../data/portalData';

import { PortalHeader } from './portal/PortalHeader';
import { PortalTabs, PortalTabKey } from './portal/PortalTabs';
import { DashboardView } from './portal/DashboardView';
import { ProjectsView } from './portal/ProjectsView';
import { BimCadView } from './portal/BimCadView';
import { SamplesView } from './portal/SamplesView';
import { SpecifierView } from './portal/SpecifierView';
import { ProjectDetailModal } from './portal/ProjectDetailModal';
import { NewProjectModal } from './portal/NewProjectModal';
import { DownloadToast } from './portal/DownloadToast';

import { ProjectComparison } from './ProjectComparison';
import { NotificationCenter } from './NotificationCenter';
import { jsPDF } from 'jspdf';

interface ArchitectPortalProps {
  user: UserProfile;
  onBackToLanding: () => void;
  onLogout: () => void;
  onOpenSimulator: () => void;
  onOpenQuote: (context: string) => void;
}

export const ArchitectPortal: React.FC<ArchitectPortalProps> = ({
  user,
  onBackToLanding,
  onLogout,
  onOpenSimulator,
  onOpenQuote,
}) => {
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(user);
  const [activeTab, setActiveTab] = useState<PortalTabKey>('dashboard');
  const [projects, setProjects] = useState<PortalProject[]>(INITIAL_PORTAL_PROJECTS);
  
  // Modals & Drawers
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<PortalProject | null>(null);
  
  // Toast states
  const [activeDownloadToast, setActiveDownloadToast] = useState<{ fileName: string; fileFormat: string } | null>(null);
  const [activeToast, setActiveToast] = useState<PortalNotification | null>(null);

  // Selected projects for Comparison view
  const [comparisonProjectAId, setComparisonProjectAId] = useState<string>('proj_1');
  const [comparisonProjectBId, setComparisonProjectBId] = useState<string>('proj_2');

  // Notification State
  const [notifications, setNotifications] = useState<PortalNotification[]>(INITIAL_PORTAL_NOTIFICATIONS);

  // Selected botanical modal detail
  const [selectedSpeciesDetail, setSelectedSpeciesDetail] = useState<{ name: string; nrc: string; leed: string; desc: string } | null>(null);

  // Interactive LEED/WELL simulator toggles in portal
  const [leedWaterEfficiency, setLeedWaterEfficiency] = useState(true);
  const [leedAirQuality, setLeedAirQuality] = useState(true);
  const [leedAcousticPanel, setLeedAcousticPanel] = useState(true);
  const [wellNatureAccess, setWellNatureAccess] = useState(true);

  // Sync user if prop changes
  useEffect(() => {
    setCurrentUserProfile(user);
  }, [user]);

  // Auto-dismiss real-time toast alert after 6 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleToggleUserRole = () => {
    setCurrentUserProfile(prev => {
      const isArch = prev.role === 'arquiteto';
      return {
        ...prev,
        role: isArch ? 'cliente' : 'arquiteto',
        company: isArch ? 'Vita Empreendimentos Imobiliários' : 'Studio Vanguarda Arquitetura',
        cau_rrt: isArch ? 'CAU A84920-1 (Homologado)' : 'Cliente Corporativo (São Paulo, SP)'
      };
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleActionClick = (notification: PortalNotification) => {
    setIsNotificationOpen(false);
    if (notification.actionType === 'view_project' && notification.projectCode) {
      const targetProj = projects.find(p => p.code === notification.projectCode);
      if (targetProj) {
        setSelectedProjectForDetail(targetProj);
      } else {
        setActiveTab('projects');
      }
    } else if (notification.actionType === 'download_report') {
      const targetProj = projects.find(p => p.code === notification.projectCode) || projects[0];
      handleDownloadSpecSheet(targetProj);
    } else if (notification.actionType === 'view_botanical') {
      setSelectedSpeciesDetail({
        name: notification.speciesName || 'Musgo Polar Moss Preservado',
        nrc: 'NRC 0.88 (Máxima Absorção Sonora - Laudo IPT 2026)',
        leed: '+3 Créditos LEED v4.1 / +4 Pts WELL Sound',
        desc: notification.description,
      });
    } else if (notification.actionType === 'recalculate_leed') {
      setActiveTab('calculator');
    }
  };

  const handleTriggerSimulation = (type: 'botanical' | 'leed') => {
    const timestamp = 'Agora';
    let newNotif: PortalNotification;

    if (type === 'botanical') {
      const isSamambaia = Math.random() > 0.5;
      newNotif = isSamambaia ? {
        id: `notif_${Date.now()}`,
        type: 'botanical_update',
        title: 'Novo Laudo IPT: Samambaia Chorona Anti-UV (ASTM G154)',
        description: 'Laudo de intemperismo acelerado confirmou resistência solar de 3.500 horas com proteção Anti-UV sem alteração de tom.',
        timestamp,
        isRead: false,
        speciesId: 'samambaia-chorona',
        speciesName: 'Samambaia Chorona Hiper-Realista Anti-UV',
        impactSummary: {
          parameterChanged: 'Resistência Solar UV & Durabilidade',
          oldValue: '3.000 horas',
          newValue: '3.500 horas certificadas (+16%)',
          deltaWell: 'Aprovado para Áreas Ensolaradas',
        },
        actionLabel: 'Ver Detalhes Botânicos',
        actionType: 'view_botanical',
      } : {
        id: `notif_${Date.now()}`,
        type: 'botanical_update',
        title: 'Atualização de Absorção Acústica: Musgo Polar Moss',
        description: 'Ensaio de laboratório IPT homologou coeficiente NRC 0.89 para painéis acústicos All Green de 60mm.',
        timestamp,
        isRead: false,
        speciesId: 'moss-dinamarques',
        speciesName: 'Musgo Polar Moss Escandinavo',
        impactSummary: {
          parameterChanged: 'Absorção Acústica (NRC ISO 354)',
          oldValue: 'NRC 0.85',
          newValue: 'NRC 0.89 (+4.7%)',
          deltaWell: '+3 Pts WELL Sound S04',
        },
        actionLabel: 'Ver Ficha da Espécie',
        actionType: 'view_botanical',
      };
    } else {
      newNotif = {
        id: `notif_${Date.now()}`,
        type: 'leed_well_update',
        title: 'Atualização no Projeto AG-8492: +4 Créditos LEED v4.1',
        description: 'A homologação do sistema 100% livre de água gerou pontuação máxima no critério WEc1 (Water Use Reduction) e crédito de inovação biofílica.',
        timestamp,
        isRead: false,
        projectCode: 'AG-8492',
        impactSummary: {
          parameterChanged: 'Pontuação LEED v4.1 & WELL v2',
          oldValue: '12 créditos',
          newValue: '16 créditos certificados (+4)',
          deltaLeed: '+4 Créditos LEED v4.1',
          deltaWell: '+5 Pts WELL v2 Mind',
        },
        actionLabel: 'Ver Projeto AG-8492',
        actionType: 'view_project',
      };
    }

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const handleToggleLeedParam = (
    paramName: string,
    stateSetter: React.Dispatch<React.SetStateAction<boolean>>,
    currentState: boolean
  ) => {
    const newState = !currentState;
    stateSetter(newState);

    const newNotif: PortalNotification = {
      id: `notif_param_${Date.now()}`,
      type: 'leed_well_update',
      title: `Calculadora LEED/WELL: ${paramName} ${newState ? 'Ativado (+Créditos)' : 'Removido'}`,
      description: `Os parâmetros de sustentabilidade foram recalculados em tempo real para seu memorial descritivo.`,
      timestamp: 'Agora',
      isRead: false,
      impactSummary: {
        parameterChanged: paramName,
        oldValue: currentState ? 'Ativo na Proposta' : 'Inativo',
        newValue: newState ? 'Homologado (+Créditos)' : 'Desativado',
        deltaLeed: newState ? '+2 Créditos LEED' : '-2 Créditos',
        deltaWell: newState ? '+3 Pts WELL' : '-3 Pts',
      },
      actionLabel: 'Ver Memorial',
      actionType: 'recalculate_leed',
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const handleDownloadSpecSheet = (project: PortalProject) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Brand Header Bar in Forest Green #072a1a
    doc.setFillColor(7, 42, 26);
    doc.rect(0, 0, 210, 36, 'F');

    // Mint Accent Stripe #86efac
    doc.setFillColor(134, 239, 172);
    doc.rect(0, 36, 210, 2.5, 'F');

    // Header Typography
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ALL GREEN DECOR & BIOPHILIC DESIGN', 18, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(134, 239, 172);
    doc.text('MEMORIAL DESCRITIVO & LAUDO DE HOMOLOGAÇÃO TÉCNICA', 18, 23);

    doc.setFontSize(8);
    doc.setTextColor(200, 230, 210);
    doc.text(`CERTIFICAÇÃO SUSTENTÁVEL LEED v4.1 & WELL v2 • LAUDO IPT NRC 0.88`, 18, 29);

    // Reset text color for body
    doc.setTextColor(30, 41, 59);

    // Metadata Box
    doc.setFillColor(245, 249, 246);
    doc.roundedRect(18, 44, 174, 48, 3, 3, 'F');
    doc.setDrawColor(200, 225, 210);
    doc.roundedRect(18, 44, 174, 48, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text(`Projeto: ${project.code} — ${project.title}`, 23, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Cliente / Empreendimento: ${project.client}`, 23, 60);
    doc.text(`Localização: ${project.location}`, 23, 67);
    doc.text(`Tipologia Homologada: ${project.style} (${project.category})`, 23, 74);
    doc.text(`Área Projetada Total: ${project.area} m²`, 23, 81);

    doc.text(`Status Fabril: ${project.statusLabel}`, 115, 60);
    doc.text(`Investimento Estimado: R$ ${project.estimatedTotal.toLocaleString('pt-BR')}`, 115, 67);
    doc.text(`Carga Estrutural: ${project.weightPerM2 || 12} kg/m²`, 115, 74);
    doc.text(`Garantia de Fábrica: ${project.warrantyYears || 5} Anos`, 115, 81);

    // Section 1: Botanical & Materials Specification
    let yPos = 100;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text('1. ESPECIFICAÇÃO BOTÂNICA & PROCESSAMENTO NATURAL', 18, yPos);
    doc.setDrawColor(7, 42, 26);
    doc.line(18, yPos + 2, 192, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text('• Composição Botânica: Musgos e folhagens preservadas com substituição de seiva por glicerina vegetal pura.', 20, yPos);
    yPos += 6;
    doc.text('• Isenção Total de Irrigação: 100% livre de pontos de água, bombas hidráulicas, drenos ou defensivos químicos.', 20, yPos);
    yPos += 6;
    doc.text('• Tratamento Anti-Estático e Anti-Insetos: Repele poeira por processo natural e é inóspito para insetos e fungos.', 20, yPos);
    yPos += 6;
    const speciesText = project.speciesUsed && project.speciesUsed.length > 0 
      ? `• Espécies Integradas: ${project.speciesUsed.join(', ')}.`
      : '• Espécies Integradas: Musgo Polar Moss, Samambaia Americana Preservada, Eucalipto Estabilizado, Costela de Adão Real Touch.';
    doc.text(speciesText, 20, yPos);

    // Section 2: Engineering & Acoustic Performance
    yPos += 13;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text('2. ENGENHARIA MODULAR & ABSORÇÃO ACÚSTICA (IPT / ISO 354)', 18, yPos);
    doc.line(18, yPos + 2, 192, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Coeficiente de Redução de Ruído (NRC): NRC ${project.acousticNrc || 0.88} (Conforme Laudo IPT / ABNT NBR 10152).`, 20, yPos);
    yPos += 6;
    doc.text('• Sistema Construtivo: Módulos Plug & Play em MDF Ultra Naval Hidrorrepelente com travamento de ancoragem oculta.', 20, yPos);
    yPos += 6;
    doc.text(`• Segurança ao Fogo: ${project.fireRating || 'Classe B-s1,d0 (Auto-extinguível e baixa densidade óptica de fumaça)'}.`, 20, yPos);
    yPos += 6;
    doc.text('• Instalação Rápida e Limpa: Montagem sem ruído agressivo, poeira de alvenaria ou impermeabilizações úmidas.', 20, yPos);

    // Section 3: LEED v4.1 & WELL v2 Sustainability Score
    yPos += 13;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text('3. MATRIZ DE CRÉDITOS SUSTENTÁVEIS (LEED v4.1 & WELL v2)', 18, yPos);
    doc.line(18, yPos + 2, 192, yPos + 2);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Crédito LEED WEc1 (Water Use Reduction): Isenção de consumo hídrico (${(project.waterSavedLitersYear || 28000).toLocaleString('pt-BR')} L/ano poupados).`, 20, yPos);
    yPos += 6;
    doc.text('• Crédito LEED EQc4 (Low-Emitting Materials): Emissão Zero de COV (Compostos Orgânicos Voláteis).', 20, yPos);
    yPos += 6;
    doc.text('• Crédito LEED EQc9 & WELL Sound S04: Atenuação de reverberação sonora para áreas de trabalho colaborativo.', 20, yPos);
    yPos += 6;
    doc.text(`• Critério WELL Mind M02 (Access to Nature): Impacto biofílico comprovado na redução de estresse (${project.wellScore || 88} pts).`, 20, yPos);

    // Footer Signature & Verification
    doc.setDrawColor(200, 220, 210);
    doc.line(18, 248, 192, 248);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(7, 42, 26);
    doc.text('ALL GREEN DECOR & BIOPHILIA — DEPARTAMENTO DE ENGENHARIA', 18, 255);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Documento emitido via Portal do Arquiteto para ${currentUserProfile.name} (${currentUserProfile.company}) em ${new Date().toLocaleDateString('pt-BR')}.`, 18, 260);
    doc.text('Suporte ao Especificador: (11) 91272-0799 | projetos@allgreendecor.com.br | www.allgreendecor.com.br', 18, 265);
    doc.text('Autenticidade e parâmetros técnicos homologados pelo Green Building Council Brasil e IPT.', 18, 270);

    // Save File
    doc.save(`AllGreen_${project.code}_Memorial_Descritivo.pdf`);

    // Show toast
    setActiveDownloadToast({
      fileName: `AllGreen_${project.code}_Memorial_Descritivo.pdf`,
      fileFormat: 'PDF Document (Homologado)',
    });
  };

  const handleDownloadAsset = (asset: TechnicalAsset) => {
    // 1. Show technical toast
    setActiveDownloadToast({
      fileName: asset.title,
      fileFormat: asset.fileFormat,
    });

    // 2. Generate and trigger real browser download with technical specifications content
    try {
      const fileContent = `================================================================================
ALL GREEN DECOR - PACOTE TÉCNICO DE ESPECIFICAÇÃO BIOPHILIC DESIGN
================================================================================
Ativo: ${asset.title}
Categoria: ${asset.category}
Formato do Arquivo: ${asset.fileFormat}
Versão Compatível: Revit 2020-2026 / SketchUp Pro / AutoCAD 2018+ / 3ds Max
Homologação: Laudos IPT / Green Building Council Brasil / WELL Building Standard v2
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}

--------------------------------------------------------------------------------
1. PARÂMETROS E PROPRIEDADES BIM/CAD EMBUTIDAS
--------------------------------------------------------------------------------
• Tipologia: Jardim Vertical Estabilizado / Modular Plug & Play
• Carga Estrutural Média: 12.0 kg/m² (MDF Ultra Naval + Vegetação)
• Espessura do Módulo Acabado: 60mm a 80mm
• Ancoragem: Perfil de travamento oculto tipo mão-amiga em alumínio naval
• Irrigação / Ponto de Água: 0 L/ano (100% Isento de Hidráulica - Crédito LEED WEc1)
• Drenagem: Não necessária
• Absorção Acústica: NRC 0.88 conforme ensaio ISO 354 / IPT

--------------------------------------------------------------------------------
2. ESPECIFICAÇÃO DE TEXTURA PBR (SE APLICÁVEL)
--------------------------------------------------------------------------------
• Albedo / Diffuse: 4096 x 4096 px (RGB 16-bit)
• Normal Map: DirectX / OpenGL Tangent Space 4K
• Roughness: 4K Grayscale (0.65 - 0.85)
• Ambient Occlusion: 4K
• Displacement: 16-bit EXR (profundidade foliar 35mm)

--------------------------------------------------------------------------------
3. NORMAS TÉCNICAS E CERTIFICAÇÕES
--------------------------------------------------------------------------------
• Classificação de Fogo: Classe II-A (ABNT NBR 9442 / IT-10 CBPMESP)
• Emissão de Compostos Orgânicos Voláteis: Zero COV (Certificado Eurofins Indoor Air Comfort)
• Garantia de Fábrica: 5 anos contra ressecamento e alteração cromática

--------------------------------------------------------------------------------
4. SUPORTE TÉCNICO DIRETO AO ESPECIFICADOR
--------------------------------------------------------------------------------
All Green Decor & Biophilia
Engenharia e Projetos Especiais: (11) 91272-0799
Email: projetos@allgreendecor.com.br
Portal do Arquiteto: https://allgreendecor.com.br
================================================================================`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const sanitizedName = asset.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const ext = asset.fileFormat.toLowerCase().includes('dwg') ? 'dwg.txt' : asset.fileFormat.toLowerCase().includes('skp') ? 'skp.txt' : asset.fileFormat.toLowerCase().includes('rfa') ? 'rfa.txt' : 'txt';
      link.href = url;
      link.download = `AllGreen_${sanitizedName}_${asset.id}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.warn('Download asset note:', e);
    }
  };

  const handleAddNewProject = (newProject: PortalProject) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectForDetail(newProject);
  };

  const handleSelectForComparison = (projectId: string) => {
    setComparisonProjectAId(projectId);
    const other = projects.find(p => p.id !== projectId);
    if (other) setComparisonProjectBId(other.id);
    setActiveTab('comparison');
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-gray-900 font-sans antialiased relative selection:bg-[#86efac] selection:text-[#062316]">
      
      {/* Top Header Bar with Live Role Switcher & Demo Mode */}
      <PortalHeader
        user={currentUserProfile}
        unreadNotificationsCount={unreadNotificationsCount}
        onBackToLanding={onBackToLanding}
        onLogout={onLogout}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenSimulator={onOpenSimulator}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onToggleUserRole={handleToggleUserRole}
        onTriggerSimulation={handleTriggerSimulation}
      />

      {/* Floating Real-Time Notification Alert Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#062316] text-white p-4 rounded-2xl border border-[#86efac]/40 shadow-2xl space-y-2 relative backdrop-blur-md">
            <button
              onClick={() => setActiveToast(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#86efac] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Notificação Técnica em Tempo Real</span>
            </div>

            <h4 className="text-xs font-bold text-white leading-snug">
              {activeToast.title}
            </h4>

            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              {activeToast.description}
            </p>

            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={() => {
                  handleActionClick(activeToast);
                  setActiveToast(null);
                }}
                className="text-[11px] font-bold text-[#062316] bg-[#86efac] hover:bg-emerald-300 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {activeToast.actionLabel || 'Ver Detalhes'}
              </button>
              <span className="text-[10px] text-gray-400 font-mono">Agora</span>
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Toast */}
      {activeDownloadToast && (
        <DownloadToast
          fileName={activeDownloadToast.fileName}
          fileFormat={activeDownloadToast.fileFormat}
          onClose={() => setActiveDownloadToast(null)}
        />
      )}

      {/* Portal Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Tabs */}
        <PortalTabs
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          projectsCount={projects.length}
          assetsCount={TECHNICAL_ASSETS.length}
          userRole={currentUserProfile.role}
        />

        {/* View Transitions */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <DashboardView
                user={currentUserProfile}
                projects={projects}
                notifications={notifications}
                onOpenSimulator={onOpenSimulator}
                onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                onOpenNotifications={() => setIsNotificationOpen(true)}
                onSelectTab={(t) => setActiveTab(t)}
                onDownloadSpecPdf={handleDownloadSpecSheet}
                onOpenProjectDetail={(p) => setSelectedProjectForDetail(p)}
                onActionClick={handleActionClick}
              />
            </motion.div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <motion.div
              key="tab-projects"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectsView
                projects={projects}
                user={currentUserProfile}
                onOpenSimulator={onOpenSimulator}
                onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                onOpenProjectDetail={(p) => setSelectedProjectForDetail(p)}
                onDownloadSpecPdf={handleDownloadSpecSheet}
                onSelectForComparison={handleSelectForComparison}
              />
            </motion.div>
          )}

          {/* TAB 3: PROJECT COMPARISON */}
          {activeTab === 'comparison' && (
            <motion.div
              key="tab-comparison"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectComparison
                projects={projects}
                initialProjectAId={comparisonProjectAId}
                initialProjectBId={comparisonProjectBId}
                onOpenSimulator={onOpenSimulator}
                onOpenQuote={onOpenQuote}
              />
            </motion.div>
          )}

          {/* TAB 4: BIM & CAD DOWNLOADS */}
          {activeTab === 'bim_cad' && (
            <motion.div
              key="tab-bim_cad"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <BimCadView onDownloadAsset={handleDownloadAsset} />
            </motion.div>
          )}

          {/* TAB 5: PHYSICAL SAMPLES KIT */}
          {activeTab === 'samples' && (
            <motion.div
              key="tab-samples"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <SamplesView user={currentUserProfile} />
            </motion.div>
          )}

          {/* TAB 6: SPECIFIER & LEED/WELL */}
          {activeTab === 'calculator' && (
            <motion.div
              key="tab-calculator"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpecifierView
                onOpenQuote={onOpenQuote}
                onToggleLeedParam={handleToggleLeedParam}
                leedWaterEfficiency={leedWaterEfficiency}
                setLeedWaterEfficiency={setLeedWaterEfficiency}
                leedAirQuality={leedAirQuality}
                setLeedAirQuality={setLeedAirQuality}
                leedAcousticPanel={leedAcousticPanel}
                setLeedAcousticPanel={setLeedAcousticPanel}
                wellNatureAccess={wellNatureAccess}
                setWellNatureAccess={setWellNatureAccess}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProjectForDetail}
        user={currentUserProfile}
        isOpen={Boolean(selectedProjectForDetail)}
        onClose={() => setSelectedProjectForDetail(null)}
        onDownloadSpecPdf={handleDownloadSpecSheet}
        onCompareWithAnother={(projId) => {
          setSelectedProjectForDetail(null);
          handleSelectForComparison(projId);
        }}
      />

      {/* New Project Registration Modal */}
      <NewProjectModal
        user={currentUserProfile}
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddNewProject}
      />

      {/* Notification Center Popover Drawer */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
        onActionClick={handleActionClick}
        onTriggerSimulation={handleTriggerSimulation}
      />

      {/* Botanical Species Detail Modal */}
      {selectedSpeciesDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border border-emerald-950/20">
            <button
              onClick={() => setSelectedSpeciesDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-[#062316] text-[10px] font-extrabold uppercase">
                Ficha Técnica Homologada IPT
              </span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-gray-900">
              {selectedSpeciesDetail.name}
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              {selectedSpeciesDetail.desc}
            </p>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-[#062316]">
                <span>Desempenho Acústico:</span>
                <span className="text-emerald-800">{selectedSpeciesDetail.nrc}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-[#062316]">
                <span>Impacto LEED / WELL:</span>
                <span className="text-emerald-800">{selectedSpeciesDetail.leed}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSpeciesDetail(null)}
              className="w-full py-3 bg-[#062316] text-[#86efac] font-bold rounded-xl text-xs hover:bg-[#15803d] transition-colors cursor-pointer"
            >
              Fechar Detalhe
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
