import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Download,
  Award,
  Layers,
  Leaf,
  Droplets,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Building,
  MapPin,
  Flame,
  Clock,
  Sparkles,
  FileText,
  DollarSign,
  SunMedium,
  Feather,
  Wrench,
  ChevronRight,
  Plus
} from 'lucide-react';
import { PortalProject } from '../types';
import { jsPDF } from 'jspdf';

interface ProjectComparisonProps {
  projects: PortalProject[];
  initialProjectAId?: string;
  initialProjectBId?: string;
  onOpenSimulator: () => void;
  onOpenQuote: (context: string) => void;
}

export const ProjectComparison: React.FC<ProjectComparisonProps> = ({
  projects,
  initialProjectAId,
  initialProjectBId,
  onOpenSimulator,
  onOpenQuote,
}) => {
  // Default to first two projects if available
  const defaultA = initialProjectAId || projects[0]?.id || '';
  const defaultB = initialProjectBId || projects[1]?.id || projects[0]?.id || '';

  const [projectAId, setProjectAId] = useState<string>(defaultA);
  const [projectBId, setProjectBId] = useState<string>(defaultB);
  const [activeTab, setActiveTab] = useState<'all' | 'specs' | 'sustainability' | 'botanical'>('all');

  const projectA = projects.find(p => p.id === projectAId) || projects[0];
  const projectB = projects.find(p => p.id === projectBId) || projects[1] || projects[0];

  const handleSwapProjects = () => {
    const temp = projectAId;
    setProjectAId(projectBId);
    setProjectBId(temp);
  };

  const handleExportComparisonPdf = () => {
    if (!projectA || !projectB) return;

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ALL GREEN DECOR & BIOPHILIA', 20, 20);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório Comparativo Técnico & Métricas de Sustentabilidade (LEED/WELL)', 20, 28);
    
    doc.line(20, 32, 190, 32);

    // Columns setup
    doc.setFont('helvetica', 'bold');
    doc.text(`Projeto A: ${projectA.code} - ${projectA.title}`, 20, 42);
    doc.text(`Projeto B: ${projectB.code} - ${projectB.title}`, 110, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Project Info
    doc.text(`Cliente: ${projectA.client}`, 20, 50);
    doc.text(`Cliente: ${projectB.client}`, 110, 50);

    doc.text(`Tipologia: ${projectA.style}`, 20, 56);
    doc.text(`Tipologia: ${projectB.style}`, 110, 56);

    doc.text(`Área Projetada: ${projectA.area} m²`, 20, 62);
    doc.text(`Área Projetada: ${projectB.area} m²`, 110, 62);

    doc.text(`Investimento Est.: R$ ${projectA.estimatedTotal.toLocaleString('pt-BR')}`, 20, 68);
    doc.text(`Investimento Est.: R$ ${projectB.estimatedTotal.toLocaleString('pt-BR')}`, 110, 68);

    doc.line(20, 74, 190, 74);

    // Sustainability Metrics
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Métricas de Sustentabilidade & Certificações:', 20, 84);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`• Pontos LEED v4.1: ${projectA.leedPointsTotal || 12} créditos`, 20, 92);
    doc.text(`• Pontos LEED v4.1: ${projectB.leedPointsTotal || 10} créditos`, 110, 92);

    doc.text(`• WELL v2 Score: ${projectA.wellScore || 85} pontos`, 20, 98);
    doc.text(`• WELL v2 Score: ${projectB.wellScore || 75} pontos`, 110, 98);

    doc.text(`• Economia Hídrica: ${(projectA.waterSavedLitersYear || 30000).toLocaleString('pt-BR')} L/ano`, 20, 104);
    doc.text(`• Economia Hídrica: ${(projectB.waterSavedLitersYear || 20000).toLocaleString('pt-BR')} L/ano`, 110, 104);

    doc.text(`• Compensação CO2: ${projectA.co2OffsetKgYear || 120} kg/ano`, 20, 110);
    doc.text(`• Compensação CO2: ${projectB.co2OffsetKgYear || 90} kg/ano`, 110, 110);

    doc.line(20, 116, 190, 116);

    // Technical Specs
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Especificações Técnicas Construtivas:', 20, 126);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`• Absorção Acústica: NRC ${projectA.acousticNrc || 0.85}`, 20, 134);
    doc.text(`• Absorção Acústica: NRC ${projectB.acousticNrc || 0.70}`, 110, 134);

    doc.text(`• Peso Estrutural: ${projectA.weightPerM2 || 12} kg/m²`, 20, 140);
    doc.text(`• Peso Estrutural: ${projectB.weightPerM2 || 10} kg/m²`, 110, 140);

    doc.text(`• Resistência UV: ${projectA.uvProtectionHours || 2500} horas`, 20, 146);
    doc.text(`• Resistência UV: ${projectB.uvProtectionHours || 3000} horas`, 110, 146);

    doc.text(`• Fogo: ${projectA.fireRating || 'Classe B-s1,d0'}`, 20, 152);
    doc.text(`• Fogo: ${projectB.fireRating || 'Classe B-s1,d0'}`, 110, 152);

    doc.text(`• Estrutura: ${projectA.structureType || 'Modular Plug & Play'}`, 20, 158);
    doc.text(`• Estrutura: ${projectB.structureType || 'Grelha Metálica'}`, 110, 158);

    doc.line(20, 168, 190, 168);

    doc.setFont('helvetica', 'italic');
    doc.text(`Emissão gerada em ${new Date().toLocaleDateString('pt-BR')} via Portal do Arquiteto All Green.`, 20, 178);
    doc.text('Suporte de Engenharia & Compatibilização BIM: contato@allgreendecor.com.br', 20, 184);

    doc.save(`Comparativo_${projectA.code}_vs_${projectB.code}_AllGreen.pdf`);
  };

  if (!projectA || !projectB) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
        <ArrowLeftRight className="w-10 h-10 text-[#15803d] mx-auto" />
        <h3 className="font-serif font-bold text-lg text-gray-950">
          Você precisa de pelo menos 2 projetos para realizar a comparação
        </h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto">
          Crie novos estudos utilizando o simulador com inteligência artificial para poder comparar soluções lado a lado.
        </p>
        <button
          onClick={onOpenSimulator}
          className="px-5 py-2.5 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full text-xs transition-all cursor-pointer shadow-sm active:scale-95"
        >
          Criar Nova Simulação
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#072a1a] text-[10px] font-extrabold uppercase tracking-wider border border-emerald-300">
              Análise Comparativa
            </span>
            <span className="text-xs text-gray-500 font-semibold">• Lado a Lado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-950 mt-1 tracking-tight">
            Comparativo Técnico & Sustentabilidade
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Compare especificações construtivas, laudos acústicos e pontuação LEED/WELL entre duas soluções.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSwapProjects}
            className="px-4 py-2 bg-white hover:bg-emerald-50 text-gray-800 hover:text-[#072a1a] border border-gray-200 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Inverter colunas de comparação"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#15803d]" />
            <span>Inverter Lados</span>
          </button>

          <button
            onClick={handleExportComparisonPdf}
            className="px-5 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold rounded-full text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Project Selector Dual Cards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Project A Card Selector */}
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-600/40 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-[#072a1a] text-[#86efac] text-[10px] font-bold">
              PROJETO A (Referência)
            </span>
            <select
              value={projectAId}
              onChange={(e) => setProjectAId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#072a1a] cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === projectBId}>
                  {p.code} - {p.title} ({p.style})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            <img
              src={projectA.thumbnail}
              alt={projectA.title}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-base text-gray-950 truncate">
                {projectA.title}
              </h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#15803d]" />
                <span>{projectA.client} • {projectA.location}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#072a1a] text-[10px] font-bold border border-emerald-200">
                  {projectA.style}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {projectA.area} m²
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project B Card Selector */}
        <div className="bg-white p-5 rounded-3xl border-2 border-teal-600/40 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-900 text-teal-200 text-[10px] font-bold">
              PROJETO B (Comparado)
            </span>
            <select
              value={projectBId}
              onChange={(e) => setProjectBId(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#072a1a] cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === projectAId}>
                  {p.code} - {p.title} ({p.style})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            <img
              src={projectB.thumbnail}
              alt={projectB.title}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-base text-gray-950 truncate">
                {projectB.title}
              </h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-700" />
                <span>{projectB.client} • {projectB.location}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 text-[10px] font-bold border border-teal-200">
                  {projectB.style}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {projectB.area} m²
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs for Comparison Modules */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
              : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
          }`}
        >
          Visão Geral Completa
        </button>
        <button
          onClick={() => setActiveTab('sustainability')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sustainability'
              ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
              : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
          }`}
        >
          Sustentabilidade (LEED & WELL)
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'specs'
              ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
              : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
          }`}
        >
          Engenharia & Especificações
        </button>
        <button
          onClick={() => setActiveTab('botanical')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'botanical'
              ? 'bg-[#072a1a] text-[#86efac] shadow-sm'
              : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
          }`}
        >
          Curadoria Botânica & Manutenção
        </button>
      </div>

      {/* SECTION 1: SUSTAINABILITY & ENVIRONMENTAL SCORE METRICS */}
      {(activeTab === 'all' || activeTab === 'sustainability') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-950">
                Certificações LEED v4.1 & WELL Standard v2
              </h3>
              <p className="text-xs text-gray-600">
                Pontuação auditável em critérios de biofilia, conforto acústico, isenção hídrica e emissão zero de COV.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column A Sustainability */}
            <div className="space-y-4 bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-[#072a1a]">{projectA.code} • {projectA.title}</span>
                <span className="text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  LEED: {projectA.leedPointsTotal || 14} Créditos
                </span>
              </div>

              {/* Progress bar LEED */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>Pontuação LEED v4.1</span>
                  <span>{projectA.leedPointsTotal || 14} / 18 pts aplicáveis</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#15803d] rounded-full transition-all"
                    style={{ width: `${((projectA.leedPointsTotal || 14) / 18) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress bar WELL */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>Score WELL v2 (Mind & Comfort)</span>
                  <span>{projectA.wellScore || 88} / 100 pts</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${projectA.wellScore || 88}%` }}
                  />
                </div>
              </div>

              {/* Sustainability Highlights */}
              <div className="space-y-2 pt-2 border-t border-emerald-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    Economia de Água Anual:
                  </span>
                  <span className="font-bold text-emerald-950">
                    {(projectA.waterSavedLitersYear || 39000).toLocaleString('pt-BR')} Litros/ano
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Compensação Estimada de CO2:
                  </span>
                  <span className="font-bold text-gray-950">
                    {projectA.co2OffsetKgYear || 185} kg/ano
                  </span>
                </div>
              </div>

              {/* Credits List */}
              {projectA.leedCreditsList && (
                <div className="pt-2 border-t border-emerald-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-gray-600 uppercase block tracking-wider">Créditos Homologados:</span>
                  <div className="flex flex-wrap gap-1">
                    {projectA.leedCreditsList.map((cr, i) => (
                      <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-gray-800 font-semibold shadow-2xs">
                        {cr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column B Sustainability */}
            <div className="space-y-4 bg-teal-50 p-5 rounded-2xl border border-teal-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-teal-950">{projectB.code} • {projectB.title}</span>
                <span className="text-[11px] font-bold text-teal-950 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300">
                  LEED: {projectB.leedPointsTotal || 9} Créditos
                </span>
              </div>

              {/* Progress bar LEED */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>Pontuação LEED v4.1</span>
                  <span>{projectB.leedPointsTotal || 9} / 18 pts aplicáveis</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-700 rounded-full transition-all"
                    style={{ width: `${((projectB.leedPointsTotal || 9) / 18) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress bar WELL */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-1">
                  <span>Score WELL v2 (Mind & Comfort)</span>
                  <span>{projectB.wellScore || 72} / 100 pts</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${projectB.wellScore || 72}%` }}
                  />
                </div>
              </div>

              {/* Sustainability Highlights */}
              <div className="space-y-2 pt-2 border-t border-teal-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    Economia de Água Anual:
                  </span>
                  <span className="font-bold text-teal-950">
                    {(projectB.waterSavedLitersYear || 16800).toLocaleString('pt-BR')} Litros/ano
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Compensação Estimada de CO2:
                  </span>
                  <span className="font-bold text-gray-950">
                    {projectB.co2OffsetKgYear || 78} kg/ano
                  </span>
                </div>
              </div>

              {/* Credits List */}
              {projectB.leedCreditsList && (
                <div className="pt-2 border-t border-teal-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-gray-600 uppercase block tracking-wider">Créditos Homologados:</span>
                  <div className="flex flex-wrap gap-1">
                    {projectB.leedCreditsList.map((cr, i) => (
                      <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-teal-200 text-gray-800 font-semibold shadow-2xs">
                        {cr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SECTION 2: TECHNICAL SPECIFICATIONS & ENGINEERING */}
      {(activeTab === 'all' || activeTab === 'specs') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-950">
                Engenharia, Ancoragem & Performance Acústica
              </h3>
              <p className="text-xs text-gray-600">
                Parâmetros físicos, laudos de ensaio de laboratório (IPT) e ancoragem em obra.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/3">Parâmetro Técnico</th>
                  <th className="py-3 px-4 w-1/3 text-[#072a1a]">{projectA.code} ({projectA.style})</th>
                  <th className="py-3 px-4 w-1/3 text-teal-950">{projectB.code} ({projectB.style})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                
                {/* Absorção Acústica NRC */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Absorção Acústica (NRC)</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#072a1a] text-sm">NRC {projectA.acousticNrc || 0.88}</span>
                      {(projectA.acousticNrc || 0) >= (projectB.acousticNrc || 0) && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          + Alto Desempenho
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-600 block mt-0.5">{projectA.acousticDamping}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-teal-950 text-sm">NRC {projectB.acousticNrc || 0.65}</span>
                      {(projectB.acousticNrc || 0) > (projectA.acousticNrc || 0) && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-teal-900 border border-teal-200">
                          + Alto Desempenho
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-600 block mt-0.5">{projectB.acousticDamping}</span>
                  </td>
                </tr>

                {/* Estrutura & Ancoragem */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sistema de Estrutura & Fixação</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {projectA.structureType || 'Painel Modular Plug & Play'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    {projectB.structureType || 'Grelha Metálica Galvanizada'}
                  </td>
                </tr>

                {/* Peso Estrutural */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-blue-600" />
                    <span>Carga Estrutural (Peso por m²)</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-950">
                    {projectA.weightPerM2 || 12.5} kg/m²
                    <span className="text-[10px] text-gray-500 font-normal block">Total: ~{((projectA.weightPerM2 || 12.5) * projectA.area).toFixed(0)} kg</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-950">
                    {projectB.weightPerM2 || 9.8} kg/m²
                    <span className="text-[10px] text-gray-500 font-normal block">Total: ~{((projectB.weightPerM2 || 9.8) * projectB.area).toFixed(0)} kg</span>
                  </td>
                </tr>

                {/* Resistência UV & Intemperismo */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                    <span>Resistência Solar UV (ASTM G154)</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-900">
                    <span className="font-bold">{projectA.uvProtectionHours || 2500} horas certificadas</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-900">
                    <span className="font-bold">{projectB.uvProtectionHours || 3500} horas certificadas</span>
                  </td>
                </tr>

                {/* Classificação ao Fogo */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>Comportamento ao Fogo (Laudo IPT)</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {projectA.fireRating || 'Classe B-s1,d0'}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">
                    {projectB.fireRating || 'Classe B-s1,d0'}
                  </td>
                </tr>

                {/* Garantia de Fábrica */}
                <tr className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#15803d]" />
                    <span>Garantia de Fábrica All Green</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#15803d]">
                    {projectA.warrantyYears || 5} Anos Ativos
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#15803d]">
                    {projectB.warrantyYears || 5} Anos Ativos
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: BOTANICAL CURATION & MAINTENANCE */}
      {(activeTab === 'all' || activeTab === 'botanical') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#072a1a] flex items-center justify-center font-bold">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-950">
                Curadoria de Espécies & Protocolo de Manutenção
              </h3>
              <p className="text-xs text-gray-600">
                Mix botânico especificado para cada ambiente e rotina de conservação.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Project A Botanical Mix */}
            <div className="space-y-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h4 className="text-xs font-extrabold text-[#072a1a] uppercase tracking-wider">
                Espécies Selecionadas • {projectA.code}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(projectA.speciesUsed || ['Musgo Moss', 'Costela Preservada', 'Samambaia']).map((sp, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white rounded-lg text-xs font-semibold text-gray-800 border border-emerald-200 shadow-2xs">
                    🌿 {sp}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-emerald-200 text-xs">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Protocolo de Manutenção:</span>
                <p className="text-gray-700 mt-0.5 font-medium">{projectA.maintenanceFreq || 'Zero rega / Limpeza semestral com ar'}</p>
              </div>
            </div>

            {/* Project B Botanical Mix */}
            <div className="space-y-3 p-5 rounded-2xl bg-teal-50 border border-teal-200">
              <h4 className="text-xs font-extrabold text-teal-950 uppercase tracking-wider">
                Espécies Selecionadas • {projectB.code}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(projectB.speciesUsed || ['Samambaia Chorona Anti-UV', 'Jiboia Real Touch']).map((sp, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white rounded-lg text-xs font-semibold text-gray-800 border border-teal-200 shadow-2xs">
                    🌱 {sp}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-teal-200 text-xs">
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Protocolo de Manutenção:</span>
                <p className="text-gray-700 mt-0.5 font-medium">{projectB.maintenanceFreq || 'Lavagem leve com spray de água anual'}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 4: FINANCIAL & PROPOSAL VIABILITY */}
      <div className="bg-[#072a1a] text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 border border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-white">
              Resumo Financeiro & Viabilidade de Implementação
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Comparativo de investimento total estimado com comissionamento e desconto parceiro.
            </p>
          </div>

          <button
            onClick={() => onOpenQuote(`Comparativo de Projetos: ${projectA.code} (${projectA.title} - ${projectA.area}m²) vs ${projectB.code} (${projectB.title} - ${projectB.area}m²)`)}
            className="px-5 py-2.5 bg-[#86efac] text-[#072a1a] font-bold rounded-full text-xs hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm active:scale-95"
          >
            <span>Emitir Proposta Comercial das Duas Opções</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800 space-y-2">
            <span className="text-xs font-bold text-emerald-300 uppercase">{projectA.code} • {projectA.title}</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#86efac]">
              R$ {projectA.estimatedTotal.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-emerald-200 flex justify-between pt-1 border-t border-emerald-900">
              <span>Investimento por m²:</span>
              <span className="font-bold">R$ {(projectA.estimatedTotal / projectA.area).toFixed(0)} / m²</span>
            </div>
          </div>

          <div className="bg-emerald-950/60 p-5 rounded-2xl border border-emerald-800 space-y-2">
            <span className="text-xs font-bold text-emerald-300 uppercase">{projectB.code} • {projectB.title}</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#86efac]">
              R$ {projectB.estimatedTotal.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-emerald-200 flex justify-between pt-1 border-t border-emerald-900">
              <span>Investimento por m²:</span>
              <span className="font-bold">R$ {(projectB.estimatedTotal / projectB.area).toFixed(0)} / m²</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
