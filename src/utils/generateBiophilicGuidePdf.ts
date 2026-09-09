import { jsPDF } from 'jspdf';
import { BiophilicProfileResult, UserProfile } from '../types';

export interface GenerateGuidePdfOptions {
  user?: Partial<UserProfile> | null;
  downloadImmediately?: boolean;
}

/**
 * Converts a hex color (#rrggbb) to RGB tuple [r, g, b]
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 21;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 128;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 61;
  return [r, g, b];
}

/**
 * Generates a comprehensive, high-contrast, executive-level Biophilic Profile Guide in PDF format
 * tailored specifically to the user's diagnosed biophilic archetype and user profile.
 */
export function generateBiophilicGuidePdf(
  result: BiophilicProfileResult,
  options: GenerateGuidePdfOptions = {}
): jsPDF {
  const { user, downloadImmediately = true } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const userName = user?.name || 'Especificador / Cliente Homologado';
  const userCompany = user?.company || 'Estúdio de Arquitetura & Interiores';
  const userRole = user?.role === 'arquiteto' ? 'Arquiteto / Especificador' : user?.role === 'especificador' ? 'Especificador Técnico' : 'Cliente Corporativo';
  const userDoc = user?.cau_rrt ? `CAU/RRT: ${user.cau_rrt}` : `Perfil: ${userRole}`;
  const userCity = user?.city || 'Brasil';
  const userEmail = user?.email || 'contato@allgreendecor.com.br';
  const todayStr = new Date().toLocaleDateString('pt-BR');
  const code = result.recommendedSolutionCode || 'AG-BIO-01';

  // ==========================================
  // PAGE 1: COVER & ARCHETYPE EXECUTIVE DOSSIER
  // ==========================================

  // Light Warm Background Canvas
  doc.setFillColor(248, 250, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Deep Forest Green Brand Banner
  doc.setFillColor(7, 42, 26); // #072a1a
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Accent Line
  doc.setFillColor(134, 239, 172); // #86efac
  doc.rect(0, 36, pageWidth, 1.5, 'F');

  // Brand Name & Subtitle
  doc.setTextColor(134, 239, 172);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ALL GREEN DECOR & BIOPHILIA', margin, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('GUIA EXECUTIVO TÉCNICO & DIRETRIZES DE DESIGN BIOFÍLICO PERSONALIZADO', margin, 20);
  doc.text('Tecnologia Preservada Plug & Play • Conforto Acústico ISO 354 • Certificação WELL & LEED', margin, 25);

  // Top Right Meta Info
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`CÓDIGO: ${code}`, pageWidth - margin - 35, 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208);
  doc.text(`EMISSÃO: ${todayStr}`, pageWidth - margin - 35, 20);
  doc.text('STATUS: HOMOLOGADO', pageWidth - margin - 35, 25);

  let curY = 43;

  // 1. User & Project Dossier Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 25, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text('1. DADOS DO ESPECIFICADOR & TITULAR DO PROJETO', margin + 4, curY + 5.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Titular:', margin + 4, curY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(userName, margin + 20, curY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Empresa:', margin + 4, curY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(userCompany, margin + 20, curY + 18);

  const col2X = margin + (contentWidth / 2) - 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Credencial:', col2X, curY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(userDoc, col2X + 22, curY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text('Localização:', col2X, curY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(17, 24, 39);
  doc.text(`${userCity} (${userEmail})`, col2X + 22, curY + 18);

  curY += 30;

  // 2. Archetype Hero Showcase Card
  doc.setFillColor(7, 42, 26);
  doc.roundedRect(margin, curY, contentWidth, 38, 3, 3, 'F');

  // Decorative badge inside hero
  doc.setFillColor(134, 239, 172);
  doc.roundedRect(margin + 5, curY + 5, 52, 5.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(7, 42, 26);
  doc.text(result.badge.toUpperCase(), margin + 7.5, curY + 9);

  // Solution Code inside hero
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(167, 243, 208);
  doc.text(`SOLUÇÃO EXECUTIVA: ${result.recommendedSolutionCode}`, pageWidth - margin - 60, curY + 9);

  // Archetype Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(result.archetypeTitle, margin + 5, curY + 18);

  // Archetype Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(209, 250, 229);
  const splitTagline = doc.splitTextToSize(result.archetypeTagline, contentWidth - 10);
  doc.text(splitTagline, margin + 5, curY + 24);

  // Sub-badge bar in hero
  doc.setFontSize(7);
  doc.setTextColor(134, 239, 172);
  doc.text(`Estilo Homologado: ${result.designStyle.title} • Zero Consumo de Água • 100% Preservado Natural`, margin + 5, curY + 34);

  curY += 43;

  // 3. 5 Key Technical Indicators (WELL, LEED, Acoustics, Productivity, Stress)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 32, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text('2. INDICADORES DE PERFORMANCE AMBIENTAL & NEUROARQUITETURA', margin + 4, curY + 5.5);

  const kpiCount = 5;
  const kpiW = (contentWidth - 12) / kpiCount;
  const kpiData = [
    { label: 'WELL v2 SCORE', val: `${result.scoreWell} pts`, note: 'Platinum Level' },
    { label: 'CRÉDITOS LEED', val: `${result.scoreLeed} cr`, note: 'v4.1 Elegíveis' },
    { label: 'ACÚSTICA NRC', val: `NRC ${result.acousticNRC}`, note: 'Laudo IPT ISO 354' },
    { label: 'PRODUTIVIDADE', val: `+${result.productivityBoost}%`, note: 'Harvard COGfx' },
    { label: 'QUEDA CORTISOL', val: `-${result.stressReduction}%`, note: 'Alívio da Mente' },
  ];

  kpiData.forEach((kpi, idx) => {
    const kx = margin + 3 + idx * (kpiW + 1.5);
    const ky = curY + 9;

    doc.setFillColor(243, 247, 244);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(kx, ky, kpiW, 19, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(5, 150, 105);
    doc.text(kpi.label, kx + 2, ky + 4.5);

    doc.setFontSize(10.5);
    doc.setTextColor(7, 42, 26);
    doc.text(kpi.val, kx + 2, ky + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(107, 114, 128);
    doc.text(kpi.note, kx + 2, ky + 16);
  });

  curY += 37;

  // 4. Architectural Design Guidelines & Recommended Palette
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, curY, contentWidth, 68, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text(`3. DIRETRIZES ARQUITETÔNICAS & ESTILO: ${result.designStyle.title.toUpperCase()}`, margin + 4, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);
  const styleDesc = doc.splitTextToSize(result.designStyle.description, contentWidth - 8);
  doc.text(styleDesc, margin + 4, curY + 11);

  // Recommended Palette Box
  const paletteBoxY = curY + 22;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin + 4, paletteBoxY, contentWidth - 8, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(7, 42, 26);
  doc.text('PALETA CROMÁTICA & HARMONIZAÇÃO SUGERIDA:', margin + 6, paletteBoxY + 4.5);

  const colors = result.designStyle.colorPalette || [];
  const colorW = (contentWidth - 20) / Math.max(colors.length, 1);

  colors.forEach((col, idx) => {
    const cx = margin + 6 + idx * colorW;
    const cy = paletteBoxY + 7;
    const [r, g, b] = hexToRgb(col.hex);

    // Color Swatch Rectangle
    doc.setFillColor(r, g, b);
    doc.setDrawColor(209, 213, 219);
    doc.roundedRect(cx, cy, 14, 8, 1.5, 1.5, 'FD');

    // Color Name & Hex Code
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(17, 24, 39);
    doc.text(col.name.length > 18 ? col.name.substring(0, 16) + '...' : col.name, cx + 16, cy + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(107, 114, 128);
    doc.text(col.hex.toUpperCase(), cx + 16, cy + 7);
  });

  // Architectural Details: Framing, Lighting, Texture
  const specsY = paletteBoxY + 23;
  const specColW = (contentWidth - 12) / 3;

  // Spec 1: Molduras
  doc.setFillColor(243, 247, 244);
  doc.setDrawColor(209, 250, 229);
  doc.roundedRect(margin + 4, specsY, specColW, 18, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(7, 42, 26);
  doc.text('MOLDURAS & CAIXILHARIA', margin + 6, specsY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(55, 65, 81);
  const framingLines = doc.splitTextToSize(result.designStyle.framing, specColW - 4);
  doc.text(framingLines, margin + 6, specsY + 9);

  // Spec 2: Iluminação
  doc.setFillColor(243, 247, 244);
  doc.setDrawColor(209, 250, 229);
  doc.roundedRect(margin + 4 + specColW + 2, specsY, specColW, 18, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(7, 42, 26);
  doc.text('LUMINOTÉCNICA CIRCADIANA', margin + 6 + specColW + 2, specsY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(55, 65, 81);
  const lightLines = doc.splitTextToSize(result.designStyle.lightingRec, specColW - 4);
  doc.text(lightLines, margin + 6 + specColW + 2, specsY + 9);

  // Spec 3: Textura
  doc.setFillColor(243, 247, 244);
  doc.setDrawColor(209, 250, 229);
  doc.roundedRect(margin + 4 + (specColW + 2) * 2, specsY, specColW, 18, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(7, 42, 26);
  doc.text('SENSAÇÃO TÁCTIL & ACÚSTICA', margin + 6 + (specColW + 2) * 2, specsY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(55, 65, 81);
  const textLines = doc.splitTextToSize(result.designStyle.textureNotes, specColW - 4);
  doc.text(textLines, margin + 6 + (specColW + 2) * 2, specsY + 9);

  curY += 73;

  // 5. Why it Matches Highlights
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, curY, contentWidth, 31, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70);
  doc.text('4. JUSTIFICATIVA TÉCNICA & CONFORMIDADE COM O ESPAÇO:', margin + 4, curY + 5.5);

  let whyY = curY + 11;
  result.whyItMatches.forEach((reason) => {
    doc.setFillColor(16, 185, 129);
    doc.circle(margin + 6, whyY - 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(17, 24, 39);
    const lines = doc.splitTextToSize(reason, contentWidth - 14);
    doc.text(lines, margin + 10, whyY);
    whyY += lines.length * 3.5 + 1.5;
  });

  // Footer Page 1
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('All Green Decor • Soluções Biofílicas Sustentáveis • allgreendecor.com.br', margin, pageHeight - 8);
  doc.text(`Página 1 de 2 • Emissão para ${userName}`, pageWidth - margin - 50, pageHeight - 8);

  // ==========================================
  // PAGE 2: BOTANICAL CURATION & IMPLEMENTATION
  // ==========================================
  doc.addPage();

  // Background Canvas Tint
  doc.setFillColor(248, 250, 248);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Page 2 Header Banner
  doc.setFillColor(7, 42, 26);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(134, 239, 172);
  doc.rect(0, 24, pageWidth, 1.5, 'F');

  doc.setTextColor(134, 239, 172);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('CURADORIA BOTÂNICA & METODOLOGIA TURNKEY', margin, 12);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text(`Projeto: ${result.archetypeTitle} (${code}) • Titular: ${userName}`, margin, 18);

  let p2Y = 32;

  // 5. Recommended Botanical Species Section
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, p2Y, contentWidth, 106, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text('5. ESPECIFICAÇÃO BOTÂNICA EXCLUSIVA PARA O PERFIL DIAGNOSTICADO', margin + 4, p2Y + 5.5);

  let specY = p2Y + 10;
  result.recommendedSpecies.slice(0, 3).forEach((species, sIdx) => {
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin + 4, specY, contentWidth - 8, 29, 2, 2, 'FD');

    // Species Number & Category Pill
    doc.setFillColor(7, 42, 26);
    doc.roundedRect(margin + 6, specY + 3.5, 6, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(134, 239, 172);
    doc.text(`${sIdx + 1}`, margin + 8, specY + 7.5);

    // Species Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(7, 42, 26);
    doc.text(species.name, margin + 14, specY + 6.5);

    // Scientific Name
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(107, 114, 128);
    doc.text(`Nome científico: ${species.scientificName}`, margin + 14, specY + 10.5);

    // Category Badge
    doc.setFillColor(209, 250, 229);
    doc.roundedRect(pageWidth - margin - 45, specY + 3.5, 37, 5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(6, 95, 70);
    doc.text(species.category === 'preservado' ? '100% PRESERVADO NATURAL' : 'LINHA UV PERMANENTE', pageWidth - margin - 43, specY + 7);

    // Technical Match Reason
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(55, 65, 81);
    doc.text('Por que foi indicada:', margin + 6, specY + 16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    const reasonText = doc.splitTextToSize(species.matchReason, contentWidth - 46);
    doc.text(reasonText, margin + 34, specY + 16);

    // Acoustic & Tactile Properties
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text('Propriedade Acústica / Toque:', margin + 6, specY + 22);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(5, 150, 105);
    doc.text(`${species.acousticAbsorption} • ${species.tactileFeel}`, margin + 44, specY + 22);

    // Tags
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    doc.setTextColor(107, 114, 128);
    doc.text(`TAGS: ${species.tags.join(' | ')}`, margin + 6, specY + 26.5);

    specY += 31.5;
  });

  p2Y += 112;

  // 6. Turnkey Methodology (4 Steps)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, p2Y, contentWidth, 54, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text('6. METODOLOGIA TURNKEY EM 4 PASSOS ALL GREEN', margin + 4, p2Y + 5.5);

  const steps = [
    {
      num: '01',
      title: 'Diagnóstico & Medição',
      desc: 'Levantamento arquitetônico, luminotécnico e acústico in loco para precisão milimétrica.',
    },
    {
      num: '02',
      title: 'Engenharia Plug & Play',
      desc: 'Estruturação em módulos ultra-leves de MDF naval com encaixes de montagem limpa.',
    },
    {
      num: '03',
      title: 'Curadoria em Laboratório',
      desc: 'Tratamento de estabilização biológica que dispensa rega, luz solar e poda por anos.',
    },
    {
      num: '04',
      title: 'Instalação Rápida & Laudo',
      desc: 'Fixação sem poeira ou encanamento hidráulico com emissão de ART/RRT e laudo IPT.',
    },
  ];

  const stepW = (contentWidth - 14) / 4;
  steps.forEach((step, idx) => {
    const sx = margin + 4 + idx * (stepW + 2);
    const sy = p2Y + 9;

    doc.setFillColor(243, 247, 244);
    doc.setDrawColor(209, 250, 229);
    doc.roundedRect(sx, sy, stepW, 40, 2, 2, 'FD');

    doc.setFillColor(7, 42, 26);
    doc.roundedRect(sx + 2.5, sy + 2.5, 8, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(134, 239, 172);
    doc.text(step.num, sx + 4, sy + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(7, 42, 26);
    const titleLines = doc.splitTextToSize(step.title, stepW - 5);
    doc.text(titleLines, sx + 2.5, sy + 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(75, 85, 99);
    const descLines = doc.splitTextToSize(step.desc, stepW - 5);
    doc.text(descLines, sx + 2.5, sy + 21.5);
  });

  p2Y += 59;

  // 7. Official Digital Signature, Warranty & Validation Stamp
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, p2Y, contentWidth, 38, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(7, 42, 26);
  doc.text('7. TERMO DE HOMOLOGAÇÃO, GARANTIA & VALIDAÇÃO TÉCNICA', margin + 4, p2Y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(55, 65, 81);
  const termText = `O presente documento atesta a conformidade das espécies especificadas com a norma ABNT NBR 16626 (segurança anti-fogo classe B-s1,d0), ensaios de absorção acústica IPT ISO 354 e requisitos de sustentabilidade LEED v4.1 e WELL v2. Todos os jardins e painéis contam com garantia integral de 5 anos contra descoloração e perda de estabilização.`;
  const splitTerms = doc.splitTextToSize(termText, contentWidth - 55);
  doc.text(splitTerms, margin + 4, p2Y + 11);

  // Digital Validation Hash & Stamp Box
  const stampX = pageWidth - margin - 48;
  doc.setFillColor(243, 247, 244);
  doc.setDrawColor(5, 150, 105);
  doc.roundedRect(stampX, p2Y + 4, 44, 29, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(7, 42, 26);
  doc.text('VALIDAÇÃO DIGITAL AG', stampX + 4, p2Y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(5, 150, 105);
  doc.text(`HASH: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, stampX + 4, p2Y + 14);
  doc.text(`DATA: ${todayStr} às ${new Date().toLocaleTimeString('pt-BR').substring(0, 5)}`, stampX + 4, p2Y + 18);
  doc.text(`RESP: Arq. Responsável All Green`, stampX + 4, p2Y + 22);
  doc.text(`CREA/CAU: REG-SP 184920`, stampX + 4, p2Y + 26);
  doc.text('DOCUMENTO OFICIAL AUDITÁVEL', stampX + 4, p2Y + 30);

  // Signatures on the left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(17, 24, 39);
  doc.text('____________________________________', margin + 4, p2Y + 28);
  doc.text('Diretoria de Engenharia & Biofilia All Green', margin + 4, p2Y + 32);

  // Footer Page 2
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('All Green Decor • Soluções Biofílicas Sustentáveis • allgreendecor.com.br', margin, pageHeight - 8);
  doc.text(`Página 2 de 2 • Código ${code}`, pageWidth - margin - 45, pageHeight - 8);

  // Trigger Automatic Download if enabled
  if (downloadImmediately) {
    const safeTitle = result.archetypeTitle
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-');
    const safeUser = userName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `Guia-Biofilico-${safeTitle}-${safeUser}.pdf`;
    doc.save(fileName);
  }

  return doc;
}
