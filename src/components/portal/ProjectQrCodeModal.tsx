import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Award,
  Sparkles,
  Smartphone,
  Eye,
  FileText,
  Leaf,
  Layers,
  MapPin,
  Calendar,
  Building,
  User,
  Share2
} from 'lucide-react';
import { PortalProject, UserProfile } from '../../types';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { getProjectDirectUrl } from '../../utils/appUrl';

interface ProjectQrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortalProject | null;
  architectUser: UserProfile;
  onOpenMobilePreview?: (project: PortalProject) => void;
}

export const ProjectQrCodeModal: React.FC<ProjectQrCodeModalProps> = ({
  isOpen,
  onClose,
  project,
  architectUser,
  onOpenMobilePreview,
}) => {
  const [activeView, setActiveView] = useState<'plaque' | 'mobile_preview'>('plaque');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Digital Report target URL for mobile scanning (always public and accessible globally)
  const reportUrl = project ? getProjectDirectUrl(project.code) : '';

  useEffect(() => {
    if (!isOpen || !project) return;

    // Generate high resolution QR code data URL and draw on canvas
    QRCode.toDataURL(reportUrl, {
      width: 1024,
      margin: 1.5,
      color: {
        dark: '#072a1a', // Deep All Green botanical obsidian
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code data URL:', err);
      });

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, reportUrl, {
        width: 260,
        margin: 1.5,
        color: {
          dark: '#072a1a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      }).catch((err) => {
        console.error('Failed to draw QR code on canvas:', err);
      });
    }
  }, [isOpen, project, reportUrl]);

  if (!isOpen || !project) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRCode-Obra-${project.code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#86efac', '#15803d', '#072a1a'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDownloadPlaquePdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;

      // Outer Luxury Frame
      doc.setDrawColor(7, 42, 26);
      doc.setLineWidth(1.2);
      doc.rect(margin, margin, contentWidth, pageHeight - margin * 2);

      // Inner Delicate Frame
      doc.setDrawColor(21, 128, 61);
      doc.setLineWidth(0.4);
      doc.rect(margin + 2.5, margin + 2.5, contentWidth - 5, pageHeight - margin * 2 - 5);

      // Header Banner
      doc.setFillColor(7, 42, 26);
      doc.rect(margin + 3, margin + 3, contentWidth - 6, 26, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(134, 239, 172); // Mint green
      doc.text('ALL GREEN DECOR & BIOPHILIA', pageWidth / 2, margin + 12, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(240, 253, 244);
      doc.text('MEMORIAL TÉCNICO & CERTIFICAÇÃO DIGITAL DA OBRA', pageWidth / 2, margin + 19, { align: 'center' });
      doc.text(`CÓDIGO HOMOLOGADO: ${project.code}`, pageWidth / 2, margin + 25, { align: 'center' });

      // Project Main Title
      let currentY = margin + 38;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(7, 42, 26);
      doc.text(project.title, pageWidth / 2, currentY, { align: 'center' });

      currentY += 8;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`Cliente / Empreendimento: ${project.client}`, pageWidth / 2, currentY, { align: 'center' });

      // Specs Table Box
      currentY += 10;
      doc.setFillColor(243, 247, 244);
      doc.roundedRect(margin + 8, currentY, contentWidth - 16, 36, 3, 3, 'F');
      doc.setDrawColor(209, 250, 229);
      doc.roundedRect(margin + 8, currentY, contentWidth - 16, 36, 3, 3, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(21, 128, 61);
      doc.text('ESPECIFICAÇÕES ARQUITETÔNICAS CERTIFICADAS', margin + 14, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(`• Estilo Biofílico: ${project.style}`, margin + 14, currentY + 14);
      doc.text(`• Dimensões / Área: ${project.area} m² (${project.category})`, margin + 14, currentY + 20);
      doc.text(`• Localização: ${project.location}`, margin + 14, currentY + 26);
      doc.text(`• Data de Homologação: ${project.dateCreated}`, margin + 14, currentY + 32);

      const col2X = margin + (contentWidth / 2) + 2;
      doc.text(`• Responsável: ${architectUser.name}`, col2X, currentY + 14);
      doc.text(`• Registro: ${architectUser.cau_rrt || 'Arquiteto Homologado'}`, col2X, currentY + 20);
      doc.text(`• Absorção Acústica: NRC ${project.acousticNrc || '0.85'} (ISO 354)`, col2X, currentY + 26);
      doc.text(`• Certificações: LEED v4.1 & WELL v2 Platinum`, col2X, currentY + 32);

      // QR Code in Center
      currentY += 46;
      if (qrDataUrl) {
        const qrSize = 64; // 64mm
        const qrX = (pageWidth - qrSize) / 2;
        doc.addImage(qrDataUrl, 'PNG', qrX, currentY, qrSize, qrSize);

        // Scan Instructions Callout
        currentY += qrSize + 8;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(7, 42, 26);
        doc.text('ACESSO AO LAUDO TÉCNICO DIGITAL', pageWidth / 2, currentY, { align: 'center' });

        currentY += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(107, 114, 128);
        doc.text(
          'Aponte a câmera do seu smartphone para o QR Code acima para visualizar',
          pageWidth / 2,
          currentY,
          { align: 'center' }
        );
        currentY += 4.5;
        doc.text(
          'o memorial botânico interativo, antes/depois, laudo acústico e certificado de garantia.',
          pageWidth / 2,
          currentY,
          { align: 'center' }
        );

        currentY += 6;
        doc.setFont('courier', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(21, 128, 61);
        doc.text(reportUrl, pageWidth / 2, currentY, { align: 'center' });
      }

      // Botanical Species List Box
      if (project.speciesUsed && project.speciesUsed.length > 0) {
        currentY += 12;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin + 8, currentY, contentWidth - 16, 24, 2, 2, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(7, 42, 26);
        doc.text('COMPOSIÇÃO BOTÂNICA HOMOLOGADA:', margin + 12, currentY + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(75, 85, 99);
        const speciesText = project.speciesUsed.slice(0, 5).join(' • ');
        doc.text(speciesText, margin + 12, currentY + 12, { maxWidth: contentWidth - 24 });
        doc.text('Tratamento 100% natural sem irrigação, atóxico e com retardante de chama NBR 9442.', margin + 12, currentY + 18);
      }

      // Footer
      const footerY = pageHeight - margin - 8;
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text('All Green Decor • Soluções Biofílicas Sustentáveis • allgreendecor.com.br', margin + 6, footerY);
      doc.text(`Documento Auditável • Emissão ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin - 58, footerY);

      doc.save(`Placa-QRCode-Obra-${project.code}.pdf`);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#86efac', '#15803d', '#072a1a'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Failed to generate plaque PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative border border-emerald-900/20 my-auto max-h-[94dvh] flex flex-col animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-full print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header - Hidden on Print */}
        <div className="bg-[#072a1a] text-white p-4 sm:p-6 flex items-center justify-between shrink-0 print:hidden border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-900/80 border border-emerald-700/60 text-[#86efac] flex items-center justify-center shadow-inner shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#86efac] uppercase font-bold">
                  PLACA TÉCNICA QR CODE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {project.code}
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white leading-tight">
                Acesso Digital Mobile da Obra
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-emerald-950/90 p-1 rounded-xl border border-emerald-800/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('plaque')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'plaque'
                    ? 'bg-[#86efac] text-[#072a1a] font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Placa Imprimível
              </button>
              <button
                type="button"
                onClick={() => setActiveView('mobile_preview')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'mobile_preview'
                    ? 'bg-[#86efac] text-[#072a1a] font-bold shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Prévia Mobile</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar modal"
              className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeView === 'plaque' ? (
            /* ================= VIEW 1: PRINTABLE ARCHITECTURAL PLAQUE ================= */
            <div className="space-y-6">
              
              {/* The Architectural Plaque Container (Targeted by window.print()) */}
              <div
                id="printable-project-qr-card"
                className="bg-white border-2 border-[#072a1a] rounded-2xl p-5 sm:p-8 shadow-sm relative overflow-hidden print:p-0 print:border-2 print:border-black print:rounded-none"
              >
                {/* Decorative Double Border inside */}
                <div className="border border-emerald-800/30 rounded-xl p-4 sm:p-6 relative space-y-5 print:border-gray-400">
                  
                  {/* Plaque Header */}
                  <div className="border-b border-emerald-900/20 pb-4 text-center space-y-1">
                    <span className="text-[10px] sm:text-xs font-mono font-extrabold tracking-widest text-emerald-800 uppercase block">
                      ALL GREEN DECOR & BIOPHILIA
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#072a1a]">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Memorial Técnico & Certificação Digital da Obra • Código:{' '}
                      <strong className="font-mono text-emerald-800">{project.code}</strong>
                    </p>
                  </div>

                  {/* Main Grid: Details on Left, QR Code on Right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Project Specifications */}
                    <div className="md:col-span-7 space-y-3 text-xs">
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
                          <span className="text-gray-600 font-semibold">Cliente / Local:</span>
                          <span className="font-bold text-[#072a1a] text-right truncate max-w-[180px]">
                            {project.client} • {project.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
                          <span className="text-gray-600 font-semibold">Estilo Biofílico:</span>
                          <span className="font-bold text-emerald-900 text-right">{project.style}</span>
                        </div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
                          <span className="text-gray-600 font-semibold">Área / Categoria:</span>
                          <span className="font-bold text-gray-900 text-right">
                            {project.area} m² ({project.category})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-semibold">Arquiteto(a):</span>
                          <span className="font-bold text-[#072a1a] text-right">
                            {architectUser.name} ({architectUser.cau_rrt || 'Homologado'})
                          </span>
                        </div>
                      </div>

                      {/* Sustainability & Acoustic Badges */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[9px] font-mono font-bold text-emerald-700 block uppercase">WELL v2</span>
                          <strong className="text-xs text-gray-900">Platinum</strong>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[9px] font-mono font-bold text-emerald-700 block uppercase">LEED v4.1</span>
                          <strong className="text-xs text-gray-900">Certificado</strong>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-[9px] font-mono font-bold text-emerald-700 block uppercase">Acústica</span>
                          <strong className="text-xs text-gray-900">NRC {project.acousticNrc || '0.85'}</strong>
                        </div>
                      </div>

                      {project.speciesUsed && project.speciesUsed.length > 0 && (
                        <div className="text-[11px] text-gray-600">
                          <strong className="text-[#072a1a] block mb-0.5">Espécies da Obra:</strong>
                          <span className="line-clamp-2">{project.speciesUsed.join(' • ')}</span>
                        </div>
                      )}
                    </div>

                    {/* QR Code Plaque Center */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-3 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-200">
                      <div className="bg-white p-3 rounded-xl shadow-md border-2 border-[#072a1a] relative group">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt={`QR Code para ${project.title}`}
                            className="w-40 h-40 sm:w-44 sm:h-44 object-contain mx-auto"
                          />
                        ) : (
                          <canvas ref={canvasRef} className="w-40 h-40 sm:w-44 sm:h-44 mx-auto" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-9 h-9 rounded-full bg-[#072a1a] border-2 border-white text-[#86efac] flex items-center justify-center shadow-md">
                            <Leaf className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <span className="text-[11px] font-bold text-[#072a1a] block leading-tight">
                          Aponte a Câmera do Celular
                        </span>
                        <p className="text-[10px] text-gray-500 leading-tight max-w-[210px] mx-auto">
                          Acesse o laudo técnico digital completo, fotos interativas e garantia da obra.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Plaque Footer */}
                  <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-[10px] text-gray-500">
                    <span className="font-mono">All Green Decor • Placa de Acrílico & Certificação Oficial</span>
                    <span className="font-mono font-bold text-emerald-800">{reportUrl}</span>
                  </div>

                </div>
              </div>

              {/* Action Buttons Toolbar - Hidden on Print */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <span className="text-xs text-gray-700 font-bold shrink-0">Link Público:</span>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono text-emerald-950 flex-1 truncate select-all">
                      <span className="truncate">{reportUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#072a1a] border border-gray-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title="Copiar link público para celular"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🌿 Memorial Técnico Biofílico - Projeto ${project.title} (${project.code})\n\nAcesse o laudo oficial no celular: ${reportUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold shadow-xs cursor-pointer"
                      title="Compartilhar no WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white hover:bg-emerald-50 text-gray-600 hover:text-[#072a1a] border border-gray-300 rounded-lg transition-colors"
                      title="Abrir em nova aba"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/60 rounded-xl px-3 py-2 text-[11px] text-[#064e3b]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Link Testado e Homologado:</strong> Este link público abre diretamente na nuvem em qualquer smartphone (iOS ou Android) e carrega a ficha do projeto {project.code}.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 flex-wrap pt-1 border-t border-gray-200">
                  {/* Print Button */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-300 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Imprimir placa ou cartão QR Code"
                  >
                    <Printer className="w-4 h-4 text-[#15803d]" />
                    <span>Imprimir Placa</span>
                  </button>

                  {/* Download PNG Button */}
                  <button
                    type="button"
                    onClick={handleDownloadQrPng}
                    className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-[#072a1a] border border-gray-300 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Baixar imagem do QR Code em alta resolução (PNG)"
                  >
                    <Download className="w-4 h-4 text-[#15803d]" />
                    <span>Baixar QR (PNG)</span>
                  </button>

                  {/* Download PDF Plaque */}
                  <button
                    type="button"
                    onClick={handleDownloadPlaquePdf}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                    title="Baixar placa completa em formato PDF A4 para impressão gráfica"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar Placa em PDF'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* ================= VIEW 2: CLIENT MOBILE PREVIEW ================= */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                  EXPERIÊNCIA DO CLIENTE
                </span>
                <h3 className="font-serif font-bold text-lg text-[#072a1a]">
                  O que seu cliente vê ao escanear o QR Code
                </h3>
                <p className="text-xs text-gray-500">
                  O relatório digital abre instantaneamente no navegador do smartphone sem necessidade de instalar aplicativos.
                </p>
              </div>

              {/* Simulated Mobile Smartphone Frame */}
              <div className="max-w-xs mx-auto bg-gray-900 rounded-[36px] p-3 shadow-2xl border-4 border-gray-800 relative">
                {/* Smartphone Speaker & Camera Notch */}
                <div className="w-24 h-4 bg-black rounded-b-xl mx-auto mb-2" />

                {/* Smartphone Screen Canvas */}
                <div className="bg-[#f3f7f4] rounded-[26px] overflow-hidden p-4 space-y-3 text-left max-h-[460px] overflow-y-auto">
                  
                  {/* Mobile Report Header */}
                  <div className="bg-[#072a1a] text-white p-3.5 rounded-2xl space-y-1">
                    <span className="text-[9px] font-mono text-[#86efac] font-bold uppercase">
                      ALL GREEN • {project.code}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-white line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-[10px] text-emerald-200">
                      {project.client} • {project.location}
                    </p>
                  </div>

                  {/* Photo Preview */}
                  <div className="relative rounded-xl overflow-hidden shadow-xs border border-gray-200">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-bold">
                      {project.style}
                    </span>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-[9px] text-gray-500 block">Área Executada</span>
                      <strong className="text-xs text-[#072a1a]">{project.area} m²</strong>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-[9px] text-gray-500 block">Índice Acústico</span>
                      <strong className="text-xs text-emerald-800">NRC {project.acousticNrc || '0.85'}</strong>
                    </div>
                  </div>

                  {/* Architect Badge */}
                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 flex items-center gap-2">
                    <img
                      src={architectUser.avatar}
                      alt={architectUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                    />
                    <div className="text-[10px] leading-tight">
                      <span className="text-gray-500 block">Projeto & Especificação:</span>
                      <strong className="text-[#072a1a] block">{architectUser.name}</strong>
                      <span className="text-emerald-700">{architectUser.company}</span>
                    </div>
                  </div>

                  {/* Call to Action in Mobile Screen */}
                  <div className="pt-1">
                    <a
                      href={reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#072a1a] text-[#86efac] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir Relatório Completo</span>
                    </a>
                  </div>

                </div>

                {/* Smartphone Home Indicator Bar */}
                <div className="w-24 h-1 bg-gray-600 rounded-full mx-auto mt-2.5" />
              </div>

              {/* Bottom Switch Back */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('plaque')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  ← Voltar para a Placa Imprimível
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
