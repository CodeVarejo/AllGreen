import React, { useState } from 'react';
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  ShieldCheck,
  Award,
  Download,
  Eye,
  Type,
  Table,
  RotateCcw,
  ExternalLink,
  ChevronUp,
  UserCheck,
  Clock,
  Truck,
  CheckCircle2,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { ScrollReveal } from './ScrollReveal';
import { BiophilicChatWidget } from './BiophilicChatWidget';

interface NewsletterAndFooterProps {
  onOpenSimulator: () => void;
  onOpenProjectLookup: () => void;
  onOpenQuote: () => void;
  onOpenLogin: () => void;
  onOpenShortcutsModal?: () => void;
  onOpenConsultation?: () => void;
  onOpenProjectPdfReport?: () => void;
  onOpenTour?: () => void;
}

export const NewsletterAndFooter: React.FC<NewsletterAndFooterProps> = ({
  onOpenSimulator,
  onOpenProjectLookup,
  onOpenQuote,
  onOpenLogin,
  onOpenShortcutsModal,
  onOpenConsultation,
  onOpenProjectPdfReport,
  onOpenTour,
}) => {
  const [email, setEmail] = useState('');
  const [newsMessage, setNewsMessage] = useState('');

  const {
    isHighContrast,
    fontSize,
    isWcagTableMode,
    toggleHighContrast,
    setFontSize,
    toggleWcagTableMode,
    resetAccessibility,
  } = useAccessibility();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setNewsMessage('Inscrição confirmada com sucesso! Bem-vindo ao Clube All Green Decor.');
    setEmail('');
    setTimeout(() => {
      setNewsMessage('');
    }, 5000);
  };

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#051c11] text-white bg-grain-dark border-t border-emerald-900/60">
      
      {/* Top Newsletter & Bio Club Bar */}
      <div className="border-b border-emerald-900/80 bg-[#072a1a]/80 py-12 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" distance={25}>
            <div className="bg-emerald-950/90 rounded-3xl p-6 sm:p-10 border border-emerald-800/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-2 max-w-xl text-center lg:text-left">
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
                  ATELIÊ BOTÂNICO • CADERNO DE ESPECIFICAÇÃO
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-white">
                  Boletim Biofílico All Green Ateliê
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Receba lançamentos de espécies hiper-realistas, atualizações de blocos 3D/BIM para Revit e SketchUp e memoriais para certificações LEED e WELL.
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail profissional..."
                    className="w-full pl-10 pr-4 py-3 bg-emerald-900/90 rounded-xl border border-emerald-700 text-xs text-white placeholder-emerald-300/60 focus:outline-none focus:border-[#86efac]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#86efac] text-[#072a1a] font-bold rounded-xl text-xs hover:bg-emerald-300 transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Cadastrar</span>
                  <Send className="w-3.5 h-3.5 fill-current" />
                </button>
              </form>

            </div>
          </ScrollReveal>

          {newsMessage && (
            <p className="text-center text-xs text-[#86efac] font-bold mt-3 animate-in fade-in">
              {newsMessage}
            </p>
          )}

          {/* AI Biophilic Chatbot Widget */}
          <div className="mt-8">
            <ScrollReveal animation="fade-up" delay={0.15} distance={20}>
              <BiophilicChatWidget
                onOpenSimulator={onOpenSimulator}
                onOpenQuote={onOpenQuote}
              />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal animation="fade-up" delay={0.1} distance={20}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Col 1: Brand & Institutional */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#86efac] text-[#072a1a] flex items-center justify-center shadow-md">
                  <Leaf className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold tracking-tight text-white">
                    ALL GREEN
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest text-emerald-400 uppercase -mt-1">
                    Decor & Biophilia
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Referência nacional em paisagismo permanente e jardins verticais preservados. Módulos Plug & Play enviados para todo o Brasil.
              </p>

              {/* Trust Badges */}
              <div className="space-y-1.5 pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86efac] shrink-0" />
                  <span>Garantia de Fábrica de 5 Anos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#86efac] shrink-0" />
                  <span>100% Zero Ponto de Irrigação</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#86efac] shrink-0" />
                  <span>Envio p/ Todo o Território Nacional</span>
                </div>
              </div>
            </div>

            {/* Col 2: Soluções & Produtos */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                SOLUÇÕES & PRODUTOS
              </span>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Jardins Verticais Preservados
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Jardins Permanentes Anti-UV
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Musgo Polar Moss & Green Art
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Módulos Plug & Play 100x50cm
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Árvores & Jardineiras em Vasos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('solutions')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Cenografia & Locação de Eventos
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Segmentos & Aplicações */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                APLICAÇÕES & MERCADO
              </span>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => scrollToSection('before-after-gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Arquitetura Corporativa
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('before-after-gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Residências & Varandas Gourmet
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('before-after-gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Clínicas, Consultórios & Spas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('before-after-gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Varejo, Vitrines & Lojas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('before-after-gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Hotelaria & Gastronomia
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onOpenProjectLookup}
                    className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-emerald-300"
                  >
                    Buscar Projeto por Código AG
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Para Arquitetos & Ferramentas */}
            <div className="space-y-3 text-xs">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                ÁREA DOS PROFISSIONAIS
              </span>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    type="button"
                    id="footer-portal-link"
                    onClick={onOpenLogin}
                    className="font-bold text-[#86efac] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Portal do Arquiteto (BIM/CAD)</span>
                  </button>
                </li>
                {onOpenConsultation && (
                  <li>
                    <button 
                      type="button"
                      id="footer-book-consultation-btn"
                      onClick={onOpenConsultation}
                      className="font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#86efac]" />
                      <span>Agendar Consultoria Técnica</span>
                    </button>
                  </li>
                )}
                {onOpenProjectPdfReport && (
                  <li>
                    <button 
                      type="button"
                      id="footer-generate-pdf-btn"
                      onClick={onOpenProjectPdfReport}
                      className="font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#86efac]" />
                      <span>Gerar PDF do Projeto (Laudo)</span>
                    </button>
                  </li>
                )}
                <li>
                  <button 
                    type="button"
                    onClick={onOpenSimulator}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Simulador de Parede Verde IA
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => scrollToSection('biophilic-roi-calculator')}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 text-emerald-300 font-semibold"
                  >
                    <span>Calculadora de Impacto & ROI (WELL/LEED)</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => scrollToSection('botanical-catalog')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Catálogo de Espécies Botânicas
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => scrollToSection('comparison-matrix')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Matriz Comparativa Técnica
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onOpenLogin}
                    className="hover:text-white transition-colors cursor-pointer text-left text-emerald-200"
                  >
                    Solicitar Kit de Amostras Físicas
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Contato Oficial & Showroom */}
            <div className="space-y-4 text-xs">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                ATENDIMENTO OFICIAL
              </span>
              
              <div className="space-y-2.5 text-gray-300">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">WhatsApp Comercial Oficial:</span>
                    <a
                      href="https://wa.me/5511912720799"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-white hover:text-emerald-300 transition-colors"
                    >
                      (11) 91272-0799
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">E-mail Corporativo:</span>
                    <a
                      href="mailto:contato@allgreendecor.com.br"
                      className="font-medium text-white hover:text-emerald-300 transition-colors"
                    >
                      contato@allgreendecor.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Horário de Atendimento:</span>
                    <span className="text-gray-300">Seg a Sex: 08h às 19h | Sáb: 09h às 14h</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href="https://wa.me/5511912720799?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20jardim%20vertical%20All%20Green"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 bg-[#86efac] text-[#072a1a] hover:bg-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Chamar no WhatsApp Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </ScrollReveal>

        {/* Accessibility Toolbar (WCAG 2.1 AA) */}
        <div id="accessibility-selector" className="mt-12 pt-8 border-t border-emerald-900/60">
          <div className="bg-[#072a1a] p-4 sm:p-6 rounded-2xl border border-emerald-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Acessibilidade & Inclusão Visual (WCAG 2.1 AA)
                </span>
                <span className="text-[11px] text-gray-400">
                  Ajuste o tamanho do texto, contraste ou modo de tabela simplificado.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={toggleHighContrast}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isHighContrast ? 'bg-yellow-400 text-black' : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                <span>Alto Contraste</span>
              </button>

              <div className="flex items-center bg-emerald-900 rounded-lg p-0.5 border border-emerald-800">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors cursor-pointer ${
                    fontSize === 'normal' ? 'bg-[#86efac] text-[#072a1a]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  100%
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors cursor-pointer ${
                    fontSize === 'large' ? 'bg-[#86efac] text-[#072a1a]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  125%
                </button>
                <button
                  onClick={() => setFontSize('huge')}
                  className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors cursor-pointer ${
                    fontSize === 'huge' ? 'bg-[#86efac] text-[#072a1a]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  150%
                </button>
              </div>

              <button
                onClick={toggleWcagTableMode}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isWcagTableMode ? 'bg-[#86efac] text-[#072a1a]' : 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabela WCAG</span>
              </button>

              {onOpenShortcutsModal && (
                <button
                  onClick={onOpenShortcutsModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-900 text-emerald-200 hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ver todos os atalhos de teclado (?)"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Atalhos (?)</span>
                </button>
              )}

              {onOpenTour && (
                <button
                  type="button"
                  id="footer-guided-tour-btn"
                  onClick={onOpenTour}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-900 text-emerald-200 hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Rever Tour Guiado da Plataforma"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>Tour Guiado</span>
                </button>
              )}

              <button
                onClick={resetAccessibility}
                className="p-1.5 rounded-lg bg-emerald-950 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Redefinir Acessibilidade"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Subfooter: Legal & Copyright */}
        <div className="mt-8 pt-6 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} All Green Decor & Biophilia Ltda. Todos os direitos reservados. CNPJ 38.912.482/0001-90.
          </p>

          <div className="flex items-center gap-4">
            <a href="#termos" onClick={(e) => { e.preventDefault(); alert('Termos de Uso All Green: Todos os projetos e orçamentos emitidos possuem validade de 30 dias com homologação técnica.'); }} className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#privacidade" onClick={(e) => { e.preventDefault(); alert('Política de Privacidade: Dados protegidos conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).'); }} className="hover:text-white transition-colors">Privacidade (LGPD)</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Voltar ao Topo"
            >
              <span>Topo</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};
