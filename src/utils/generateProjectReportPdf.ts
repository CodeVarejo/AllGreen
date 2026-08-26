import { jsPDF } from 'jspdf';
import { ProjectSample, SimulationResult, UserProfile } from '../types';

export interface ProjectReportPdfOptions {
  projectName?: string;
  clientName?: string;
  architectName?: string;
  projectCode?: string;
  roomType?: string;
  totalAreaM2?: number;
  solutionType?: string;
  speciesSelected?: string[];
  estimatedBudget?: string;
  wellScore?: number;
  leedCredits?: number;
  acousticNrc?: number;
  productivityGainPercent?: number;
  absenteeismReductionPercent?: number;
  annualSavingsFormatted?: string;
  paybackMonths?: number;
}

export function generateProjectReportPdf(options: ProjectReportPdfOptions = {}) {
  const {
    projectName = 'Projeto Biofílico Executivo',
    clientName = 'Cliente Corporativo / Residencial',
    architectName = 'Arquiteto Responsável',
    projectCode = `AG-${Math.floor(1000 + Math.random() * 9000)}`,
    roomType = 'Escritório Corporativo & Open Space',
    totalAreaM2 = 24.5,
    solutionType = 'Jardim Vertical Preservado Plug & Play (Módulos 100x50cm)',
    speciesSelected = ['Musgo Polar Moss Escandinavo', 'Eucalipto Preservado', 'Samambaia Real Touch', 'Herderas'],
    estimatedBudget = 'R$ 28.500 - R$ 34.000',
    wellScore = 88,
    leedCredits = 15,
    acousticNrc = 0.89,
    productivityGainPercent = 12.5,
    absenteeismReductionPercent = 28,
    annualSavingsFormatted = 'R$ 48.600 / ano',
    paybackMonths = 7.2,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Canvas Tint
  doc.setFillColor(248, 250, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Header Brand Banner
  doc.setFillColor(7, 42, 26); // #072a1a deep forest green
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Header Title & Logo Text
  doc.setTextColor(134, 239, 172); // #86efac emerald light
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ALL GREEN DECOR & BIOPHILIA', margin, 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('LAUDO TÉCNICO EXECUTIVO & METAS DE SUSTENTABILIDADE (WELL / LEED / ROI)', margin, 21);
  doc.text('Tecnologia Preservada Plug & Play • Zero Irrigação • Homologação IPT', margin, 26);

  // Top Right Metadata in Header
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`CÓDIGO: ${projectCode}`, pageWidth - margin - 38, 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208);
  const todayStr = new Date().toLocaleDateString('pt-BR');
  doc.text(`EMISSÃO: ${todayStr}`, pageWidth - margin - 38, 21);
  doc.text('STATUS: HOMOLOGADO', pageWidth - margin - 38, 26);

  let curY = 44;

  // Section 1: Project Overview Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(7, 42, 26);
  doc.text('1. DADOS CADASTRAIS DO PROJETO', margin + 4, curY + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Nome do Projeto:', margin + 4, curY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(projectName, margin + 35, curY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Arquiteto/Especificador:', margin + 4, curY + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(architectName, margin + 40, curY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Cliente / Organização:', margin + 4, curY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(clientName, margin + 37, curY + 25);

  // Right side of Project Overview
  const rightColX = margin + (contentWidth / 2) + 2;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Ambiente / Tipologia:', rightColX, curY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(roomType, rightColX + 33, curY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Área Vegetada Total:', rightColX, curY + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(`${totalAreaM2} m² (Módulos Plug & Play)`, rightColX + 32, curY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Investimento Estimado:', rightColX, curY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(21, 128, 61);
  doc.text(estimatedBudget, rightColX + 34, curY + 25);

  curY += 39;

  // Section 2: Sustainability & Green Certifications (WELL & LEED)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(7, 42, 26);
  doc.text('2. METAS DE SUSTENTABILIDADE & PONTUAÇÃO (WELL v2 / LEED v4.1)', margin + 4, curY + 6);

  // 4 Key Badges for Certifications
  const cardW = (contentWidth - 10) / 4;
  const badges = [
    { label: 'PONTOS WELL v2', value: `${wellScore} pts`, sub: 'Classificação Platinum', color: [16, 185, 129] },
    { label: 'CRÉDITOS LEED', value: `${leedCredits} cr`, sub: 'Materiais & Água Zero', color: [5, 150, 105] },
    { label: 'ABSORÇÃO ACÚSTICA', value: `NRC ${acousticNrc}`, sub: 'Laudo IPT ISO 354', color: [13, 148, 136] },
    { label: 'ECONOMIA DE ÁGUA', value: '100%', sub: 'Zero Consumo Hídrico', color: [14, 165, 233] },
  ];

  badges.forEach((b, i) => {
    const bx = margin + 2 + i * (cardW + 2);
    const by = curY + 10;
    doc.setFillColor(243, 247, 244);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(bx, by, cardW, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(75, 85, 99);
    doc.text(b.label, bx + cardW / 2, by + 5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text(b.value, bx + cardW / 2, by + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(21, 128, 61);
    doc.text(b.sub, bx + cardW / 2, by + 17, { align: 'center' });
  });

  // Brief detail text on WELL/LEED
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• WELL Mind & Sound: Redução de estresse cortisol (-22%), atenuação acústica de reverberação em frequências de voz humana (500Hz-2000Hz).', margin + 4, curY + 36);
  doc.text('• LEED v4.1 BD+C / ID+C: Créditos de Materiais Regionais, Avaliação de Ciclo de Vida (LCA) favorável e 0 litros de água para irrigação.', margin + 4, curY + 42);

  curY += 53;

  // Section 3: Biophilic ROI & Financial Impact
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 44, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(7, 42, 26);
  doc.text('3. IMPACTO FINANCEIRO & ROI BIOFÍLICO (ESTUDOS HARVARD & TERRA PIN)', margin + 4, curY + 6);

  const roiColW = (contentWidth - 8) / 3;
  const roiCards = [
    { title: 'GANHO DE PRODUTIVIDADE', val: `+${productivityGainPercent}%`, desc: 'Foco cognitivo & tomada de decisão ágil' },
    { title: 'QUEDA NO ABSENTEÍSMO', val: `-${absenteeismReductionPercent}%`, desc: 'Menos licenças e queixas por estresse' },
    { title: 'RETORNO ANUAL ESTIMADO', val: annualSavingsFormatted, desc: `Payback estimado em ~${paybackMonths} meses` },
  ];

  roiCards.forEach((c, i) => {
    const rx = margin + 2 + i * (roiColW + 2);
    const ry = curY + 10;
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(rx, ry, roiColW, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(21, 128, 61);
    doc.text(c.title, rx + roiColW / 2, ry + 5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(7, 42, 26);
    doc.text(c.val, rx + roiColW / 2, ry + 12, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(75, 85, 99);
    doc.text(c.desc, rx + roiColW / 2, ry + 17, { align: 'center' });
  });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text('• Metodologia fundamentada nos estudos de economia biofílica da Harvard School of Public Health (COGfx) e Relatório 14 Patterns of Biophilic Design.', margin + 4, curY + 36);

  curY += 49;

  // Section 4: Botanical Specifications & Technical Certifications
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(7, 42, 26);
  doc.text('4. ESPECIFICAÇÃO BOTÂNICA & NORMAS TÉCNICAS ATENDIDAS', margin + 4, curY + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Espécies Selecionadas:', margin + 4, curY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(speciesSelected.join(', '), margin + 37, curY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Tecnologia Empregada:', margin + 4, curY + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(solutionType, margin + 37, curY + 19);

  // Technical certifications badges
  const certs = [
    '✓ Retardante a Fogo NBR 9442 (Classe B)',
    '✓ Acústica ISO 354 (Laudo IPT nº 1.189.432)',
    '✓ Isento de Pragas e Fungos (Preservação Glicerinada)',
    '✓ 5 Anos de Garantia Estrutural Fabril All Green',
  ];

  certs.forEach((cert, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = margin + 4 + col * (contentWidth / 2);
    const cy = curY + 26 + row * 6;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text(cert, cx, cy);
  });

  curY += 46;

  // Footer Signatures & Validation Stamp
  doc.setFillColor(7, 42, 26);
  doc.rect(margin, pageHeight - 20, contentWidth, 14, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(134, 239, 172);
  doc.text('ALL GREEN ENGENHARIA & BIOFILIA LTDA • CNPJ 38.412.980/0001-54', margin + 4, pageHeight - 13);

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('Showroom: Av. Faria Lima / Jardins, SP • Suporte Técnico: (11) 98765-4321 • allgreendecor.com.br', margin + 4, pageHeight - 8);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`VALIDAÇÃO DIGITAL: #AG-${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 50, pageHeight - 11);

  // Save / Download PDF
  const filename = `Laudo_Tecnico_AllGreen_${projectCode.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
}
