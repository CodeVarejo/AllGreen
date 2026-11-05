import { jsPDF } from 'jspdf';
import { VerticalTechnology } from '../data/technologyData';
import { ComparisonRow } from '../types';

export interface ComparisonMatrixPdfOptions {
  viewMode: 'side-by-side' | 'full-table';
  techA?: VerticalTechnology;
  techB?: VerticalTechnology;
  projectArea?: number;
  metricsA?: {
    initialCapex: number;
    annualOpex: number;
    fiveYearOpex: number;
    fiveYearTCO: number;
    annualWaterLiters: number;
    fiveYearWaterLiters: number;
    weightTotalKg: number;
  };
  metricsB?: {
    initialCapex: number;
    annualOpex: number;
    fiveYearOpex: number;
    fiveYearTCO: number;
    annualWaterLiters: number;
    fiveYearWaterLiters: number;
    weightTotalKg: number;
  };
  techFilter?: 'all' | 'preservado' | 'permanente' | 'natural';
  matrixRows?: ComparisonRow[];
}

export function generateComparisonMatrixPdf(options: ComparisonMatrixPdfOptions): void {
  const {
    viewMode,
    techA,
    techB,
    projectArea = 15,
    metricsA,
    metricsB,
    techFilter = 'all',
    matrixRows = [],
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const protocolCode = `AG-MTRX-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // 1. Luxury Outer Frame
  doc.setDrawColor(7, 42, 26); // Deep Botanical Obsidian
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

  // Subtle Inner Accent Frame
  doc.setDrawColor(21, 128, 61); // Emerald Green
  doc.setLineWidth(0.2);
  doc.rect(margin + 1.5, margin + 1.5, contentWidth - 3, pageHeight - margin * 2 - 3);

  // 2. Header Banner
  const headerHeight = 24;
  doc.setFillColor(7, 42, 26);
  doc.rect(margin + 1.8, margin + 1.8, contentWidth - 3.6, headerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(134, 239, 172); // Mint green
  doc.text('ALL GREEN DECOR & BIOPHILIA', margin + 6, margin + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(240, 253, 244);
  doc.text('DOSSIÊ TÉCNICO DE ESPECIFICAÇÃO & MATRIZ COMPARATIVA DE TECNOLOGIAS', margin + 6, margin + 13.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(134, 239, 172);
  doc.text(`PROTOCOLO: ${protocolCode} | DATA: ${currentDate}`, margin + 6, margin + 18.5);

  let currentY = margin + headerHeight + 6;

  // 3. Document Subtitle & Context
  if (viewMode === 'side-by-side' && techA && techB && metricsA && metricsB) {
    // ================= SIDE BY SIDE MODE =================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(7, 42, 26);
    doc.text('Duelo Comparativo 1x1: Avaliação Técnica & TCO', margin + 6, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Simulação baseada na área especificada de ${projectArea} m² para ciclo de vida de 5 anos (Capex + Opex).`, margin + 6, currentY);

    currentY += 7;

    // Dual Summary Badges
    const colWidth = (contentWidth - 16) / 2;
    const boxHeight = 24;

    // Tech A Box
    doc.setFillColor(240, 253, 244); // Light emerald
    doc.roundedRect(margin + 6, currentY, colWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin + 6, currentY, colWidth, boxHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(21, 128, 61);
    doc.text('SISTEMA A (REFERÊNCIA)', margin + 9, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(7, 42, 26);
    doc.text(techA.name, margin + 9, currentY + 11, { maxWidth: colWidth - 8 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Categoria: ${techA.badge} | NRC ${techA.acousticNRC} | LEED +${techA.leedCredits} pts`, margin + 9, currentY + 19);

    // Tech B Box
    const col2X = margin + 6 + colWidth + 4;
    doc.setFillColor(249, 250, 251); // Gray
    doc.roundedRect(col2X, currentY, colWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(col2X, currentY, colWidth, boxHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(55, 65, 81);
    doc.text('SISTEMA B (COMPARADO)', col2X + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    doc.text(techB.name, col2X + 3, currentY + 11, { maxWidth: colWidth - 8 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(75, 85, 99);
    doc.text(`Categoria: ${techB.badge} | NRC ${techB.acousticNRC} | LEED +${techB.leedCredits} pts`, col2X + 3, currentY + 19);

    currentY += boxHeight + 6;

    // Financial TCO Highlight Box
    const tcoDiff = Math.abs(metricsA.fiveYearTCO - metricsB.fiveYearTCO);
    const mostEconomicalTech = metricsA.fiveYearTCO < metricsB.fiveYearTCO ? techA : techB;
    const diffPct = Math.round((tcoDiff / Math.max(metricsA.fiveYearTCO, metricsB.fiveYearTCO)) * 100);

    doc.setFillColor(7, 42, 26);
    doc.roundedRect(margin + 6, currentY, contentWidth - 12, 14, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(134, 239, 172);
    doc.text(`ANÁLISE DE CUSTO TOTAL (TCO 5 ANOS): ECONOMIA DE R$ ${tcoDiff.toLocaleString('pt-BR')} (${diffPct}%)`, margin + 10, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(240, 253, 244);
    doc.text(`A tecnologia ${mostEconomicalTech.name} apresenta a melhor viabilidade financeira acumulada para ${projectArea} m².`, margin + 10, currentY + 10);

    currentY += 19;

    // Detailed Metrics Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(7, 42, 26);
    doc.text('1. Métricas Técnicas & de Engenharia Aplicada', margin + 6, currentY);
    currentY += 4;

    const tableRows = [
      {
        criterion: 'Investimento Inicial (Capex Total)',
        valA: `R$ ${metricsA.initialCapex.toLocaleString('pt-BR')}`,
        valB: `R$ ${metricsB.initialCapex.toLocaleString('pt-BR')}`,
      },
      {
        criterion: 'Custo de Manutenção Anual (Opex/ano)',
        valA: `R$ ${metricsA.annualOpex.toLocaleString('pt-BR')}/ano`,
        valB: `R$ ${metricsB.annualOpex.toLocaleString('pt-BR')}/ano`,
      },
      {
        criterion: 'Custo Total em 5 Anos (TCO)',
        valA: `R$ ${metricsA.fiveYearTCO.toLocaleString('pt-BR')}`,
        valB: `R$ ${metricsB.fiveYearTCO.toLocaleString('pt-BR')}`,
      },
      {
        criterion: 'Consumo Hídrico Estimado (5 Anos)',
        valA: `${metricsA.fiveYearWaterLiters.toLocaleString('pt-BR')} Litros`,
        valB: `${metricsB.fiveYearWaterLiters.toLocaleString('pt-BR')} Litros`,
      },
      {
        criterion: 'Sobrecarga Estrutural na Parede',
        valA: `${techA.structuralWeightKgM2} kg/m² (${metricsA.weightTotalKg} kg total)`,
        valB: `${techB.structuralWeightKgM2} kg/m² (${metricsB.weightTotalKg} kg total)`,
      },
      {
        criterion: 'Ponto Hidráulico & Drenagem',
        valA: techA.plumbingRequired ? 'Obrigatório (Ponto + Ralo)' : 'Isento (Sem tubulação hidráulica)',
        valB: techB.plumbingRequired ? 'Obrigatório (Ponto + Ralo)' : 'Isento (Sem tubulação hidráulica)',
      },
      {
        criterion: 'Absorção Acústica (ISO 354)',
        valA: `NRC ${techA.acousticNRC} (Alta Absorção)`,
        valB: `NRC ${techB.acousticNRC} (Atenuação)`,
      },
      {
        criterion: 'Segurança contra Incêndio (NBR 9442)',
        valA: techA.fireRating,
        valB: techB.fireRating,
      },
      {
        criterion: 'Certificações LEED v4.1 & WELL v2',
        valA: `+${techA.leedCredits} Créditos LEED | WELL Score ${techA.wellScore}/100`,
        valB: `+${techB.leedCredits} Créditos LEED | WELL Score ${techB.wellScore}/100`,
      },
      {
        criterion: 'Garantia Estrutural Homologada',
        valA: `${techA.warrantyYears} Anos`,
        valB: `${techB.warrantyYears} Anos`,
      },
    ];

    const rowHeight = 7.5;
    const critWidth = 72;
    const dataColWidth = (contentWidth - 12 - critWidth) / 2;

    // Table Header
    doc.setFillColor(243, 247, 244);
    doc.rect(margin + 6, currentY, contentWidth - 12, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(21, 128, 61);
    doc.text('CRITÉRIO AVALIADO', margin + 8, currentY + 4.5);
    doc.text(techA.name, margin + 8 + critWidth, currentY + 4.5, { maxWidth: dataColWidth - 4 });
    doc.text(techB.name, margin + 8 + critWidth + dataColWidth, currentY + 4.5, { maxWidth: dataColWidth - 4 });

    currentY += 6.5;

    tableRows.forEach((r, idx) => {
      const isAlt = idx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(250, 252, 251);
        doc.rect(margin + 6, currentY, contentWidth - 12, rowHeight, 'F');
      }

      doc.setDrawColor(230, 235, 232);
      doc.line(margin + 6, currentY + rowHeight, margin + 6 + contentWidth - 12, currentY + rowHeight);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(55, 65, 81);
      doc.text(r.criterion, margin + 8, currentY + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(17, 24, 39);
      doc.text(r.valA, margin + 8 + critWidth, currentY + 4.8, { maxWidth: dataColWidth - 4 });
      doc.text(r.valB, margin + 8 + critWidth + dataColWidth, currentY + 4.8, { maxWidth: dataColWidth - 4 });

      currentY += rowHeight;
    });

    currentY += 5;

    // Technical Verdict Callout
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin + 6, currentY, contentWidth - 12, 22, 2, 2, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin + 6, currentY, contentWidth - 12, 22, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(21, 128, 61);
    doc.text('PARECER TÉCNICO DE ESPECIFICAÇÃO RECOMENDADA:', margin + 9, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(55, 65, 81);
    const techADesc = (techA.keyStrengths || []).slice(0, 3).join('; ');
    doc.text(`• Vantagens Sistema A: ${techADesc}.`, margin + 9, currentY + 11, { maxWidth: contentWidth - 18 });
    const techBDesc = (techB.keyStrengths || []).slice(0, 3).join('; ');
    doc.text(`• Vantagens Sistema B: ${techBDesc}.`, margin + 9, currentY + 16.5, { maxWidth: contentWidth - 18 });

  } else {
    // ================= FULL TABLE MODE =================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(7, 42, 26);
    doc.text('Matriz Comparativa Completa das Tecnologias Verticais', margin + 6, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    const filterDesc = techFilter === 'all' 
      ? 'Comparativo integrado entre Jardim Preservado, Jardim Permanente e Jardim Natural Vivo.'
      : `Filtro ativo: ${techFilter.toUpperCase()}`;
    doc.text(filterDesc, margin + 6, currentY);

    currentY += 7;

    // Table Columns Setup
    const critWidth = 50;
    const colW = (contentWidth - 12 - critWidth) / 3;
    const rowH = 7.2;

    // Table Header
    doc.setFillColor(7, 42, 26);
    doc.rect(margin + 6, currentY, contentWidth - 12, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(134, 239, 172);
    doc.text('CRITÉRIO', margin + 8, currentY + 5);
    doc.text('JARDIM PRESERVADO', margin + 8 + critWidth, currentY + 5);
    doc.text('JARDIM PERMANENTE', margin + 8 + critWidth + colW, currentY + 5);
    doc.text('NATURAL HIDROPÔNICO', margin + 8 + critWidth + colW * 2, currentY + 5);

    currentY += 7.5;

    matrixRows.slice(0, 18).forEach((row, idx) => {
      const isAlt = idx % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 248);
        doc.rect(margin + 6, currentY, contentWidth - 12, rowH, 'F');
      }

      doc.setDrawColor(229, 231, 235);
      doc.line(margin + 6, currentY + rowH, margin + 6 + contentWidth - 12, currentY + rowH);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(31, 41, 55);
      doc.text(row.criterion, margin + 8, currentY + 4.8, { maxWidth: critWidth - 4 });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(17, 24, 39);

      const pText = row.preservadoHighlight ? `[V] ${row.preservadoHighlight}` : row.preservadoText;
      doc.text(pText, margin + 8 + critWidth, currentY + 4.8, { maxWidth: colW - 3 });

      const permText = row.permanenteHighlight ? `[V] ${row.permanenteHighlight}` : row.permanenteText;
      doc.text(permText, margin + 8 + critWidth + colW, currentY + 4.8, { maxWidth: colW - 3 });

      doc.text(row.naturalVivoText, margin + 8 + critWidth + colW * 2, currentY + 4.8, { maxWidth: colW - 3 });

      currentY += rowH;
    });
  }

  // 4. Document Footer & Compliance Stamp
  const footerY = pageHeight - margin - 12;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin + 6, footerY, margin + contentWidth - 6, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'All Green Decor & Biofilia • Homologado Green Building Council Brasil • Laudos Acústicos IPT ISO 354 • NBR 9442 Classe B-s1,d0',
    margin + 6,
    footerY + 4
  );

  doc.text(
    `Documento de Especificação Técnica Oficial • Emitido em ${currentDate} • allgreendecor.com.br`,
    margin + 6,
    footerY + 8
  );

  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(21, 128, 61);
  doc.text(`REF: ${protocolCode}`, pageWidth - margin - 42, footerY + 6);

  // Trigger download with descriptive filename
  const fileName = viewMode === 'side-by-side' && techA && techB
    ? `Matriz-Comparativa-${techA.name.replace(/\s+/g, '-')}-vs-${techB.name.replace(/\s+/g, '-')}-${projectArea}m2.pdf`
    : `Matriz-Comparativa-Tecnologias-AllGreen.pdf`;

  doc.save(fileName);
}
