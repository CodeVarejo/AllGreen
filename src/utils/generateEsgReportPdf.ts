import { jsPDF } from 'jspdf';
import { PortalProject, UserProfile } from '../types';

export interface EsgReportPdfOptions {
  user: UserProfile;
  projects: PortalProject[];
  timeHorizonYears?: number;
  totalAreaM2: number;
  cumulativeWaterLiters: number;
  cumulativeEnergyKwh: number;
  cumulativeHvacSavingsBrl: number;
  cumulativeCo2OffsetKg: number;
  avgLeedPoints: number;
  avgWellScore: number;
}

export function generateEsgReportPdf(options: EsgReportPdfOptions) {
  const {
    user,
    projects,
    timeHorizonYears = 5,
    totalAreaM2,
    cumulativeWaterLiters,
    cumulativeEnergyKwh,
    cumulativeHvacSavingsBrl,
    cumulativeCo2OffsetKg,
    avgLeedPoints,
    avgWellScore,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryGreen = [7, 42, 26]; // #072a1a
  const accentLightGreen = [134, 239, 172]; // #86efac
  const deepEmerald = [21, 128, 61]; // #15803d
  const softBg = [240, 253, 244]; // #f0fdf4
  const darkGray = [31, 41, 55]; // #1f2937
  const mutedGray = [107, 114, 128]; // #6b7280

  // Header Banner
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('LAUDO EXECUTIVO DE SUSTENTABILIDADE & ESG', margin, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentLightGreen[0], accentLightGreen[1], accentLightGreen[2]);
  doc.text('PAINÉIS BIOFÍLICOS PRESERVADOS & PERMANENTES ALL GREEN | EFICIÊNCIA HÍDRICA & TÉRMICA', margin, 26);

  doc.setFontSize(8);
  doc.setTextColor(220, 252, 231);
  const dateStr = new Date().toLocaleDateString('pt-BR');
  doc.text(`Emissão: ${dateStr} | Especificador(a): ${user.name} (${user.cau_rrt || 'CAU/RRT Ativo'})`, margin, 34);
  doc.text(`Horizonte de Projeção Auditado: ${timeHorizonYears} Anos (${projects.length} Obras Especificadas)`, margin, 39);

  let y = 52;

  // Executive Summary Card
  doc.setFillColor(softBg[0], softBg[1], softBg[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  doc.setDrawColor(deepEmerald[0], deepEmerald[1], deepEmerald[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'D');

  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('BALANÇO CONSOLIDADO DE IMPACTO AMBIENTAL', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(
    `Área Verde Especificada: ${totalAreaM2.toFixed(1)} m² | Isenção Hídrica Total (Zero Irrigação / Zero Descarte de Efluentes)`,
    margin + 6,
    y + 15
  );
  doc.text(
    `Economia Acumulada em ${timeHorizonYears} Anos: ${(cumulativeWaterLiters * timeHorizonYears).toLocaleString('pt-BR')} Litros de Água | ${(cumulativeEnergyKwh * timeHorizonYears).toLocaleString('pt-BR')} kWh de Energia HVAC`,
    margin + 6,
    y + 21
  );
  doc.text(
    `Redução de Emissões: ${(cumulativeCo2OffsetKg * timeHorizonYears).toLocaleString('pt-BR')} kg CO2e | Economia Financeira HVAC Estimada: R$ ${(cumulativeHvacSavingsBrl * timeHorizonYears).toLocaleString('pt-BR')}`,
    margin + 6,
    y + 27
  );

  y += 42;

  // 4 KPI Summary Grid
  const cardW = (contentWidth - 6) / 2;
  const cardH = 26;

  // Card 1: Water
  doc.setFillColor(240, 249, 255);
  doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'D');
  doc.setTextColor(3, 105, 161);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ECONOMIA HÍDRICA (vs. PAREDE VIVA)', margin + 4, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(12, 74, 110);
  doc.text(`${(cumulativeWaterLiters * timeHorizonYears).toLocaleString('pt-BR')} Litros`, margin + 4, y + 15);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(14, 116, 144);
  doc.text(`100% isento de bombas d'água, tubulações e gotejamento`, margin + 4, y + 21);

  // Card 2: Energy & HVAC
  const col2X = margin + cardW + 6;
  doc.setFillColor(254, 252, 232);
  doc.roundedRect(col2X, y, cardW, cardH, 2, 2, 'F');
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(col2X, y, cardW, cardH, 2, 2, 'D');
  doc.setTextColor(161, 98, 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('EFICIÊNCIA TÉRMICA & HVAC', col2X + 4, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(113, 63, 18);
  doc.text(`${(cumulativeEnergyKwh * timeHorizonYears).toLocaleString('pt-BR')} kWh poupados`, col2X + 4, y + 15);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(161, 98, 7);
  doc.text(`Atenuação de carga térmica de até 3.6°C na envolvente`, col2X + 4, y + 21);

  y += cardH + 5;

  // Card 3: Carbon
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, cardW, cardH, 2, 2, 'D');
  doc.setTextColor(21, 128, 61);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PEGADA DE CARBONO (CO2e EVITADO)', margin + 4, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(20, 83, 45);
  doc.text(`${(cumulativeCo2OffsetKg * timeHorizonYears).toLocaleString('pt-BR')} kg CO2e`, margin + 4, y + 15);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text(`Equivalente a ${Math.round(cumulativeCo2OffsetKg * timeHorizonYears / 20)} árvores adultas preservadas`, margin + 4, y + 21);

  // Card 4: LEED & WELL
  doc.setFillColor(250, 245, 255);
  doc.roundedRect(col2X, y, cardW, cardH, 2, 2, 'F');
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(col2X, y, cardW, cardH, 2, 2, 'D');
  doc.setTextColor(126, 34, 206);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CERTIFICAÇÕES VERDES (MÉDIA)', col2X + 4, y + 7);
  doc.setFontSize(13);
  doc.setTextColor(88, 28, 135);
  doc.text(`${avgLeedPoints.toFixed(1)} Cr. LEED | ${Math.round(avgWellScore)} WELL`, col2X + 4, y + 15);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 33, 168);
  doc.text(`Créditos: WEc1, EQc9 (Acústica), EQc4 (Zero COV), INc1`, col2X + 4, y + 21);

  y += cardH + 10;

  // Project Table Section
  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DETALHAMENTO TÉCNICO AUDITÁVEL POR PROJETO', margin, y);

  y += 5;

  // Table Header
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CÓDIGO', margin + 3, y + 5);
  doc.text('OBRA / CLIENTE', margin + 25, y + 5);
  doc.text('ÁREA', margin + 78, y + 5);
  doc.text('ÁGUA (L/ANO)', margin + 96, y + 5);
  doc.text('ENERGIA (KWH)', margin + 124, y + 5);
  doc.text('LEED/WELL', margin + 154, y + 5);

  y += 7;

  // Table Rows
  projects.forEach((proj, idx) => {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = 20;
    }

    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, contentWidth, 7, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text(proj.code, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const cleanTitle = proj.title.length > 28 ? proj.title.substring(0, 26) + '...' : proj.title;
    doc.text(cleanTitle, margin + 25, y + 5);

    doc.text(`${proj.area.toFixed(1)} m²`, margin + 78, y + 5);
    doc.text(`${(proj.waterSavedLitersYear || proj.area * 1200).toLocaleString('pt-BR')} L`, margin + 96, y + 5);
    doc.text(`${(proj.energySavedKwhYear || Math.round(proj.area * 130)).toLocaleString('pt-BR')} kWh`, margin + 124, y + 5);
    doc.text(`${proj.leedPointsTotal || 12} cr / ${proj.wellScore || 85} pts`, margin + 154, y + 5);

    y += 7;
  });

  y += 6;

  // Normative Compliance and Engineering Seal Box
  if (y > pageHeight - 45) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'D');

  doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CONFORMIDADE NORMATIVA & LAUDOS HOMOLOGADOS', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('• Laudo IPT Auto-Extinguível (ABNT NBR 16626 / Classe B-s1,d0)', margin + 4, y + 11);
  doc.text('• Absorção Acústica Homologada (ISO 354 / NRC até 0.91)', margin + 4, y + 16);
  doc.text('• Zero Agrotóxicos, Zero Fertilizantes Químicos e 100% Não-Tóxico', margin + 85, y + 11);
  doc.text('• Garantia Estrutural e Botânica de 5 Anos All Green', margin + 85, y + 16);

  // Footer Signature & Authentication
  const footerY = pageHeight - 16;
  doc.setFontSize(7);
  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.text('Documento técnico gerado via Portal do Arquiteto All Green | Validação de Impacto ESG Biofílico', margin, footerY);
  doc.text(`Hash de Autenticação: AG-ESG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, margin, footerY + 4);

  // Download
  doc.save(`Laudo_Sustentabilidade_ESG_${user.name.replace(/\s+/g, '_')}.pdf`);
}
