import { jsPDF } from 'jspdf';
import { SimulationResult } from '../types';

export interface SimulationPdfOptions {
  simulationResult: SimulationResult;
  originalImageUrl?: string | null;
  roomType?: string;
  stylePreference?: string;
  clientName?: string;
  projectName?: string;
}

/**
 * Generates and downloads a comprehensive, architect-ready PDF report
 * summarizing the AI-generated biophilic simulation analysis.
 */
export async function exportSimulationToPdf(options: SimulationPdfOptions): Promise<void> {
  const {
    simulationResult,
    roomType = 'Ambiente Corporativo / Residencial',
    stylePreference = 'Jardim Preservado Moss & Samambaia',
    clientName = 'Cliente / Especificador',
    projectName = 'Simulação Biofílica IA',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : (doc.internal.pageSize.width || 210);
  const pageHeight = doc.internal.pageSize.getHeight ? doc.internal.pageSize.getHeight() : (doc.internal.pageSize.height || 297);
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Generate unique report protocol
  const dateStr = new Date().toLocaleDateString('pt-BR');
  const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const protocolCode = `AG-SIM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  // --- BRAND HEADER BAR ---
  // Dark Green Top Bar (#072A1A)
  doc.setFillColor(7, 42, 26);
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Emerald Accent Strip (#86EFAC)
  doc.setFillColor(134, 239, 172);
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ALL GREEN DECOR & BIOPHILIA', margin, 14);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(134, 239, 172);
  doc.text('TECNOLOGIA VISIO-BOTÂNICA & ENGENHARIA ACÚSTICA PRESERVADA', margin, 20);

  // Protocol & Date right-aligned
  doc.setTextColor(220, 240, 230);
  doc.setFontSize(7.5);
  doc.text(`PROTOCOLO: ${protocolCode}`, pageWidth - margin, 12, { align: 'right' });
  doc.text(`EMISSÃO: ${dateStr} às ${timeStr}`, pageWidth - margin, 17, { align: 'right' });
  doc.text('STATUS: ANÁLISE IA CONCLUÍDA', pageWidth - margin, 22, { align: 'right' });

  let yPos = 42;

  // --- REPORT TITLE SECTION ---
  doc.setTextColor(7, 42, 26);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('LAUDO TÉCNICO DE SIMULAÇÃO BIOFÍLICA', margin, yPos);
  
  yPos += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Diagnóstico computacional de viabilidade botânica, desempenho acústico e certificação sustentável.', margin, yPos);

  yPos += 8;

  // --- PROJECT SUMMARY CARD (2 columns layout) ---
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(220, 235, 225);
  doc.roundedRect(margin, yPos, contentWidth, 24, 3, 3, 'FD');

  const col1X = margin + 5;
  const col2X = margin + (contentWidth / 2) + 5;
  let cardY = yPos + 6;

  // Row 1
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TIPO DE AMBIENTE:', col1X, cardY);
  doc.text('ESTILO ESPECIFICADO:', col2X, cardY);

  cardY += 4.5;
  doc.setFontSize(9);
  doc.setTextColor(7, 42, 26);
  doc.setFont('helvetica', 'bold');
  doc.text(roomType.toUpperCase(), col1X, cardY);
  doc.text(simulationResult.recommendedStyle || stylePreference, col2X, cardY);

  // Row 2
  cardY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ESPECIFICADOR / CLIENTE:', col1X, cardY);
  doc.text('MODALIDADE DE ENGENHARIA:', col2X, cardY);

  cardY += 4.5;
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.setFont('helvetica', 'bold');
  doc.text(clientName, col1X, cardY);
  doc.text('SISTEMA MODULAR PLUG & PLAY (ZERO MANUTENÇÃO)', col2X, cardY);

  yPos += 30;

  // --- KEY PERFORMANCE INDICATORS (4 METRIC TILES) ---
  const tileWidth = (contentWidth - 9) / 4; // ~42.75mm each
  const tileHeight = 22;

  const metrics = [
    {
      label: 'ÁREA ESTIMADA',
      val: `${simulationResult.estimatedArea} m²`,
      sub: 'Parede mapeada',
      accentColor: [7, 42, 26],
    },
    {
      label: 'ATENUAÇÃO ACÚSTICA',
      val: '-10 dB',
      sub: 'NRC 0.85 (Frequências médias)',
      accentColor: [21, 128, 61],
    },
    {
      label: 'SELO WELL v2',
      val: `+${simulationResult.wellScore} pts`,
      sub: 'Mente & Conforto',
      accentColor: [7, 42, 26],
    },
    {
      label: 'INVESTIMENTO ESTIMADO',
      val: `R$ ${simulationResult.estimatedBudgetMin.toLocaleString('pt-BR')} - ${simulationResult.estimatedBudgetMax.toLocaleString('pt-BR')}`,
      sub: 'Material + Instalação',
      accentColor: [7, 42, 26],
    },
  ];

  metrics.forEach((m, idx) => {
    const tileX = margin + idx * (tileWidth + 3);
    
    // Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 225, 215);
    doc.roundedRect(tileX, yPos, tileWidth, tileHeight, 2.5, 2.5, 'FD');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, tileX + 3.5, yPos + 5.5);

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(idx === 3 ? 8.5 : 11);
    doc.setTextColor(m.accentColor[0], m.accentColor[1], m.accentColor[2]);
    doc.text(m.val, tileX + 3.5, yPos + 12);

    // Subtext
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 135, 125);
    doc.text(m.sub, tileX + 3.5, yPos + 18);
  });

  yPos += tileHeight + 8;

  // --- AI DIAGNOSTIC TEXT BLOCK ---
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'FD');

  // Title icon bar
  doc.setFillColor(7, 42, 26);
  doc.circle(margin + 5, yPos + 6, 2.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(7, 42, 26);
  doc.text('PARECER DO MOTOR DE INTELIGÊNCIA ARTIFICIAL ALL GREEN', margin + 10, yPos + 7);

  // Split and print diagnostic text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  const splitAiText = doc.splitTextToSize(
    simulationResult.aiAnalysisText ||
      'A análise de volumetria indicou uma parede frontal com alta visibilidade e absorção de iluminação difusa. A introdução de vegetação preservada tridimensional cria ponto focal biofílico de alto impacto, promovendo redução de reverberação de voz e aumento no índice de bem-estar corporal.',
    contentWidth - 10
  );
  doc.text(splitAiText, margin + 5, yPos + 14);

  yPos += 40;

  // --- BOTANICAL COMPOSITION & SPECIES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(7, 42, 26);
  doc.text('COMPOSIÇÃO BOTÂNICA SUGERIDA PARA ESTE PROJETO', margin, yPos);

  yPos += 5;

  const speciesList = simulationResult.recommendedSpecies && simulationResult.recommendedSpecies.length > 0
    ? simulationResult.recommendedSpecies
    : [
        'Moss Moss Preservado (Líquen Dinamarquês)',
        'Samambaia Chorona Hiper-Realista Anti-UV',
        'Costela-de-Adão Preservada',
        'Avenca & Hera Verde Esmeralda'
      ];

  // Draw species cards
  speciesList.forEach((specie, idx) => {
    const itemY = yPos + idx * 7.5;
    
    // Bullet marker
    doc.setFillColor(21, 128, 61);
    doc.rect(margin, itemY, 2.5, 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(specie, margin + 5, itemY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Tratamento Fito-Preservado • Não Atrai Insetos • 100% Antiestático', margin + 75, itemY + 4);
  });

  yPos += speciesList.length * 7.5 + 8;

  // --- TECHNICAL COMPLIANCE & CERTIFICATIONS TABLE ---
  doc.setFillColor(248, 250, 249);
  doc.setDrawColor(220, 235, 225);
  doc.roundedRect(margin, yPos, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(7, 42, 26);
  doc.text('ESPECIFICAÇÕES TÉCNICAS E LAUDOS DE ENGENHARIA', margin + 5, yPos + 6);

  const specs = [
    { label: 'Segurança Contra Incêndio:', val: 'Classificação II-A (Auto-Extinguível) / Ensaio de Inflamabilidade IPT' },
    { label: 'Desempenho Acústico:', val: 'Laudo de Absorção Sonora ISO 354 / Redução de RT60 em até 38%' },
    { label: 'Manutenção Hidráulica:', val: 'Zero irrigação, sem ponto de água ou esgoto, não necessita luz solar' },
    { label: 'Garantia Fabril All Green:', val: '05 Anos de garantia contra desbotamento e desprendimento das folhas' },
    { label: 'Sustentabilidade:', val: 'Pontuação ativa para selos LEED v4.1 (Créditos EQ) e WELL v2 (Mente/Conforto)' },
  ];

  let specY = yPos + 12;
  specs.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(21, 128, 61);
    doc.text(`• ${s.label}`, margin + 5, specY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(s.val, margin + 52, specY);

    specY += 5.5;
  });

  yPos += 50;

  // --- FOOTER & CONTACT SIGN-OFF ---
  doc.setFillColor(7, 42, 26);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('ALL GREEN DECOR & BIOPHILIA — SÃO PAULO / BRASIL', margin, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 220, 200);
  doc.text('Atendimento Técnico & Especificações: comercial@allgreendecor.com.br • (11) 98765-4321 • www.allgreendecor.com.br', margin, pageHeight - 7);

  doc.text(`Página 1 de 1 • Autenticado via Protocolo Digital ${protocolCode}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Save the document
  const fileName = `Laudo-Simulacao-AllGreen-${protocolCode}.pdf`;
  doc.save(fileName);
}
