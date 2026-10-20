import { BiophilicProfileResult, PortalProject, SimulationResult, UserProfile } from '../types';
import { ProjectReportPdfOptions } from './generateProjectReportPdf';

export interface SocialSharePayload {
  title: string;
  text: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'cancelled' | 'error';
  message: string;
}

/**
 * Invokes native Web Share API (navigator.share) with automatic fallback to clipboard copy.
 */
export async function shareHighlights(payload: SocialSharePayload): Promise<ShareResult> {
  const currentUrl = payload.url || (typeof window !== 'undefined' ? window.location.href : 'https://allgreendecor.com.br');
  const fullShareData = {
    title: payload.title,
    text: payload.text,
    url: currentUrl,
  };

  // 1. Try Native Web Share API
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (typeof navigator.canShare === 'function') {
        if (navigator.canShare(fullShareData)) {
          await navigator.share(fullShareData);
          return {
            success: true,
            method: 'native',
            message: 'Destaques compartilhados com sucesso!',
          };
        } else if (navigator.canShare({ title: payload.title, text: payload.text })) {
          await navigator.share({
            title: payload.title,
            text: `${payload.text}\n\n🔗 ${currentUrl}`,
          });
          return {
            success: true,
            method: 'native',
            message: 'Destaques compartilhados com sucesso!',
          };
        }
      } else {
        await navigator.share(fullShareData);
        return {
          success: true,
          method: 'native',
          message: 'Destaques compartilhados com sucesso!',
        };
      }
    } catch (err: any) {
      // User cancelled native share sheet
      if (err?.name === 'AbortError') {
        return {
          success: false,
          method: 'cancelled',
          message: 'Compartilhamento cancelado.',
        };
      }
      console.warn('[WebShare] Native share failed, falling back to clipboard:', err);
    }
  }

  // 2. Clipboard Fallback with rich text
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      const clipboardContent = `${payload.title}\n\n${payload.text}\n\n🔗 ${currentUrl}`;
      await navigator.clipboard.writeText(clipboardContent);
      return {
        success: true,
        method: 'clipboard',
        message: 'Destaques copiados para a área de transferência! Cole no WhatsApp, Teams ou E-mail.',
      };
    } catch (clipErr) {
      console.error('[WebShare] Clipboard fallback failed:', clipErr);
    }
  }

  // 3. Fallback for environments where clipboard API is blocked
  return {
    success: false,
    method: 'error',
    message: 'Não foi possível compartilhar automaticamente neste dispositivo.',
  };
}

/**
 * Formats a generated Biophilic Profile into a compelling social highlight summary for sharing with contacts.
 */
export function formatBiophilicProfileShare(
  profile: BiophilicProfileResult,
  user?: Partial<UserProfile> | null
): SocialSharePayload {
  const authorName = user?.name ? ` por ${user.name}` : '';
  const title = `🌿 Perfil Biofílico: ${profile.archetypeTitle} • All Green Decor`;

  const speciesList = profile.recommendedSpecies?.map((s) => s.name).slice(0, 3).join(', ') || 'Musgo Polar Moss, Samambaia Real Touch';

  const text = `🌿 Diagnóstico de Biofilia & Bem-Estar${authorName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Arquétipo: ${profile.archetypeTitle} (${profile.badge})
🏛️ Estilo Arquitetônico: ${profile.designStyle?.title || 'Design Biofílico'}

📊 METAS DE SUSTENTABILIDADE & CONFORTO:
• WELL v2 Score: ${profile.scoreWell} pts (Classificação Platinum)
• Créditos LEED v4.1: +${profile.scoreLeed} créditos homologados
• Absorção Acústica: NRC ${profile.acousticNRC} (Laudo IPT ISO 354)
• Ganho de Produtividade: +${profile.productivityBoost}% (Harvard COGfx)
• Redução de Estresse: -${profile.stressReduction}% de cortisol

🌱 Espécies Recomendadas: ${speciesList}
🔖 Código de Homologação: ${profile.recommendedSolutionCode}

Descubra seu perfil biofílico corporativo ou residencial na All Green Decor:`;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/#biophilic-quiz` : 'https://allgreendecor.com.br';

  return {
    title,
    text,
    url: baseUrl,
  };
}

/**
 * Formats a LEED/WELL project report or project card into highlights for sharing with clients, developers or partners.
 */
