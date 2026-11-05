import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Sparkles,
  Layers,
  HelpCircle,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { SHARED_APP_URL, getProjectDirectUrl, getSectionDirectUrl } from '../../utils/appUrl';
import { PROJECT_SAMPLES } from '../../data/mockData';
import confetti from 'canvas-confetti';

interface PublicLinkShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectCode?: string;
}

export const PublicLinkShareModal: React.FC<PublicLinkShareModalProps> = ({
  isOpen,
  onClose,
  initialProjectCode,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'app' | 'simulator' | 'quiz' | 'project'>(
    initialProjectCode ? 'project' : 'app'
  );
  const [projectCode, setProjectCode] = useState<string>(initialProjectCode || 'AG-8492');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute active URL
  const activeUrl = React.useMemo(() => {
    switch (selectedTarget) {
      case 'simulator':
        return getSectionDirectUrl('simulator');
      case 'quiz':
        return getSectionDirectUrl('quiz');
      case 'project':
        return getProjectDirectUrl(projectCode);
      case 'app':
      default:
        return SHARED_APP_URL;
    }
  }, [selectedTarget, projectCode]);

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(activeUrl, {
      width: 1024,
      margin: 1.5,
      color: {
        dark: '#072a1a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, activeUrl, {
        width: 220,
        margin: 1.5,
        color: {
          dark: '#072a1a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      }).catch((e) => console.error('Canvas QR error:', e));
    }
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#86efac', '#15803d', '#072a1a'],
      });
    } catch (e) {}
  };

  const whatsappMessage = encodeURIComponent(
    `🌿 *All Green Decor & Biofilia* - Aplicativo & Memorial Digital\n\nAcesse no seu celular:\n${activeUrl}`
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-emerald-900/20 my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#072a1a] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-900/90 border border-emerald-700/80 text-[#86efac] flex items-center justify-center shadow-inner shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#86efac] uppercase font-bold">
                  LINK OFICIAL PARA USUÁRIOS
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ONLINE & ATIVO
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                Testar Aplicativo no Celular
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900/70 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[80dvh]">
          {/* Target Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2 uppercase tracking-wider">
              O que você deseja testar no celular?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTarget('app')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedTarget === 'app'
                    ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a] shadow-xs'
                    : 'bg-gray-50 hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                }`}
              >
                🌐 Site Principal
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('simulator')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedTarget === 'simulator'
                    ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a] shadow-xs'
                    : 'bg-gray-50 hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                }`}
              >
                🌿 Simulador IA
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('quiz')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedTarget === 'quiz'
                    ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a] shadow-xs'
                    : 'bg-gray-50 hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                }`}
              >
                📊 Quiz Biofílico
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('project')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedTarget === 'project'
                    ? 'bg-[#072a1a] text-[#86efac] border-[#072a1a] shadow-xs'
                    : 'bg-gray-50 hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                }`}
              >
                📋 Ficha de Projeto
              </button>
            </div>
          </div>

          {/* If project selected, show project code selector */}
          {selectedTarget === 'project' && (
            <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-2 animate-in fade-in">
              <label className="text-xs font-bold text-[#064e3b] block">
                Escolha o Projeto Biofílico para o cliente abrir:
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {['AG-8492', 'AG-4891', 'AG-2024', 'AG-3090', 'AG-5112'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setProjectCode(code)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                      projectCode === code
                        ? 'bg-[#072a1a] text-[#86efac] shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-300'
                    }`}
                  >
                    {code}
                  </button>
                ))}
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                  placeholder="DIGITE OUTRO CÓDIGO"
                  className="px-2.5 py-1 bg-white text-xs font-mono border border-emerald-300 rounded-lg text-gray-800 uppercase focus:outline-none focus:ring-1 focus:ring-emerald-600 w-36"
                />
              </div>
            </div>
          )}

          {/* Direct Link Box & Action Buttons */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Link Público Verificado (Sem Login Necessário)
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                HTTPS NUVEM GOOGLE
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-300">
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="w-full text-xs font-mono text-[#072a1a] bg-transparent focus:outline-none select-all"
              />
            </div>

            {/* Quick Share Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 min-w-[130px] py-2 px-3 bg-[#072a1a] hover:bg-[#15803d] text-[#86efac] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#86efac]" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link de Teste</span>
                  </>
                )}
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-gray-500" />
                <span>Abrir</span>
              </a>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="border border-emerald-900/15 rounded-2xl p-5 bg-gradient-to-b from-[#fafdfb] to-emerald-50/40 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-800 font-extrabold uppercase tracking-widest block">
                LEITURA INSTANTÂNEA PELA CÂMERA DO CELULAR
              </span>
              <h3 className="font-serif font-bold text-base text-[#072a1a]">
                Aponte a câmera do seu celular para testar agora
              </h3>
            </div>

            <div className="inline-block p-4 bg-white rounded-2xl shadow-md border-2 border-[#072a1a]">
              <canvas ref={canvasRef} className="mx-auto" />
            </div>

            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Não é preciso baixar nenhum aplicativo. Basta abrir a câmera padrão do iPhone ou Android e tocar na notificação que surgir.
            </p>
          </div>

          {/* Explanation Alert: Why previous links failed */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-amber-950 block">
                Por que o link anterior não abria no celular de outras pessoas?
              </strong>
              <p>
                No ambiente de desenvolvimento interno, links com <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono text-[11px]">localhost:3000</code> ou <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono text-[11px]">ais-dev-*</code> são restritos ao seu computador e bloqueiam acessos externos.
              </p>
              <p>
                O link acima (<strong className="font-mono text-[11px]">{SHARED_APP_URL}</strong>) é o endereço oficial de produção pública na nuvem e abre perfeitamente para qualquer pessoa em qualquer operadora ou Wi-Fi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Google Cloud Run • Certificado SSL Ativo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