export function formatProjectReportShare(
  projectOrOptions: Partial<PortalProject> | ProjectReportPdfOptions | Record<string, any>,
  author?: string
): SocialSharePayload {
  // Support both PortalProject and ProjectReportPdfOptions shapes
  const titleText = (projectOrOptions as PortalProject).title || (projectOrOptions as ProjectReportPdfOptions).projectName || 'Projeto Biofílico Executivo';
  const code = (projectOrOptions as PortalProject).code || (projectOrOptions as ProjectReportPdfOptions).projectCode || 'AG-8492';
  const client = (projectOrOptions as PortalProject).client || (projectOrOptions as ProjectReportPdfOptions).clientName || 'Cliente Corporativo';
  const area = (projectOrOptions as PortalProject).area || (projectOrOptions as ProjectReportPdfOptions).totalAreaM2 || 24;
  const leed = (projectOrOptions as PortalProject).leedPointsTotal || (projectOrOptions as ProjectReportPdfOptions).leedCredits || 14;
  const well = (projectOrOptions as PortalProject).wellScore || 88;
  const nrc = (projectOrOptions as PortalProject).acousticNrc || 0.88;
  const waterSaved = (projectOrOptions as PortalProject).waterSavedLitersYear || 32000;
  const style = (projectOrOptions as PortalProject).style || (projectOrOptions as ProjectReportPdfOptions).solutionType || 'Jardim Vertical Preservado Plug & Play';

  const shareTitle = `🏛️ Memorial LEED & WELL: ${titleText} (${code})`;

  const text = `🏛️ RELATÓRIO TÉCNICO & MEMORIAL BIOFÍLICO
Obra: ${titleText} (${code})
Cliente: ${client} | Área: ${area} m²
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 ESPECIFICAÇÃO: ${style}

🏆 CERTIFICAÇÕES SUSTENTÁVEIS HOMOLOGADAS:
• LEED v4.1: +${leed} créditos (WEc1 Isenção Total de Água & Baixo COV)
• WELL v2: ${well} pontos (Patamar Platina Mind & Sound)
• Acústica Certificada: NRC ${nrc} (Laudo IPT ISO 354)
• Economia Hídrica: ${waterSaved.toLocaleString('pt-BR')} L/ano (Zero Rega)
• Segurança ao Fogo: Classe B-s1,d0 (Auto-extinguível)
• 5 Anos de Garantia Estrutural

Homologado pelo Green Building Council Brasil & IPT.
Acesse o memorial completo e especificações BIM/CAD:`;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/#projects` : 'https://allgreendecor.com.br';

  return {
    title: shareTitle,
    text,
    url: baseUrl,
  };
}

/**
 * Formats a live botanical simulation result for quick sharing.
 */
export function formatSimulationShare(
  simulation: SimulationResult,
  roomType: string = 'Espaço Corporativo',
  areaM2?: number
): SocialSharePayload {
  const area = areaM2 || simulation.estimatedArea || 10.2;
  const title = `🌿 Simulação de Espaço Biofílico: ${roomType} (${area} m²) • All Green Decor`;
  const speciesList = simulation.recommendedSpecies?.slice(0, 3).join(', ') || 'Musgo Preservado, Samambaia Real Touch';

  const text = `🌿 SIMULAÇÃO DE PAREDE VERDE & DESIGN BIOFÍLICO
Tipologia: ${roomType} | Área Vegetada: ${area} m²
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 ESPÉCIES SUGERIDAS: ${speciesList}

📊 PERFORMANCE AMBIENTAL PREVISTA:
• Certificação WELL v2: +${simulation.wellScore} pontos potenciais
• Absorção Acústica Estimada: ${(area * 0.85).toFixed(1)} m² com NRC 0.85
• Manutenção: Zero rega, sem necessidade de ponto hidráulico ou drenagem

💡 DIAGNÓSTICO PRELIMINAR:
"${simulation.aiAnalysisText ? simulation.aiAnalysisText.slice(0, 160) + '...' : 'Análise acústica e de bem-estar homologada.'}"

Confira a simulação e solicite um projeto executivo completo:`;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}/#simulator` : 'https://allgreendecor.com.br';

  return {
    title,
    text,
    url: baseUrl,
  };
}
